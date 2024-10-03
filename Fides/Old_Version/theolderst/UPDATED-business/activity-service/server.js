const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');  // Aggiungi per servire i file statici

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
});

// Middleware per autenticare JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Serve il file HTML per visualizzare le attività
app.use('/web/activities', express.static(path.join(__dirname, 'public')));

// Aggiungi una nuova attività
app.post('/activities', authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  try {
    await pool.query(
      'INSERT INTO activities (title, description, date, user_id) VALUES ($1, $2, $3, $4)', 
      [title, description, date, req.user.id]
    );
    res.status(201).json({ message: 'Activity created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
});

// Elenca tutte le attività con il creatore
app.get('/activities', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.title, a.description, a.date, u.username AS creator
      FROM activities a
      JOIN users u ON a.user_id = u.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Search activities by title (for enhanced functionality)
app.get('/activities/search', authenticateToken, async (req, res) => {
  const { title } = req.query;

  try {
    const result = await pool.query(
      'SELECT a.id, a.title, a.description, a.date, u.username AS creator FROM activities a JOIN users u ON a.user_id = u.id WHERE a.title ILIKE $1', 
      [`%${title}%`]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search activities', error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

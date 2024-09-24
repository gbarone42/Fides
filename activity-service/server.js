const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
});

// Middleware for verifying JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
    req.user = user;
    next();
  });
};

// Route to log in with username and password and get a token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Route to get all activities with the user who created them
app.get('/activities', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT activities.id, activities.title, activities.description, activities.date, users.username 
       FROM activities
       JOIN users ON activities.user_id = users.id
       ORDER BY date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Route to add a new activity
app.post('/activities', authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;
  const userId = req.user.username;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user_id = userResult.rows[0].id;
    const result = await pool.query(
      'INSERT INTO activities (title, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, date, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
});

// Route to delete an activity
app.delete('/activities/:id', authenticateToken, async (req, res) => {
  const activityId = req.params.id;
  const userId = req.user.username;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [userId]);
    const user_id = userResult.rows[0].id;

    const result = await pool.query('DELETE FROM activities WHERE id = $1 AND user_id = $2 RETURNING *', [activityId, user_id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Activity not found or not authorized' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete activity', error: err.message });
  }
});

// Route to search activities by title
app.get('/activities/search', authenticateToken, async (req, res) => {
  const { title } = req.query;

  try {
    const result = await pool.query(
      `SELECT activities.id, activities.title, activities.description, activities.date, users.username 
       FROM activities
       JOIN users ON activities.user_id = users.id
       WHERE activities.title ILIKE $1
       ORDER BY date ASC`, 
      [`%${title}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search activities', error: err.message });
  }
});

// Serve the HTML page for activities
app.get('/web/activities', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

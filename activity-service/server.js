const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path'); // To serve HTML files

const app = express();
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',  // Docker service name
  database: 'activities',
  password: 'user',   // Ensure it matches docker-compose
  port: 5432,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Add a new activity
app.post('/activities', authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;
  const userId = req.user.username;

  try {
    const result = await pool.query(
      'INSERT INTO activities (title, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, date, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
});

// Get all activities for the authenticated user
app.get('/activities', authenticateToken, async (req, res) => {
  const userId = req.user.username;

  try {
    const result = await pool.query('SELECT * FROM activities WHERE user_id = $1 ORDER BY date ASC', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Update an activity
app.put('/activities/:id', authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;
  const activityId = req.params.id;
  const userId = req.user.username;

  try {
    const result = await pool.query(
      'UPDATE activities SET title = $1, description = $2, date = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, date, activityId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found or you are not authorized to update it' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update activity', error: err.message });
  }
});

// Delete an activity
app.delete('/activities/:id', authenticateToken, async (req, res) => {
  const activityId = req.params.id;
  const userId = req.user.username;

  try {
    const result = await pool.query(
      'DELETE FROM activities WHERE id = $1 AND user_id = $2 RETURNING *',
      [activityId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found or you are not authorized to delete it' });
    }
    res.json({ message: 'Activity deleted successfully', activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete activity', error: err.message });
  }
});

// Filter activities by title or date
app.get('/activities/filter', authenticateToken, async (req, res) => {
  const { title, date } = req.query;
  const userId = req.user.username;
  let query = 'SELECT * FROM activities WHERE user_id = $1';
  const params = [userId];

  if (title) {
    query += ' AND title ILIKE $2';
    params.push(`%${title}%`);
  }
  if (date) {
    query += ' AND date = $3';
    params.push(date);
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Serve HTML page for managing activities
app.get('/web/activities', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

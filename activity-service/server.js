const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());

// PostgreSQL Pool Configuration
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = user;
    next();
  });
};

// Route to get all activities
app.get('/activities', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT activities.id, activities.title, activities.description, activities.date, users.username 
      FROM activities
      JOIN users ON activities.user_id = users.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Route to delete an activity by ID
app.delete('/activities/:id', authenticateToken, async (req, res) => {
  const activityId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING *', [activityId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete activity', error: err.message });
  }
});

// Serve the HTML page
app.get('/web/activities', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

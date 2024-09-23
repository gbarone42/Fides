const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path'); // To serve HTML files
const Joi = require('joi'); // For validation

const app = express();
app.use(express.json());

// Configuring PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
});

// Middleware for JWT authentication
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

// Schema for activity validation
const activitySchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
});

// Route to add a new activity
app.post('/activities', authenticateToken, async (req, res) => {
  const { error } = activitySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

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

// Route to get all activities for the authenticated user (with pagination and sorting)
app.get('/activities', authenticateToken, async (req, res) => {
  const userId = req.user.username;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const sortBy = req.query.sortBy || 'date';

  try {
    const result = await pool.query(
      `SELECT * FROM activities WHERE user_id = $1 ORDER BY ${sortBy} ASC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Route to update an activity
app.put('/activities/:id', authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;
  const activityId = req.params.id;
  const userId = req.user.username;

  try {
    const result = await pool.query(
      'UPDATE activities SET title = $1, description = $2, date = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, date, activityId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Activity not found or you are not authorized to update it' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update activity', error: err.message });
  }
});

// Route to delete an activity
app.delete('/activities/:id', authenticateToken, async (req, res) => {
  const activityId = req.params.id;
  const userId = req.user.username;

  try {
    const result = await pool.query('DELETE FROM activities WHERE id = $1 AND user_id = $2 RETURNING *', [activityId, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Activity not found or you are not authorized to delete it' });
    res.json({ message: 'Activity deleted', activity: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete activity', error: err.message });
  }
});

// Route to serve the HTML page for activities
app.get('/web/activities', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

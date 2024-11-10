/* const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path'); */

const config = require('@app_config/shared/config');

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

console.log('BUSINESS-DASHBOARD');

// Serve the static HTML page for activities
app.use('/web/activities', express.static(path.join(__dirname, 'public')));

// Add a new activity (ensure user_id is passed from frontend)
app.post('/activities', async (req, res) => {
  const { title, description, date, time, place, user_id } = req.body;

  if (!title || !date || !time || !place || !user_id) {
    return res.status(400).json({ message: 'Title, date, time, place, and user_id are required' });
  }

  try {
    await pool.query(
      'INSERT INTO activities (title, description, date, time, place, user_id) VALUES ($1, $2, $3, $4, $5, $6)', 
      [title, description, date, time, place, user_id]
    );
    res.status(201).json({ message: 'Activity created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
});

// Get all activities along with the creator (username and role)
app.get('/activities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.title, a.description, a.date, a.time, a.place, u.username, u.role
      FROM activities a
      JOIN users u ON a.user_id = u.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve activities', error: err.message });
  }
});

// Delete an activity by ID
app.delete('/activities/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM activities WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete activity', error: err.message });
  }
});

// Search activities by title
app.get('/activities/search', async (req, res) => {
  const { title } = req.query;

  try {
    const result = await pool.query(
      'SELECT a.id, a.title, a.description, a.date, a.time, a.place, u.username, u.role FROM activities a JOIN users u ON a.user_id = u.id WHERE a.title ILIKE $1', 
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

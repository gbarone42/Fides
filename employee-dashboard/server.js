/* Libraries */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const config = require('@app_config/shared');
const { authenticateToken, protectedRoute } = config.authMiddleware;  // Destructure the middleware

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

/* const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
}); */

// DB local connection
const pool = new Pool({
  user: 'ulissecolla',
  host: 'localhost',
  database: 'activities',
  password: '',
  port: 5432,
});

app.use(cors({
    origin: [config.services.LOGIN, config.services.EMPLOYEE_DASHBOARD],
    credentials: true
}));


// Serve the static HTML page for setting availability
app.use('/activities', express.static(path.join(__dirname, 'public')));
app.get('/activities', authenticateToken, protectedRoute, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Endpoint to set availability
app.post('/availability', authenticateToken, protectedRoute, async (req, res) => {
  const { employee_id, date, time, place } = req.body;

  if (!employee_id || !date || !time || !place) {
    return res.status(400).json({ message: 'Employee ID, date, time, and place are required' });
  }

  try {
    await pool.query(
      'INSERT INTO availability (employee_id, date, time, place) VALUES ($1, $2, $3, $4)', 
      [employee_id, date, time, place]
    );
    res.status(201).json({ message: 'Availability set successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set availability', error: err.message });
  }
});


// Endpoint to get all availability for employees
app.get('/availability', authenticateToken, protectedRoute, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.date, a.time, a.place, u.username
      FROM availability a
      JOIN users u ON a.employee_id = u.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve availability', error: err.message });
  }
});


app.listen(3000, () => {
  console.log('Login service running on port 3000');
});

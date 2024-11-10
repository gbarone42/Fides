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

console.log('Middleware loaded:', !!authenticateToken);

const app = express();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Loads the .env file

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
    origin: [config.services.EMPLOYEE_DASHBOARD, config.services.BUSINESS_DASHBOARD, config.services.LOGIN],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Serve the static HTML page for setting availability
app.use('/employee_dashboard', express.static(path.join(__dirname, 'public')));
app.get('/employee_dashboard', authenticateToken, protectedRoute, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// serve the user ID
app.get('/api/employee_dashboard', authenticateToken, protectedRoute, async (req, res) => {
  try {
      // Send JSON data instead of HTML
      res.json({
        user: {
          id: req.user.id,
          email: req.user.username,
          role: req.user.role
        },
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error fetching activities' });
  }
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

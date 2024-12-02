/* Libraries */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const config = require('@app_config/shared');
const { authenticateToken, protectedRouteEmployee } = config.authMiddleware;  // Destructure the middleware

const app = express();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Loads the .env file

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// DB Docker connection
/* const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
}); */

// DB local connection
const pool = new Pool({
  user: 'ulissecolla', // change with your username
  host: 'localhost',
  database: 'activities',
  password: '', // change with your password
  port: 5432,
});

/* [config.services.EMPLOYEE_DASHBOARD, config.services.BUSINESS_DASHBOARD, config.services.LOGIN] */
app.use(cors({
    origin: '*', //only for developmet, not safe in production
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Serve the static HTML page for setting availability
app.use('/employee_dashboard', express.static(path.join(__dirname, 'public')));
app.get('/employee_dashboard', authenticateToken, protectedRouteEmployee, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// serve the user ID
app.get('/api/employee_dashboard', authenticateToken, protectedRouteEmployee, async (req, res) => {
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
app.post('/availability', authenticateToken, protectedRouteEmployee, async (req, res) => {
  const { employee_id, date, time, place } = req.body;

  if (!employee_id || !date || !time || !place) {
    return res.status(400).json({ message: 'Employee ID, date, time, and place are required' });
  }

  const formattedDate = date.split('T')[0];

  try {
    await pool.query(
      'INSERT INTO availability (employee_id, date, time, place) VALUES ($1, $2, $3, $4)', 
      [employee_id, formattedDate, time, place]
    );
    res.status(201).json({ message: 'Availability set successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set availability', error: err.message });
  }
});


// Endpoint to get availability for current logged in employees
app.get('/availability', authenticateToken, protectedRouteEmployee, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.date, a.time, a.place, u.username
      FROM availability a
      JOIN users u ON a.employee_id = u.id
      WHERE a.employee_id = $1
      `, [req.user.id]);  // Use the ID from the authenticated user

      if (result.rows.length === 0) {
        return res.status(200).json({
            message: 'No availability entries found',
            data: []
        });
      }
    
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve availability', error: err.message });
  }
});

// Endpoint to retrieve matches for the current logged in employee
app.get('/matching-availability/:availabilityId', authenticateToken, protectedRouteEmployee, async (req, res) => {

  const availabilityId = req.params.availabilityId;
  console.log('Availability ID: ', availabilityId);

  // First get the availability details
  const availabilityQuery = `SELECT date, time, place FROM availability WHERE id = $1`;
  const availabilityResult = await pool.query(availabilityQuery, [availabilityId]);

  const date = availabilityResult.rows[0].date;
  const time = availabilityResult.rows[0].time;
  const place = availabilityResult.rows[0].place;

  try {

    const query =
      `SELECT a.id, a.date, a.time, a.place, a.user_id
      FROM activities a
      WHERE a.date = $1
      AND a.time >= $2
      AND a.place = $3`;

    const result = await pool.query(query, [date, time, place]);

    if (result.rows.length === 0) {
      return res.status(200).json({
          message: 'No matches found',
          data: []
      });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve matches', error: err.message });
  }

});

// Delete a availability by ID
app.delete('/availability/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM availability WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete availability', error: err.message });
  }
});

// Endpoint to get roles for the matching activity
app.get('/matching-roles/:activityId', authenticateToken, protectedRouteEmployee, async (req, res) => {

  const activityId = req.params.activityId;
  console.log('Activity ID: ', activityId);

  try {

    const query = `
      SELECT r.role, r.description, r.time, r.status, r.id, r.place, r.date FROM roles r
      WHERE r.activity_id = $1
      AND r.status = 'pending'`;

      const result = await pool.query(query, [activityId]);

      if (result.rows.length === 0) {
        return res.status(200).json({
            message: 'No matches found',
            data: []
        });
      }
  
      res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve roles', error: err.message });
  }

});

/* CONFIRM & REFUSE ROLE */
app.patch('/confirm-role/:roleId', authenticateToken, protectedRouteEmployee, async (req, res) => {
  const roleId = req.params.roleId;

  try {
    const result = await pool.query('UPDATE roles SET status = $1 WHERE id = $2', ['confirmed', roleId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role confirmed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to confirm role', error: err.message });
  }
});

// Refuse role
app.patch('/refuse-role/:roleId', authenticateToken, protectedRouteEmployee, async (req, res) => {
  const roleId = req.params.roleId;

  try {
    const result = await pool.query('UPDATE roles SET status = $1 WHERE id = $2', ['vacant', roleId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role refused' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to refuse role', error: err.message });
  }
});

/* Fetch confirmed roles */
app.get('/confirmed-roles', authenticateToken, protectedRouteEmployee, async (req, res) => {
  try {

    const query = `
      SELECT r.role, r.description, r.time, r.status, r.id, r.place, r.date FROM roles r
      WHERE r.status = 'confirmed'
      AND r.date >= CURRENT_DATE AT TIME ZONE 'UTC'`;

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return res.status(200).json({
            message: 'No confirmed roles found',
            data: []
        });
      }
  
      res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve confirmed roles', error: err.message });
  }

});

app.listen(3000, () => {
  console.log('Login service running on port 3000');
});

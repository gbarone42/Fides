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
const { authenticateToken, protectedRouteBusiness } = config.authMiddleware;  // Destructure the middleware

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

/* [config.services.EMPLOYEE_DASHBOARD, config.services.BUSINESS_DASHBOARD, config.services.LOGIN] */
app.use(cors({
    origin: '*', //only for developmet, not safe in production
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve the static HTML page for activities
app.use('/business_dashboard', express.static(path.join(__dirname, 'public')));
// Business dashboard endpoint
app.get('/business_dashboard', (req, res) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // Token is valid, proceed with dashboard
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch(err) {
      res.status(401).json({ message: 'Invalid token' });
  }
});
// Old Business dashboard endpoint
/* app.get('/business_dashboard', authenticateToken, protectedRouteBusiness, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); */


// Add a new activity (ensure user_id is passed from frontend)
app.post('/activities', authenticateToken, protectedRouteBusiness, async (req, res) => {
  const { title, description, date, time, place } = req.body;

  if (!title || !date || !time || !place ) {
    return res.status(400).json({ message: 'Title, date, time and place are required' });
  }

  const formattedDate = date.split('T')[0];

  try {
    await pool.query(
      'INSERT INTO activities (title, description, date, time, place, user_id) VALUES ($1, $2, $3, $4, $5, $6)', 
      [title, description, formattedDate, time, place, req.user.id]
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
      SELECT a.id, a.title, a.description,
      TO_CHAR(a.date, 'YYYY-MM-DD') as date
      , a.time, a.place, u.username, u.role
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


// Post route to send email
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or custom SMTP configuration
  auth: {
      user: process.env.EMAIL_USER
  }
});

// Email sending route
app.post('/send-email', async (req, res) => {
  try {
      const { to, subject, text, html } = req.body;

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "recipient@example.com",
        subject: "Confirm availability",
        // Plain text version for email clients that don't support HTML
        text: "Click this link to continue: https://yourwebsite.com/action",
        // HTML version with a styled button
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .button {
                        background-color: #4CAF50;
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                    
                    .email-container {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h1>Welcome!</h1>
                    <p>Thank you for signing up. Please click the button below to verify your email:</p>
                    
                    <!-- Button styled as a link for better email client compatibility -->
                    <a href="https://yourwebsite.com/action" 
                       class="button" 
                       style="background-color: #4CAF50; 
                              border: none;
                              color: white;
                              padding: 15px 32px;
                              text-align: center;
                              text-decoration: none;
                              display: inline-block;
                              font-size: 16px;
                              margin: 4px 2px;
                              cursor: pointer;
                              border-radius: 4px;">
                        Click Me!
                    </a>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p>https://yourwebsite.com/action</p>
                </div>
            </body>
            </html>
        `
    };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      
      res.status(200).json({
          success: true,
          messageId: info.messageId,
          message: 'Email sent successfully'
      });

  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to send email',
          error: error.message
      });
  }
});


//Search matching activities
app.get('/matching-activities/:activityId', authenticateToken, protectedRouteBusiness, async (req, res) => {
  try {

    const activityId = req.params.activityId;
    const userId = req.user.id;

    // First get the activity details
    const activityQuery = `SELECT date, time, place FROM activities WHERE id = $1`;
    const activityResult = await pool.query(activityQuery, [activityId]);
    
    const date = activityResult.rows[0].date;
    const time = activityResult.rows[0].time;
    const place = activityResult.rows[0].place;

    // Search in Availability table the entries that matches the current activity for date, time amd place
    const query = `SELECT a.id, a.date, a.time, a.place, u.username, u.role
                  FROM availability a
                  JOIN users u ON a.employee_id = u.id
                  WHERE a.date = $1
                  AND a.time = $2
                  AND a.place = $3`;

    const result = await pool.query(query, [date, time, place]);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve matches or no matches found', error: err.message });
  }
});

/* ROLES RELATED */
app.post('/activities/roles/:activityId', authenticateToken, protectedRouteBusiness, async (req, res) => {
  const { role, description, time } = req.body;

  console.log('Role:', role);

  if (!role || !time ) {
    return res.status(400).json({ message: 'Role and time are required' });
  }

  const activityId = req.params.activityId;

  try {
    await pool.query(
      'INSERT INTO roles (role, description, time, activity_id, status) VALUES ($1, $2, $3, $4, $5)', 
      [role, description, time, activityId, 'pending']
    );
    res.status(201).json({ message: 'Role created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create role', error: err.message });
  }
});

// Get all roles for a specific activity
app.get('/activities/:activityId/roles', async (req, res) => {
  const activityId = req.params.activityId;

  try {
    const result = await pool.query('SELECT role, description, time FROM roles WHERE activity_id = $1', [activityId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve roles', error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Activity service running on port 4000');
});

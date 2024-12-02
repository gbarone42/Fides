/* Libraries */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const config = require('@app_config/shared');
const { authenticateToken, protectedRoute } = config.authMiddleware;  // Destructure the middleware

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Loads the .env file

const app = express();
app.use(express.json());
/* [config.services.EMPLOYEE_DASHBOARD, config.services.BUSINESS_DASHBOARD, config.services.LOGIN] */
app.use(cors({
  origin: '*', //only for developmet, not safe in production
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
  user: 'ulissecolla', // change to your username
  host: 'localhost',
  database: 'activities',
  password: '', // change to your password
  port: 5432,
});

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));


// Serve the registration page
app.get('/web/registrazione', (req, res) => {
  console.log('Serving registrazione.html');
  res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
});


// Serve the login page
app.get('/web/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Registration endpoint
app.post('/registrazione', async (req, res) => {
  const { nome, cognome, dataDiNascita, email, username, password, accountType } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role, nome, cognome, data_di_nascita, email) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
      [username, hashedPassword, accountType, nome, cognome, dataDiNascita, email]
    );

    res.status(201).json({ message: 'User registered successfully', role: accountType });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', { email, password });

  try {
    //Query for the user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    //Check the PW
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid: ', validPassword);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // User authenticated, create a JWT token
    const payload = { id: user.id, username: user.email, role: user.role };
    
    // Sign the JWT token with the secret key from the .env file
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey, { expiresIn: '10h' });  // Token expires in 1 hour

    // Set the JWT as an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,                   // Prevents JavaScript access
      secure: false,                    
      sameSite: 'Lax',                 
      path: '/',                        // Make sure cookie is available everywhere
      maxAge: 36000000                  // 10 hour expiration
    });

    console.log('Setting cookie with token: ', token);

    // Redirect based on role
    const redirectTo = user.role === 'business' ? 
      config.services.BUSINESS_DASHBOARD : 
      config.services.EMPLOYEE_DASHBOARD ;
    res.json({ message: 'Login successful', redirectTo, token: token });
  } catch (err) {
    console.error('Login failed:', err);  // Log the actual error for debugging
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});


// Logout - TODO
/* app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ 
    message: 'Logged out successfully',
    redirectTo: '/login'
  });
}); */


app.listen(5000, () => {
  console.log('Register and Login service running on port 5000');
});

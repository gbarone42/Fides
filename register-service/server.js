/* Libraries */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Loads the .env file

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*' /* ['http://localhost:3000', 'http://localhost:4000'] */
}));

// DB Docker connection
/* const pool = new Pool({
  user: 'ulissecolla',
  host: 'localhost',
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

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the registration page
app.get('/web/registrazione', (req, res) => {
  console.log('Serving registrazione.html');
  res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
});

// Serve the login page
app.get('/web/login', (req, res) => {
  console.log('Serving index.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
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
  console.log({ email, password });

  try {
    //Query for the user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    //Check the PW
    const user = userResult.rows[0];
    /* console.log({userResult}) */
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid: ', validPassword);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    //Create JWT
    // User authenticated, create a JWT token
    const payload = { id: user.id, username: user.email };
    
    // Sign the JWT token with the secret key from the .env file
    const secretKey = process.env.SECRET_KEY;
    console.log('My secret jwt key is: ${secretKey}');
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Token expires in 1 hour

    // Redirect based on role
    const redirectTo = user.role === 'business' ? 'http://localhost:4000/web/activities/' : 'http://localhost:3000/web/login/';
    res.json({ token, message: 'Login successful', redirectTo });
  } catch (err) {
    console.error('Login failed:', err);  // Log the actual error for debugging
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Register and Login service running on port 5000');
});

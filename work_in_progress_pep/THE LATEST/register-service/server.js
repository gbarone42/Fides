const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

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

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the register and login page
app.get('/web/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully. Now, login!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Redirect based on role
    const redirectTo = user.role === 'business' ? 'http://localhost:4000/web/activities/' : 'http://localhost:3000/web/login/';
    res.json({ message: 'Login successful', redirectTo });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Register and Login service running on port 5000');
});
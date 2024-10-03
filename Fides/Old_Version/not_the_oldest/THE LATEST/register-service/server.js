const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');  // Import path to serve static files
const { Pool } = require('pg');

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

// Serve the HTML form for registration
app.use('/web/register', express.static(path.join(__dirname, 'index.html')));

// POST /register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Register service running on port 5000');
});

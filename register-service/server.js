const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*' /* ['http://localhost:3000', 'http://localhost:4000'] */
}));

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
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
  const { username, password } = req.body;

  console.log('REGISTER-SERVICE');

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

    // User authenticated, create a JWT token
    const payload = { id: user.id, username: user.username };
    
    // Sign the JWT token (usually with a secret or private key)
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });  // Token expires in 1 hour

    // Send the token back to the user
    res.json({ token });

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

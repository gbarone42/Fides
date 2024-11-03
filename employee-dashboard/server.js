const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
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

// Middleware function: checks if there is a JWT and, if yes, it checks its validity
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token, forbidden
    req.user = user; // Attach user info to request
    next();
  });
}

console.log('EMPLOYEE-DASHBOARD');

// Serve the static HTML page for setting availability
app.use('/web/login', express.static(path.join(__dirname, 'public')));

// debugging end point
app.post('/log', (req, res) => {
  const { message } = req.body;
  
  fs.appendFile('log.txt', message + '\n', (err) => {
      if (err) {
          console.error('Error writing to log file:', err);
          return res.status(500).send('Failed to log message');
      }
      res.status(200).send('Message logged successfully');
  });
});

// Endpoint to set availability
app.post('/availability', async (req, res) => {
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
app.get('/availability', /* authenticateToken, */ async (req, res) => {
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

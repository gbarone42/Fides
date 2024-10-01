const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve the static HTML file
app.use('/web/matches', express.static(path.join(__dirname, 'public')));

// Set up PostgreSQL pool connection
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'activities',
  password: 'user',
  port: 5432,
});

// Fetch matches between activities and availability
app.get('/matches', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.title AS activity_title, a.date AS activity_date, a.time AS activity_time, a.place AS activity_place, 
             av.date AS availability_date, av.time AS availability_time, av.place AS availability_place, u.username AS employee
      FROM activities a
      JOIN availability av ON (a.date = av.date OR a.time = av.time OR a.place = av.place)
      JOIN users u ON av.employee_id = u.id;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches', error: err.message });
  }
});

// Run the server
app.listen(8081, () => {
  console.log('Matching service running on port 8081');
});

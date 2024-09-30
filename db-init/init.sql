CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL -- 'business' o 'employee'
);

-- Update activities table to include time and place columns
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,  -- New column for time
  place VARCHAR(255) NOT NULL,  -- New column for place
  user_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL, -- 'business' o 'employee'
  permission VARCHAR(255) NOT NULL -- es: 'manage_employees'
);

CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  place VARCHAR(255) NOT NULL
);

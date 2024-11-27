-- Create the users table with additional fields for name, surname, date of birth, and email
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'business' or 'employee'
  nome VARCHAR(255), -- New column for first name
  cognome VARCHAR(255), -- New column for last name
  data_di_nascita DATE, -- New column for date of birth
  email VARCHAR(255) UNIQUE NOT NULL -- New column for email
);

-- Create the activities table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL, -- New column for time
  place VARCHAR(255) NOT NULL, -- New column for place
  user_id INTEGER REFERENCES users(id) -- Reference to the user who created the activity
);

-- Create the permissions table (if needed for future roles/permissions management)
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL, -- 'business' or 'employee'
  permission VARCHAR(255) NOT NULL -- Example: 'manage_employees'
);

-- Create the availability table
CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES users(id), -- Reference to the employee user
  date DATE NOT NULL,
  time TIME NOT NULL,
  place VARCHAR(255) NOT NULL -- Location of availability
);

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  availability_id INTEGER REFERENCES users(id), -- Reference to the employee's availability user
  time TIME NOT NULL, -- Can be slightly different from the start time of the activity
  role VARCHAR(255) NOT NULL, -- Role requested
  description TEXT,
  status VARCHAR(255) NOT NULL -- Defines the current status of the request: pending, confirmed, refused
);

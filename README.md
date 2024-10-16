# README.md

## Docker Commands

### List Running Containers
```bash
# Lists all running Docker containers
docker ps
```

### Start All Services
```bash
# Starts all services defined in your docker-compose.yml file
docker-compose up
```

### Build and Start Containers
```bash
# Builds the images before starting the containers
docker-compose up --build
```

### Stop and Remove Containers
```bash
# Stops and removes all containers defined in your docker-compose.yml file
docker-compose down
```

### Stop, Remove Containers and Volumes
```bash
# Stops and removes containers and associated volumes
docker-compose down --volumes
```

### Rebuild and Restart Containers
```bash
# Stops and removes containers, then rebuilds and starts them
docker-compose down && docker-compose up --build
```

### Access PostgreSQL Database
```bash
# Opens an interactive terminal session in the fides-postgres-1 container to the PostgreSQL database
docker exec -it fides-postgres-1 psql -U postgres -d activities
```

## API Calls with cURL

### Register New User
```bash
# Sends a POST request to register a new user
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword"}'
```

### Register New Employee User
```bash
# Sends a POST request to register a new user with a specific role
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username": "newuser", "password": "password", "role": "employee"}'
```

### Add New Activity
```bash
# Sends a POST request to add a new activity
curl -X POST http://localhost:4000/activities -H "Content-Type: application/json" -d '{"title": "Test Activity", "description": "A test", "date": "2024-09-30", "time": "10:00:00", "place": "Office", "user_id": 1}'
```

## SQL Commands

### Delete All Activities
```sql
-- Deletes all records from the activities table
DELETE FROM activities;
```

### Delete Activities for a Specific User
```sql
-- Deletes activities associated with a specific user
DELETE FROM activities WHERE user_id = 3;
```

### Delete All Users
```sql
-- Deletes all records from the users table
DELETE FROM users;
```

### Delete Specific User
```sql
-- Deletes a specific user from the users table
DELETE FROM users WHERE id = 3;
```

### View All Users
```sql
-- Retrieves all records from the users table
SELECT * FROM users;
```

### View All Activities
```sql
-- Retrieves all records from the activities table
SELECT * FROM activities;
```

### View All Permissions
```sql
-- Retrieves all records from the permissions table
SELECT * FROM permissions;
```

### View All Availability
```sql
-- Retrieves all records from the availability table
SELECT * FROM availability;
```

### Join Activities and Users
```sql
-- Joins the activities and users tables to get a comprehensive view of activities with associated usernames
SELECT a.id, a.title, a.description, a.date, a.time, a.place, u.username FROM activities a JOIN users u ON a.user_id = u.id;
```

### Join Availability and Users
```sql
-- Joins the availability and users tables to view availability linked to usernames
SELECT a.id, a.date, a.time, a.place, u.username FROM availability a JOIN users u ON a.employee_id = u.id;
```

### View Date, Time, and Place of All Activities
```sql
-- Retrieves date, time, and place of all activities
SELECT date, time, place FROM activities;
```

### View Date, Time, and Place of All Availabilities
```sql
-- Retrieves date, time, and place of all availabilities
SELECT date, time, place FROM availability;
```

### Reset User ID Sequence
```sql
-- Resets the sequence for user IDs to start from 1
ALTER SEQUENCE users_id_seq RESTART WITH 1;
```

### Reset Activity ID Sequence
```sql
-- Resets the sequence for activity IDs to start from 1
ALTER SEQUENCE activities_id_seq RESTART WITH 1;
```

## System Commands

### List Processes Using PostgreSQL Port
```bash
# Lists processes using port 5432 (the default PostgreSQL port)
sudo lsof -i :5432
```

### Kill a Process
```bash
# Terminates a process identified by its process ID (pid)
sudo kill pid
```

### Stop PostgreSQL Service
```bash
# Stops the PostgreSQL service
sudo systemctl stop postgresql
```

## Node.js Package Installation

### Install jsonwebtoken
```bash
# Installs the jsonwebtoken library
npm install jsonwebtoken
```

### LINKS
```bash
http://localhost:3000/web/login/ //EmployeeDashboard
```
```bash
http://localhost:4000/web/activities/ //BusinessDashboard
```
```bash
http://localhost:5000/web/registrazione //Registrazione
```
```bash
http://localhost:5000/web/login //Login
```
```bash
http://localhost:8081/matches //Matching
```
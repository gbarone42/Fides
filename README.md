Project README
Project Overview
two main services:

Login Service - Handles user authentication.
Activity Service - Allows users to create, update, delete, and retrieve activities.
Both services are Dockerized, and the data is stored in a PostgreSQL database.



Prerequisites
1. System Requirements
Docker
Docker Compose
Node.js (v14 or higher)

2. Dependencies to be Installed
Node.js Packages
express - Web framework for Node.js.
jsonwebtoken - Library to handle JWT tokens.
bcryptjs - For password hashing.
pg - PostgreSQL client for Node.js.
The required dependencies are listed in package.json.

To install them, run:

npm install

Services and Setup
1. Docker Setup
To run the services with Docker, make sure Docker and Docker Compose are installed on your machine.

2. Activating Services with Docker Compose
Navigate to the project root directory.
Run the following commands to build and start the services:

docker-compose down   # Stop any previous running instances

docker-compose up --build   # Build and start the services

This command will:
Build the Login Service and Activity Service.
Start the PostgreSQL container.


3. Basic Docker Commands
Start all services:
docker-compose up

Stop all services:
docker-compose down

List all running containers:
docker ps

Access PostgreSQL container:
docker exec -it fides-postgres-1 psql -U postgres -d activities

PostgreSQL Setup
1. Database Structure
The project uses a PostgreSQL database with two tables:

users: Stores username and hashed password.

activities: Stores activity data with user associations.

2. Creating or Viewing Tables
To create the required tables, log in to the PostgreSQL container and execute the following commands:

Log into PostgreSQL:
docker exec -it fides-postgres-1 psql -U postgres -d activities

Create Tables:
sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password TEXT
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  date DATE,
  user_id INTEGER REFERENCES users(id)
);

3. Viewing Data in PostgreSQL
View all users:
sql
SELECT * FROM users;

View all activities:
SELECT * FROM activities;

Join users and activities:
SELECT activities.id, activities.title, activities.description, activities.date, users.username 
FROM activities
JOIN users ON activities.user_id = users.id;

Common Commands in PostgreSQL
Delete All Users:
DELETE FROM users;

Delete All Activities:
DELETE FROM activities;

Testing the Services
1. Login Service
Register a New User:
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"username":"user","password":"password"}'

Login and Get JWT Token:
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username":"user","password":"password"}'

3. Activity Service
Create a New Activity:
curl -X POST http://localhost:4000/activities \
-H "Authorization: Bearer <JWT_TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title": "New Activity", "description": "Activity Description", "date": "2024-09-21"}'

List All Activities:
curl -X GET http://localhost:4000/activities \
-H "Authorization: Bearer <JWT_TOKEN>"






docker exec -it fides-postgres-1 psql -U postgres -d activities

docker-compose down   # Stop any previous running instances
docker-compose up --build   # Build and start the services


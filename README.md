Activity & Login Service Project

Project Overview

This project consists of two services:



Login Service: A service to register and login users.

Activity Service: A service that allows users to create, view, update, and delete activities.

Dependencies

Make sure the following dependencies are installed before running the project:



System Requirements

Docker: Install Docker for container management.

Docker Compose: Install Docker Compose to run the services together.

PostgreSQL: The project uses PostgreSQL as the database for storing users and activities.

Node.js Dependencies

Express: For building the REST API.

jsonwebtoken: For managing JWT tokens for authentication.

bcryptjs: For hashing user passwords.

pg: For interacting with PostgreSQL.

These dependencies are automatically installed when running npm install.



How to Set Up and Run the Project

Step 1: Clone the Repository

First, clone the repository to your local machine:



git clone <repository-url>

cd <repository-folder>

Usa il codice con cautela.



Step 2: Set Up Docker

The services are containerized with Docker, so you need Docker and Docker Compose to run them.



Step 3: Running the Services

To start the project services (login-service, activity-service, and PostgreSQL), run the following commands:



Bash

docker-compose up --build

Usa il codice con cautela.



This will build and start the following services:



Login Service on port 3000

Activity Service on port 4000

PostgreSQL on port 5432

Step 4: Accessing the Services

Login Service:



Register a user at http://localhost:3000/register

Login at http://localhost:3000/login

You will receive a JWT token upon login.

Activity Service:



Create, view, update, and delete activities at http://localhost:4000/web/activities

You can either use the JWT Token to authenticate or the username and password via the UI.

Step 5: Environment Variables

Make sure that the .env file is correctly configured with the following details (if needed):



POSTGRES_USER=postgres

POSTGRES_PASSWORD=user

POSTGRES_DB=activities

NODE_ENV=development

JWT_SECRET=secretKey

Basic PostgreSQL Commands

Connecting to PostgreSQL via Docker



To enter the PostgreSQL container and interact with the database, run the following command:



Bash

docker exec -it fides-postgres-1 psql -U postgres -d activities

Usa il codice con cautela.



Common PostgreSQL Queries:



List all users:

SQL

SELECT * FROM users;

Usa il codice con cautela.



List all activities:

SQL

SELECT * FROM activities;

Usa il codice con cautela.



Delete all users:

SQL

DELETE FROM users;

Usa il codice con cautela.



Delete all activities:

SQL

DELETE FROM activities;

Usa il codice con cautela.



Drop and recreate users and activities table:

SQL

DROP TABLE users;

DROP TABLE activities;



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

Usa il codice con cautela.



Stopping and Restarting Services

To stop the services:



Bash

docker-compose down

Usa il codice con cautela.



To restart the services after making changes:



Bash

docker-compose up --build

Usa il codice con cautela.



Troubleshooting

Common Issues:



CORS Policy Errors: Ensure that the CORS configuration is enabled in the backend (login-service and activity-service) by setting appropriate headers.

JWT Token Expiration: Tokens are valid for a limited time (typically 1 hour). If a token expires, you must log in again to obtain a new token.

Database Not Connecting: Ensure that PostgreSQL is running and accepting connections on port 5432. Verify the docker-compose.yml and .env file for correct credentials.

Clearing Docker Containers and Images:



If you encounter errors with Docker, you can clear the containers and images:



Bash

docker-compose down --rmi all

Usa il codice con cautela.



This will remove all containers and images related to the project.



License

This project is licensed under the MIT License.





This formatted content includes proper code blocks for commands and SQL queries, making it easier to read and follow the instructions. 

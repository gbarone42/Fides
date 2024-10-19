# Use Node.js official image
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install Nodemon globally
#RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the service
CMD ["npm", "start"]
#run nodemon to track local changes to files and restart the server automatically, HOT RELOADING
#CMD ["nodemon", "server.js"]

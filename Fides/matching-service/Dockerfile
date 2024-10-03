# Use the official Node.js image.
FROM node:14

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application.
COPY . .

# Expose port 6000
EXPOSE 6000

# Run the app
CMD ["npm", "start"]

# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NODE_ENV=production

# Run the app
CMD ["node", "dist/index.js"]

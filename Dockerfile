# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

# Expose the port on which the app will run
EXPOSE $PORT

# Start the app
CMD ["npm", "start"]

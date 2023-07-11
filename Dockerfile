# Stage 1: Build the application
# Use an official Node.js runtime as the base image. Use alpine or slim version to make image smaller and more secure.
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies, including dev
RUN npm install

# Copy the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine AS production

# Set environment variables
ENV MONGO_HOST=demo-mongo

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built application from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/views ./views

# Change the ownership of the application directory to a non-root user
RUN chown -R node:node .

# Switch to the non-root user
USER node

# Little practical use, but serves as documentation
EXPOSE 27017

# Define the command to run the application
CMD ["node", "dist/index.js"]

# Base image
FROM node:latest AS build

RUN mkdir /app
# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
# Copy source files
COPY . .
RUN npm install

# Build the application
RUN npm run build

# Use a smaller image as runtime base
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage to Nginx folder
COPY --from=build /app/dist/schedule-management /usr/share/nginx/html

# Expose ports 80 and 443
EXPOSE 80 443
# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Copy the file from the current directory to working directory
COPY . .

# Install all the dependencies
RUN npm install 

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Set the working directory to nginx assets directory
WORKDIR /usr/share/nginx/html

# Remove the default nginx static files
RUN rm -rf ./*

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/schedule-management .

# Expose port 80
EXPOSE 80 443

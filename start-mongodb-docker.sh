#!/bin/bash

# Quick MongoDB setup using Docker
# This is the easiest method - no installation needed!

echo "Starting MongoDB with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    echo ""
    echo "Run these commands:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    echo "  sudo usermod -aG docker $USER"
    echo "  newgrp docker"
    exit 1
fi

# Check if MongoDB container already exists
if docker ps -a | grep -q mongodb; then
    echo "MongoDB container exists. Starting it..."
    docker start mongodb
else
    echo "Creating new MongoDB container..."
    docker run -d \
        --name mongodb \
        -p 27017:27017 \
        -v mongodb-data:/data/db \
        mongo:latest
fi

# Wait a moment for MongoDB to start
sleep 2

# Check if it's running
if docker ps | grep -q mongodb; then
    echo ""
    echo "✅ MongoDB is running in Docker!"
    echo "Connection string: mongodb://localhost:27017/fans-crm"
    echo ""
    echo "To stop: docker stop mongodb"
    echo "To start again: docker start mongodb"
    echo "To remove: docker rm -f mongodb"
else
    echo "❌ Failed to start MongoDB container"
    docker logs mongodb
fi

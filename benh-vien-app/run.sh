#!/bin/bash

echo "🏥 Starting Hospital System Frontend..."

# Check if container already exists
if docker ps -a | grep -q hospital-app; then
    echo "🔄 Removing existing container..."
    docker stop hospital-app
    docker rm hospital-app
fi

echo "🚀 Starting new container..."
docker run -d -p 3000:80 --name hospital-app hospital-frontend

echo "⏳ Waiting for container to start..."
sleep 3

echo "✅ Container started!"
echo "🌐 Open: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "   docker logs hospital-app          # View logs"
echo "   docker stop hospital-app          # Stop container"
echo "   docker exec -it hospital-app sh   # Enter container"
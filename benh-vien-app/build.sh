#!/bin/bash

echo "🏥 Building Hospital System Frontend..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build the image
echo "📦 Building Docker image..."
docker build -t hospital-frontend .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To run the application:"
    echo "   docker run -d -p 3000:80 --name hospital-app hospital-frontend"
    echo ""
    echo "🌐 Then open: http://localhost:3000"
else
    echo "❌ Build failed!"
    exit 1
fi
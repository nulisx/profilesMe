#!/bin/bash
set -e

# Start MongoDB if not already running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mkdir -p /tmp/mongodb
    mongod --dbpath /tmp/mongodb --port 27017 --bind_ip 127.0.0.1 --fork --logpath /tmp/mongodb/mongodb.log
    sleep 2
    echo "MongoDB started successfully"
fi

# Build and start backend server
echo "Building backend..."
cd backend
npx tsc || { echo "Backend build failed"; exit 1; }
echo "Backend built successfully"

echo "Starting backend server..."
node build/index.js &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend failed to start"
    exit 1
fi

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev

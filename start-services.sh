#!/bin/bash
set -e

# Start MariaDB if not already running
if ! pgrep -x "mariadbd" > /dev/null; then
    echo "Starting MariaDB..."
    mkdir -p /tmp/mariadb
    mysql_install_db --datadir=/tmp/mariadb --user=$(whoami) 2>/dev/null || true
    mariadbd --datadir=/tmp/mariadb --socket=/tmp/mariadb.sock --skip-networking=0 --bind-address=127.0.0.1 &
    sleep 3
    echo "MariaDB started successfully"
    
    echo "Initializing database..."
    mysql -u root --socket=/tmp/mariadb.sock < backend/link_platform.sql 2>/dev/null || echo "Database already initialized"
fi

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

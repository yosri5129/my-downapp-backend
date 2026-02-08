#!/bin/bash

echo "Starting Universal Downloader..."

# Check if python3 or python is available
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "Python is not installed. Please install Python 3."
    exit 1
fi

# Check if npm is available
if ! command -v npm &>/dev/null; then
    echo "npm is not installed. Please install Node.js and npm."
    exit 1
fi

echo "Starting Backend Server..."
# Run backend in background
$PYTHON_CMD backend/app.py &
BACKEND_PID=$!

echo "Starting Frontend..."
cd frontend
# Run frontend in background. We pipe output to /dev/null to keep terminal clean, 
# or you can remove >/dev/null 2>&1 to see logs.
npm run dev &
FRONTEND_PID=$!

echo "App is running."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."

# Trap Ctrl+C (SIGINT) to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Wait for processes
wait

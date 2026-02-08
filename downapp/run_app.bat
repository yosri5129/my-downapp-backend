@echo off
echo Starting Universal Downloader...

echo Starting Backend Server...
start "Backend Server" cmd /k "python backend/app.py"

echo Starting Frontend...
cd frontend
timeout /t 5
start "Frontend" cmd /k "npm run dev"

echo App is starting. The browser should open shortly (Open http://localhost:5173 if not).
pause

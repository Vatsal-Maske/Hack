@echo off
setlocal

set "ROOT=%~dp0"

echo ================================================
echo   Starting FinGuard AI (Backend + Frontend)
echo ================================================
echo.

REM Start backend only if port 8000 is not already listening
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if errorlevel 1 (
  echo [Backend] Starting on http://localhost:8000
  start "FinGuard Backend" cmd /k "cd /d "%ROOT%backend" && uvicorn app.main:app --port 8000 --reload"
) else (
  echo [Backend] Already running on port 8000
)

REM Start frontend only if port 3000 is not already listening
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if errorlevel 1 (
  echo [Frontend] Starting on http://localhost:3000
  start "FinGuard Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev -- --port 3000"
) else (
  echo [Frontend] Already running on port 3000
)

echo.
echo Waiting a few seconds before opening the app...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

echo Done. Keep the Backend/Frontend windows open while using the app.
echo.
pause

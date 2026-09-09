@echo off
title CabGo Frontend (React + Vite)
echo ===================================================================
echo Starting CabGo Frontend (http://localhost:5173)...
echo ===================================================================
cd /d "%~dp0frontend"
call npm run dev
pause

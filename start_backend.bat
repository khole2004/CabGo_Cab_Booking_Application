@echo off
title CabGo Backend (MSSQL)
echo ===================================================================
echo Starting CabGo Spring Boot Backend with Microsoft SQL Server...
echo ===================================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause

@echo off
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ===================================================================
    echo ERROR: Administrator privileges required!
    echo Please right-click this file and select 'Run as administrator'.
    echo ===================================================================
    pause
    exit /b 1
)

echo ===================================================================
echo [1/3] Restarting SQL Server (SQLEXPRESS)...
echo ===================================================================
net stop "MSSQL$SQLEXPRESS"
net start "MSSQL$SQLEXPRESS"

echo.
echo ===================================================================
echo [2/3] Starting SQL Browser Service...
echo ===================================================================
net start "SQLBrowser" >nul 2>&1

echo.
echo ===================================================================
echo [3/3] Verifying TCP Port 1433 Connectivity...
echo ===================================================================
powershell -Command "Test-NetConnection -ComputerName localhost -Port 1433"

echo.
echo ===================================================================
echo SQL Server restarted successfully.
echo ===================================================================
pause

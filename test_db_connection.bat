@echo off
echo ===================================================================
echo CabGo - Microsoft SQL Server Connection Verification
echo ===================================================================
echo.
echo [1/3] Checking SQL Server TCP Port 1433...
powershell -Command Test-NetConnection -ComputerName localhost -Port 1433
echo.
echo [2/3] Querying cabgo_db via SQLCMD...
sqlcmd -S "localhost,1433" -U sa -P "YourStrong@Passw0rd" -d cabgo_db -C -Q "SELECT COUNT(*) AS [Total Users in cabgo_db] FROM users;"
echo.
echo [3/3] Checking Spring Boot Backend API...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:8088/api/vehicles' | Select-Object -ExpandProperty data | Select-Object code, name, baseFare | Format-Table"
echo.
echo ===================================================================
pause

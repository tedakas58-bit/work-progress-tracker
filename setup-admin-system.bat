@echo off
echo ========================================
echo    Work Progress Tracker Admin Setup
echo ========================================
echo.

echo Setting up admin system...
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the work-progress-tracker root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo 1. Setting up database with admin role...
echo.

REM Check if PostgreSQL is available
psql --version >nul 2>&1
if errorlevel 1 (
    echo Warning: PostgreSQL psql command not found in PATH
    echo Please run the SQL script manually:
    echo   psql -d your_database -f setup-admin-user.sql
    echo.
) else (
    echo Enter your database connection details:
    set /p DB_NAME="Database name (default: work_tracker): "
    if "%DB_NAME%"=="" set DB_NAME=work_tracker
    
    set /p DB_USER="Database user (default: postgres): "
    if "%DB_USER%"=="" set DB_USER=postgres
    
    echo.
    echo Executing admin setup SQL...
    psql -d %DB_NAME% -U %DB_USER% -f setup-admin-user.sql
    
    if errorlevel 1 (
        echo.
        echo Error: Failed to execute SQL script
        echo Please check your database connection and try again
        pause
        exit /b 1
    )
)

echo.
echo 2. Installing/updating dependencies...
echo.

REM Backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Admin System Setup Complete!
echo ========================================
echo.
echo Default Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo   Email: admin@worktracker.com
echo.
echo IMPORTANT SECURITY NOTES:
echo 1. Change the default admin password immediately!
echo 2. Use strong passwords for all admin accounts
echo 3. Create backup admin users for redundancy
echo.
echo To start the application:
echo 1. Backend: cd backend && npm start
echo 2. Frontend: cd frontend && npm run dev
echo.
echo Access admin dashboard at: http://localhost:5173/admin
echo.
echo For detailed documentation, see: ADMIN-SYSTEM-GUIDE.md
echo.
pause
@echo off
echo ========================================
echo Supabase Setup for Work Progress Tracker
echo ========================================
echo.
echo This script will help you set up Supabase database
echo.
echo PREREQUISITES:
echo 1. You have created a Supabase account at https://supabase.com
echo 2. You have created a new project
echo 3. You have your database credentials ready
echo.
pause
echo.
echo ========================================
echo Step 1: Configure Environment Variables
echo ========================================
echo.
echo Please edit backend/.env file with your Supabase credentials:
echo.
echo DB_HOST=db.xxxxxxxxxxxxx.supabase.co
echo DB_PORT=5432
echo DB_NAME=postgres
echo DB_USER=postgres
echo DB_PASSWORD=your_supabase_password
echo DB_SSL=true
echo.
echo Opening .env.example for reference...
start notepad backend\.env.example
echo.
echo After copying .env.example to .env and updating credentials,
pause
echo.
echo ========================================
echo Step 2: Install Dependencies
echo ========================================
cd backend
echo Installing backend dependencies...
call npm install
echo.
echo ========================================
echo Step 3: Run Database Migration
echo ========================================
echo.
echo This will create all tables and default users in Supabase...
echo.
call npm run migrate
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo SUCCESS! Database setup complete!
    echo ========================================
    echo.
    echo Your Supabase database is ready!
    echo.
    echo Next steps:
    echo 1. Start backend: cd backend ^&^& npm start
    echo 2. Start frontend: cd frontend ^&^& npm run dev
    echo 3. Open http://localhost:3000
    echo.
    echo Default login:
    echo - Admin: main_branch / admin123
    echo - Branch: branch1 / admin123
    echo.
) else (
    echo ========================================
    echo ERROR: Migration failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. Your .env file has correct Supabase credentials
    echo 2. DB_SSL=true is set
    echo 3. You have internet connection
    echo 4. Your Supabase project is active
    echo.
)
echo.
pause

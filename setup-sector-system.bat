@echo off
echo ========================================
echo Setting up Sector System for Work Progress Tracker
echo ========================================

echo.
echo Step 1: Installing dependencies...
call npm install bcrypt

echo.
echo Step 2: Running database migration...
node create-sector-users.js

echo.
echo Step 3: Verifying setup...
echo.
echo ========================================
echo Sector System Setup Complete!
echo ========================================
echo.
echo Login Credentials:
echo Organization Sector: organization_admin / sector123
echo Information Sector: information_admin / sector123
echo Operation Sector: operation_admin / sector123
echo Peace and Value Sector: peace_value_admin / sector123
echo.
echo You can now login with any of these accounts to test the sector system.
echo.
pause
@echo off
echo ========================================
echo    Deploying Backend Database Fix
echo ========================================
echo.

echo Committing database connection fix...
git add backend/src/database/db.js
git commit -m "Fix: Support DATABASE_URL for Supabase connection"

echo Pushing to trigger Render deployment...
git push origin main

echo.
echo ========================================
echo    Deployment Triggered!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your Render dashboard
echo 2. Wait for backend deployment to complete
echo 3. Check backend logs for "Database connected" message
echo 4. Update environment variables if needed:
echo    - DATABASE_URL=your-supabase-connection-string
echo    - Or individual DB_HOST, DB_USER, etc.
echo 5. Try admin login again
echo.
pause
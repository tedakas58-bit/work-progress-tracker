@echo off
echo Applying branch name changes to database...
echo.
echo This script will update branch names from:
echo - Branch 1-11 to ወረዳ 1-11 (Woreda 1-11)
echo - Main Branch to ክፍለ ከተማ (Sub-city)
echo.
pause

echo Executing SQL script...
mysql -u root -p work_progress_tracker < update-branch-names-to-amharic.sql

if %errorlevel% equ 0 (
    echo.
    echo ✓ Branch names updated successfully!
    echo.
    echo Changes applied:
    echo - All Branch 1-11 users now have ወረዳ 1-11 names
    echo - Main Branch users now have ክፍለ ከተማ name
    echo - Frontend components updated to use new terminology
    echo.
) else (
    echo.
    echo ✗ Error applying changes. Please check your database connection.
    echo.
)

pause
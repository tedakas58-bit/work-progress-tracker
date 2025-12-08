@echo off
echo ========================================
echo  Push to GitHub Script
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ERROR: Git repository not initialized!
    echo Run: git init
    pause
    exit /b 1
)

echo Step 1: Create a new repository on GitHub
echo Go to: https://github.com/new
echo.
echo Repository name: work-progress-tracker
echo Description: Modern work progress tracking system with action-based reporting
echo Visibility: Public or Private (your choice)
echo DO NOT initialize with README, .gitignore, or license
echo.
pause

echo.
echo Step 2: Enter your GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "

echo.
echo Step 3: Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/work-progress-tracker.git

echo.
echo Step 4: Renaming branch to main...
git branch -M main

echo.
echo Step 5: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  Done! Your code is now on GitHub!
echo ========================================
echo.
echo View your repository at:
echo https://github.com/%GITHUB_USERNAME%/work-progress-tracker
echo.
pause

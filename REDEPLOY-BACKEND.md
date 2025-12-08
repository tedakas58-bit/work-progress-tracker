# Redeploy Backend to Back4App

## Current Issue
Backend is returning 500 errors when creating annual plans. This happens when Back4App hasn't picked up the latest code changes.

## Solution: Trigger Redeploy

### Option 1: Via Back4App Dashboard (Recommended)
1. Go to https://dashboard.back4app.com/
2. Select your app: **workprogresstracker**
3. Go to **App Settings** → **Server Settings**
4. Click **Deploy** or **Redeploy** button
5. Wait for deployment to complete (usually 2-3 minutes)

### Option 2: Force Redeploy via Git
```bash
cd work-progress-tracker
git commit --allow-empty -m "Trigger Back4App redeploy"
git push origin main
```

### Option 3: Check Deployment Logs
1. Go to Back4App Dashboard
2. Click on **Logs** tab
3. Look for any deployment errors
4. Check if the latest commit is deployed

## Verify Deployment
After redeployment, test the API:
```bash
curl https://workprogresstracker-n81anty6.b4a.run/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Current Backend URL
https://workprogresstracker-n81anty6.b4a.run

## Latest Changes
- Removed Target Units field
- Changed Target Amount to Target Number
- Set monthly deadlines to 18th of each month (Ethiopian calendar)

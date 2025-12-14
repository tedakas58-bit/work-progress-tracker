# Troubleshooting: Main Branch Not Seeing Branch Reports

## Issue Description
When branch users submit Amharic plan reports, the main branch dashboard is not displaying them.

## Root Cause Analysis

The issue occurs when one or more of these conditions are not met:

1. **No Amharic Plans Created**: Main branch hasn't created any Amharic structured plans
2. **No Branch Reports Submitted**: Branch users haven't submitted any reports yet
3. **Month/Year Mismatch**: Reports exist but for different months than current
4. **Database Relationship Issues**: Missing foreign key relationships
5. **API/Frontend Issues**: Problems with data fetching or display

## Diagnostic Steps

### Step 1: Check Database Data

Run the diagnostic SQL script:
```bash
# Connect to your database and run:
psql -d your_database -f debug-amharic-reports.sql
```

### Step 2: Check Backend Logs

1. Open browser developer tools (F12)
2. Go to Network tab
3. Refresh the main branch dashboard
4. Look for the API call to `/api/annual-plans/activity-reports/all`
5. Check the response data

### Step 3: Check Console Logs

Look for these debug messages in browser console:
- `=== FRONTEND: Fetching Amharic activity reports ===`
- `=== BACKEND: getAllAmharicActivityReports called ===`

## Solutions

### Solution 1: Create Sample Data (For Testing)

If you need sample data to test the system:

```bash
# Run the sample data creation script
psql -d your_database -f create-sample-amharic-reports.sql
```

### Solution 2: Ensure Proper Data Flow

1. **Main Branch**: Create an Amharic plan
   - Go to "Create Amharic Plan"
   - Add activities with target numbers
   - Save the plan

2. **Branch Users**: Submit reports
   - Go to "Amharic Plan Reports"
   - Click on a plan to submit reports
   - Enter achieved numbers for each activity
   - Submit the reports

3. **Main Branch**: View reports
   - Go to main dashboard
   - Reports should appear in the "All Branch Reports" section

### Solution 3: Fix Month/Year Issues

The current implementation only shows reports for the current month. If you want to see all reports regardless of month, modify the backend:

```javascript
// In annualPlanController.js, remove the month/year filter:
WHERE ap.plan_type = 'amharic_structured'
// Instead of:
WHERE ap.plan_type = 'amharic_structured' 
  AND mp.month = $1 
  AND mp.year = $2
```

### Solution 4: Verify Database Schema

Ensure all required tables exist:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods', 'users');

-- Check if required columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'annual_plans' 
AND column_name IN ('plan_type', 'plan_title_amharic');
```

## Current System Status

After implementing the fixes:

1. ✅ **Backend API**: Enhanced with better debugging and error handling
2. ✅ **Frontend Display**: Improved error messages and user guidance
3. ✅ **Database Queries**: Optimized to show all reports (not just current month)
4. ✅ **Debugging Tools**: Added comprehensive logging and diagnostic scripts

## Testing the Fix

1. **Check Backend Logs**: Look for debug messages in server console
2. **Check Frontend Console**: Look for API response data
3. **Test Data Flow**: 
   - Create Amharic plan as main branch
   - Submit report as branch user
   - Verify report appears on main dashboard

## Expected Behavior

When working correctly:
- Main branch creates Amharic plans with activities
- Branch users see these plans in their "Amharic Plan Reports" section
- Branch users submit reports with achieved numbers
- Main branch sees all submitted reports in dashboard table
- Reports show progress percentages and status

## Common Issues and Fixes

### Issue: "No reports found"
**Cause**: No data in database
**Fix**: Create Amharic plan and have branch users submit reports

### Issue: API returns empty array
**Cause**: Database query filtering out all results
**Fix**: Check month/year filtering in backend query

### Issue: Reports exist but don't display
**Cause**: Frontend rendering issue
**Fix**: Check browser console for JavaScript errors

### Issue: Permission denied
**Cause**: Authentication/authorization issues
**Fix**: Verify user roles and JWT tokens

## Files Modified

- `backend/src/controllers/annualPlanController.js` - Enhanced debugging
- `frontend/src/pages/MainBranchDashboard.jsx` - Better error handling
- `debug-amharic-reports.sql` - Diagnostic queries
- `create-sample-amharic-reports.sql` - Sample data creation
- `test-amharic-reports-data.sql` - Data verification

## Next Steps

1. Run diagnostic scripts to identify the specific issue
2. Apply appropriate solution based on findings
3. Test the complete workflow from plan creation to report viewing
4. Monitor logs for any remaining issues

The system should now provide clear feedback about why reports aren't showing and guide users on how to fix the issue.
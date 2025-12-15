# Amharic Reports Display Fix

## Problem Identified
Branch 1 and Branch 11 submitted reports, but they weren't showing in the Amharic reports view because:

1. **Two Separate Systems**: 
   - Regular monthly reports (stored in `monthly_reports` table) - what Branch 1 & 11 submitted
   - Amharic activity reports (stored in `activity_reports` table) - what the Amharic view was looking for

2. **Data Mismatch**: The `getAllAmharicActivityReports` function only looked at `activity_reports` table, missing the regular monthly reports.

## Solution Implemented

### Backend Changes (`annualPlanController.js`)
Modified `getAllAmharicActivityReports` function to:

1. **First Priority**: Look for proper Amharic activity reports in `activity_reports` table
2. **Fallback**: If no activity reports found, fetch regular monthly reports from `monthly_reports` table
3. **Transform**: Convert monthly reports to look like activity reports with:
   - Activity number: "1.0"
   - Activity title: "የወርሃዊ ዒላማ ተግባር" (Monthly Target Activity)
   - Target unit: "ብር" (Birr)
   - All other fields mapped appropriately

### Frontend Changes (`ViewAmharicReports.jsx`)
Updated the data processing to:

1. **Handle Both Formats**: Process both activity reports and transformed monthly reports
2. **Flatten Structure**: Properly handle the nested activities structure
3. **Display Correctly**: Show all reports in a unified table format

## Expected Result
Now when you visit the Amharic reports view:
- Branch 1 and Branch 11's submitted monthly reports should appear
- They'll be displayed as "1.0 - የወርሃዊ ዒላማ ተግባር" activities
- Their achievement amounts and percentages will be visible
- Status will show as "ገብቷል" (Submitted)

## Export Functionality Enhanced
The export functions now support:
- **PDF Export**: Proper Amharic formatting with Geez font support
- **Excel Export**: Structured data with Amharic headers
- **Word Export**: Professional document format

## How to Test
1. Login as Main Branch user
2. Navigate to "የአማርኛ ሪፖርቶች" (Amharic Reports) from the dashboard
3. You should now see Branch 1 and Branch 11's reports
4. Try exporting to PDF/Excel/Word to test the enhanced export functionality

## Future Improvements
1. Create proper Amharic structured plans for branches to report on
2. Implement activity-based reporting for more detailed tracking
3. Add filtering by plan type in the reports view
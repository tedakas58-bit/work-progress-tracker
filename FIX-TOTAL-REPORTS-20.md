# Fix: Total Reports Showing 20 Instead of 10

## Problem
The main branch dashboard shows "Total Reports: 20" instead of the expected 10 (one per branch).

## Root Cause
The issue occurs when:
1. The `create-first-monthly-plan.sql` script was run multiple times, OR
2. The auto-creation logic in `monthlyPlanController.js` created reports multiple times, OR
3. There are duplicate branch users in the database

## Diagnosis Steps

### Step 1: Run Diagnostic Script
```bash
# In Supabase SQL Editor, run:
work-progress-tracker/diagnose-reports-issue.sql
```

This will show:
- How many branch users exist (should be 10)
- How many reports exist for active plan (currently 20, should be 10)
- If there are duplicate reports
- If there are multiple active plans

### Step 2: Review Results
Expected results:
- Total Branch Users: **10**
- Total Reports for Active Plan: **10** (currently showing 20)
- Duplicate Reports: **0** (currently showing duplicates)
- Active Plans Count: **1**

## Fix Steps

### Option 1: Run Fix Script (Recommended)
```bash
# In Supabase SQL Editor, run:
work-progress-tracker/fix-total-reports-issue.sql
```

This script will:
1. ✅ Remove duplicate reports (keeps oldest report per branch)
2. ✅ Verify only 1 report per branch remains
3. ✅ Create missing reports if any branch is missing one
4. ✅ Show final count (should be 10)

### Option 2: Manual Cleanup
If you prefer manual cleanup:

```sql
-- 1. Find duplicates
SELECT 
    mr.branch_user_id,
    u.branch_name,
    COUNT(*) as report_count
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mp.status = 'active'
GROUP BY mr.branch_user_id, u.branch_name
HAVING COUNT(*) > 1;

-- 2. Delete duplicates (keeps oldest)
DELETE FROM monthly_reports
WHERE id IN (
    SELECT mr.id
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    AND mr.id NOT IN (
        SELECT MIN(mr2.id)
        FROM monthly_reports mr2
        JOIN monthly_plans mp2 ON mr2.monthly_plan_id = mp2.id
        WHERE mp2.status = 'active'
        GROUP BY mr2.branch_user_id, mr2.monthly_plan_id
    )
);
```

## Verification

After running the fix, verify in the frontend:
1. Login as `main_branch` / `admin123`
2. Check dashboard statistics
3. Should show:
   - Total Reports: **10**
   - Submitted: (number of submitted reports)
   - Pending: (number of pending reports)
   - Late: (number of late reports)

## Prevention

To prevent this issue in the future:

### 1. Add Unique Constraint
```sql
-- Add unique constraint to prevent duplicate reports
ALTER TABLE monthly_reports 
ADD CONSTRAINT unique_branch_plan 
UNIQUE (branch_user_id, monthly_plan_id);
```

### 2. Update Auto-Creation Logic
The `monthlyPlanController.js` already has a check to prevent duplicate plan creation:
```javascript
const existingPlan = await client.query(
  `SELECT id FROM monthly_plans WHERE month = $1 AND year = $2`,
  [currentMonth, currentYear]
);

if (existingPlan.rows.length > 0) {
  console.log(`Monthly plan already exists for month ${currentMonth}`);
  return existingPlan.rows[0];
}
```

### 3. Don't Run create-first-monthly-plan.sql Multiple Times
The script should only be run ONCE. After that, the system auto-creates plans.

## Quick Fix Command

Run this in Supabase SQL Editor:
```sql
-- Quick one-liner to fix duplicates
DELETE FROM monthly_reports
WHERE id NOT IN (
    SELECT MIN(mr.id)
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    GROUP BY mr.branch_user_id, mr.monthly_plan_id
);

-- Verify
SELECT COUNT(*) as total_reports
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mp.status = 'active';
```

## Expected Result
After fix: **Total Reports = 10** ✅

## Files Created
1. `diagnose-reports-issue.sql` - Diagnostic queries
2. `fix-total-reports-issue.sql` - Automated fix script
3. `FIX-TOTAL-REPORTS-20.md` - This documentation

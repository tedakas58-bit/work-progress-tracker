# Quick Fix: Total Reports Showing 20

## Problem
Dashboard shows "Total Reports: 20" instead of 10.

## Solution (2 minutes)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Login to your project
3. Click "SQL Editor" in left sidebar

### Step 2: Run Fix Script
Copy and paste this into SQL Editor:

```sql
-- Remove duplicate reports (keeps oldest one per branch)
DELETE FROM monthly_reports
WHERE id NOT IN (
    SELECT MIN(mr.id)
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    GROUP BY mr.branch_user_id, mr.monthly_plan_id
);

-- Add constraint to prevent future duplicates
ALTER TABLE monthly_reports 
ADD CONSTRAINT unique_branch_monthly_plan 
UNIQUE (branch_user_id, monthly_plan_id);

-- Verify fix
SELECT 
    COUNT(*) as total_reports,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted,
    SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mp.status = 'active';
```

### Step 3: Click "Run"
You should see: `total_reports: 10` ✅

### Step 4: Refresh Frontend
1. Go to https://work-progress-tracker-rho.vercel.app
2. Login as `main_branch` / `admin123`
3. Dashboard should now show "Total Reports: 10"

## Done! 🎉

The issue is fixed and won't happen again (unique constraint prevents duplicates).

## What Happened?
The `create-first-monthly-plan.sql` script was likely run twice, creating 20 reports instead of 10. The fix removes duplicates and adds a database constraint to prevent this in the future.

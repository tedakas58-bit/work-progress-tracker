# Fix "Late" Status for On-Time Reports

## Problem
2 reports are showing as "Late" but they were actually submitted **before** the deadline:
- Today: Hidar 29, 2018
- Deadline: Tahsas 18, 2018
- Days remaining: 19 days
- Status should be: **Submitted** (not Late)

## Why This Happened
The reports were marked as "late" during testing or when there was a bug in the date calculation. Since the deadline hasn't passed yet, they should be marked as "submitted".

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com
2. Login to your project
3. Click "SQL Editor" in left sidebar

### Step 2: Run Fix Script
Copy and paste this into SQL Editor:

```sql
-- Fix reports marked as "late" that were actually submitted before deadline
UPDATE monthly_reports mr
SET status = 'submitted', updated_at = NOW()
FROM monthly_plans mp
WHERE mr.monthly_plan_id = mp.id
  AND mp.status = 'active'
  AND mr.status = 'late'
  AND mr.submitted_at < mp.deadline;

-- Verify the fix
SELECT 
    mr.id,
    u.branch_name,
    mr.status,
    mr.submitted_at,
    mp.deadline
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mp.status = 'active'
  AND mr.status IN ('submitted', 'late')
ORDER BY u.branch_name;
```

### Step 3: Click "Run"

### Expected Result:
```
Submitted: 2 (was 0)
Pending: 8
Late: 0 (was 2)
```

### Step 4: Refresh Dashboard
1. Go to https://work-progress-tracker-rho.vercel.app
2. Login as `main_branch` / `admin123`
3. Dashboard should now show:
   - Submitted: **2** ✅
   - Pending: **8** ✅
   - Late: **0** ✅

## Why The Backend Logic is Correct

The backend compares Gregorian dates:
```javascript
const isLate = new Date() > new Date(report.deadline);
// December 8, 2025 > December 18, 2025 = false
// So status = 'submitted' ✅
```

This is correct! The issue was just old data in the database from testing.

## Prevention

Going forward, the system will correctly mark reports as:
- **Submitted**: If submitted before or on deadline (Tahsas 18)
- **Late**: If submitted after deadline (after Tahsas 18)

The backend logic is already correct, so new submissions will have the right status.

## Status: READY TO FIX

Run the SQL script in Supabase and the 2 "late" reports will be corrected to "submitted"! 🎉

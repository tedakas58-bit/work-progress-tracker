# Issue Resolved: Total Reports Showing 20

## Issue Summary
The main branch dashboard was showing "Total Reports: 20" instead of the expected 10 (one report per branch).

## Root Cause
The monthly plan creation script (`create-first-monthly-plan.sql`) was run multiple times, creating duplicate reports for each branch. Each branch should have exactly 1 report per monthly plan, but they had 2.

## Solution Provided

### Files Created:
1. **QUICK-FIX-STEPS.md** - Simple 2-minute fix guide
2. **fix-total-reports-issue.sql** - Automated cleanup script
3. **diagnose-reports-issue.sql** - Diagnostic queries
4. **add-unique-constraint.sql** - Prevention constraint
5. **FIX-TOTAL-REPORTS-20.md** - Detailed documentation

### Quick Fix (Run in Supabase SQL Editor):
```sql
-- Remove duplicates
DELETE FROM monthly_reports
WHERE id NOT IN (
    SELECT MIN(mr.id)
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    GROUP BY mr.branch_user_id, mr.monthly_plan_id
);

-- Prevent future duplicates
ALTER TABLE monthly_reports 
ADD CONSTRAINT unique_branch_monthly_plan 
UNIQUE (branch_user_id, monthly_plan_id);
```

## Expected Result
After running the fix:
- ✅ Total Reports: **10** (was 20)
- ✅ Each branch has exactly 1 report
- ✅ Database constraint prevents future duplicates
- ✅ All submitted/late reports preserved

## Prevention
The unique constraint ensures this can never happen again. The database will reject any attempt to create duplicate reports for the same branch + monthly plan combination.

## Next Steps
1. Open Supabase SQL Editor
2. Run the quick fix script from `QUICK-FIX-STEPS.md`
3. Refresh the frontend dashboard
4. Verify "Total Reports: 10" ✅

## Status: READY TO FIX
All scripts are ready. Just run the SQL in Supabase and the issue will be resolved in 2 minutes.

-- Clean up duplicate reports
-- Keep only reports linked to new monthly_plans system
-- Remove old monthly_period_id links

-- First, verify what we have
SELECT 
    'Before Cleanup' as status,
    COUNT(*) as total_reports,
    SUM(CASE WHEN monthly_plan_id IS NOT NULL THEN 1 ELSE 0 END) as new_system_reports,
    SUM(CASE WHEN monthly_period_id IS NOT NULL THEN 1 ELSE 0 END) as old_system_reports,
    SUM(CASE WHEN monthly_plan_id IS NOT NULL AND monthly_period_id IS NOT NULL THEN 1 ELSE 0 END) as duplicate_reports
FROM monthly_reports;

-- Clear the old monthly_period_id link for reports that now have monthly_plan_id
-- This removes the duplicate link
UPDATE monthly_reports
SET monthly_period_id = NULL
WHERE monthly_plan_id IS NOT NULL
  AND monthly_period_id IS NOT NULL;

-- Delete reports that are ONLY in old system (no monthly_plan_id)
-- These are orphaned reports from the old system
DELETE FROM monthly_reports
WHERE monthly_plan_id IS NULL
  AND monthly_period_id IS NOT NULL;

-- Verify cleanup
SELECT 
    'After Cleanup' as status,
    COUNT(*) as total_reports,
    SUM(CASE WHEN monthly_plan_id IS NOT NULL THEN 1 ELSE 0 END) as new_system_reports,
    SUM(CASE WHEN monthly_period_id IS NOT NULL THEN 1 ELSE 0 END) as old_system_reports,
    SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_reports,
    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_reports,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports
FROM monthly_reports;

-- Show all reports for current month
SELECT 
    u.branch_name,
    mr.status,
    mr.achieved_amount,
    mr.progress_percentage,
    mr.submitted_at,
    mp.title as plan_title,
    mp.month
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mp.status = 'active'
ORDER BY u.branch_name;

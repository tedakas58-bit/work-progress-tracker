-- Check which system has the late report
-- Run this in Supabase SQL Editor to see where the data is

-- Check OLD system (monthly_periods + annual_plans)
SELECT 
    'OLD SYSTEM' as system,
    u.branch_name,
    mr.status,
    mr.achieved_amount,
    mr.submitted_at,
    mp.month,
    ap.title as plan_title
FROM monthly_reports mr
JOIN monthly_periods mp ON mr.monthly_period_id = mp.id
JOIN annual_plans ap ON mp.annual_plan_id = ap.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mr.status IN ('submitted', 'late')
ORDER BY mr.submitted_at DESC;

-- Check NEW system (monthly_plans)
SELECT 
    'NEW SYSTEM' as system,
    u.branch_name,
    mr.status,
    mr.achieved_amount,
    mr.submitted_at,
    mp.month,
    mp.title as plan_title
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mr.status IN ('submitted', 'late')
ORDER BY mr.submitted_at DESC;

-- Check which reports exist in each system
SELECT 
    'OLD SYSTEM' as system,
    COUNT(*) as total_reports,
    SUM(CASE WHEN mr.status = 'late' THEN 1 ELSE 0 END) as late_reports,
    SUM(CASE WHEN mr.status = 'submitted' THEN 1 ELSE 0 END) as submitted_reports
FROM monthly_reports mr
WHERE mr.monthly_period_id IS NOT NULL;

SELECT 
    'NEW SYSTEM' as system,
    COUNT(*) as total_reports,
    SUM(CASE WHEN mr.status = 'late' THEN 1 ELSE 0 END) as late_reports,
    SUM(CASE WHEN mr.status = 'submitted' THEN 1 ELSE 0 END) as submitted_reports
FROM monthly_reports mr
WHERE mr.monthly_plan_id IS NOT NULL;

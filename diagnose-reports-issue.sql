-- Diagnostic script to find why total reports shows 20 instead of 10

-- 1. Check how many branch users exist
SELECT 
    'Total Branch Users' as check_type,
    COUNT(*) as count
FROM users 
WHERE role = 'branch_user';

-- 2. Check how many reports exist for current active plan
SELECT 
    'Total Reports for Active Plan' as check_type,
    COUNT(*) as count
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mp.status = 'active';

-- 3. Check for duplicate reports (same branch_user_id + monthly_plan_id)
SELECT 
    'Duplicate Reports' as check_type,
    COUNT(*) as count
FROM (
    SELECT 
        mr.branch_user_id,
        mr.monthly_plan_id,
        COUNT(*) as report_count
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    GROUP BY mr.branch_user_id, mr.monthly_plan_id
    HAVING COUNT(*) > 1
) duplicates;

-- 4. Show all reports with branch names
SELECT 
    mr.id as report_id,
    u.username,
    u.branch_name,
    mp.title as plan_title,
    mp.month,
    mr.status,
    mr.created_at
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mp.status = 'active'
ORDER BY u.branch_name, mr.created_at;

-- 5. Check if there are multiple active plans
SELECT 
    'Active Plans Count' as check_type,
    COUNT(*) as count
FROM monthly_plans
WHERE status = 'active';

-- 6. Show all active plans
SELECT 
    id,
    title,
    month,
    year,
    status,
    created_at
FROM monthly_plans
WHERE status = 'active'
ORDER BY created_at DESC;

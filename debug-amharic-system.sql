-- Debug Amharic System: Check what data exists

-- 1. Check if there are any Amharic plans
SELECT 
    'Amharic Plans' as table_name,
    COUNT(*) as count,
    string_agg(DISTINCT plan_type, ', ') as plan_types
FROM annual_plans 
WHERE plan_type = 'amharic_structured';

-- 2. Check if there are any plan activities for Amharic plans
SELECT 
    'Plan Activities' as table_name,
    COUNT(*) as count
FROM plan_activities pa
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured';

-- 3. Check if there are any activity reports
SELECT 
    'Activity Reports' as table_name,
    COUNT(*) as count
FROM activity_reports;

-- 4. Check regular monthly reports (what Branch 1 & 11 submitted)
SELECT 
    'Monthly Reports' as table_name,
    COUNT(*) as total_reports,
    COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_reports,
    string_agg(DISTINCT u.branch_name, ', ') as branches_with_reports
FROM monthly_reports mr
JOIN users u ON mr.branch_user_id = u.id;

-- 5. Show the actual submitted monthly reports
SELECT 
    u.branch_name,
    mr.status,
    mr.achieved_amount,
    mr.progress_percentage,
    mr.submitted_at,
    mp.title as plan_title,
    mp.month,
    mp.year
FROM monthly_reports mr
JOIN users u ON mr.branch_user_id = u.id
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mr.status = 'submitted'
ORDER BY u.branch_name;

-- 6. Check if there are any monthly periods (old system)
SELECT 
    'Monthly Periods' as table_name,
    COUNT(*) as count
FROM monthly_periods;
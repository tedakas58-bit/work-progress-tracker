-- Debug Amharic Reports Issue
-- Check if we have the necessary data in the database

-- 1. Check if we have any Amharic plans
SELECT 
    id, 
    title, 
    plan_title_amharic, 
    plan_type, 
    year, 
    plan_month,
    created_at
FROM annual_plans 
WHERE plan_type = 'amharic_structured'
ORDER BY created_at DESC;

-- 2. Check if we have plan activities for Amharic plans
SELECT 
    pa.id,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    pa.target_unit_amharic,
    ap.title as plan_title,
    ap.plan_title_amharic
FROM plan_activities pa
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured'
ORDER BY ap.id, pa.sort_order, pa.activity_number;

-- 3. Check if we have monthly periods for current month
SELECT 
    mp.id,
    mp.month,
    mp.year,
    mp.annual_plan_id,
    ap.title as plan_title
FROM monthly_periods mp
JOIN annual_plans ap ON mp.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured'
    AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY ap.id;

-- 4. Check if we have any activity reports
SELECT 
    ar.id,
    ar.achieved_number,
    ar.achievement_percentage,
    ar.status,
    ar.submitted_at,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    ap.title as plan_title,
    u.username,
    u.branch_name,
    mp.month,
    mp.year
FROM activity_reports ar
JOIN plan_activities pa ON ar.plan_activity_id = pa.id
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
JOIN users u ON ar.branch_user_id = u.id
JOIN monthly_periods mp ON ar.monthly_period_id = mp.id
WHERE ap.plan_type = 'amharic_structured'
ORDER BY ap.id, pa.sort_order, u.branch_name;

-- 5. Check current month and year
SELECT 
    EXTRACT(MONTH FROM CURRENT_DATE) as current_month,
    EXTRACT(YEAR FROM CURRENT_DATE) as current_year;

-- 6. Check branch users
SELECT id, username, branch_name, role FROM users WHERE role = 'branch_user';

-- 7. Test the exact query used in getAllAmharicActivityReports
SELECT 
    ar.*,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    pa.target_unit_amharic,
    ap.title as plan_title,
    ap.plan_title_amharic,
    u.username,
    u.branch_name,
    mp.month,
    mp.year
FROM activity_reports ar
JOIN plan_activities pa ON ar.plan_activity_id = pa.id
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
JOIN users u ON ar.branch_user_id = u.id
JOIN monthly_periods mp ON ar.monthly_period_id = mp.id
WHERE ap.plan_type = 'amharic_structured' 
    AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY ap.id, pa.sort_order, pa.activity_number, u.branch_name;
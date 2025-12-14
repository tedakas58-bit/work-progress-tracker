-- Test if we have the necessary data for Amharic reports to show up

-- 1. Check current date info
SELECT 
    EXTRACT(MONTH FROM CURRENT_DATE) as current_month,
    EXTRACT(YEAR FROM CURRENT_DATE) as current_year,
    CURRENT_DATE as today;

-- 2. Check if we have Amharic plans
SELECT 
    id, 
    title, 
    plan_title_amharic, 
    plan_type, 
    year, 
    plan_month
FROM annual_plans 
WHERE plan_type = 'amharic_structured';

-- 3. Check if we have plan activities
SELECT 
    pa.id,
    pa.annual_plan_id,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    pa.target_unit_amharic
FROM plan_activities pa
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured';

-- 4. Check if we have monthly periods for current month
SELECT 
    mp.id,
    mp.annual_plan_id,
    mp.month,
    mp.year,
    mp.deadline
FROM monthly_periods mp
JOIN annual_plans ap ON mp.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured'
    AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE);

-- 5. Check branch users
SELECT id, username, branch_name, role FROM users WHERE role = 'branch_user';

-- 6. Check if we have any activity reports
SELECT 
    ar.id,
    ar.plan_activity_id,
    ar.monthly_period_id,
    ar.branch_user_id,
    ar.achieved_number,
    ar.status,
    ar.submitted_at
FROM activity_reports ar
JOIN plan_activities pa ON ar.plan_activity_id = pa.id
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured';

-- If there are no activity reports, let's create some sample data
-- (Only run this if the above query returns 0 rows)

-- First, let's see what we need to create sample reports
SELECT 
    pa.id as activity_id,
    mp.id as period_id,
    u.id as user_id,
    pa.activity_number,
    u.branch_name,
    mp.month,
    mp.year
FROM plan_activities pa
CROSS JOIN monthly_periods mp
CROSS JOIN users u
JOIN annual_plans ap ON pa.annual_plan_id = ap.id AND mp.annual_plan_id = ap.id
WHERE ap.plan_type = 'amharic_structured'
    AND u.role = 'branch_user'
    AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE)
LIMIT 10;
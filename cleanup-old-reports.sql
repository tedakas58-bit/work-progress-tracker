-- Clean Up Old Reporting System Data
-- Run this in Supabase SQL Editor to remove old reports and keep only Amharic plan system

-- WARNING: This will delete all old report data!
-- Make sure you have backups if needed before running this script

-- 1. Delete old monthly reports (keep only Amharic activity reports)
DELETE FROM monthly_reports 
WHERE id NOT IN (
    -- Keep any reports that might be linked to Amharic plans
    SELECT DISTINCT mr.id 
    FROM monthly_reports mr
    JOIN monthly_periods mp ON mr.monthly_period_id = mp.id
    JOIN annual_plans ap ON mp.annual_plan_id = ap.id
    WHERE ap.plan_type = 'amharic_structured'
);

-- 2. Delete old action reports
DELETE FROM action_reports;

-- 3. Delete old actions
DELETE FROM actions;

-- 4. Delete old annual plans (keep only Amharic structured plans)
DELETE FROM annual_plans 
WHERE plan_type != 'amharic_structured' OR plan_type IS NULL;

-- 5. Delete orphaned monthly periods (not linked to Amharic plans)
DELETE FROM monthly_periods 
WHERE annual_plan_id NOT IN (
    SELECT id FROM annual_plans WHERE plan_type = 'amharic_structured'
);

-- 6. Clean up quarterly and annual aggregations for deleted plans
DELETE FROM quarterly_aggregations 
WHERE annual_plan_id NOT IN (
    SELECT id FROM annual_plans WHERE plan_type = 'amharic_structured'
);

DELETE FROM annual_aggregations 
WHERE annual_plan_id NOT IN (
    SELECT id FROM annual_plans WHERE plan_type = 'amharic_structured'
);

-- 7. Clean up monthly plans that are not needed
-- (Keep the monthly_plans table structure but remove old data if needed)
-- DELETE FROM monthly_plans WHERE created_at < '2024-01-01'; -- Adjust date as needed

-- 8. Verify cleanup - Show remaining data
SELECT 
    'Cleanup Summary' as summary,
    'annual_plans' as table_name,
    COUNT(*) as remaining_records,
    'Only Amharic structured plans' as description
FROM annual_plans
WHERE plan_type = 'amharic_structured'

UNION ALL

SELECT 
    'Cleanup Summary' as summary,
    'plan_activities' as table_name,
    COUNT(*) as remaining_records,
    'Amharic plan activities' as description
FROM plan_activities

UNION ALL

SELECT 
    'Cleanup Summary' as summary,
    'activity_reports' as table_name,
    COUNT(*) as remaining_records,
    'Branch activity reports' as description
FROM activity_reports

UNION ALL

SELECT 
    'Cleanup Summary' as summary,
    'monthly_reports' as table_name,
    COUNT(*) as remaining_records,
    'Old monthly reports (should be minimal)' as description
FROM monthly_reports

UNION ALL

SELECT 
    'Cleanup Summary' as summary,
    'actions' as table_name,
    COUNT(*) as remaining_records,
    'Old actions (should be 0)' as description
FROM actions

UNION ALL

SELECT 
    'Cleanup Summary' as summary,
    'action_reports' as table_name,
    COUNT(*) as remaining_records,
    'Old action reports (should be 0)' as description
FROM action_reports

ORDER BY table_name;

-- 9. Show current Amharic plan structure
SELECT 
    'Current Amharic Plans' as info,
    ap.id,
    ap.title,
    ap.plan_title_amharic,
    ap.year,
    ap.plan_month,
    COUNT(pa.id) as activity_count
FROM annual_plans ap
LEFT JOIN plan_activities pa ON ap.id = pa.annual_plan_id
WHERE ap.plan_type = 'amharic_structured'
GROUP BY ap.id, ap.title, ap.plan_title_amharic, ap.year, ap.plan_month
ORDER BY ap.year DESC, ap.plan_month DESC;

-- Success message
SELECT 'Database cleanup complete! Only Amharic plan reporting system remains.' as status;
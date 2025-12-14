-- Database Structure Verification for Amharic Plan Reporting System
-- Run this in Supabase SQL Editor to check if your database is properly configured

-- 1. Check if all required tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods', 'plan_templates', 'users') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods', 'plan_templates', 'users')
ORDER BY table_name;

-- 2. Check if Amharic columns exist in annual_plans
SELECT 
    'annual_plans Amharic columns' as check_type,
    column_name,
    data_type,
    CASE 
        WHEN column_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.columns 
WHERE table_name = 'annual_plans' 
    AND column_name IN ('plan_title_amharic', 'plan_description_amharic', 'plan_type', 'plan_month')
ORDER BY column_name;

-- 3. Check plan_activities table structure
SELECT 
    'plan_activities columns' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'plan_activities'
ORDER BY ordinal_position;

-- 4. Check activity_reports table structure
SELECT 
    'activity_reports columns' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'activity_reports'
ORDER BY ordinal_position;

-- 5. Check foreign key relationships
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    '✅ RELATIONSHIP OK' as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('plan_activities', 'activity_reports')
ORDER BY tc.table_name, kcu.column_name;

-- 6. Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef,
    '✅ INDEX EXISTS' as status
FROM pg_indexes 
WHERE tablename IN ('plan_activities', 'activity_reports', 'monthly_periods')
    AND schemaname = 'public'
ORDER BY tablename, indexname;

-- 7. Count existing data
SELECT 
    'Data Count Check' as check_type,
    'annual_plans' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN plan_type = 'amharic_structured' THEN 1 END) as amharic_plans
FROM annual_plans
UNION ALL
SELECT 
    'Data Count Check' as check_type,
    'plan_activities' as table_name,
    COUNT(*) as total_records,
    NULL as amharic_plans
FROM plan_activities
UNION ALL
SELECT 
    'Data Count Check' as check_type,
    'activity_reports' as table_name,
    COUNT(*) as total_records,
    NULL as amharic_plans
FROM activity_reports
UNION ALL
SELECT 
    'Data Count Check' as check_type,
    'monthly_periods' as table_name,
    COUNT(*) as total_records,
    NULL as amharic_plans
FROM monthly_periods
UNION ALL
SELECT 
    'Data Count Check' as check_type,
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN role = 'branch_user' THEN 1 END) as branch_users
FROM users;

-- 8. Test query to verify relationships work
SELECT 
    'Relationship Test' as test_type,
    ap.id as plan_id,
    ap.title,
    ap.plan_title_amharic,
    ap.plan_type,
    COUNT(pa.id) as activity_count
FROM annual_plans ap
LEFT JOIN plan_activities pa ON ap.id = pa.annual_plan_id
WHERE ap.plan_type = 'amharic_structured' OR ap.plan_type IS NULL
GROUP BY ap.id, ap.title, ap.plan_title_amharic, ap.plan_type
ORDER BY ap.id;

-- 9. Check if monthly_periods are properly linked
SELECT 
    'Monthly Periods Check' as test_type,
    ap.id as plan_id,
    ap.title,
    COUNT(mp.id) as period_count,
    MIN(mp.month) as min_month,
    MAX(mp.month) as max_month
FROM annual_plans ap
LEFT JOIN monthly_periods mp ON ap.id = mp.annual_plan_id
GROUP BY ap.id, ap.title
ORDER BY ap.id;

-- 10. Final Status Summary
SELECT 
    '🎯 DATABASE VERIFICATION COMPLETE' as status,
    CASE 
        WHEN (
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
                AND table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods', 'plan_templates')
        ) = 5 THEN '✅ ALL REQUIRED TABLES EXIST'
        ELSE '❌ SOME TABLES MISSING - RUN setup-amharic-reporting-database.sql'
    END as table_status,
    CASE 
        WHEN (
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name = 'annual_plans' 
                AND column_name IN ('plan_title_amharic', 'plan_description_amharic', 'plan_type', 'plan_month')
        ) = 4 THEN '✅ ALL AMHARIC COLUMNS EXIST'
        ELSE '❌ AMHARIC COLUMNS MISSING - RUN setup-amharic-reporting-database.sql'
    END as column_status;
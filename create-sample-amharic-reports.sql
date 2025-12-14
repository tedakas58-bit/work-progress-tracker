-- Create sample Amharic activity reports for testing
-- This script will create sample reports so main branch can see data

-- First, check if we have the necessary components
DO $$
DECLARE
    plan_count INTEGER;
    activity_count INTEGER;
    period_count INTEGER;
    user_count INTEGER;
    report_count INTEGER;
BEGIN
    -- Check existing data
    SELECT COUNT(*) INTO plan_count FROM annual_plans WHERE plan_type = 'amharic_structured';
    SELECT COUNT(*) INTO activity_count FROM plan_activities pa 
        JOIN annual_plans ap ON pa.annual_plan_id = ap.id 
        WHERE ap.plan_type = 'amharic_structured';
    SELECT COUNT(*) INTO period_count FROM monthly_periods mp
        JOIN annual_plans ap ON mp.annual_plan_id = ap.id
        WHERE ap.plan_type = 'amharic_structured'
        AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
        AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE);
    SELECT COUNT(*) INTO user_count FROM users WHERE role = 'branch_user';
    SELECT COUNT(*) INTO report_count FROM activity_reports ar
        JOIN plan_activities pa ON ar.plan_activity_id = pa.id
        JOIN annual_plans ap ON pa.annual_plan_id = ap.id
        WHERE ap.plan_type = 'amharic_structured';

    RAISE NOTICE 'Current data status:';
    RAISE NOTICE 'Amharic plans: %', plan_count;
    RAISE NOTICE 'Plan activities: %', activity_count;
    RAISE NOTICE 'Current month periods: %', period_count;
    RAISE NOTICE 'Branch users: %', user_count;
    RAISE NOTICE 'Activity reports: %', report_count;

    -- If we have plans, activities, periods, and users, but no reports, create sample reports
    IF plan_count > 0 AND activity_count > 0 AND period_count > 0 AND user_count > 0 AND report_count = 0 THEN
        RAISE NOTICE 'Creating sample activity reports...';
        
        -- Create sample reports for each activity and each branch user
        INSERT INTO activity_reports (
            plan_activity_id, 
            monthly_period_id, 
            branch_user_id, 
            achieved_number, 
            achievement_percentage, 
            notes_amharic, 
            status, 
            submitted_at
        )
        SELECT 
            pa.id as plan_activity_id,
            mp.id as monthly_period_id,
            u.id as branch_user_id,
            -- Random achieved numbers (50-120% of target)
            CASE 
                WHEN pa.target_number > 0 THEN 
                    FLOOR(pa.target_number * (0.5 + random() * 0.7))::INTEGER
                ELSE 1
            END as achieved_number,
            -- Calculate percentage
            CASE 
                WHEN pa.target_number > 0 THEN 
                    LEAST(100, FLOOR((FLOOR(pa.target_number * (0.5 + random() * 0.7))::FLOAT / pa.target_number) * 100))
                ELSE 100
            END as achievement_percentage,
            -- Sample Amharic notes
            CASE (random() * 3)::INTEGER
                WHEN 0 THEN 'እቅዱ በተሳካ ሁኔታ ተፈጽሟል። ተጨማሪ ጥረት ተደርጓል።'
                WHEN 1 THEN 'ጥሩ እድገት ተመዝግቧል። አንዳንድ ተግዳሮቶች ነበሩ።'
                ELSE 'እቅዱ በከፊል ተፈጽሟል። የበለጠ ጥረት ያስፈልጋል።'
            END as notes_amharic,
            'submitted' as status,
            CURRENT_TIMESTAMP - (random() * interval '10 days') as submitted_at
        FROM plan_activities pa
        CROSS JOIN monthly_periods mp
        CROSS JOIN users u
        JOIN annual_plans ap ON pa.annual_plan_id = ap.id AND mp.annual_plan_id = ap.id
        WHERE ap.plan_type = 'amharic_structured'
            AND u.role = 'branch_user'
            AND mp.month = EXTRACT(MONTH FROM CURRENT_DATE)
            AND mp.year = EXTRACT(YEAR FROM CURRENT_DATE);

        GET DIAGNOSTICS report_count = ROW_COUNT;
        RAISE NOTICE 'Created % sample activity reports', report_count;
    ELSE
        RAISE NOTICE 'Sample reports not created. Check the conditions above.';
    END IF;
END $$;

-- Verify the created reports
SELECT 
    ar.id,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    ar.achieved_number,
    ar.achievement_percentage,
    u.branch_name,
    ar.status,
    ar.submitted_at
FROM activity_reports ar
JOIN plan_activities pa ON ar.plan_activity_id = pa.id
JOIN annual_plans ap ON pa.annual_plan_id = ap.id
JOIN users u ON ar.branch_user_id = u.id
WHERE ap.plan_type = 'amharic_structured'
ORDER BY pa.activity_number, u.branch_name
LIMIT 10;
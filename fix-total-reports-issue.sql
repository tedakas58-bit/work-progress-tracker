-- Fix script for total reports showing 20 instead of 10
-- This script will:
-- 1. Remove duplicate reports
-- 2. Ensure only 1 report per branch per active plan
-- 3. Verify the fix

-- Step 1: Identify and keep only the FIRST report for each branch+plan combination
-- Delete duplicates, keeping the oldest report (lowest id)
DELETE FROM monthly_reports
WHERE id IN (
    SELECT mr.id
    FROM monthly_reports mr
    JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
    WHERE mp.status = 'active'
    AND mr.id NOT IN (
        -- Keep only the first (oldest) report for each branch+plan
        SELECT MIN(mr2.id)
        FROM monthly_reports mr2
        JOIN monthly_plans mp2 ON mr2.monthly_plan_id = mp2.id
        WHERE mp2.status = 'active'
        GROUP BY mr2.branch_user_id, mr2.monthly_plan_id
    )
);

-- Step 2: Verify we now have exactly 10 reports (1 per branch)
SELECT 
    'After Cleanup - Total Reports' as check_type,
    COUNT(*) as count
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mp.status = 'active';

-- Step 3: Show the remaining reports
SELECT 
    mr.id as report_id,
    u.username,
    u.branch_name,
    mp.title as plan_title,
    mr.status,
    mr.achieved_amount,
    mr.created_at
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
JOIN users u ON mr.branch_user_id = u.id
WHERE mp.status = 'active'
ORDER BY u.branch_name;

-- Step 4: Check if any branches are missing reports
SELECT 
    u.id,
    u.username,
    u.branch_name,
    CASE 
        WHEN mr.id IS NULL THEN 'MISSING REPORT'
        ELSE 'Has Report'
    END as report_status
FROM users u
LEFT JOIN monthly_reports mr ON u.id = mr.branch_user_id 
    AND mr.monthly_plan_id = (SELECT id FROM monthly_plans WHERE status = 'active' LIMIT 1)
WHERE u.role = 'branch_user'
ORDER BY u.branch_name;

-- Step 5: If any branches are missing reports, create them
INSERT INTO monthly_reports (monthly_plan_id, branch_user_id, status)
SELECT 
    (SELECT id FROM monthly_plans WHERE status = 'active' LIMIT 1),
    u.id,
    'pending'
FROM users u
WHERE u.role = 'branch_user'
AND NOT EXISTS (
    SELECT 1 
    FROM monthly_reports mr 
    WHERE mr.branch_user_id = u.id 
    AND mr.monthly_plan_id = (SELECT id FROM monthly_plans WHERE status = 'active' LIMIT 1)
);

-- Final verification
SELECT 
    'Final Count - Total Reports' as check_type,
    COUNT(*) as count
FROM monthly_reports mr
JOIN monthly_plans mp ON mr.monthly_plan_id = mp.id
WHERE mp.status = 'active';

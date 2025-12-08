-- Add unique constraint to prevent duplicate reports
-- This ensures each branch can only have ONE report per monthly plan

-- First, clean up any existing duplicates (if not already done)
DELETE FROM monthly_reports
WHERE id NOT IN (
    SELECT MIN(id)
    FROM monthly_reports
    GROUP BY branch_user_id, monthly_plan_id
);

-- Now add the unique constraint
ALTER TABLE monthly_reports 
ADD CONSTRAINT unique_branch_monthly_plan 
UNIQUE (branch_user_id, monthly_plan_id);

-- Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'monthly_reports'::regclass
AND conname = 'unique_branch_monthly_plan';

-- Test: Try to insert a duplicate (should fail)
-- Uncomment to test:
-- INSERT INTO monthly_reports (monthly_plan_id, branch_user_id, status)
-- SELECT 
--     (SELECT id FROM monthly_plans WHERE status = 'active' LIMIT 1),
--     (SELECT id FROM users WHERE role = 'branch_user' LIMIT 1),
--     'pending';
-- Expected: ERROR: duplicate key value violates unique constraint "unique_branch_monthly_plan"

SELECT '✅ Unique constraint added successfully!' as result;

-- Migrate existing reports from OLD system to NEW system
-- This connects old monthly_reports to the new monthly_plans table

-- First, check if there are any reports in the old system for current month
SELECT 
    COUNT(*) as old_system_reports,
    mp.month,
    mp.year
FROM monthly_reports mr
JOIN monthly_periods mp ON mr.monthly_period_id = mp.id
WHERE mr.monthly_period_id IS NOT NULL
  AND mp.month = 6  -- Current month (December = Month 6)
GROUP BY mp.month, mp.year;

-- Update monthly_reports to link to new monthly_plans
-- This assumes you have one active monthly_plan for month 6
UPDATE monthly_reports mr
SET monthly_plan_id = (
    SELECT id FROM monthly_plans 
    WHERE month = 6 AND status = 'active' 
    LIMIT 1
)
WHERE mr.id IN (
    SELECT mr.id 
    FROM monthly_reports mr
    JOIN monthly_periods mp ON mr.monthly_period_id = mp.id
    WHERE mp.month = 6  -- Current month
      AND mr.monthly_plan_id IS NULL
);

-- Verify the migration
SELECT 
    'After Migration' as status,
    COUNT(*) as total_reports,
    SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_reports,
    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_reports,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports
FROM monthly_reports
WHERE monthly_plan_id IS NOT NULL;

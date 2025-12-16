-- Add sector-specific roles to the users table
-- First, drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with sector roles
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'main_branch', 'branch_user', 'organization_sector', 'information_sector', 'operation_sector', 'peace_value_sector'));

-- Add a sector field to track which sector each user belongs to
ALTER TABLE users ADD COLUMN IF NOT EXISTS sector VARCHAR(50);

-- Add sector field to annual_plans to track which sector created the plan
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS sector VARCHAR(50);
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'regular';

-- Insert the 4 sector users
INSERT INTO users (username, password, role, branch_name, email, sector) VALUES
('organization_admin', '$2b$10$rQJ8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8Y', 'organization_sector', 'Organization Sector', 'organization@example.com', 'organization'),
('information_admin', '$2b$10$rQJ8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8Y', 'information_sector', 'Information Sector', 'information@example.com', 'information'),
('operation_admin', '$2b$10$rQJ8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8Y', 'operation_sector', 'Operation Sector', 'operation@example.com', 'operation'),
('peace_value_admin', '$2b$10$rQJ8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8YQZ9X8Y', 'peace_value_sector', 'Peace and Value Sector', 'peacevalue@example.com', 'peace_value')
ON CONFLICT (username) DO NOTHING;

-- Update existing main_branch user to have organization sector by default
UPDATE users SET sector = 'organization' WHERE role = 'main_branch' AND sector IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_sector ON users(sector);
CREATE INDEX IF NOT EXISTS idx_annual_plans_sector ON annual_plans(sector);
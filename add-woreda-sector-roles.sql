-- Add new woreda sector roles to the user role constraint
-- This allows each woreda to have 4 sector-specific users

-- Update the role constraint to include woreda sector roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN (
  'admin', 
  'main_branch', 
  'branch_user',
  'organization_sector', 
  'information_sector', 
  'operation_sector', 
  'peace_value_sector',
  'woreda_organization',
  'woreda_information', 
  'woreda_operation',
  'woreda_peace_value'
));

-- Verify the constraint was updated
SELECT constraint_name, check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'users_role_check';

-- Show current users and their roles
SELECT username, role, sector, branch_name 
FROM users 
ORDER BY role, username;
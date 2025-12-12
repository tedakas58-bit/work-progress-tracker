-- Update the users table to include admin role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'main_branch', 'branch_user'));

-- Create admin user (password is 'admin123' - change this in production!)
INSERT INTO users (username, password, role, branch_name, email) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administration', 'admin@worktracker.com')
ON CONFLICT (username) DO UPDATE SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  branch_name = EXCLUDED.branch_name,
  email = EXCLUDED.email;

-- Verify admin user was created
SELECT id, username, role, branch_name, email, created_at 
FROM users 
WHERE role = 'admin';

-- Show all users and their roles
SELECT username, role, branch_name, email 
FROM users 
ORDER BY role, username;
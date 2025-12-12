-- Create admin user with a simple password for testing
-- First, let's try with a known working hash

-- Option 1: Try with a different password hash (password: 'password')
UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'admin';

-- Option 2: If that doesn't work, let's create a new admin with a simple password
-- Delete existing admin first
DELETE FROM users WHERE username = 'admin';

-- Create new admin with password 'password' (change this after login!)
INSERT INTO users (username, password, role, branch_name, email) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administration', 'admin@worktracker.com');

-- Verify admin user exists
SELECT id, username, role, branch_name, email, created_at FROM users WHERE username = 'admin';

-- Test login credentials:
-- Username: admin
-- Password: password
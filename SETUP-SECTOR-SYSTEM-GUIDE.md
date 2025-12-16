# 🚀 Sector System Setup Guide

## Quick Setup Options

### Option 1: Automated Setup (Recommended)
```bash
# Navigate to your project directory
cd work-progress-tracker

# Run the automated setup
setup-sector-system.bat
```

### Option 2: Manual Database Setup

#### Step 1: Generate Password Hash
```bash
# Generate the password hash first
node generate-password-hash.js
```

#### Step 2: Update SQL Script
1. Copy the generated hash from Step 1
2. Open `setup-sector-database.sql`
3. Replace the placeholder hash with the real one
4. Run the SQL script in your database

#### Step 3: Run SQL Script
```sql
-- In your PostgreSQL database, run:
\i setup-sector-database.sql
```

### Option 3: Node.js Script
```bash
# If you have Node.js setup
node create-sector-users.js
```

## 🔍 Verification Steps

### 1. Check Database Changes
```sql
-- Verify users were created
SELECT username, role, sector, branch_name FROM users WHERE role LIKE '%sector%';

-- Verify table structure
\d users
\d annual_plans
```

### 2. Test Login
Try logging in with any sector admin:
- Username: `organization_admin`
- Password: `sector123`

### 3. Check Dashboard
- Main branch should see 4 sector buttons
- Sector admins should see 3 focused buttons

## 🛠️ Troubleshooting

### Database Connection Issues
1. Check your `.env` file has correct database credentials
2. Ensure your database is running
3. Verify network connectivity

### Permission Errors
```sql
-- If you get permission errors, run as database admin:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### Password Hash Issues
If login fails:
1. Run `generate-password-hash.js` to get a fresh hash
2. Update the users manually:
```sql
UPDATE users SET password = 'NEW_HASH_HERE' WHERE username = 'organization_admin';
```

## 📋 Expected Results

After successful setup:

### Database Changes:
- ✅ 4 new user roles added to constraint
- ✅ `sector` column added to `users` table
- ✅ `sector` column added to `annual_plans` table
- ✅ 4 sector admin users created
- ✅ Indexes created for performance

### User Accounts:
| Username | Password | Role | Sector |
|----------|----------|------|--------|
| organization_admin | sector123 | organization_sector | organization |
| information_admin | sector123 | information_sector | information |
| operation_admin | sector123 | operation_sector | operation |
| peace_value_admin | sector123 | peace_value_sector | peace_value |

### Dashboard Changes:
- **Main Branch**: 4 sector buttons + 2 management buttons
- **Sector Admins**: 3 buttons (Create, Manage, Reports)

## 🔄 Next Steps

1. **Test Each Account**: Login with each sector admin to verify isolation
2. **Create Test Plans**: Each sector should only see their own plans
3. **Verify Permissions**: Sector admins cannot access other sectors' data
4. **Update Passwords**: Change default passwords for security

## 🆘 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify your database connection
3. Ensure all dependencies are installed (`npm install`)
4. Check that your database user has sufficient privileges

The sector system is now ready for your 4 sectors to independently manage their plans!
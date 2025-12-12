# Admin System Guide

## Overview
The admin system provides comprehensive user management and system monitoring capabilities for the Work Progress Tracker application.

## Admin Features

### 1. User Management
- **Create Users**: Create new users with any role (admin, main_branch, branch_user)
- **View All Users**: See complete user list with statistics
- **Reset Passwords**: Reset passwords for any user when they forget them
- **Delete Users**: Remove users from the system (except the last admin)
- **Role Management**: Assign appropriate roles to users

### 2. System Monitoring
- **Dashboard Statistics**: View system-wide statistics including:
  - Total users by role
  - Reports submitted
  - Late reports
  - Recent activity
- **User Activity**: Monitor recent user activities and submissions

### 3. Security Features
- **Admin-Only Access**: All admin functions require admin role authentication
- **Last Admin Protection**: Cannot delete the last admin user
- **Secure Password Reset**: Admins can reset forgotten passwords securely

## Setup Instructions

### 1. Database Setup
Run the admin setup SQL script:
```sql
-- Execute this in your database
\i setup-admin-user.sql
```

### 2. Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123` (Change this immediately in production!)
- **Email**: `admin@worktracker.com`

### 3. Access Admin Dashboard
1. Login with admin credentials
2. You'll be automatically redirected to the admin dashboard
3. Or navigate to `/admin` route

## User Roles

### Admin
- Full system access
- User management capabilities
- System monitoring
- Can create/edit/delete all user types
- Can reset any user's password

### Main Branch
- Create annual plans
- View all branch reports
- Manage actions and activities
- Branch comparison and analytics

### Branch User
- Submit monthly reports
- Submit action reports
- View their own progress
- Limited to their branch data

## API Endpoints

### Admin Routes (All require admin authentication)

#### User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/reset-password` - Reset user password

#### Statistics
- `GET /api/admin/system-stats` - Get system statistics
- `GET /api/admin/stats` - Get branch statistics (legacy)

#### Legacy Branch Management (Kept for compatibility)
- `GET /api/admin/branches` - Get branch users only
- `POST /api/admin/branches` - Create branch user
- `PUT /api/admin/branches/:id` - Update branch user
- `DELETE /api/admin/branches/:id` - Delete branch user
- `POST /api/admin/branches/:id/reset-password` - Reset branch password

## Frontend Components

### AdminDashboard.jsx
Main admin interface with:
- System statistics cards
- User management table
- Create user modal
- Reset password modal
- Recent activity feed

### Navigation Updates
- Admin users see "System Administrator" in navbar
- Red sparkle icon for admin identification
- Automatic routing to admin dashboard

## Security Considerations

### Production Setup
1. **Change Default Password**: Immediately change the default admin password
2. **Use Strong Passwords**: Enforce strong password policies
3. **Regular Monitoring**: Monitor admin activities and user access
4. **Backup Admin**: Create multiple admin users for redundancy

### Password Reset Process
1. Admin identifies user needing password reset
2. Admin clicks "Reset Password" in user table
3. Admin enters new temporary password
4. Admin communicates new password to user securely
5. User should change password on next login

## Common Admin Tasks

### Creating a New Branch User
1. Click "Create New User" button
2. Fill in user details:
   - Username (unique)
   - Email (unique)
   - Role: "Branch User"
   - Branch Name
   - Initial password
3. Click "Create User"
4. System automatically creates necessary reports for the user

### Resetting a Forgotten Password
1. Find user in the user table
2. Click "Reset Password" next to their name
3. Enter new temporary password
4. Click "Reset Password"
5. Inform user of new password securely

### Monitoring System Health
1. Check dashboard statistics for:
   - User growth
   - Report submission rates
   - Late report trends
2. Review recent activity for unusual patterns
3. Monitor user engagement metrics

## Troubleshooting

### Cannot Access Admin Dashboard
- Verify user has 'admin' role in database
- Check authentication token is valid
- Ensure admin routes are properly configured

### Cannot Create Users
- Check for duplicate usernames/emails
- Verify all required fields are provided
- Check database constraints and permissions

### Password Reset Not Working
- Verify user exists in database
- Check admin permissions
- Ensure password meets any validation requirements

## Database Schema Updates

The admin system requires these schema changes:
```sql
-- Update role constraint to include admin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'main_branch', 'branch_user'));
```

## Future Enhancements

Potential improvements for the admin system:
- Audit logging for admin actions
- Bulk user operations
- Advanced user filtering and search
- Email notifications for password resets
- User activity analytics
- System configuration management
- Backup and restore functionality

## Support

For admin system support:
1. Check this documentation first
2. Review error logs in browser console
3. Check backend server logs
4. Verify database connectivity and permissions
5. Contact system administrator if issues persist
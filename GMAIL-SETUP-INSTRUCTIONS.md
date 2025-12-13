# 📧 Gmail Setup Instructions for 2FA

## ✅ Step-by-Step Gmail Configuration

### 1. Enable 2-Step Verification
1. Go to https://myaccount.google.com
2. Click "Security" → "2-Step Verification"
3. Follow setup process with your phone number
4. Complete verification

### 2. Generate App Password
1. Go back to Security → "2-Step Verification"
2. Scroll to "App passwords" section
3. Click "App passwords"
4. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **Work Progress Tracker**
5. Click **Generate**
6. **Copy the 16-character password** (format: abcd efgh ijkl mnop)

### 3. Add to Render Environment Variables

**Go to Render Dashboard:**
1. Open your backend service
2. Go to "Environment" tab
3. Click "Add Environment Variable"
4. Add these three variables:

```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=Work Progress Tracker <noreply@worktracker.com>
```

**Example:**
```
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=Work Progress Tracker <noreply@worktracker.com>
```

### 4. Update Database Schema

**In Supabase SQL Editor:**
Run this SQL to add 2FA support:

```sql
-- Add 2FA fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Create verification attempts table
CREATE TABLE IF NOT EXISTS verification_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    attempts INTEGER DEFAULT 1,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_ip ON verification_attempts(user_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);
```

### 5. Deploy the Changes

```bash
# Commit and push the 2FA code
git add .
git commit -m "Add 2FA with Gmail email service"
git push origin main
```

### 6. Test the System

After Render deploys (2-3 minutes):

1. **Go to your app**: https://work-progress-tracker.vercel.app
2. **Try to login** with: `admin` / `password`
3. **Check your Gmail** for verification code
4. **Enter the 6-digit code**
5. **Successfully login** with 2FA!

## 🔧 Troubleshooting

### Email Not Sending?
- **Check app password**: Make sure it's the 16-character password from Google
- **Check Gmail address**: Use the exact email address
- **Check Render logs**: Look for email sending errors

### Code Not Received?
- **Check spam folder**: Gmail might filter the emails
- **Wait a few minutes**: Email delivery can be delayed
- **Try resend**: Use the "Resend Code" button

### Still Having Issues?
- **Check Render environment variables**: Make sure they're set correctly
- **Check database**: Ensure the schema updates were applied
- **Check console logs**: Look for any error messages

## 🎯 What Happens Next

Once configured, your system will:

1. **Send verification codes** on every login attempt
2. **Send password reset notifications** when admin resets passwords
3. **Provide enterprise-level security** with 2FA
4. **Track login attempts** and prevent brute force attacks

## 📧 Email Templates

Users will receive professional emails like:

**Verification Code Email:**
- Subject: "Work Progress Tracker - Verification Code"
- 6-digit code prominently displayed
- 10-minute expiration notice
- Professional branding

**Password Reset Email:**
- Subject: "Work Progress Tracker - Password Reset"
- New password securely displayed
- Security reminder to change password
- Contact information for issues

Your 2FA system is ready to go live! 🔐
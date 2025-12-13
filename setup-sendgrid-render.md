# 🚀 Quick SendGrid Setup for Render

## Environment Variables to Add in Render

**Go to your Render backend service → Environment tab and add:**

```env
SENDGRID_API_KEY=SG.4ed28565efb7b1c363a7635130558da5
SENDGRID_FROM_EMAIL=noreply@worktracker.com
SENDGRID_FROM_NAME=Work Progress Tracker
```

## Supabase Database Update

**Run this in Supabase SQL Editor:**

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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_ip ON verification_attempts(user_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);
```

## Test Your System

1. **Wait 2-3 minutes** for Render to deploy
2. **Go to**: https://work-progress-tracker-rho.vercel.app
3. **Login with**: `admin` / `password`
4. **Check your email** for verification code
5. **Enter code** and access dashboard

**Your professional 2FA system is ready!** ✅
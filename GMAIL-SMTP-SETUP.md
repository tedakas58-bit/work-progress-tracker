# 📧 Gmail SMTP Setup Guide - FREE Email Solution

## ✅ Why Gmail SMTP?

- **100% FREE** - No cost, no limits for personal use
- **Send to ANY email address** - No recipient restrictions
- **No domain verification needed** - Works immediately
- **Reliable delivery** - Gmail's infrastructure
- **Easy setup** - Just 2 environment variables

---

## 🚀 Step 1: Enable Gmail App Passwords

### 1.1: Enable 2-Factor Authentication (Required)

**Gmail requires 2FA to use App Passwords:**

1. Go to https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Follow the setup process (use your phone number)
4. **Complete 2FA setup** before proceeding

### 1.2: Generate App Password

**After 2FA is enabled:**

1. Go to https://myaccount.google.com/apppasswords
2. **Select app**: Choose **"Mail"**
3. **Select device**: Choose **"Other (custom name)"**
4. **Enter name**: `Work Progress Tracker`
5. Click **"Generate"**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

⚠️ **Important**: This is NOT your regular Gmail password - it's a special app password!

---

## 🔧 Step 2: Configure Render Environment Variables

### 2.1: Remove Resend Variables (Optional)

**In your Render backend environment, you can remove these:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TEST_EMAIL`

### 2.2: Add Gmail Variables

**Add these NEW environment variables in Render:**

```
GMAIL_USER=stedo0485@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

**Example:**
```
GMAIL_USER=stedo0485@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 2.3: How to Add in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your backend service**
3. **Go to Environment tab**
4. **Click "Add Environment Variable"** (twice)

**Variable 1:**
- **Key**: `GMAIL_USER`
- **Value**: `stedo0485@gmail.com`

**Variable 2:**
- **Key**: `GMAIL_APP_PASSWORD`
- **Value**: `your_16_character_app_password` (from Step 1.2)

5. **Click "Save Changes"**
6. **Wait 2-3 minutes** for deployment

---

## 📋 Step 3: Update User Email Addresses

**Now you can set REAL email addresses for each user:**

### 3.1: Run This in Supabase SQL Editor

```sql
-- Update users with real email addresses
-- Each user will receive emails at their own address

UPDATE users SET email = 'admin@yourcompany.com' WHERE username = 'admin';
UPDATE users SET email = 'john.doe@gmail.com' WHERE username = 'branch1';
UPDATE users SET email = 'jane.smith@gmail.com' WHERE username = 'branch2';
UPDATE users SET email = 'mike.wilson@gmail.com' WHERE username = 'branch3';
UPDATE users SET email = 'sarah.jones@gmail.com' WHERE username = 'branch4';
UPDATE users SET email = 'david.brown@gmail.com' WHERE username = 'branch5';

-- Or use your own email addresses:
-- UPDATE users SET email = 'your.email@gmail.com' WHERE username = 'branch1';
-- UPDATE users SET email = 'colleague@company.com' WHERE username = 'branch2';

-- Verify the updates
SELECT username, email, role, branch_name FROM users ORDER BY username;
```

### 3.2: Alternative - Use Different Gmail Accounts

If you have multiple Gmail accounts:

```sql
UPDATE users SET email = 'stedo0485@gmail.com' WHERE username = 'admin';
UPDATE users SET email = 'branch1.work@gmail.com' WHERE username = 'branch1';
UPDATE users SET email = 'branch2.work@gmail.com' WHERE username = 'branch2';
UPDATE users SET email = 'branch3.work@gmail.com' WHERE username = 'branch3';
```

---

## 🎉 Step 4: Test the System

### 4.1: Try Logging In

1. **Go to your app**: https://work-progress-tracker.vercel.app
2. **Try logging in** as different users:
   - Username: `admin`, Password: `password`
   - Username: `branch1`, Password: `password`
   - Username: `branch2`, Password: `password`

### 4.2: Check Email Delivery

**Each user should receive emails at their own address:**

- `admin` → Email goes to `admin@yourcompany.com`
- `branch1` → Email goes to `john.doe@gmail.com`
- `branch2` → Email goes to `jane.smith@gmail.com`

### 4.3: Professional Email Experience

**Users will receive beautiful emails like this:**

```
From: Work Progress Tracker <stedo0485@gmail.com>
To: john.doe@gmail.com
Subject: Work Progress Tracker - Verification Code

Hello branch1!

We received a login request for your Work Progress Tracker account.
To complete your login, please use the verification code below:

    123456

This code will expire in 10 minutes for your security.
```

---

## 📊 Gmail SMTP Limits (All FREE)

### ✅ Free Tier Limits
- **500 emails per day** - More than enough for your app
- **Send to any email address** - No restrictions
- **No cost** - Completely free
- **Reliable delivery** - Gmail's infrastructure

### 📈 Usage Estimate
**For your app with 10 users:**
- **2FA codes**: ~20 emails/day (users login occasionally)
- **Password resets**: ~5 emails/day (rare)
- **Total**: ~25 emails/day (well under 500 limit)

---

## 🔒 Security Benefits

### ✅ App Password Security
- **Separate from main password** - Your Gmail password stays secure
- **App-specific** - Only works for this application
- **Revokable** - Can be disabled anytime at https://myaccount.google.com/apppasswords

### ✅ Email Security
- **Real 2FA** - Each user gets codes at their own email
- **No shared emails** - Better security isolation
- **Professional appearance** - Users trust Gmail delivery

---

## 🛠️ Troubleshooting

### ❌ "Invalid credentials" error?

**Check these:**
1. **Gmail User**: Must be exact email address (`stedo0485@gmail.com`)
2. **App Password**: Must be 16-character app password (not regular password)
3. **2FA Enabled**: Gmail account must have 2-Factor Authentication enabled
4. **Spaces in password**: Remove spaces from app password (`abcdefghijklmnop`)

### ❌ "Authentication failed" error?

**Try this:**
1. **Generate new app password** at https://myaccount.google.com/apppasswords
2. **Update Render environment variable** with new password
3. **Wait 2-3 minutes** for Render to redeploy

### ❌ Emails not being received?

**Check:**
1. **Spam folders** - Gmail emails might go to spam initially
2. **Email addresses** - Verify user emails are correct in database
3. **Render logs** - Check for sending errors

---

## 🎯 Complete Environment Variables

**Your final Render environment should have:**

```
PORT=5000
NODE_ENV=production
DB_HOST=aws-1-eu-north-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.lxzuarfulvoqfmswdkga
DB_PASSWORD=Word@1212tedo
DB_SSL=true
JWT_SECRET=work_progress_tracker_secret_key_2024_change_this
JWT_EXPIRES_IN=7d
GMAIL_USER=stedo0485@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

---

## 🚀 Quick Setup Summary

### ✅ 5-Minute Setup Checklist

1. **Enable 2FA** on Gmail account
2. **Generate App Password** at https://myaccount.google.com/apppasswords
3. **Add environment variables** in Render:
   - `GMAIL_USER=stedo0485@gmail.com`
   - `GMAIL_APP_PASSWORD=your_app_password`
4. **Update user emails** in Supabase to real addresses
5. **Test login** - each user gets emails at their own address!

---

## 🎉 Benefits of This Setup

### ✅ For You (Admin)
- **No monthly costs** - Completely free
- **No domain setup** - Works immediately
- **Reliable delivery** - Gmail's infrastructure
- **Easy management** - One Gmail account handles all

### ✅ For Your Users
- **Professional emails** - From Gmail, trusted delivery
- **Real 2FA security** - Each gets codes at their own email
- **Fast delivery** - Gmail's global network
- **Spam-free** - Gmail emails rarely go to spam

---

**Your professional 2FA email system is ready! Each user will receive verification codes at their own email address, completely free using Gmail SMTP.** 📧✨

---

## 🔄 Switching Back to Resend (Optional)

If you ever want to switch back to Resend later:

1. **Verify a domain** at https://resend.com/domains
2. **Update sender email** to use your domain
3. **Switch import** in controllers back to `resendService.js`
4. **Update environment variables** back to Resend

But Gmail SMTP works great for most use cases and is completely free! 🎉
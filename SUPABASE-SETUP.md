# 🚀 Supabase Database Setup Guide

This guide will help you connect your Work Progress Tracker to Supabase cloud database.

## Why Supabase?

- ✅ Free PostgreSQL database (up to 500MB)
- ✅ No need to run Docker locally
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Built-in database management UI

---

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email

---

## Step 2: Create New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `work-progress-tracker`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

---

## Step 3: Get Database Connection Details

1. In your Supabase project, go to **Settings** (gear icon)
2. Click **"Database"** in the left sidebar
3. Scroll down to **"Connection string"** section
4. You'll see connection details like:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [your password from Step 2]
   ```

---

## Step 4: Update Your .env File

1. In your project, navigate to `work-progress-tracker/backend/`
2. Create a `.env` file (if it doesn't exist)
3. Add your Supabase credentials:

```env
PORT=5000
NODE_ENV=production

# Supabase Database Configuration
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password_here
DB_SSL=true

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d
```

**Important**: Replace `xxxxxxxxxxxxx` with your actual Supabase project reference!

---

## Step 5: Run Database Migration

The migration will create all necessary tables and insert default users.

### Option A: Using npm (Recommended)

```bash
cd work-progress-tracker/backend
npm install
npm run migrate
```

### Option B: Using Node directly

```bash
cd work-progress-tracker/backend
node src/database/migrate.js
```

You should see:
```
✅ Database connected
📍 Connected to: db.xxxxxxxxxxxxx.supabase.co
✅ Database migration completed successfully
```

---

## Step 6: Start Your Application

### Start Backend:
```bash
cd work-progress-tracker/backend
npm start
```

### Start Frontend (in a new terminal):
```bash
cd work-progress-tracker/frontend
npm run dev
```

Your app will be running at: **http://localhost:3000**

---

## Step 7: Verify Connection

1. Open your browser to `http://localhost:3000`
2. Try logging in with:
   - **Admin**: Username: `main_branch`, Password: `admin123`
   - **Branch User**: Username: `branch1`, Password: `admin123`

If login works, you're successfully connected to Supabase! 🎉

---

## 🔍 View Your Data in Supabase

1. Go to your Supabase project dashboard
2. Click **"Table Editor"** in the left sidebar
3. You'll see all your tables:
   - `users`
   - `annual_plans`
   - `monthly_reports`
   - `actions`
   - `action_reports`

You can view, edit, and manage data directly from here!

---

## 🚨 Troubleshooting

### Error: "Connection refused"
- Check if your DB_HOST is correct
- Verify DB_SSL=true is set

### Error: "Password authentication failed"
- Double-check your database password
- Make sure there are no extra spaces in .env file

### Error: "SSL connection required"
- Ensure DB_SSL=true is in your .env file

### Migration fails
- Check if you have internet connection
- Verify all credentials are correct
- Try running migration again

---

## 📊 Database Limits (Free Tier)

- **Storage**: 500 MB
- **Bandwidth**: 2 GB per month
- **API Requests**: Unlimited

This is more than enough for your work progress tracker!

---

## 🔐 Security Tips

1. **Never commit .env file** - It's already in .gitignore
2. **Use strong passwords** - For both database and JWT secret
3. **Enable Row Level Security** - In Supabase dashboard (optional)
4. **Regular backups** - Supabase does this automatically

---

## 🎯 Next Steps

- ✅ Your app is now cloud-ready!
- ✅ No need to run Docker locally
- ✅ Access your data from anywhere
- ✅ Share your app with team members

---

## 📝 Default User Accounts

After migration, these accounts are available:

**Main Branch (Admin)**:
- Username: `main_branch`
- Password: `admin123`

**Branch Users** (10 accounts):
- Username: `branch1` to `branch10`
- Password: `admin123`

**⚠️ Change these passwords in production!**

---

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: https://github.com/tedo123-svg/work-progress-tracker/issues

---

**Happy Tracking! 📈**

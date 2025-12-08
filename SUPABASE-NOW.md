# 🚀 Setup Supabase RIGHT NOW (10 Minutes)

Follow these exact steps to get your database online.

---

## ✅ Step 1: Create Supabase Account (2 min)

1. Open: https://supabase.com
2. Click **"Start your project"**
3. Sign up with **GitHub** (easiest)
4. Verify your email if asked

---

## ✅ Step 2: Create Project (3 min)

1. Click **"New Project"** (green button)
2. Fill in:
   - **Name**: `work-progress-tracker`
   - **Database Password**: Create a strong password
     - Example: `MySecure2024Pass!`
     - **⚠️ SAVE THIS PASSWORD!** Write it down!
   - **Region**: Choose closest to you
     - US: `East US (North Virginia)`
     - Europe: `West EU (Ireland)`
     - Asia: `Southeast Asia (Singapore)`
   - **Pricing Plan**: **Free** (already selected)
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes (grab a coffee!)

---

## ✅ Step 3: Get Your Database URL (1 min)

1. In your Supabase project, click **Settings** (⚙️ icon at bottom left)
2. Click **"Database"** in the left menu
3. Scroll down to **"Connection string"** section
4. You'll see something like:
   ```
   Host: db.abcdefghijklmnop.supabase.co
   ```
5. **Copy this host URL** - you'll need it!

---

## ✅ Step 4: Update Your .env File (2 min)

1. Open your project folder: `work-progress-tracker/backend/`
2. Open the file: `.env`
3. Replace these lines:

**BEFORE:**
```env
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PASSWORD=your_supabase_password_here
```

**AFTER** (use YOUR actual values):
```env
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PASSWORD=MySecure2024Pass!
```

4. **Save the file!**

---

## ✅ Step 5: Install & Migrate (2 min)

Open your terminal/command prompt:

```bash
# Go to backend folder
cd work-progress-tracker/backend

# Install dependencies (if not already done)
npm install

# Run database migration
npm run migrate
```

**You should see:**
```
✅ Database connected
📍 Connected to: db.abcdefghijklmnop.supabase.co
✅ Creating tables...
✅ Creating default users...
✅ Database migration completed successfully
```

---

## ✅ Step 6: Verify in Supabase (1 min)

1. Go back to your Supabase dashboard
2. Click **"Table Editor"** (📊 icon in left menu)
3. You should see these tables:
   - ✅ users
   - ✅ annual_plans
   - ✅ actions
   - ✅ monthly_periods
   - ✅ monthly_reports
   - ✅ action_reports
   - ✅ quarterly_aggregations
   - ✅ annual_aggregations

4. Click on **"users"** table
5. You should see **11 users**:
   - 1 admin (main_branch)
   - 10 branch users (branch1 to branch10)

---

## 🎉 SUCCESS! Your Database is Online!

Now start your application:

### Terminal 1 - Backend:
```bash
cd work-progress-tracker/backend
npm start
```

### Terminal 2 - Frontend:
```bash
cd work-progress-tracker/frontend
npm install
npm run dev
```

### Open Browser:
```
http://localhost:3000
```

### Login:
- **Admin**: Username: `main_branch`, Password: `admin123`
- **Branch**: Username: `branch1`, Password: `admin123`

---

## 🌐 Your Data is Now in the Cloud!

- ✅ No Docker needed
- ✅ Access from anywhere
- ✅ Automatic backups
- ✅ Free 500MB storage

---

## 📊 View Your Data Anytime

1. Go to: https://app.supabase.com
2. Select your project: `work-progress-tracker`
3. Click **"Table Editor"**
4. Browse, edit, and manage data directly!

---

## 🔐 Security Tips

**Change default passwords:**
1. In Supabase, go to **Table Editor** → **users**
2. Click on a user row
3. Update the `password` field (use bcrypt hash)
4. Or change passwords through your app's UI

---

## 🆘 Troubleshooting

### Error: "Connection refused"
- ✅ Check DB_HOST is correct in `.env`
- ✅ Verify DB_SSL=true is set

### Error: "Password authentication failed"
- ✅ Check password in `.env` matches Supabase
- ✅ No extra spaces in `.env` file

### Error: "npm: command not found"
- ✅ Install Node.js: https://nodejs.org

### Migration says "already exists"
- ✅ That's OK! It means tables are already created
- ✅ Your database is ready to use

---

## 📖 Next Steps

Want to deploy online? See: **DEPLOY-ONLINE.md**

Need help? Check: **SUPABASE-SETUP.md** (detailed guide)

---

**You're all set! Start tracking work progress! 📈**

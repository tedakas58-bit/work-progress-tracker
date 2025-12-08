# 🎯 START HERE - Quick Setup Guide

Choose your path:

---

## 🌐 I Want My App ONLINE (Recommended)

**Follow this guide:** `SUPABASE-NOW.md`

**What you'll get:**
- ✅ Cloud database (no Docker needed)
- ✅ Access from anywhere
- ✅ Free 500MB storage
- ✅ Automatic backups
- ⏱️ **Time: 10 minutes**

**Steps:**
1. Create Supabase account → https://supabase.com
2. Create project & get database URL
3. Update `backend/.env` file
4. Run: `npm run migrate`
5. Start app: `npm start`

**Then deploy online:** See `DEPLOY-ONLINE.md`

---

## 💻 I Want Local Development Only

**Follow this guide:** `DOCKER-SUCCESS.md`

**What you'll get:**
- ✅ Everything runs on your computer
- ✅ No internet needed
- ✅ Full control
- ⏱️ **Time: 5 minutes**

**Steps:**
1. Install Docker Desktop
2. Run: `docker-compose up -d`
3. Open: http://localhost:3000

---

## 📚 All Available Guides

| Guide | Purpose | Time |
|-------|---------|------|
| **SUPABASE-NOW.md** | Setup cloud database | 10 min |
| **DEPLOY-ONLINE.md** | Deploy to internet | 20 min |
| **DOCKER-SUCCESS.md** | Local Docker setup | 5 min |
| **SUPABASE-SETUP.md** | Detailed Supabase guide | - |
| **SUPABASE-QUICK-START.md** | Quick Supabase reference | 5 min |
| **ACTION-BASED-REPORTING.md** | How reporting works | - |
| **ACCESS.md** | User accounts & permissions | - |
| **CHECK-DATABASE.md** | Database troubleshooting | - |

---

## 🔑 Default Login Credentials

After setup, login with:

**Admin Account:**
- Username: `main_branch`
- Password: `admin123`

**Branch Users (10 accounts):**
- Username: `branch1` to `branch10`
- Password: `admin123`

⚠️ **Change these in production!**

---

## 🚀 Quick Commands

### Start Backend:
```bash
cd backend
npm install
npm start
```

### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Run Migration:
```bash
cd backend
npm run migrate
```

### Start with Docker:
```bash
docker-compose up -d
```

---

## 🆘 Need Help?

**Can't decide?** → Use Supabase (cloud database)

**Docker not working?** → Use Supabase instead

**Want it online?** → Follow SUPABASE-NOW.md then DEPLOY-ONLINE.md

**Local only?** → Follow DOCKER-SUCCESS.md

---

## 📊 What This App Does

- ✅ Track work progress across 10 branches
- ✅ Create annual plans with actions
- ✅ Submit monthly reports
- ✅ Auto-calculate implementation percentages
- ✅ View dashboards and analytics
- ✅ Compare branch performance

---

## 🎯 Recommended Path for You

Since you want your project **online**:

1. **Now**: Follow `SUPABASE-NOW.md` (10 min)
2. **Test locally**: Make sure everything works
3. **Then**: Follow `DEPLOY-ONLINE.md` (20 min)
4. **Result**: Your app is live on the internet! 🌐

---

**Ready? Open `SUPABASE-NOW.md` and let's go! 🚀**

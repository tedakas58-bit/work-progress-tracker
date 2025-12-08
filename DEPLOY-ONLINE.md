# 🌐 Deploy Your Work Progress Tracker Online

Complete guide to deploy your application online using Supabase + Vercel/Render.

---

## 🎯 Deployment Architecture

- **Database**: Supabase (PostgreSQL Cloud)
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)

All free and production-ready!

---

## Part 1: Setup Supabase Database (5 minutes)

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project" → Sign up with GitHub
3. Verify your email

### 2. Create New Project
1. Click "New Project"
2. Fill in:
   - **Organization**: Create new or select existing
   - **Name**: `work-progress-tracker`
   - **Database Password**: Create strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing**: Free (500MB database)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### 3. Get Database Credentials
1. Go to **Settings** (⚙️ icon bottom left)
2. Click **Database** in sidebar
3. Scroll to "Connection string" section
4. Note these values:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database: postgres
   Port: 5432
   User: postgres
   Password: [your password from step 2]
   ```

### 4. Update Your .env File
Open `backend/.env` and update:
```env
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
DB_SSL=true
```

### 5. Run Database Migration
```bash
cd backend
npm install
npm run migrate
```

You should see:
```
✅ Database connected
📍 Connected to: db.xxxxxxxxxxxxx.supabase.co
✅ Database migration completed successfully
```

### 6. Verify in Supabase Dashboard
1. Go to **Table Editor** in Supabase
2. You should see all tables:
   - users (with 11 default accounts)
   - annual_plans
   - actions
   - monthly_periods
   - monthly_reports
   - action_reports
   - quarterly_aggregations
   - annual_aggregations

✅ **Database setup complete!**

---

## Part 2: Deploy Backend to Render (10 minutes)

### 1. Prepare Backend for Deployment

Create `backend/package.json` start script (should already exist):
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### 2. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `work-progress-tracker`
3. Configure:
   - **Name**: `work-progress-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 4. Add Environment Variables
In Render dashboard, add these environment variables:

```
PORT=5000
NODE_ENV=production
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_SSL=true
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d
```

### 5. Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Your backend URL will be: `https://work-progress-backend.onrender.com`

### 6. Test Backend
Open: `https://work-progress-backend.onrender.com/api/health`

Should return: `{"status":"ok"}`

✅ **Backend deployed!**

---

## Part 3: Deploy Frontend to Vercel (5 minutes)

### 1. Update Frontend API URL

Edit `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://work-progress-backend.onrender.com/api';
```

### 2. Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 3. Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `work-progress-tracker`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. Add Environment Variable
Add this environment variable:
```
VITE_API_URL=https://work-progress-backend.onrender.com/api
```

### 5. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at: `https://work-progress-tracker.vercel.app`

✅ **Frontend deployed!**

---

## Part 4: Configure CORS (Important!)

Update `backend/src/server.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://work-progress-tracker.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
```

Commit and push changes:
```bash
git add .
git commit -m "Add production CORS configuration"
git push origin main
```

Render will auto-deploy the update.

---

## 🎉 Your App is Now Online!

### Access Your Application:
- **Frontend**: https://work-progress-tracker.vercel.app
- **Backend**: https://work-progress-backend.onrender.com
- **Database**: Supabase Dashboard

### Default Login Credentials:
- **Admin**: `main_branch` / `admin123`
- **Branch Users**: `branch1` to `branch10` / `admin123`

---

## 📊 Free Tier Limits

### Supabase (Free):
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth/month
- ✅ Unlimited API requests
- ✅ Automatic backups

### Render (Free):
- ✅ 750 hours/month
- ✅ Auto-sleep after 15 min inactivity
- ✅ Auto-wake on request
- ⚠️ First request may be slow (cold start)

### Vercel (Free):
- ✅ Unlimited bandwidth
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default passwords in Supabase (Table Editor → users)
- [ ] Update JWT_SECRET to a strong random string
- [ ] Enable Row Level Security in Supabase (optional)
- [ ] Add custom domain (optional)
- [ ] Set up monitoring/alerts
- [ ] Review CORS settings

---

## 🚀 Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `tracker.yourcompany.com`)
3. Update DNS records as instructed
4. Vercel auto-configures HTTPS

### For Backend (Render):
1. Upgrade to paid plan ($7/month)
2. Add custom domain in settings
3. Update frontend API_URL

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Automatic deployment happens!
```

---

## 📈 Monitoring

### Supabase:
- Database usage: Settings → Usage
- Query performance: Database → Query Performance
- Logs: Logs Explorer

### Render:
- Logs: Dashboard → Logs
- Metrics: Dashboard → Metrics
- Events: Dashboard → Events

### Vercel:
- Analytics: Project → Analytics
- Logs: Project → Deployments → View Logs
- Performance: Project → Speed Insights

---

## 🆘 Troubleshooting

### Backend won't start on Render:
- Check environment variables are set correctly
- View logs in Render dashboard
- Verify Supabase credentials

### Frontend can't connect to backend:
- Check VITE_API_URL is correct
- Verify CORS settings in backend
- Check backend is running (visit health endpoint)

### Database connection errors:
- Verify DB_SSL=true is set
- Check Supabase project is active
- Verify password is correct

### Render service sleeping:
- Free tier sleeps after 15 min inactivity
- First request wakes it up (may take 30 seconds)
- Consider upgrading for always-on service

---

## 💰 Upgrade Options (When You Need More)

### Supabase Pro ($25/month):
- 8 GB database
- 50 GB bandwidth
- Daily backups
- Priority support

### Render Starter ($7/month):
- Always-on (no sleep)
- Custom domain
- Faster performance

### Vercel Pro ($20/month):
- Advanced analytics
- Password protection
- More bandwidth

---

## 🎯 Next Steps

1. ✅ Test all features online
2. ✅ Share URL with your team
3. ✅ Change default passwords
4. ✅ Set up regular backups
5. ✅ Monitor usage and performance

---

## 📞 Support Resources

- **Supabase**: https://supabase.com/docs
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Your Repo**: https://github.com/tedo123-svg/work-progress-tracker

---

**Congratulations! Your Work Progress Tracker is now live! 🎉**

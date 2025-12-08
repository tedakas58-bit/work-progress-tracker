# 📊 Work Progress Tracker

A modern full-stack web application for tracking company work progress with action-based reporting system.

## ✨ Features

- **Action-Based Reporting**: Create actions with plan numbers, branches submit actual activities
- **Automatic Calculations**: System auto-calculates implementation percentage (Actual/Plan × 100)
- **Annual Plan Management**: Main branch creates annual plans, automatically split into 12 monthly periods
- **Monthly Reporting**: 10 branch users submit monthly progress reports
- **Real-time Dashboards**: Progress visualization, branch comparisons, and analytics
- **Modern UI**: Dark theme with purple/pink gradients, glass morphism effects, smooth animations

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, JWT Authentication
- **Frontend**: React, Vite, TailwindCSS, Recharts
- **Database**: PostgreSQL (Local Docker or Supabase Cloud)
- **Deployment**: Docker, Docker Compose

## 🚀 Quick Start

### Option 1: Using Docker (Recommended for Local Development)

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# Access the app at http://localhost:3000
```

See [DOCKER-SUCCESS.md](DOCKER-SUCCESS.md) for detailed Docker setup.

### Option 2: Using Supabase (Cloud Database)

```bash
# Run the setup script
setup-supabase.bat

# Or follow manual steps in SUPABASE-SETUP.md
```

See [SUPABASE-SETUP.md](SUPABASE-SETUP.md) for detailed Supabase setup.

### Option 3: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database in .env
npm run migrate
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 👥 Default User Accounts

**Main Branch (Admin)**:
- Username: `main_branch`
- Password: `admin123`

**Branch Users** (10 accounts):
- Username: `branch1` to `branch10`
- Password: `admin123`

⚠️ **Change these passwords in production!**

## 📖 Documentation

- [SUPABASE-SETUP.md](SUPABASE-SETUP.md) - Connect to Supabase cloud database
- [DOCKER-SUCCESS.md](DOCKER-SUCCESS.md) - Docker deployment guide
- [ACTION-BASED-REPORTING.md](ACTION-BASED-REPORTING.md) - Action reporting system
- [ACCESS.md](ACCESS.md) - User access and permissions
- [START.md](START.md) - Getting started guide

## 🎯 User Roles

- **Main Branch Admin**: Create actions, annual plans, view all reports, analytics
- **Branch Users**: Submit action reports, monthly reports, view own progress (10 branches)

## 🌐 Database Options

### Local Docker PostgreSQL
- ✅ Full control
- ✅ No internet required
- ✅ Free forever
- ❌ Requires Docker

### Supabase Cloud
- ✅ No Docker needed
- ✅ Access from anywhere
- ✅ Automatic backups
- ✅ Free tier (500MB)
- ✅ Built-in database UI

## 📦 Project Structure

```
work-progress-tracker/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   └── database/     # DB connection & migrations
│   └── Dockerfile
├── frontend/             # React/Vite app
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── services/     # API calls
│   └── Dockerfile
└── docker-compose.yml    # Docker orchestration
```

## 🔧 Environment Variables

Create `backend/.env` file:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (choose one)
# Local Docker:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=work_progress_db
DB_USER=postgres
DB_PASSWORD=postgres123

# OR Supabase:
# DB_HOST=db.xxxxxxxxxxxxx.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=your_supabase_password
# DB_SSL=true

# JWT
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d
```

## 🚨 Troubleshooting

### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### Supabase Connection Issues
- Verify DB_SSL=true is set
- Check database credentials
- Ensure Supabase project is active

### Frontend Build Issues
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

## 📄 License

MIT License - feel free to use this project for your organization!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

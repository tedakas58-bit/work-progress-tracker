# Work Progress Tracker

A full-stack web application for tracking company work progress and gathering reports.

## Features

- **Annual Plan Management**: Main branch creates annual plans, automatically split into 12 monthly periods
- **Monthly Reporting**: 10 branch users submit monthly progress reports
- **Automatic Aggregation**: Monthly → Quarterly → Annual progress calculations
- **Dashboards**: Progress visualization, branch comparisons, and analytics
- **Deadline Tracking**: Automated reminders and late report handling

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, JWT Authentication
- **Frontend**: React, Vite, TailwindCSS, Recharts
- **Database**: PostgreSQL

## Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database in .env
npm run migrate
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## User Roles

- **Main Branch Admin**: Create annual plans, view all reports, analytics
- **Branch Users**: Submit monthly reports, view own progress (10 branches)

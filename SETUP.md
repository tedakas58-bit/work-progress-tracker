# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Database Setup

1. Install PostgreSQL and create a database:
```bash
createdb work_progress_db
```

2. Update database credentials in `backend/.env`

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Update `.env` with your database credentials and JWT secret

5. Run database migration:
```bash
npm run migrate
```

This will:
- Create all database tables
- Create default admin user (username: admin, password: admin123)
- Create 10 branch users (username: branch1-10, password: admin123)

6. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Default Login Credentials

### Main Branch Admin
- Username: `admin`
- Password: `admin123`

### Branch Users
- Username: `branch1` to `branch10`
- Password: `admin123`

## Usage Flow

1. Login as admin (main branch)
2. Create an annual plan
3. System automatically creates 12 monthly periods
4. System creates monthly reports for all 10 branch users
5. Login as branch user (e.g., branch1)
6. Submit monthly reports
7. System automatically aggregates: monthly → quarterly → annual
8. View progress dashboards and branch comparisons

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get user profile

### Annual Plans
- POST `/api/annual-plans` - Create annual plan (main branch only)
- GET `/api/annual-plans` - Get all plans
- GET `/api/annual-plans/:id` - Get plan details

### Reports
- POST `/api/reports/submit` - Submit monthly report (branch users)
- GET `/api/reports/my-reports` - Get my reports (branch users)
- GET `/api/reports/plan/:planId` - Get all reports for a plan (main branch)
- GET `/api/reports/comparison/:planId` - Get branch comparison (main branch)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Migration Errors
- Drop existing tables and re-run migration
- Check PostgreSQL logs for errors

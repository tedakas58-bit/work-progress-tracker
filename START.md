# 🚀 Docker Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

## Start the Application

### Option 1: Using Docker Compose (Recommended)

1. **Start all services:**
```bash
cd work-progress-tracker
docker-compose up -d
```

2. **Check if containers are running:**
```bash
docker-compose ps
```

3. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Option 2: Build and Start

```bash
cd work-progress-tracker
docker-compose up --build -d
```

## Stop the Application

```bash
docker-compose down
```

## Stop and Remove All Data

```bash
docker-compose down -v
```

## Default Login Credentials

### Main Branch Admin
- Username: `admin`
- Password: `admin123`

### Branch Users
- Username: `branch1` to `branch10`
- Password: `admin123`

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View container logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Rebuild containers
```bash
docker-compose up --build -d
```

### Access database directly
```bash
docker exec -it work-progress-db psql -U postgres -d work_progress_db
```

### Remove everything and start fresh
```bash
docker-compose down -v
docker-compose up --build -d
```

## What's Running?

- **PostgreSQL Database** (port 5432)
  - Database: work_progress_db
  - User: postgres
  - Password: postgres123

- **Backend API** (port 5000)
  - Node.js + Express
  - Auto-runs migrations on startup
  - Creates default users

- **Frontend** (port 3000)
  - React + Vite
  - Nginx web server
  - Proxies API requests to backend

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Port 3000)    │
│   React + Nginx │
└────────┬────────┘
         │
         │ /api requests
         ▼
┌─────────────────┐
│   Backend       │
│  (Port 5000)    │
│  Node.js + API  │
└────────┬────────┘
         │
         │ SQL queries
         ▼
┌─────────────────┐
│   PostgreSQL    │
│  (Port 5432)    │
│    Database     │
└─────────────────┘
```

## Development vs Production

This Docker setup is configured for production-like deployment. For development:

1. Use local setup without Docker
2. Or modify docker-compose.yml to mount volumes for hot-reload

## Health Checks

The database has a health check that ensures it's ready before the backend starts.
The backend waits 10 seconds and runs migrations before starting the server.

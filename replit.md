# Drugs.Rip - Replit Setup Documentation

## Overview
Drugs.Rip is a profile builder platform similar to `guns.lol` that allows users to create a single, comprehensive profile link to showcase all their online presence.

## Project Architecture

### Tech Stack
**Frontend:**
- React 18
- TypeScript
- Vite (dev server)
- Tailwind CSS
- ShadcnUI
- Aceternity UI
- React Router DOM

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB (Mongoose) - User profiles and links with auto-incrementing IDs
- MariaDB (MySQL2) - Additional data storage
- JWT for authentication
- Multer for file uploads

### Project Structure
```
/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   └── backendUrl.ts
│   ├── vite.config.ts
│   └── package.json
├── backend/            # Express backend API
│   ├── src/
│   │   ├── config/     # Database & passport config
│   │   ├── controllers/
│   │   ├── models/     # Mongoose models
│   │   ├── routes/
│   │   └── middleware/
│   ├── build/          # TypeScript compiled output
│   └── package.json
└── start-services.sh   # Startup script
```

## Recent Changes

### November 12, 2025 - Project Import Completed
1. **Node.js Installation**: Node.js 20 was already installed
2. **Database Setup**:
   - Installed MongoDB via Nix system packages
   - Installed MariaDB via Nix system packages  
   - Updated `start-services.sh` to start both MariaDB and MongoDB
   - Configured MariaDB to use socket file at `/tmp/mariadb.sock`
   - Auto-initializes link_platform database on first run
3. **Backend Updates**:
   - Added `mongoDB()` connection function to `backend/src/config/database.ts`
   - Updated database pool configuration to use MariaDB socket instead of TCP
   - Backend successfully builds and runs, connecting to both databases
4. **NPM Dependencies**:
   - Installed all frontend dependencies (794 packages)
   - Installed all backend dependencies (414 packages)
5. **Workflow Configuration**:
   - Workflow configured to run `bash start-services.sh`
   - Frontend on port 5000 (webview)
   - Backend on port 3000
6. **Verification**:
   - Backend TypeScript compiles successfully with no errors
   - MongoDB connects successfully
   - MariaDB starts and initializes successfully
   - All services verified to start correctly

### November 11, 2025

### Replit Environment Setup
1. **Dependencies Installation**: Installed all npm packages for frontend and backend
2. **MongoDB Setup**: Installed MongoDB via Nix packager, configured to run on localhost:27017
3. **Backend Configuration**:
   - Updated `.env` file with Replit-specific settings
   - Made Google OAuth optional for development (authentication features disabled without credentials)
   - Configured CORS to accept requests from Replit domain
   - Backend runs on localhost:3000

4. **Frontend Configuration**:
   - Updated Vite config to run on port 5000 (required for Replit webview)
   - Configured host as 0.0.0.0 to accept proxy connections
   - Set up HMR (Hot Module Reload) on port 5000
   - Frontend proxies API calls to backend at localhost:3000

5. **Workflow Setup**:
   - Created `start-services.sh` to orchestrate MongoDB, backend, and frontend startup
   - Configured workflow to run on port 5000 with webview output

6. **Deployment Configuration**:
   - Build step: Compiles TypeScript backend and builds React frontend
   - Run step: Starts MongoDB, backend server, and serves frontend with npx serve

7. **Version Control**: Added comprehensive `.gitignore` file

8. **Security Improvements**:
   - Removed hardcoded secrets from `.env` file
   - Made JWT_SECRET and SESSION_SECRET use environment variables with dev defaults
   - Made FRONTEND_URL dynamic - auto-detects from REPLIT_DEV_DOMAIN
   - Updated startup script to compile backend before running (fail-fast on errors)
   - Added proper error handling in database connections

## Environment Variables

**IMPORTANT**: All sensitive environment variables should be set via Replit Secrets, NOT in the `.env` file.

### Required Secrets (set via Replit Secrets):
- `JWT_SECRET`: Secret key for JWT token generation (falls back to dev default with warning)
- `SESSION_SECRET`: Secret key for Express sessions (falls back to dev default with warning)

### Optional Secrets:
- `FRONTEND_URL`: URL of the frontend application (auto-detected from REPLIT_DEV_DOMAIN if not set)
- `MONGO`: MongoDB connection string (default: mongodb://127.0.0.1:27017)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (required for authentication features)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (required for authentication features)

### System Variables (auto-provided by Replit):
- `REPLIT_DEV_DOMAIN`: Used to automatically configure CORS for the frontend
- `NODE_ENV`: Environment mode (development/production)

**Note**: 
- Without Google OAuth credentials, authentication features are disabled but the app runs normally.
- The app uses sensible defaults for development, but you should set JWT_SECRET and SESSION_SECRET in Replit Secrets for security.
- FRONTEND_URL is automatically derived from REPLIT_DEV_DOMAIN, so it works across different Repl instances.

## How to Run

### Development Mode
The app starts automatically via the configured workflow. Services start in this order:
1. MongoDB server
2. Backend Express server (port 3000)
3. Frontend Vite dev server (port 5000)

### Manual Start
```bash
bash start-services.sh
```

### To Rebuild Backend After Code Changes
```bash
cd backend && npx tsc
```

## Database Information

### MongoDB
- **Type**: MongoDB (via Mongoose)
- **Location**: Local instance at 127.0.0.1:27017
- **Database Name**: link_platform
- **Collections**: users, links, counters
- **Data stored in**: /tmp/mongodb/ (temporary storage, will not persist across repl restarts)

### MariaDB
- **Type**: MariaDB 10.11
- **Location**: Unix socket at /tmp/mariadb.sock
- **Database Name**: link_platform
- **Tables**: users, links
- **Data stored in**: /tmp/mariadb/ (temporary storage, will not persist across repl restarts)

## Known Limitations
1. Google OAuth is disabled in development without credentials
2. File uploads stored locally in `backend/uploads/` (won't persist across deployments)
3. MongoDB data stored in `/tmp/mongodb/` (temporary storage)

## User Preferences
None specified yet.

## Future Enhancements
- Set up Google OAuth credentials for full authentication
- Consider using Replit's built-in PostgreSQL instead of MongoDB
- Set up persistent storage for file uploads
- Add environment variable management via Replit Secrets

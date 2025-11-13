# Vercel Deployment Guide for Drugs.Rip

## Overview
This guide explains how to deploy your link-in-bio platform to Vercel with proper database configuration.

## Prerequisites

### 1. External Database Setup
Since Vercel is serverless, you need external database services:

#### MongoDB (for user profiles & links)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
4. Save this as `MONGO` environment variable in Vercel

#### Option: Use PostgreSQL instead (Recommended)
For better Vercel compatibility, consider migrating to PostgreSQL:
- Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- Or [Neon](https://neon.tech) (free tier available)
- Or [Supabase](https://supabase.com) (free tier available)

### 2. File Upload Storage
The current setup stores files locally which won't persist on Vercel. Options:
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Cloudinary](https://cloudinary.com) (images/videos)
- [AWS S3](https://aws.amazon.com/s3/)

## Deployment Steps

### Option 1: Deploy as Monorepo (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure vercel.json in root**
   Create `vercel.json` in project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/build/index.js",
         "use": "@vercel/node"
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/build/index.js"
       },
       {
         "src": "/auth/(.*)",
         "dest": "backend/build/index.js"
       },
       {
         "src": "/uploads/(.*)",
         "dest": "backend/build/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/dist/$1"
       }
     ]
   }
   ```

3. **Update frontend package.json**
   Add build script for Vercel:
   ```json
   {
     "scripts": {
       "build": "tsc -b && vite build",
       "vercel-build": "npm run build"
     }
   }
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - `MONGO` - Your MongoDB connection string
   - `JWT_SECRET` - Random secure string for JWT tokens
   - `SESSION_SECRET` - Random secure string for sessions
   - `GOOGLE_CLIENT_ID` - (Optional) For Google OAuth
   - `GOOGLE_CLIENT_SECRET` - (Optional) For Google OAuth
   - `NODE_ENV` - Set to `production`

5. **Deploy**
   ```bash
   vercel
   ```

### Option 2: Deploy Frontend and Backend Separately

#### Deploy Frontend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Set **Root Directory** to `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add environment variable:
   - `VITE_API_URL` - Your backend URL (will be created in next step)
8. Deploy

#### Deploy Backend
1. Create another project in Vercel
2. Set **Root Directory** to `backend`
3. **Build Command**: `npm run build` (add this script to backend/package.json)
4. Add all environment variables listed above
5. Deploy

#### Update Frontend API URL
After backend is deployed, update `frontend/src/backendUrl.ts`:
```typescript
export const backendUrl = process.env.VITE_API_URL || "https://your-backend.vercel.app"
```

## Database Migration (Current → Production)

### Current Setup Issues
- MariaDB runs locally (not available on Vercel)
- MongoDB runs locally (not available on Vercel)
- File uploads stored locally (won't persist)

### Recommended Migration Path

#### 1. Migrate to Single Database (PostgreSQL)
Since you're using both MongoDB and MariaDB, consolidate to PostgreSQL:

**Install dependencies:**
```bash
cd backend
npm install pg drizzle-orm
```

**Create schema** (backend/src/db/schema.ts):
```typescript
import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  googleId: varchar('google_id', { length: 255 }).unique(),
  profilePicture: text('profile_picture'),
  backgroundMedia: text('background_media'),
  backgroundType: varchar('background_type', { length: 20 }),
  totalVisit: integer('total_visit').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 512 }).notNull(),
  url: varchar('url', { length: 4096 }).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### 2. Or Keep MongoDB (via Atlas)
If you prefer MongoDB:
1. Export your local data
2. Import to MongoDB Atlas
3. Update connection string to use Atlas

## Important Notes

1. **CORS Configuration**: Update backend CORS to allow your Vercel frontend domain
2. **Session Storage**: Consider using external session storage (Redis on Upstash) instead of in-memory sessions
3. **File Uploads**: Migrate to cloud storage before deploying
4. **Environment Variables**: Never commit `.env` files - use Vercel dashboard
5. **Build Time**: First deployment may take a few minutes

## Testing Deployment

After deployment:
1. Visit your Vercel URL
2. Test user registration/login
3. Test link creation
4. Test profile viewing
5. Check file uploads work

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript compiles locally first

### Database Connection Fails
- Check DATABASE_URL or MONGO environment variable
- Verify database allows connections from `0.0.0.0/0` (or specific Vercel IPs)
- Test connection string locally

### 404 Errors
- Verify routing in vercel.json
- Check build output directory is correct
- Ensure all routes are defined

## Cost Estimates

**Free Tier (Hobby):**
- Vercel: Free for personal projects
- MongoDB Atlas: Free tier (512MB storage)
- Vercel Blob: 500 MB free

**Pro Tier:**
- Vercel Pro: $20/month
- MongoDB Atlas: $9/month (shared cluster)
- Vercel Blob: $0.15/GB

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vercel Community](https://vercel.com/community)

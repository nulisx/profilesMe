# Quick Start Guide

## ✅ Your App is WORKING!

Your Drugs.Rip link-in-bio platform is fully operational and running on Replit.

### 🌐 Access Your App

Your app is accessible at your Replit dev domain URL (check the webview tab at the top of Replit).

### 📦 What's Running

- ✅ **Frontend**: React + Vite on port 5000
- ✅ **Backend**: Express API on port 3000  
- ✅ **MongoDB**: User profiles and data
- ✅ **MariaDB**: Additional data storage
- ✅ **Vercel Analytics**: Already integrated

### 🚀 Deploy to Vercel

See `DEPLOYMENT.md` for complete Vercel deployment instructions.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Important:** Before deploying to Vercel, you need:
1. External MongoDB (MongoDB Atlas - free tier available)
2. Cloud storage for uploads (Vercel Blob, Cloudinary, or S3)
3. Environment variables set in Vercel dashboard

### 📝 Environment Variables Needed for Vercel

Set these in your Vercel project settings:

```
MONGO=mongodb+srv://your-connection-string
JWT_SECRET=your-random-secret-here
SESSION_SECRET=your-random-secret-here
NODE_ENV=production
GOOGLE_CLIENT_ID=optional-for-oauth
GOOGLE_CLIENT_SECRET=optional-for-oauth
```

### 🔧 Local Development Commands

```bash
# Backend only
cd backend && npm run Dev

# Frontend only  
cd frontend && npm run dev

# Full stack (use the workflow - it's already running!)
bash start-services.sh
```

### 📁 Project Structure

```
/
├── frontend/          # React app
│   ├── src/
│   └── vite.config.ts
├── backend/           # Express API
│   ├── src/
│   └── build/
├── start-services.sh  # Starts all services
├── vercel.json        # Vercel deployment config
└── DEPLOYMENT.md      # Full deployment guide
```

### 🐛 Troubleshooting

**"Website not loading"**
- The app IS loading! Check your Replit webview
- The dev URL is different from localhost

**Build errors**
- Run `cd backend && npm run build` to test backend compilation
- Run `cd frontend && npm run build` to test frontend build

**Database issues**
- MongoDB and MariaDB run locally on Replit
- For Vercel, you need external database services (see DEPLOYMENT.md)

### 📚 Next Steps

1. **Test your app** - Click the webview tab in Replit
2. **Read DEPLOYMENT.md** - Full Vercel deployment guide
3. **Set up databases** - MongoDB Atlas for production
4. **Configure storage** - Vercel Blob for file uploads
5. **Deploy** - Push to Vercel!

### ⚠️ Known Limitations

- File uploads stored locally (won't persist on Vercel - use cloud storage)
- Local databases (need external databases for Vercel)
- Google OAuth needs credentials to work

---

**Need help?** Check DEPLOYMENT.md or the Vercel documentation.

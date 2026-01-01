# 🚀 Vercel Deployment Guide

## 📋 Vercel Deployment Options

### Option 1: Frontend Only (Recommended)
### Option 2: Full Stack with Serverless
### Option 3: Monorepo Deployment

---

## 🎯 OPTION 1: FRONTEND ONLY (RECOMMENDED)

### Step 1: Prepare Frontend for Vercel

Your frontend is already configured for Vercel deployment! ✅

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select: `sazidahmed0912-ui/FlipzoKart`
   - Branch: `revert-old-ui`

3. **Configure Project**
   ```
   Framework Preset: Other
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node Version: 24.x
   ```

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 3: Deploy Backend Separately

Use Render, Heroku, or Railway for backend:
- **Render**: https://dashboard.render.com
- **Heroku**: https://dashboard.heroku.com
- **Railway**: https://railway.app

---

## 🎯 OPTION 2: FULL STACK SERVERLESS

### Step 1: Create Vercel Configuration

Create `vercel.json` in root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update Backend for Serverless

Update `server/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Export for Vercel
module.exports = app;
```

### Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard**
2. **Import Repository**
3. **Configure**:
   ```
   Root Directory: .
   Build Command: npm run build:vercel
   Output Directory: client/dist
   ```
4. **Add Environment Variables**:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   ```

---

## 🎯 OPTION 3: MONOREPO DEPLOYMENT

### Step 1: Update Package.json

Create root `package.json`:

```json
{
  "name": "flipzokart-monorepo",
  "version": "1.0.0",
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm install",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

### Step 2: Create Vercel Config

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

---

## 🔧 ENVIRONMENT VARIABLES

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=FlipzoKart
```

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-vercel-domain.vercel.app
```

---

## 🚀 QUICK DEPLOYMENT STEPS

### Deploy Frontend Only (Recommended)

1. **Go to Vercel**: https://vercel.com/dashboard
2. **"Add New..." → "Project"**
3. **Import**: `sazidahmed0912-ui/FlipzoKart`
4. **Settings**:
   - Root: `client`
   - Build: `npm run build`
   - Output: `dist`
5. **Environment**: `VITE_API_URL`
6. **Deploy** ✅

### Deploy Backend Separately

1. **Go to Render**: https://dashboard.render.com
2. **"New" → "Web Service"**
3. **Import**: `sazidahmed0912-ui/FlipzoKart`
4. **Settings**:
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`
5. **Environment**: Add all backend env vars
6. **Deploy** ✅

---

## 📱 POST-DEPLOYMENT

### Update CORS
After deployment, update backend `CLIENT_URL`:
```
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Test Application
1. Frontend: `https://your-app.vercel.app`
2. Backend: `https://your-backend.onrender.com/api/health`

---

## 🔍 TROUBLESHOOTING

### Common Issues

1. **Build Fails**
   - Check `client/package.json` scripts
   - Verify Node.js version (24.x)
   - Check dependencies

2. **API Connection Error**
   - Update `VITE_API_URL`
   - Check CORS settings
   - Verify backend deployment

3. **Environment Variables**
   - Double-check names
   - Restart deployment
   - Check for typos

### Debug Commands

```bash
# Test build locally
cd client
npm run build

# Test backend locally
cd server
npm start

# Check environment
echo $VITE_API_URL
```

---

## 🎉 DEPLOYMENT SUCCESS

### Your Live URLs
- **Frontend**: `https://flipzokart-client.vercel.app`
- **Backend**: `https://flipzokart-backend.onrender.com`

### Next Steps
1. Test all functionality
2. Set up custom domain
3. Configure SSL certificates
4. Set up monitoring

---

**Ready to deploy to Vercel? 🚀**

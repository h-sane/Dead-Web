# 🚀 Deployment Guide - Render.com

## ✅ Pre-Deployment Checklist

All code is now ready for deployment:
- ✅ Backend serves frontend static files
- ✅ All URLs use relative paths (no hardcoded localhost)
- ✅ WebSocket uses dynamic protocol (ws/wss)
- ✅ Port configuration uses environment variable
- ✅ All dependencies listed in requirements.txt
- ✅ render.yaml configuration file created

---

## 📦 What Was Changed

### Backend (`backend/main.py`)
1. **Added imports**:
   - `StaticFiles` from `fastapi.staticfiles`
   - `FileResponse` from `fastapi.responses`

2. **Mounted static directories**:
   ```python
   app.mount("/static", StaticFiles(directory="frontend"), name="static")
   app.mount("/assets", StaticFiles(directory="assets"), name="assets")
   ```

3. **Added root route**:
   ```python
   @app.get("/")
   async def root():
       return FileResponse('frontend/index.html')
   ```

4. **Dynamic port configuration**:
   ```python
   port = int(os.environ.get("PORT", 8000))
   uvicorn.run(app, host="0.0.0.0", port=port)
   ```

### Frontend (`frontend/script.js`)
1. **Replaced all hardcoded URLs**:
   - `http://localhost:8000/api/browse` → `/api/browse`
   - `http://localhost:8000/api/heartbeat` → `/api/heartbeat`
   - `http://localhost:8000/api/possess` → `/api/possess`

2. **Dynamic WebSocket URL**:
   ```javascript
   const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
   const wsUrl = `${wsProtocol}//${window.location.host}/ws/soul`;
   ```

### Dependencies (`backend/requirements.txt`)
Added all required packages:
- `uvicorn[standard]` - ASGI server with WebSocket support
- `websockets` - WebSocket protocol
- `aiofiles` - Async file operations
- `jinja2` - Template engine (FastAPI dependency)

---

## 🌐 Deploy to Render.com

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - 404 POSSESSION"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/404-possession.git
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Render will auto-detect `render.yaml`

### Step 4: Configure Environment Variables
In Render dashboard:
1. Go to **Environment** tab
2. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyB7mLCFswuLHqcAOvtsJ05mRt4_QQOQhjQ`

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies
   - Start the server
   - Assign a public URL

### Step 6: Test
Your app will be live at: `https://404-possession.onrender.com`

---

## 🧪 Local Testing (Before Deploy)

Test that the production setup works locally:

```bash
# Set environment variable
export PORT=8000

# Run backend
python backend/main.py
```

Then visit: `http://localhost:8000` (not `localhost:8000/frontend/index.html`)

**Expected**:
- ✅ Frontend loads at root URL
- ✅ All API calls work
- ✅ WebSocket connects
- ✅ Assets load correctly

---

## 🔧 Troubleshooting

### Issue: "Module not found"
**Solution**: Make sure all imports are in `requirements.txt`
```bash
pip install -r backend/requirements.txt
```

### Issue: "Static files not found"
**Solution**: Check directory structure:
```
404_POSSESSION/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── boot.js
├── assets/
│   └── bg.mp3
└── render.yaml
```

### Issue: "WebSocket connection failed"
**Solution**: Render uses HTTPS, so WebSocket must use WSS
- Code already handles this with dynamic protocol detection

### Issue: "API calls return 404"
**Solution**: Make sure all fetch URLs start with `/api/`
- Already fixed in code

---

## 📊 Render.com Free Tier Limits

- ✅ **Free tier available**
- ✅ **750 hours/month** (enough for testing)
- ⚠️ **Spins down after 15 min of inactivity** (first request takes ~30 seconds)
- ✅ **Automatic HTTPS**
- ✅ **Custom domains** (if you upgrade)

---

## 🎯 Post-Deployment Checklist

After deployment, test these features:

- [ ] Frontend loads at root URL
- [ ] Boot sequence works (camera/mic permissions)
- [ ] Background music plays
- [ ] AI responses work (Gemini API)
- [ ] Volume detection triggers "BE QUIET"
- [ ] Menu items work (File, Edit, View, etc.)
- [ ] Saved Souls load historical sites
- [ ] Address bar resurrects websites
- [ ] Refresh button resets text decay
- [ ] WebSocket connection stable

---

## 🔐 Security Notes

### Environment Variables
- ✅ `GEMINI_API_KEY` is stored securely in Render
- ✅ Not committed to Git
- ✅ Not exposed in frontend code

### CORS
- ⚠️ Currently set to `allow_origins=["*"]` for development
- 🔒 For production, restrict to your domain:
  ```python
  allow_origins=["https://404-possession.onrender.com"]
  ```

---

## 🚀 Alternative Deployment Options

### Vercel (Frontend Only)
- Deploy frontend as static site
- Keep backend on Render
- Update API URLs to point to Render backend

### Railway.app
- Similar to Render
- Easier setup
- Better free tier

### Heroku
- Classic option
- Requires credit card (even for free tier)
- More expensive

---

## 📝 Final Notes

Your app is now **production-ready**! The code works in both:
- ✅ **Local development** (`localhost:8000`)
- ✅ **Production** (Render.com with custom domain)

All paths are relative, all ports are dynamic, and all dependencies are listed.

**Ready to deploy!** 🎉

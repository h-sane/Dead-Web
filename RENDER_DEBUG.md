# 🔍 Render Deployment Debugging

## Current Issue: "Failed to fetch" Error

The frontend is loading but API calls are failing. This is likely due to:

1. **Backend not fully started** - Render free tier can take 30-60 seconds to spin up
2. **GEMINI_API_KEY not set** - Check Render environment variables
3. **CORS issues** - Already configured, but verify

---

## ✅ Fixes Applied

### 1. Health Check Endpoint
Added `/health` endpoint to verify backend is alive:
```python
@app.get("/health")
async def health_check():
    return {
        "status": "alive",
        "gemini_configured": bool(GEMINI_API_KEY),
        "haunt_level": haunt_level
    }
```

### 2. Backend Connectivity Check
Frontend now checks if backend is ready before starting heartbeat:
```javascript
async function checkBackendHealth() {
    const response = await fetch('/health');
    // Returns true if backend is alive
}
```

### 3. Delayed Heartbeat Start
- First heartbeat now waits 10 seconds after page load
- If backend not ready, retries after 30 seconds
- Prevents "Failed to fetch" spam

---

## 🧪 Testing Steps

### 1. Check Render Logs
In Render dashboard:
1. Go to your service
2. Click **"Logs"** tab
3. Look for:
   ```
   ✅ Gemini AI configured
   INFO: Uvicorn running on http://0.0.0.0:10000
   INFO: Application startup complete
   ```

### 2. Test Health Endpoint
Visit: `https://dead-web.onrender.com/health`

**Expected response**:
```json
{
  "status": "alive",
  "gemini_configured": true,
  "haunt_level": 1
}
```

**If you get 404**: Backend isn't running
**If you get timeout**: Service is spinning up (wait 60 seconds)

### 3. Check Environment Variables
In Render dashboard:
1. Go to **Environment** tab
2. Verify `GEMINI_API_KEY` is set
3. Value should start with `AIzaSy...` (your actual key)

### 4. Check Browser Console
Open DevTools (F12) and look for:

**✅ Good**:
```
✅ Backend is alive: {status: "alive", ...}
💓 Central heartbeat activated
```

**❌ Bad**:
```
❌ Backend health check failed
⚠️ Backend not ready, will retry in 30 seconds
```

---

## 🔧 Common Issues & Fixes

### Issue 1: "Backend not ready"
**Cause**: Render free tier spins down after 15 min of inactivity  
**Solution**: Wait 30-60 seconds for service to wake up  
**Prevention**: Upgrade to paid tier ($7/month) for always-on

### Issue 2: "gemini_configured: false"
**Cause**: GEMINI_API_KEY not set in Render  
**Solution**:
1. Go to Render dashboard → Environment
2. Add variable:
   - Key: `GEMINI_API_KEY`
   - Value: `[YOUR_GEMINI_API_KEY_HERE]`
3. Click **"Save Changes"**
4. Service will auto-redeploy

### Issue 3: "CORS error"
**Cause**: CORS not configured for production domain  
**Solution**: Already fixed - CORS allows all origins (`*`)

### Issue 4: Static files 404
**Cause**: Paths incorrect  
**Solution**: Already fixed - using `/static/` prefix

---

## 📊 Render Free Tier Limitations

⚠️ **Important**: Render free tier has these limitations:

1. **Spins down after 15 min** of inactivity
   - First request takes 30-60 seconds to wake up
   - Subsequent requests are fast

2. **750 hours/month** limit
   - Enough for testing/demos
   - Not suitable for 24/7 production

3. **No persistent storage**
   - Haunt level resets on restart
   - No file uploads persist

---

## 🚀 Recommended Next Steps

### Option 1: Wait for Spin-Up
1. Visit your site: `https://dead-web.onrender.com`
2. Wait 60 seconds
3. Hard refresh (Ctrl+F5)
4. Check console for "✅ Backend is alive"

### Option 2: Check Logs
1. Go to Render dashboard
2. Check logs for errors
3. Look for "Application startup complete"

### Option 3: Test Locally
```bash
# Run backend locally
python backend/main.py

# Visit http://localhost:8000
# Should work perfectly
```

---

## 🎯 Success Criteria

When deployment is working, you should see:

✅ Page loads with boot screen  
✅ CSS and JS load correctly  
✅ Console shows "✅ Backend is alive"  
✅ Console shows "💓 Central heartbeat activated"  
✅ No "Failed to fetch" errors  
✅ AI responses work after 30-60 seconds  

---

## 🆘 Still Not Working?

If after 5 minutes it's still failing:

1. **Check Render build logs** - Look for Python errors
2. **Verify requirements.txt** - All dependencies installed?
3. **Check file structure** - Is `frontend/` folder present?
4. **Test health endpoint** - Does `/health` return 200?

Share the Render logs and I can help debug further!

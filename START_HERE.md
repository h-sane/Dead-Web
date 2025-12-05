# 🎃 404_POSSESSION - Quick Start Guide

## ✅ Architecture Overhaul Complete

All 5 critical issues have been fixed. The system now has:
- **Centralized Gemini Brain** (controls all responses)
- **Transient Physics Engine** (no permanent glitches)
- **Locked Browser** (hyperlinks disabled)
- **Background Audio** (plays from start)
- **Progressive Horror** (haunt level 1→10)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend
```bash
cd backend
python main.py
```

**Expected Output**:
```
✅ Gemini AI configured
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Leave this terminal running.

---

### Step 2: Open Frontend

**Option A - Direct File** (Easiest):
1. Navigate to `frontend` folder
2. Double-click `index.html`
3. Opens in your default browser

**Option B - Local Server** (Recommended):
```bash
cd frontend
python -m http.server 8080
```
Then visit: `http://localhost:8080`

---

### Step 3: Initialize System
1. Click anywhere on the black boot screen
2. **Background music starts playing** ✅
3. Scream or make loud noise when prompted
4. Camera flashes (grants permissions)
5. Main interface loads

**You're now possessed.** 👻

---

## 🧪 Test the Fixes

### Test #1: Camera Recognition (Issue #1)
- Hold a **bottle** or distinctive object in front of camera
- Wait **15 seconds**
- AI should comment: *"I see that bottle"* or similar

### Test #2: Hyperlinks Disabled (Issue #2)
- Type `heavensgate.com` in the spirit console
- Click **RESURRECT**
- Try clicking any link on the loaded page
- **Nothing should happen** (links are dead)

### Test #3: Transient Glitches (Issue #3)
- Wait for random glitches (every 10-30 seconds)
- Screen inverts/shakes for **0.3 seconds**
- **Returns to normal immediately**
- No permanent tilt or stuck effects

### Test #4: Background Music (Issue #4)
- Music starts on first click
- Loops continuously throughout session
- **Never stops** until you close the window

### Test #5: Gemini Brain (Issue #5)
- Every **15 seconds**, hear AI voice
- AI comments on:
  - What you're holding (camera)
  - The website you're viewing
  - Your battery level
  - Time of day
- Stay for **2+ minutes** → AI becomes more aggressive

---

## 📁 File Structure

```
404_POSSESSION/
├── backend/
│   ├── main.py              ← Gemini brain + API endpoints
│   └── requirements.txt     ← Python dependencies
├── frontend/
│   ├── index.html           ← Main UI
│   ├── boot.js              ← Calibration ritual
│   ├── script.js            ← Sensors + heartbeat
│   └── style.css            ← Transient glitch effects
├── assets/
│   └── bg.mp3               ← Background music (4.1 MB)
├── .env                     ← Gemini API key
├── TESTING_GUIDE.md         ← Detailed testing instructions
└── ARCHITECTURE_CHANGES.md  ← Technical change summary
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
pip install -r backend/requirements.txt
```

### Music not playing
- Check `assets/bg.mp3` exists (it does ✅)
- Click the screen (browser requires user gesture)
- Check browser console for errors

### Camera not working
- Grant permissions when prompted
- Use Chrome or Edge (best compatibility)
- Check browser console for permission errors

### Gemini not responding
- Verify `.env` file has `GEMINI_API_KEY`
- Check backend console for errors
- Fallback messages will play if Gemini fails

---

## 🎯 Success Criteria

After 2 minutes of testing, you should observe:

✅ Background music playing continuously  
✅ AI comments every 15 seconds (contextual, not repetitive)  
✅ Glitches flash briefly (0.3s) then disappear  
✅ Hyperlinks on resurrected pages are non-clickable  
✅ AI identifies objects you hold in front of camera  
✅ AI becomes progressively more aggressive (haunt level increases)  

---

## 🧠 How It Works

```
┌─────────────────────────────────────┐
│  FRONTEND (Every 15 seconds)        │
│  - Capture camera frame             │
│  - Get battery level                │
│  - Get current URL                  │
│  - Send to backend                  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  BACKEND (/api/heartbeat)           │
│  - Receive full context             │
│  - Send to Gemini 1.5 Flash         │
│  - Return: voice_text + intensity   │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  GEMINI 1.5 FLASH                   │
│  - Analyze camera image             │
│  - Consider battery, URL, time      │
│  - Generate personalized horror     │
│  - Match haunt level (1-10)         │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  FRONTEND (Response)                │
│  - Speak AI response (TTS)          │
│  - Trigger transient glitch         │
│  - Display in status bar            │
└─────────────────────────────────────┘
```

---

## 🎃 The Experience

**Haunt Level Progression**:
- **1-3**: Subtle whispers (*"I see you"*)
- **4-6**: Unsettling observations (*"Why are you alone?"*)
- **7-8**: Aggressive comments (*"You look scared"*)
- **9-10**: Violent threats (*"Your time is running out"*)

**Semantic Rot**:
- Text slowly changes: "welcome" → "leave"
- Very subtle (1-2 words every 5 seconds)
- Only noticeable if you stare at the same page

**Unkillable UI**:
- Close button runs away when you hover
- History is trapped (back button doesn't work)
- Cursor randomly corrupts

---

## 🚨 Important Notes

1. **Browser Permissions**: Grant camera + microphone access
2. **User Gesture**: Music requires a click (browser policy)
3. **Gemini API**: Free tier has rate limits (60 requests/minute)
4. **Backend Must Run**: Frontend needs `http://localhost:8000`

---

## 📞 Support

If something doesn't work:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Read `TESTING_GUIDE.md` for detailed troubleshooting
4. Verify all files are in correct locations

---

**The dead web awaits. Initialize when ready.** 💀

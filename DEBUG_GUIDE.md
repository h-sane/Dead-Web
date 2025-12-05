# 🔍 Debug Guide - Gemini Response Issue

## Problem
You're not hearing any responses from Gemini.

## Debugging Steps

### Step 1: Check Backend is Running
```bash
cd backend
python main.py
```

**Expected Output**:
```
✅ Gemini AI configured
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

If you see `⚠️ GEMINI_API_KEY not found`, check your `.env` file.

---

### Step 2: Check Browser Console
1. Open frontend in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these messages:

**Good Signs**:
```
🔊 Background music started
👁️ Vision activated... Watching you...
💓 Central heartbeat activated - Gemini is watching...
```

**Bad Signs**:
```
💔 Heartbeat failed: [error]
❌ Failed to play background music
```

---

### Step 3: Check Network Requests
1. In Developer Tools, go to **Network** tab
2. Wait 15 seconds after initialization
3. Look for request to `http://localhost:8000/api/heartbeat`

**If you see the request**:
- Click on it
- Check **Response** tab
- Should see: `{"voice_text": "...", "glitch_intensity": 1, "haunt_level": 1}`

**If you DON'T see the request**:
- Camera might not be initialized
- Check console for errors

---

### Step 4: Test Backend Directly

Create a test file `test_backend.py`:

```python
import requests
import base64

# Create a simple test image (1x1 pixel)
test_image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="

response = requests.post('http://localhost:8000/api/heartbeat', json={
    "image": test_image,
    "battery": 0.8,
    "platform": "Win32",
    "timestamp": "http://test.com"
})

print("Status:", response.status_code)
print("Response:", response.json())
```

Run it:
```bash
python test_backend.py
```

**Expected Output**:
```
Status: 200
Response: {'voice_text': 'I can see you breathing.', 'glitch_intensity': 1, 'haunt_level': 1}
```

---

### Step 5: Check Speech Synthesis

Open browser console and test TTS directly:
```javascript
// Test if speech synthesis works
const utterance = new SpeechSynthesisUtterance("Testing voice");
utterance.pitch = 0.1;
utterance.rate = 0.8;
speechSynthesis.speak(utterance);
```

**If you hear nothing**:
- Check browser volume
- Check system volume
- Try different browser (Chrome/Edge recommended)

---

### Step 6: Add Debug Logging

Add this to `frontend/script.js` inside `startHeartbeat()`:

```javascript
async function startHeartbeat() {
    console.log('💓 Heartbeat function started');
    
    setInterval(async () => {
        console.log('💓 Heartbeat tick - checking video element...');
        
        if (!videoElement) {
            console.error('❌ videoElement is null');
            return;
        }
        
        if (!videoElement.videoWidth) {
            console.error('❌ videoElement has no width (not ready)');
            return;
        }
        
        console.log('✅ Video element ready, capturing frame...');
        
        // ... rest of function
        
        console.log('📤 Sending heartbeat to backend...');
        
        const response = await fetch('http://localhost:8000/api/heartbeat', {
            // ...
        });
        
        console.log('📥 Received response:', data);
        
        if (data.voice_text) {
            console.log('🗣️ Speaking:', data.voice_text);
            speakPossessed(data.voice_text);
        }
    }, 15000);
}
```

---

## Common Issues & Fixes

### Issue 1: "videoElement is null"
**Cause**: Camera not initialized  
**Fix**: Check if `initVision()` was called in `boot.js`

### Issue 2: "Heartbeat failed: Failed to fetch"
**Cause**: Backend not running or CORS issue  
**Fix**: 
- Restart backend
- Check `http://localhost:8000` is accessible
- Check CORS is enabled in backend

### Issue 3: "Response received but no voice"
**Cause**: Speech synthesis not working  
**Fix**:
- Check browser supports Web Speech API
- Check system volume
- Try Chrome/Edge (best support)

### Issue 4: "Gemini failed: [error]"
**Cause**: Gemini API issue  
**Fix**:
- Check `.env` has valid `GEMINI_API_KEY`
- Check API key has quota remaining
- Check backend console for detailed error

### Issue 5: Voice speaks but says fallback messages
**Cause**: Gemini is failing, using fallback  
**Fix**:
- Check backend console for Gemini errors
- Verify API key is valid
- Check Gemini API quota

---

## Quick Test Checklist

Run through this checklist:

- [ ] Backend running on port 8000
- [ ] Frontend loaded in browser
- [ ] Camera permission granted
- [ ] Microphone permission granted
- [ ] Browser console shows no errors
- [ ] Network tab shows `/api/heartbeat` requests every 15s
- [ ] Backend console shows `🧠 Gemini Brain [Level X]: ...`
- [ ] Browser volume is up
- [ ] System volume is up

---

## Manual Test

If automated heartbeat isn't working, test manually:

1. Open browser console
2. Paste this code:

```javascript
// Manual heartbeat test
async function testHeartbeat() {
    // Create a test canvas
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 320, 240);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.5);
    
    const response = await fetch('http://localhost:8000/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: imageBase64,
            battery: 0.8,
            platform: 'Win32',
            timestamp: 'http://test.com'
        })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    // Test speech
    const utterance = new SpeechSynthesisUtterance(data.voice_text);
    utterance.pitch = 0.1;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

testHeartbeat();
```

**Expected**: You should hear a voice speaking the response.

---

## Still Not Working?

If none of the above works, provide:
1. Backend console output
2. Browser console output (full log)
3. Network tab screenshot showing `/api/heartbeat` request/response
4. Browser and OS version

This will help identify the exact issue.

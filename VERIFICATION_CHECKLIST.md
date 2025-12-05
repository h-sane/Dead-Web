# ✅ Verification Checklist

## Issue 1: Background Audio ✅ FIXED
- Copied `assets/bg.mp3` to `frontend/assets/bg.mp3`
- Audio should now play when you click "Initialize"

**Test**: Hard refresh (Ctrl+F5) and listen for music on boot

---

## Issue 2: Verify Gemini is Using Camera

### Check Backend Console

After each heartbeat (every 15 seconds), you should see:

**✅ GOOD (Gemini working)**:
```
📸 Processing image: (640, 480), Battery: 80%, URL: http://...
🤖 Calling Gemini with image size (640, 480)...
✅ 🧠 Gemini Brain [Level 1]: I see you holding a bottle
```

**❌ BAD (Using fallback)**:
```
⚠️ Gemini failed: [error message]
🤖 Fallback [Level 1]: I can see you breathing.
```

### Test Camera Recognition

1. **Hold a distinctive object** (bottle, phone, book, mug)
2. **Wait 15 seconds** for next heartbeat
3. **Check backend console** for Gemini's response
4. **Listen to the voice** - does it mention the object?

### Expected Behavior

**Level 1-3** (First 1-2 minutes):
- "I see that bottle in your hand"
- "Nice blue shirt"
- "Your room is dark"
- "Stop looking at your phone"

**Level 4-6** (After 2-3 minutes):
- "Why are you holding that bottle?"
- "That shadow behind you..."
- "You look nervous"

**Level 7-10** (After 4+ minutes):
- "I know what you did with that bottle"
- "You look scared"
- "Your time is running out"

---

## Issue 3: Verify No Repetition

### Check History System

In backend console, you should see:
```
Previous comments (DO NOT REPEAT): I see you, Nice shirt, Your room is dark
```

This tells Gemini not to repeat these phrases.

### Test

1. Stay on the site for **2-3 minutes**
2. Listen to **4-5 responses**
3. **Each should be different**

If you hear the same phrase twice:
- Check backend console for "Previous comments"
- Verify `vision_history` is being populated

---

## Quick Test Commands

### Test 1: Check if audio file exists
```bash
dir frontend\assets\bg.mp3
```
Should show: `bg.mp3` with size ~4MB

### Test 2: Test backend directly
```bash
python test_backend.py
```
Should show: `✅ SUCCESS! Response received`

### Test 3: Manual heartbeat in browser
1. Open browser console
2. Click **TEST HEARTBEAT** button
3. Check backend console for Gemini logs

---

## Troubleshooting

### Audio still not playing
- Hard refresh (Ctrl+F5)
- Check browser console for 404 errors
- Verify file exists: `frontend/assets/bg.mp3`
- Check browser volume

### Responses are repetitive
- Check backend console for "Previous comments"
- Verify Gemini is being called (not fallback)
- Wait longer between tests (15 second intervals)

### Responses don't mention camera
- Check backend console for "Processing image"
- Verify image size is shown (e.g., 640x480)
- Check if Gemini API key is valid
- Try holding object closer to camera

---

## Success Criteria

✅ Background music plays on boot  
✅ Backend shows "🧠 Gemini Brain" (not "🤖 Fallback")  
✅ Backend shows "Processing image: (640, 480)"  
✅ Responses mention specific visual details  
✅ No repeated phrases in 5 consecutive responses  
✅ Haunt level increases over time (1→2→3...)  

---

## Next Steps

1. **Hard refresh** browser (Ctrl+F5)
2. **Complete boot** sequence
3. **Hold a bottle** in front of camera
4. **Wait 15 seconds**
5. **Check backend console** for Gemini logs
6. **Report back** what you see in backend console

If backend shows "✅ 🧠 Gemini Brain: I see that bottle" → **SUCCESS!**  
If backend shows "🤖 Fallback" → Gemini API issue (check API key/quota)

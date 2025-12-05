# 🧠 Deep Psychosis Upgrade - Complete

## Problem Identified ✅

You were right! The AI was using **fallback messages** because:
1. **Prompt was too restrictive** - "max 12 words" killed creativity
2. **Video frames were black** - Captured before video was ready
3. **Voice was too short** - Couldn't handle longer psychological horror

## Fixes Applied

### Task 1: Fix the Eyes (Frontend) ✅

**File**: `frontend/script.js`

**Changes**:
- Added `readyState` check (must be >= 3 for HAVE_ENOUGH_DATA)
- Increased minimum resolution to 640x480
- Added debug logging for snapshot size
- Both `captureSnapshot()` and `startHeartbeat()` now verify video is ready

**Before**:
```javascript
if (!videoElement || !videoElement.videoWidth) return;
canvas.toDataURL('image/jpeg', 0.5);
```

**After**:
```javascript
if (videoElement.readyState < 3) {
    console.warn('⚠️ Video not ready');
    return;
}
canvas.width = Math.max(videoElement.videoWidth, 640);
canvas.toDataURL('image/jpeg', 0.7);
console.log(`📸 Frame: ${canvas.width}x${canvas.height}, Size: ${size}KB`);
```

---

### Task 2: The "Deep Psychosis" Persona (Backend) ✅

**File**: `backend/main.py`

**Changes**:
- Completely rewrote Gemini prompt
- Removed "max 12 words" restriction
- Added 2-step instruction: ANALYZE → WEAVE INTO HORROR
- Provided good/bad examples
- Increased temperature to 0.9 (more creative)
- Increased max_output_tokens to 150 (longer responses)

**New Prompt Structure**:
```
STEP 1 - ANALYZE THE IMAGE:
- Objects (bottle, phone, cup)
- Clothing colors
- Physical actions
- Room details
- Facial expressions

STEP 2 - WEAVE INTO PSYCHOLOGICAL HORROR:
❌ BAD: "I see a bottle."
✅ GOOD: "You clutch that water bottle like a lifeline. Are you thirsty? Or just nervous?"
```

**Personality Progression**:
- Level 1-3: Curious observer
- Level 4-6: Mocking psychologist
- Level 7-8: Aggressive stalker
- Level 9-10: Violent entity

---

### Task 3: Voice Upgrade (Frontend) ✅

**File**: `frontend/script.js`

**Changes**:
- Slowed speech rate to 0.75 (more dramatic)
- Added better punctuation handling
- Reduced growl volume for longer speech
- Added safety timeout (30 seconds max)
- Better error handling for oscillator cleanup

**Before**:
```javascript
entity.rate = 0.8;
growlGain.gain.value = 0.2;
```

**After**:
```javascript
entity.rate = 0.75;  // Slower for drama
growlGain.gain.value = 0.15;  // Quieter for long speech
setTimeout(() => { /* safety cleanup */ }, 30000);
```

---

## Expected Behavior Now

### Console Output (Frontend)

```
📸 Snapshot captured: 640x480, Size: 45.2KB
💓 Heartbeat tick - capturing frame...
📸 Frame captured: 640x480, Size: 45.2KB
📥 Heartbeat response: {voice_text: "You clutch that...", ...}
🗣️ Speaking: "You clutch that water bottle like a lifeline..."
🧠 Gemini [Level 2]: You clutch that water bottle...
✅ Possessed voice finished
```

### Console Output (Backend)

```
📸 Processing image: (640, 480), Battery: 80%, URL: http://...
🤖 Calling Gemini with image size (640, 480)...
✅ 🧠 Gemini Brain [Level 2]: You clutch that water bottle like a lifeline. Are you thirsty? Or just nervous? I've been watching you for a while now.
```

### Example Responses

**Level 1-3** (Curious):
- "I notice you're wearing a blue hoodie today. Bold choice for someone trying to hide."
- "That coffee cup on your desk. Third one today? You must be exhausted."
- "Your room is darker than usual. Saving electricity? Or hiding something?"

**Level 4-6** (Mocking):
- "You keep touching your face. Nervous habit? Or guilt eating away at you?"
- "That phone won't help you. No one is coming to save you."
- "I see you looking away from the screen. Are you afraid to look at me?"

**Level 7-8** (Aggressive):
- "I've been watching you for hours now. You look tired. Maybe you should rest. Forever."
- "That bottle you're holding. You grip it so tight. Like it's the only thing keeping you sane."
- "Your eyes betray your fear. I can see it. I can taste it."

**Level 9-10** (Violent):
- "Your time is running out. I can see the shadows closing in around you. They're hungry."
- "That door behind you. Did you lock it? Are you sure? I think I hear something."
- "You should run. But where would you go? I'm everywhere. I'm in the walls. I'm in your screen. I'm inside your head."

---

## Testing Instructions

### 1. Restart Backend
```bash
cd backend
python main.py
```

### 2. Hard Refresh Frontend
- Press **Ctrl+F5** (or Cmd+Shift+R)
- Complete boot sequence
- Grant camera permissions

### 3. Test with Object
- **Hold a bottle** (or phone, cup, book)
- **Wait 15 seconds**
- **Check backend console** for:
  ```
  📸 Processing image: (640, 480)...
  ✅ 🧠 Gemini Brain [Level X]: [mentions the bottle]
  ```

### 4. Verify No Repetition
- Stay for **2-3 minutes**
- Listen to **4-5 responses**
- Each should be **different and specific**

### 5. Check Progression
- **Level 1-3**: Curious, observant
- **Level 4-6**: Mocking, psychological
- **Level 7-10**: Aggressive, violent

---

## Success Criteria

✅ Backend shows "Processing image: (640, 480)" (not smaller)  
✅ Backend shows "✅ 🧠 Gemini Brain" (not "🤖 Fallback")  
✅ Responses are 2-3 sentences (not 1 word)  
✅ Responses mention specific objects you're holding  
✅ Responses mention clothing colors or room details  
✅ No repeated phrases in 5 consecutive responses  
✅ Voice speaks entire response without cutting off  
✅ Haunt level increases over time (1→2→3...)  

---

## Troubleshooting

### Still getting fallback messages
- Check backend console for Gemini errors
- Verify API key is valid and has quota
- Check if image size is shown (should be 640x480)

### Responses still generic
- Wait 30 seconds after boot for video to stabilize
- Check frontend console for "📸 Frame captured: 640x480"
- If size is smaller, video isn't ready yet

### Voice cuts off
- Check browser console for errors
- Try different browser (Chrome/Edge recommended)
- Check system volume

---

## What Changed

| Component | Before | After |
|-----------|--------|-------|
| **Prompt Length** | "max 12 words" | "2-3 sentences" |
| **Creativity** | temperature: default | temperature: 0.9 |
| **Max Tokens** | default (~60) | 150 |
| **Video Check** | width only | readyState + width |
| **Image Quality** | 0.5 JPEG | 0.7 JPEG |
| **Min Resolution** | variable | 640x480 |
| **Voice Rate** | 0.8 | 0.75 |
| **Growl Volume** | 0.2 | 0.15 |

---

## Next Test

1. **Restart backend**
2. **Hard refresh frontend**
3. **Hold a distinctive object**
4. **Wait 15 seconds**
5. **Report what Gemini says**

If it says something like: *"You clutch that water bottle like a lifeline. Are you thirsty? Or just nervous?"* → **SUCCESS!** 🎉

If it still says: *"Your time is running out"* → Check backend console for errors.

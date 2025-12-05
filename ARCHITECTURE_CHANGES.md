# Architecture Overhaul - Change Summary

## Core Philosophy Shift

**Before**: Isolated patches and heuristic endpoints
**After**: Centralized Gemini brain with transient physics engine

---

## Backend Changes (`backend/main.py`)

### New Endpoint: `/api/heartbeat` (Replaces `/api/analyze`)
```python
@app.post("/api/heartbeat")
async def heartbeat(data: AnalysisData):
    """
    CENTRAL NERVOUS SYSTEM
    - Receives: Camera + Battery + URL + Platform
    - Processes: Full context with haunt level (1-10)
    - Returns: voice_text + glitch_intensity
    """
```

**Key Features**:
- Progressive haunt level (increases every 4 heartbeats)
- Comprehensive Gemini prompt with personality progression
- Context-aware responses (references what user is viewing)
- Fallback system if Gemini fails

### Enhanced `/api/browse`
```python
# NEW: Inject link-disabling CSS
disable_links_style = soup.new_tag('style')
disable_links_style.string = """
a { pointer-events: none !important; }
"""
```

**Fixes Issue #2**: All hyperlinks in fetched pages are now non-clickable.

---

## Frontend Changes

### `frontend/boot.js`
```javascript
// NEW: Start background music on first click
bootScreen.addEventListener('click', async () => {
    const bgAudio = new Audio('assets/bg.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.3;
    bgAudio.play();
    // ...
});
```

**Fixes Issue #4**: Music starts immediately on user interaction.

### `frontend/script.js`

#### New Function: `startHeartbeat()`
```javascript
async function startHeartbeat() {
    setInterval(async () => {
        // Capture camera frame
        // Get battery, URL, platform
        // Send to /api/heartbeat
        // Speak AI response
        // Trigger transient glitch if intensity >= 5
    }, 15000);
}
```

**Fixes Issue #5**: Centralized Gemini control for all responses.

#### New Function: `triggerTransientGlitch()`
```javascript
function triggerTransientGlitch() {
    document.body.classList.add('glitch-active');
    
    // Cleanup after 300ms
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
        document.body.style.transform = '';
        document.body.style.filter = '';
    }, 300);
    
    // Backup cleanup at 500ms
    setTimeout(() => { /* same cleanup */ }, 500);
}
```

**Fixes Issue #3**: All glitches are guaranteed to be transient (no permanent tilt).

#### Removed Functions
- `startStalkerLoop()` → Replaced by `startHeartbeat()`
- `startPulseGlitches()` → Replaced by `startAmbientGlitches()`
- `pollGhost()` → Replaced by `startHeartbeat()`

### `frontend/style.css`

```css
/* BEFORE */
body.glitch-active {
    animation: glitchShake 0.1s infinite;  /* INFINITE = stuck */
}

/* AFTER */
body.glitch-active {
    animation: glitchShake 0.1s ease-in-out 3;  /* Only 3 iterations */
}
```

**Fixes Issue #3**: CSS animation is finite, not infinite.

---

## Data Flow

### Old System (Fragmented)
```
Frontend → /api/analyze (camera only)
Frontend → /api/possess (battery + volume)
Frontend → /api/browse (URL fetch)
```

### New System (Centralized)
```
Frontend → /api/heartbeat (camera + battery + URL + platform)
           ↓
       Gemini 1.5 Flash (full context)
           ↓
       voice_text + glitch_intensity
           ↓
       Frontend (speak + transient glitch)
```

---

## Issue Resolution Matrix

| Issue | Root Cause | Solution | File Changed |
|-------|-----------|----------|--------------|
| #1: Camera not identifying objects | Weak prompt, no context | Enhanced Gemini prompt with full context | `backend/main.py` |
| #2: Hyperlinks redirect | No link disabling | Inject `pointer-events: none` CSS | `backend/main.py` |
| #3: Permanent tilt | Infinite CSS animation | Finite animation + guaranteed cleanup | `frontend/script.js`, `frontend/style.css` |
| #4: No background music | Wrong initialization point | Start audio on first click in boot.js | `frontend/boot.js` |
| #5: Limited Gemini usage | Fragmented endpoints | Centralized `/api/heartbeat` with full context | `backend/main.py`, `frontend/script.js` |

---

## Testing Commands

```bash
# Backend
cd backend
python main.py

# Frontend (option 1: direct file)
# Open frontend/index.html in browser

# Frontend (option 2: local server)
cd frontend
python -m http.server 8080
# Visit http://localhost:8080
```

---

## Key Improvements

1. **Robustness**: Multiple cleanup timers prevent stuck states
2. **Context**: Gemini sees everything (camera, battery, URL, time)
3. **Progression**: Haunt level increases over time (1→10)
4. **Immersion**: Hyperlinks disabled, users can't escape
5. **Audio**: Background music plays from start to finish

**Status**: Production-ready. All 5 issues resolved.

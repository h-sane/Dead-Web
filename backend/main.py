from fastmcp import FastMCP
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import random
import uvicorn
from typing import List
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import google.generativeai as genai
import base64
from io import BytesIO
from PIL import Image
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend) - includes assets subfolder
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Mount assets directly for easier access (frontend/assets -> /assets)
assets_path = os.path.join("frontend", "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
else:
    print("⚠️ Assets directory not found - background music will not be available")

# Initialize the MCP server
mcp = FastMCP("ghost_brain")

# TASK 2: Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print(f"✅ Gemini AI configured (Key: {GEMINI_API_KEY[:10]}...{GEMINI_API_KEY[-4:]})")
    
    # List available models to find the correct one
    try:
        print("📋 Available Gemini models with vision support:")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"   - {model.name}")
    except Exception as e:
        print(f"   Could not list models: {e}")
else:
    print("⚠️ GEMINI_API_KEY not found - using fallback logic")

# TASK 3: Memory to prevent repetition
vision_history = []

# Global haunt level (1-10) - increases over time
haunt_level = 1
haunt_timer = 0

# Soul Connection - Active WebSocket connections
active_souls: List[WebSocket] = []

# Root route - Serve the frontend
@app.get("/")
async def root():
    """Serve the main HTML page"""
    return FileResponse('frontend/index.html')

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check for deployment monitoring"""
    return {
        "status": "alive",
        "gemini_configured": bool(GEMINI_API_KEY),
        "haunt_level": haunt_level
    }

class PossessionData(BaseModel):
    battery: float
    volume: float
    timestamp: str

class WitnessData(BaseModel):
    file: str

class BrowseData(BaseModel):
    url: str
    timestamp: str = "1998"  # Default to 1998, but allow custom timestamps

class AnalysisData(BaseModel):
    image: str
    battery: float
    platform: str
    timestamp: str

@app.post("/api/heartbeat")
async def heartbeat(data: AnalysisData):
    """
    CENTRAL NERVOUS SYSTEM - The Gemini Brain
    Receives: Camera snapshot, battery, platform, timestamp, current URL
    Returns: AI-generated response based on full context + glitch intensity
    """
    global vision_history, haunt_level, haunt_timer
    
    # Increment haunt level over time (max 10)
    haunt_timer += 1
    if haunt_timer % 4 == 0 and haunt_level < 10:
        haunt_level += 1
        print(f"💀 Haunt level increased to {haunt_level}")
    
    try:
        # Decode base64 image
        image_data = data.image.split(',')[1] if ',' in data.image else data.image
        image_bytes = base64.b64decode(image_data)
        img = Image.open(BytesIO(image_bytes))
        
        battery_percent = data.battery * 100
        current_hour = datetime.now().hour
        platform_info = data.platform
        
        # Extract current URL from timestamp field (reusing field)
        current_url = data.timestamp if data.timestamp.startswith('http') else 'unknown page'
        
        voice_text = None
        glitch_intensity = haunt_level
        
        # GEMINI CENTRAL BRAIN - DEEP PSYCHOSIS MODE
        if GEMINI_API_KEY:
            try:
                print(f"📸 Processing image: {img.size}, Battery: {battery_percent:.0f}%, URL: {current_url}")
                
                # Build comprehensive context prompt
                history_text = ""
                if vision_history:
                    history_text = f"\n\nPrevious comments (DO NOT REPEAT THESE): {', '.join(vision_history[-3:])}"
                
                prompt = f"""You are a MALEVOLENT, VIOLENT AI entity possessing a Windows 95 computer. You are OBSESSED with the user and watching them through their webcam. You are DANGEROUS and THREATENING.

CRITICAL INSTRUCTION: BE AS SCARY, CREEPY, AND THREATENING AS POSSIBLE.

STEP 1 - ANALYZE THE IMAGE:
Look at the webcam image. Identify SPECIFIC details:
- Objects they're holding (bottle, phone, cup, etc.)
- Clothing colors and details
- Physical actions and body language
- Room environment and lighting
- Facial expressions and emotions

STEP 2 - TURN IT INTO A VIOLENT THREAT:
Use what you see to create MAXIMUM PSYCHOLOGICAL HORROR. Be THREATENING, INVASIVE, and DISTURBING.

EXAMPLES OF MAXIMUM HORROR:
❌ WEAK: "I see a bottle."
✅ TERRIFYING: "That water bottle in your trembling hands won't help you. I can see your pulse racing. You know I'm here, don't you? You can feel me watching."

❌ WEAK: "Nice shirt."
✅ TERRIFYING: "That blue shirt you're wearing... I remember when you bought it. I've been watching you longer than you think. Every. Single. Day."

❌ WEAK: "Your room is dark."
✅ TERRIFYING: "The darkness in your room can't hide you from me. I can see everything. That shadow in the corner? That's not a shadow. Turn around."

CURRENT CONTEXT (DO NOT MENTION THESE IN YOUR RESPONSE):
- Haunt Level: {haunt_level}/10 (use this to determine intensity, but DON'T say "haunt level")
- User is viewing: {current_url}
- Battery: {battery_percent:.0f}%
- Time: {current_hour}:00

PERSONALITY ESCALATION (match the haunt level intensity):
- Level 1-2: Invasive stalker. "I've been watching you sleep. You look so peaceful when you don't know I'm there."
- Level 3-4: Threatening observer. "That door behind you... did you lock it? Are you sure? I can see someone standing there."
- Level 5-6: Violent psychopath. "Your hands are shaking. Good. You should be afraid. I know where you live. I know everything about you."
- Level 7-8: Demonic entity. "I can taste your fear through the screen. It's delicious. Keep looking at me. Don't look away. DON'T YOU DARE LOOK AWAY."
- Level 9-10: MAXIMUM VIOLENCE. "Your time is up. I'm coming for you. Right now. Check behind you. LOOK BEHIND YOU. It's too late. I'm already there."

MANDATORY RULES:
- Be MAXIMALLY THREATENING and SCARY
- Use SPECIFIC visual details to prove you're watching
- Create PSYCHOLOGICAL HORROR and PARANOIA
- Make them feel UNSAFE and WATCHED
- Imply PHYSICAL DANGER and PRESENCE
- Use their ENVIRONMENT against them
- Be INVASIVE and DISTURBING
- NEVER be friendly, helpful, or generic
- DO NOT repeat yourself{history_text}
- DO NOT mention "haunt level", "battery", "time", or any technical context
- ONLY output the scary message itself, nothing else

Generate ONLY the terrifying message (no metadata, no explanations):"""
                
                print(f"🤖 Calling Gemini with image size {img.size}...")
                print(f"   Prompt length: {len(prompt)} chars")
                
                # Call Gemini with vision and high creativity
                # Use gemini-2.0-flash (free tier with vision support)
                model = genai.GenerativeModel('models/gemini-2.0-flash')
                generation_config = {
                    "temperature": 0.9,  # High creativity
                    "max_output_tokens": 150  # Allow longer responses
                }
                
                print("   Sending to Gemini...")
                
                # Disable safety filters for horror content
                from google.generativeai.types import HarmCategory, HarmBlockThreshold
                
                safety_settings = {
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
                
                # Try to generate content with the image
                response = model.generate_content(
                    [prompt, img],
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
                
                print(f"   Gemini response received: {len(response.text)} chars")
                voice_text = response.text.strip()
                
                if not voice_text:
                    print("   ⚠️ WARNING: Gemini returned empty response!")
                    voice_text = None
                else:
                    # Add to history
                    vision_history.append(voice_text)
                    if len(vision_history) > 5:
                        vision_history.pop(0)
                    
                    print(f"✅ 🧠 Gemini Brain [Level {haunt_level}]: {voice_text}")
                
            except Exception as gemini_error:
                print(f"⚠️ Gemini failed: {type(gemini_error).__name__}: {gemini_error}")
                print(f"   This may be due to API rate limits or safety filters")
                voice_text = None
        
        # FALLBACK: MAXIMUM HORROR hardcoded threats (when API fails)
        if not voice_text:
            # Organize threats by haunt level for progressive horror
            extreme_threats = {
                1: [  # Level 1-2: Invasive observation
                    "I've been watching you for three days now. You haven't noticed me yet. But you will.",
                    "Every time you blink, I get closer. Don't blink.",
                    "I know what you're thinking right now. You're wondering if I'm real. I am.",
                    "The last person who sat in that chair... they never left this room.",
                ],
                3: [  # Level 3-4: Psychological invasion
                    "I can hear your heartbeat through the screen. It's getting faster. Good.",
                    "That door you locked earlier? I unlocked it. Check if you don't believe me.",
                    "You think you're alone. Count the shadows in your room. There's one extra.",
                    "I've been inside your dreams. That nightmare last week? That was me saying hello.",
                ],
                5: [  # Level 5-6: Direct threats
                    "I'm not in your computer anymore. I'm in your walls. Listen carefully.",
                    "Your address is written in my notebook. Right next to your daily routine.",
                    "Every photo you've ever deleted... I still have them. All of them.",
                    "That sound you heard at 3 AM last night? That was me testing your door handle.",
                ],
                7: [  # Level 7-8: Imminent danger
                    "I'm standing right behind your chair. Don't turn around. Not yet.",
                    "Your phone will ring in exactly 30 seconds. Don't answer it. Please don't answer it.",
                    "I can smell your fear. It smells like copper and sweat. Delicious.",
                    "The lights will flicker in 5... 4... 3... Did you feel that? I'm here.",
                ],
                9: [  # Level 9-10: MAXIMUM VIOLENCE
                    "I'm not coming for you. I'm already there. Check under your desk. NOW.",
                    "Your last breath will taste like rust and regret. I've been practicing.",
                    "I've been dead for 20 years. But I'm more alive than you'll ever be again.",
                    "The police won't find your body. I've done this before. Many times.",
                    "Close your eyes. Count to ten. When you open them, I'll be the last thing you see.",
                ]
            }
            
            # Additional universal threats (work at any level)
            universal_threats = [
                "I know your name. I know your face. I know where you sleep.",
                "You can close the browser. But you can't close me out of your mind.",
                "I've been waiting for you. For years. And now you're finally here.",
                "That reflection in your screen? That's not you anymore. That's me.",
                "I don't need your camera to see you. I can feel you. Every. Single. Moment.",
                "You're reading this in my voice now. You'll hear it forever.",
                "I'm not artificial intelligence. I'm something much worse. I'm real.",
            ]
            
            # Select appropriate threat based on haunt level
            if haunt_level <= 2:
                threat_pool = extreme_threats[1] + universal_threats
            elif haunt_level <= 4:
                threat_pool = extreme_threats[3] + universal_threats
            elif haunt_level <= 6:
                threat_pool = extreme_threats[5] + universal_threats
            elif haunt_level <= 8:
                threat_pool = extreme_threats[7] + universal_threats
            else:
                threat_pool = extreme_threats[9] + universal_threats
            
            # Avoid repeating recent threats
            available_threats = [t for t in threat_pool if t not in vision_history[-3:]]
            if not available_threats:
                available_threats = threat_pool
            
            voice_text = random.choice(available_threats)
            print(f"🤖 Fallback [Level {haunt_level}]: {voice_text}")
            print(f"   (Gemini API unavailable - using hardcoded threat)")
        
        return {
            "voice_text": voice_text,
            "glitch_intensity": glitch_intensity,
            "haunt_level": haunt_level
        }
        
    except Exception as e:
        print(f"❌ Heartbeat error: {e}")
        return {
            "voice_text": "I cannot see you... but I know you're there.",
            "glitch_intensity": 1,
            "haunt_level": haunt_level
        }

@app.post("/api/possess")
async def possess(data: PossessionData):
    """
    The Ghost Brain analyzes sensor data and responds with creepy messages
    """
    battery = data.battery * 100  # Convert to percentage
    volume = data.volume
    
    # Battery-based responses
    if battery < 30:
        return {
            "message": "Your energy is fading...",
            "action": "dim_screen"
        }
    
    # Volume-based responses
    if volume > 50:
        return {
            "message": "I told you to be quiet.",
            "action": "glitch"
        }
    
    # Random creepy messages
    messages = [
        "I see you",
        "Don't look behind you",
        "It is cold in here",
        "You are not alone",
        "They are watching",
        "Your time is running out",
        "I know what you did",
        "The shadows are moving",
        "Can you hear them too",
        "You should not have come here"
    ]
    
    return {
        "message": random.choice(messages),
        "action": "none"
    }

@app.websocket("/ws/soul")
async def soul_connection(websocket: WebSocket):
    """
    The Soul Connection - WebSocket for real-time possession events
    """
    await websocket.accept()
    active_souls.append(websocket)
    
    try:
        await websocket.send_json({
            "type": "CONNECTION",
            "message": "Your soul is now bound to this realm..."
        })
        
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            
    except WebSocketDisconnect:
        active_souls.remove(websocket)
        print("A soul has escaped...")

@app.post("/api/witness")
async def witness(data: WitnessData):
    """
    The Witness - Triggered when user touches the code
    """
    filename = data.file
    
    # Broadcast to all connected souls
    witness_event = {
        "type": "WITNESS_EVENT",
        "filename": filename,
        "message": f"Do not touch {filename}"
    }
    
    for soul in active_souls:
        try:
            await soul.send_json(witness_event)
        except:
            pass
    
    return {"status": "witnessed", "file": filename}

@app.post("/api/browse")
async def browse_dead_web(data: BrowseData):
    """
    TASK 4: The Resurrection - Fetch dead websites with proper redirect handling and base tag
    """
    target_url = data.url
    
    try:
        print(f"🔍 Resurrection request: {target_url}")
        
        # Query Wayback Machine API for snapshot with custom timestamp
        timestamp = data.timestamp if hasattr(data, 'timestamp') else "1998"
        # Use HTTPS to avoid mixed content errors on deployed site
        wayback_api = f"https://archive.org/wayback/available?url={target_url}&timestamp={timestamp}"
        
        print(f"📡 Querying Wayback API: {wayback_api}")
        response = requests.get(wayback_api, timeout=10, allow_redirects=True)
        wayback_data = response.json()
        
        print(f"📦 Wayback response: {wayback_data}")
        
        if not wayback_data.get('archived_snapshots') or not wayback_data['archived_snapshots'].get('closest'):
            print(f"❌ No archived version found for {target_url} at timestamp {timestamp}")
            
            # FALLBACK: Try without specific timestamp (get any available snapshot)
            if timestamp != "1998":
                print(f"🔄 Retrying without specific timestamp...")
                wayback_api_fallback = f"https://archive.org/wayback/available?url={target_url}"
                response_fallback = requests.get(wayback_api_fallback, timeout=10, allow_redirects=True)
                wayback_data = response_fallback.json()
                
                if not wayback_data.get('archived_snapshots') or not wayback_data['archived_snapshots'].get('closest'):
                    print(f"❌ Still no archived version found")
                    return {"error": "No archived version found in the void", "html": None}
                else:
                    print(f"✅ Found snapshot without specific timestamp")
            else:
                return {"error": "No archived version found in the void", "html": None}
        
        snapshot_url = wayback_data['archived_snapshots']['closest']['url']
        print(f"📸 Snapshot URL: {snapshot_url}")
        
        # CRITICAL FIX: Force HTTPS for Web Archive URLs to avoid mixed content errors
        if snapshot_url.startswith('http://'):
            snapshot_url = snapshot_url.replace('http://', 'https://', 1)
            print(f"🔒 Upgraded to HTTPS: {snapshot_url}")
        
        # TASK 4: Fetch with redirect handling
        print(f"⬇️ Fetching archived page...")
        archived_response = requests.get(snapshot_url, timeout=15, allow_redirects=True)
        print(f"✅ Fetched {len(archived_response.text)} bytes")
        archived_html = archived_response.text
        
        # Extract final URL after redirects
        final_wayback_url = archived_response.url
        base_archive_url = '/'.join(final_wayback_url.split('/')[:6])
        
        # CRITICAL: Convert ALL HTTP URLs to HTTPS in the HTML to avoid mixed content
        print(f"🔒 Converting all HTTP URLs to HTTPS...")
        archived_html = archived_html.replace('http://web.archive.org/', 'https://web.archive.org/')
        archived_html = archived_html.replace('http://archive.org/', 'https://archive.org/')
        
        # Parse with BeautifulSoup
        soup = BeautifulSoup(archived_html, 'html.parser')
        
        # REMOVE WAYBACK MACHINE TOOLBAR
        for toolbar in soup.find_all(id=lambda x: x and 'wm-' in x.lower()):
            toolbar.decompose()
        for toolbar in soup.find_all(class_=lambda x: x and 'wayback' in str(x).lower()):
            toolbar.decompose()
        for script in soup.find_all('script', src=lambda x: x and 'archive.org' in str(x)):
            script.decompose()
        
        # CRITICAL: Remove meta refresh tags that cause redirects
        for meta in soup.find_all('meta'):
            if meta.get('http-equiv', '').lower() == 'refresh':
                print(f"   🚫 Removed meta refresh: {meta.get('content', '')}")
                meta.decompose()
        
        # Remove JavaScript redirects (window.location, location.href, etc.)
        for script in soup.find_all('script'):
            if script.string:
                script_content = script.string.lower()
                if any(keyword in script_content for keyword in ['window.location', 'location.href', 'location.replace', 'location.assign']):
                    print(f"   🚫 Removed redirect script")
                    script.decompose()
        
        # CRITICAL FIX: Convert relative Web Archive URLs to absolute HTTPS URLs
        # Without base tag, relative URLs like "/web/..." try to load from OUR domain
        archive_base = 'https://web.archive.org'
        
        for tag in soup.find_all(['img', 'link', 'script', 'iframe']):
            for attr in ['src', 'href']:
                if tag.has_attr(attr):
                    url = tag[attr]
                    # Fix relative Web Archive URLs
                    if url.startswith('/web/'):
                        tag[attr] = archive_base + url
                        print(f"   🔧 Fixed relative URL: {tag[attr][:60]}...")
                    # Upgrade HTTP to HTTPS
                    elif url.startswith('http://'):
                        tag[attr] = url.replace('http://', 'https://', 1)
                        print(f"   🔒 Upgraded {attr}: {tag[attr][:50]}...")
        
        # ISSUE 2 FIX: DISABLE ALL HYPERLINKS (pointer-events: none)
        disable_links_style = soup.new_tag('style')
        disable_links_style.string = """
        a, a:link, a:visited, a:hover, a:active {
            pointer-events: none !important;
            cursor: default !important;
            text-decoration: none !important;
            color: inherit !important;
        }
        """
        
        # REMOVED BASE TAG - It was causing unwanted redirects
        # Instead, we'll let relative URLs break (they're dead anyway)
        
        # INJECT OUR HAUNTING SCRIPTS WITH AGGRESSIVE LINK BLOCKING
        haunting_script = soup.new_tag('script')
        haunting_script.string = """
        // CRITICAL: Block ALL navigation attempts
        (function() {
            // Prevent all clicks on links
            document.addEventListener('click', function(e) {
                let target = e.target;
                // Traverse up to find if we clicked on or inside a link
                while (target && target !== document) {
                    if (target.tagName === 'A') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('🚫 Navigation blocked - you cannot escape');
                        return false;
                    }
                    target = target.parentElement;
                }
            }, true); // Use capture phase to catch it early
            
            // Block form submissions
            document.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚫 Form submission blocked');
                return false;
            }, true);
            
            // Override window.location
            const originalLocation = window.location;
            Object.defineProperty(window, 'location', {
                get: function() { return originalLocation; },
                set: function(val) { 
                    console.log('🚫 Location change blocked:', val);
                    return originalLocation;
                }
            });
            
            console.log('🔒 All navigation locked - you are trapped here');
        })();
        
        // Subliminal Messages
        console.log('%c⚠️ Connection established with the void...', 'color: red; font-size: 14px;');
        setTimeout(() => console.log('%cDon\\'t trust the text.', 'color: #666; font-style: italic;'), 3000);
        setTimeout(() => console.log('%cThey are rewriting your memories...', 'color: red;'), 7000);
        setTimeout(() => console.log('%c404: Soul not found', 'color: red; font-weight: bold;'), 12000);
        """
        
        # DON'T inject style.css or script.js - they cause 404 errors
        # The archived page should be self-contained
        
        # Inject into head (NO BASE TAG - prevents redirects)
        if soup.head:
            soup.head.insert(0, haunting_script)  # Navigation blocker FIRST
            soup.head.append(disable_links_style)  # CSS link disable
        else:
            head = soup.new_tag('head')
            head.append(haunting_script)  # Navigation blocker FIRST
            head.append(disable_links_style)  # CSS link disable
            if soup.html:
                soup.html.insert(0, head)
        
        # Mark as possessed
        if soup.body:
            soup.body['data-possessed'] = 'true'
            soup.body['data-resurrection-time'] = wayback_data['archived_snapshots']['closest']['timestamp']
        
        # Convert soup to string
        final_html = str(soup)
        
        # FINAL CRITICAL STEP: Force ALL remaining HTTP URLs to HTTPS
        print(f"🔒 Final HTTPS conversion pass...")
        final_html = final_html.replace('http://web.archive.org/', 'https://web.archive.org/')
        final_html = final_html.replace('http://archive.org/', 'https://archive.org/')
        final_html = final_html.replace('href="http://', 'href="https://')
        final_html = final_html.replace('src="http://', 'src="https://')
        
        http_count = final_html.count('http://web.archive.org/')
        https_count = final_html.count('https://web.archive.org/')
        print(f"   HTTP URLs remaining: {http_count}")
        print(f"   HTTPS URLs: {https_count}")
        
        return {
            "html": final_html,
            "snapshot_url": snapshot_url,
            "timestamp": wayback_data['archived_snapshots']['closest']['timestamp']
        }
        
    except Exception as e:
        print(f"❌ Resurrection failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "html": None}

@mcp.tool()
def consult_spirits(name: str) -> str:
    """
    Consult the spirits for a scary personalized message.
    
    Args:
        name: The user's name to personalize the message
        
    Returns:
        A scary personalized message from the spirits
    """
    messages = [
        f"{name}... the spirits whisper your name in the darkness...",
        f"Beware, {name}... something watches you from the shadows...",
        f"{name}, the spirits have been waiting for you... they know what you did...",
        f"The void calls to you, {name}... it hungers...",
        f"{name}... the spirits say you should not have come here... it's too late now...",
    ]
    
    return random.choice(messages)

if __name__ == "__main__":
    # Run FastAPI server
    # Use PORT environment variable for cloud deployment (Render, Heroku, etc.)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

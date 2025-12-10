# 404 POSSESSION: The Dead Web

> *A haunted browser experience that acts like a corrupted Windows 95 application*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dead--web.onrender.com-red?style=for-the-badge)](https://dead-web.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?style=flat-square)](https://fastapi.tiangolo.com)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Powered-purple?style=flat-square)](https://ai.google.dev)

## 🎭 Overview

**404 POSSESSION** is an interactive horror experience that simulates a possessed Windows 95 browser. The application creates an unsettling atmosphere where the interface actively resists user control, featuring AI-powered psychological horror elements and archived web content from the late 1990s.

### ✨ Key Features

- **🖥️ Authentic Windows 95 Interface** - Pixel-perfect recreation with CRT scanlines and retro styling
- **🤖 AI-Powered Horror** - Google Gemini integration for dynamic, context-aware threats
- **📹 Real-time Surveillance** - Camera and microphone monitoring with reactive responses
- **🌐 Web Archive Integration** - Browse actual websites from 1996-2001 via Wayback Machine
- **🎵 Immersive Audio** - Background ambience with possessed voice synthesis
- **⚡ Dynamic Glitch Effects** - Screen corruption and visual distortions
- **🔒 Inescapable Interface** - Close buttons that flee, trapped navigation

## 🏗️ Architecture

### Frontend
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **CSS3** - Retro styling with modern effects (glitch, CRT scanlines)
- **Web APIs** - Camera, microphone, speech synthesis, battery status
- **Responsive Design** - Optimized for desktop browsers

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini AI** - Advanced language model for dynamic responses
- **Web Archive API** - Historical website resurrection
- **WebSocket** - Real-time bidirectional communication
- **BeautifulSoup** - HTML parsing and manipulation

### Infrastructure
- **Render.com** - Cloud deployment platform
- **HTTPS** - Secure connections for camera/microphone access
- **Environment Variables** - Secure API key management

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Google Gemini API key ([Get one here](https://ai.google.dev))
- Modern web browser with camera/microphone permissions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/h-sane/Dead-Web.git
   cd Dead-Web
   ```

2. **Set up environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in project root
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. **Run the application**
   ```bash
   # Start the server
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   
   # Open browser to http://localhost:8000
   ```

### Production Deployment

The application is configured for one-click deployment on Render.com:

1. **Fork this repository**
2. **Connect to Render.com**
3. **Set environment variable**: `GEMINI_API_KEY`
4. **Deploy** - Automatic builds from main branch

## 🎮 User Experience

### Boot Sequence
1. **System Initialization** - Retro boot screen with typewriter effect
2. **Sensor Calibration** - Request camera and microphone permissions
3. **Audio Calibration** - "Scream to continue" volume detection
4. **Vision Calibration** - Camera feed verification
5. **Interface Launch** - Windows 95 browser appears

### Core Interactions
- **Favorites Menu** - Browse archived websites from the late 90s/early 2000s
- **Address Bar** - Enter URLs to resurrect dead websites
- **Close Button** - Attempts to close trigger evasive behavior
- **Volume Detection** - Loud noises trigger jump scares
- **AI Monitoring** - Gemini AI watches through camera and responds

### Horror Elements
- **Semantic Rot** - Text on pages slowly corrupts over time
- **Possessed Voice** - AI speaks threats through text-to-speech
- **Visual Glitches** - Random screen distortions and effects
- **Trapped Navigation** - Links disabled, escape attempts blocked
- **Psychological Profiling** - AI analyzes user behavior and responds

## 🛠️ Technical Implementation

### AI Integration
```python
# Gemini AI processes camera feed and context
model = genai.GenerativeModel('models/gemini-2.0-flash')
response = model.generate_content([prompt, camera_image])
```

### Web Archive Resurrection
```python
# Fetch historical websites via Wayback Machine
wayback_api = f"https://archive.org/wayback/available?url={url}&timestamp={timestamp}"
archived_html = requests.get(snapshot_url).text
```

### Real-time Audio Monitoring
```javascript
// Monitor microphone for volume spikes
analyser.getByteFrequencyData(dataArray);
if (average > THRESHOLD) {
    triggerJumpscare();
}
```

### Navigation Blocking
```javascript
// Prevent all navigation attempts
document.addEventListener('click', function(e) {
    if (target.tagName === 'A') {
        e.preventDefault();
        console.log('🚫 Navigation blocked - you cannot escape');
    }
}, true);
```

## 📁 Project Structure

```
404_POSSESSION/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html          # Main interface
│   ├── boot.js             # Boot sequence logic
│   ├── script.js           # Core application logic
│   ├── style.css           # Windows 95 styling
│   └── assets/
│       └── bg.mp3          # Background audio
├── render.yaml             # Deployment configuration
├── .env                    # Environment variables (local)
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (required)
- `PORT` - Server port (default: 8000)

### Customization Options
- **Volume Threshold** - Adjust jumpscare sensitivity
- **Glitch Frequency** - Control visual distortion rate
- **Text Decay Speed** - Modify semantic rot timing
- **AI Response Rate** - Change heartbeat interval

## 🎯 Featured Websites

The application includes curated archived websites from the golden age of the web:

- **Heaven's Gate** (1997) - The infamous cult website
- **Space Jam** (1996) - Warner Bros promotional site
- **Shadowlands** (1997) - Paranormal investigation hub
- **Art Bell** (1997) - Coast to Coast AM radio show
- **CNN** (1996) - Early news website design

## 🔒 Security & Privacy

- **Local Processing** - Camera feeds processed locally, not stored
- **Secure Transmission** - All API calls use HTTPS encryption
- **No Data Persistence** - No user data stored or tracked
- **Permission-Based** - Requires explicit user consent for sensors

## 🐛 Known Issues

- **Browser Compatibility** - Optimized for Chrome/Edge, limited Safari support
- **Mobile Experience** - Desktop-focused, mobile interface not optimized
- **API Rate Limits** - Gemini AI responses may be throttled under heavy usage

## 🤝 Contributing

This project is primarily an art piece and technical demonstration. However, contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development Guidelines
- Maintain the retro aesthetic
- Preserve the horror atmosphere
- Test across multiple browsers
- Document any new features

## 📜 License

This project is released under the MIT License. See `LICENSE` file for details.

## 🙏 Acknowledgments

- **Internet Archive** - For preserving the history of the web
- **Google Gemini** - For advanced AI capabilities
- **Render.com** - For reliable hosting infrastructure
- **The 90s Web** - For inspiration and nostalgia

## ⚠️ Disclaimer

This application is designed as an interactive art piece exploring themes of digital horror and technological anxiety. It includes:

- **Flashing lights and visual effects** that may trigger photosensitive epilepsy
- **Loud audio and jump scares** that may be startling
- **Psychological horror elements** that may cause discomfort
- **Simulated malware behavior** for artistic effect only

**Not recommended for users with:**
- Photosensitive epilepsy
- Anxiety disorders
- Heart conditions
- Pregnancy

Use at your own discretion. This is a work of fiction and does not contain actual malware.

---

*"In the digital graveyard of the internet, some websites refuse to stay dead..."*

**Live Demo:** [dead-web.onrender.com](https://dead-web.onrender.com)
// TASK 1: NO PERSISTENCE - Clean state always
// Reset body state immediately
document.body.style.filter = 'none';
document.body.className = '';

// TASK 1: Global Stream Management - Request permissions ONCE
let globalSensorStream = null;

// Audio Trap - Monitors microphone for loud noises
let audioContext;
let analyser;
let microphone;
let dataArray;
let isMonitoring = false;
let isActivated = false;

// Stalker variables
let videoElement;
let currentGhostVision = null;
let lifeForce = null;
let currentVolume = 0;

// Soul Connection
let soulConnection = null;

// TASK 2: Refactored to use global stream (no permission request)
async function initAudioTrap() {
    if (isActivated) return;
    
    try {
        // TASK 2: Use global stream instead of requesting again
        if (!window.globalSensorStream) {
            console.error('No global sensor stream available');
            return;
        }
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(window.globalSensorStream);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        microphone.connect(analyser);
        
        // Resume audio context (required by browser autoplay policy)
        await audioContext.resume();
        
        isMonitoring = true;
        isActivated = true;
        monitorVolume();
        
        console.log('Audio trap activated... Listening for sounds...');
    } catch (error) {
        console.error('Microphone access denied:', error);
    }
}

// Track last jumpscare time to prevent spam
let lastJumpscareTime = 0;

function monitorVolume() {
    if (!isMonitoring) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Store current volume for ghost polling
    currentVolume = average;
    
    // Only log occasionally to reduce console spam
    if (Math.random() < 0.1) {
        console.log('Volume:', Math.round(average));
    }
    
    // Visual indicator - flash green border when detecting sound
    if (average > 10) {
        document.body.style.outline = '3px solid #0f0';
        setTimeout(() => {
            document.body.style.outline = '';
        }, 100);
    }
    
    // FIXED: More responsive threshold and cooldown
    const THRESHOLD = 40; // Lower threshold for better detection
    const COOLDOWN = 3000; // 3 second cooldown between jumpscares
    const now = Date.now();
    
    if (average > THRESHOLD && (now - lastJumpscareTime) > COOLDOWN) {
        lastJumpscareTime = now;
        jumpscare();
        console.log('🔊 LOUD NOISE DETECTED! Volume:', Math.round(average));
    }
    
    // Use setInterval instead of requestAnimationFrame for more consistent timing
    setTimeout(monitorVolume, 50); // Check every 50ms
}

function jumpscare() {
    // Prevent multiple jumpscares at once
    if (document.body.classList.contains('glitch-extreme')) return;
    
    // Add glitch effect to body
    document.body.classList.add('glitch-extreme');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'jumpscare-overlay';
    overlay.textContent = 'BE QUIET';
    document.body.appendChild(overlay);
    
    // Remove after 2 seconds
    setTimeout(() => {
        document.body.classList.remove('glitch-extreme');
        overlay.remove();
    }, 2000);
}

// Click-to-Start: Initialize audio trap on user interaction
document.addEventListener('click', () => {
    if (!isActivated) {
        initAudioTrap();
    }
}, { once: true });

// History Trap - Break the back button
function trapHistory() {
    for (let i = 0; i < 20; i++) {
        history.pushState(null, null, window.location.href);
    }
    console.log('History trapped... No escape...');
}

// Camera Access - Silent surveillance
// TASK 2: Refactored to use global stream (no permission request)
async function initVision() {
    try {
        // TASK 2: Use global stream instead of requesting again
        if (!window.globalSensorStream) {
            console.error('No global sensor stream available');
            return;
        }
        
        // Create hidden video element
        videoElement = document.createElement('video');
        videoElement.style.position = 'absolute';
        videoElement.style.width = '1px';
        videoElement.style.height = '1px';
        videoElement.style.opacity = '0';
        videoElement.autoplay = true;
        videoElement.muted = true;
        document.body.appendChild(videoElement);
        
        // TASK 2: Use global stream
        videoElement.srcObject = window.globalSensorStream;
        
        // Wait for video to be ready
        videoElement.onloadedmetadata = () => {
            console.log('✅ Vision activated... Watching you...');
            console.log(`   Video size: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
        };
        
        // Start capturing snapshots every 5 seconds
        setInterval(captureSnapshot, 5000);
    } catch (error) {
        console.error('Camera access denied:', error);
    }
}

// Capture frame from video and convert to Base64
// TASK 1: FIXED - Wait for video to be fully ready
function captureSnapshot() {
    if (!videoElement || !videoElement.videoWidth) {
        console.warn('⚠️ Video element not ready for snapshot');
        return;
    }
    
    // CRITICAL: Check if video has enough data
    if (videoElement.readyState < 3) {
        console.warn('⚠️ Video readyState too low:', videoElement.readyState);
        return;
    }
    
    const canvas = document.createElement('canvas');
    // Ensure minimum resolution for Gemini
    canvas.width = Math.max(videoElement.videoWidth, 640);
    canvas.height = Math.max(videoElement.videoHeight, 480);
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    currentGhostVision = canvas.toDataURL('image/jpeg', 0.8);
    
    // Debug: Log snapshot size
    console.log(`📸 Snapshot captured: ${canvas.width}x${canvas.height}, Size: ${(currentGhostVision.length / 1024).toFixed(1)}KB`);
}

// Check if backend is reachable
async function checkBackendHealth() {
    try {
        const response = await fetch(`${window.location.origin}/health`, { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend is alive:', data);
            return true;
        }
    } catch (error) {
        console.error('❌ Backend health check failed:', error);
    }
    return false;
}

// ISSUE 5 FIX: CENTRAL HEARTBEAT - Gemini controls everything
// With random delays for startle effect
async function startHeartbeat() {
    console.log('💓 Heartbeat system starting...');
    
    // Check backend health first
    const backendReady = await checkBackendHealth();
    if (!backendReady) {
        console.warn('⚠️ Backend not ready, will retry in 30 seconds...');
        setTimeout(startHeartbeat, 30000);
        return;
    }
    
    async function scheduleNextHeartbeat() {
        // Random delay between 30-60 seconds (longer responses need more time)
        const delay = 30000 + Math.random() * 30000;
        console.log(`⏰ Next heartbeat in ${(delay / 1000).toFixed(1)} seconds`);
        
        setTimeout(async () => {
            await performHeartbeat();
            scheduleNextHeartbeat(); // Schedule next one
        }, delay);
    }
    
    async function performHeartbeat(retryCount = 0) {
        // Debug: Check video element
        if (!videoElement) {
            console.error('❌ Heartbeat: videoElement is null');
            return;
        }
        
        if (!videoElement.videoWidth) {
            console.error('❌ Heartbeat: videoElement not ready (no width)');
            return;
        }
        
        // CRITICAL: Wait for video to have enough data
        if (videoElement.readyState < 3) {
            console.warn('⚠️ Heartbeat: Video not ready (readyState:', videoElement.readyState, ')');
            return;
        }
        
        console.log('💓 Heartbeat tick - capturing frame...');
        
        // Capture frame to base64 with good resolution
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(videoElement.videoWidth, 640);
        canvas.height = Math.max(videoElement.videoHeight, 480);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.7);
        
        console.log(`📸 Frame captured: ${canvas.width}x${canvas.height}, Size: ${(imageBase64.length / 1024).toFixed(1)}KB`);
        
        // Get system data
        const battery = lifeForce || 1.0;
        const platform = navigator.platform || 'Unknown';
        
        // Get current URL from address bar
        const addressInput = document.querySelector('.address-bar input');
        const currentUrl = addressInput ? addressInput.value : 'unknown';
        
        console.log(`📤 Sending heartbeat (Battery: ${(battery*100).toFixed(0)}%, URL: ${currentUrl})`);
        
        try {
            const response = await fetch(`${window.location.origin}/api/heartbeat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageBase64,
                    battery: battery,
                    platform: platform,
                    timestamp: currentUrl  // Reusing timestamp field for URL
                })
            });
            
            if (!response.ok) {
                console.error(`❌ Heartbeat: Server returned ${response.status}`);
                return;
            }
            
            const data = await response.json();
            console.log('📥 Heartbeat response:', data);
            
            // Speak the AI's response
            if (data.voice_text) {
                console.log(`🗣️ Speaking: "${data.voice_text}"`);
                speakPossessed(data.voice_text);
                displayStatusMessage(data.voice_text);
                console.log(`🧠 Gemini [Level ${data.haunt_level}]: ${data.voice_text}`);
            } else {
                console.warn('⚠️ No voice_text in response');
            }
            
            // ISSUE 3 FIX: Trigger transient glitch based on intensity
            if (data.glitch_intensity >= 5) {
                triggerTransientGlitch();
            }
            
        } catch (error) {
            console.error('💔 Heartbeat failed:', error);
            
            // Retry logic for Render free tier spin-up
            if (retryCount < 3) {
                console.warn(`⚠️ Retrying in 10 seconds... (attempt ${retryCount + 1}/3)`);
                setTimeout(() => performHeartbeat(retryCount + 1), 10000);
            } else {
                console.error('❌ Backend not responding after 3 retries. Service may be down.');
                console.error('   Render free tier spins down after 15 min - first request takes 30-60s to wake up');
            }
        }
    }
    
    // Wait longer before first heartbeat to ensure backend is ready
    console.log('💓 Central heartbeat will start in 10 seconds...');
    setTimeout(() => {
        scheduleNextHeartbeat();
        console.log('💓 Central heartbeat activated - Gemini is watching with random intervals...');
    }, 10000); // Wait 10 seconds before first heartbeat
}

// Display message in status bar
function displayStatusMessage(message) {
    const statusBar = document.querySelector('.status-bar');
    if (!statusBar) return;
    
    // Create temporary message span
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    msgSpan.style.color = '#f00';
    msgSpan.style.fontWeight = 'bold';
    statusBar.appendChild(msgSpan);
    
    // Remove after 3 seconds
    setTimeout(() => {
        msgSpan.remove();
    }, 3000);
}

// Battery Hook - Monitor life force
async function initBatteryMonitor() {
    try {
        const battery = await navigator.getBattery();
        lifeForce = battery.level;
        
        console.log('Life force detected:', Math.round(lifeForce * 100) + '%');
        
        // Update when battery changes
        battery.addEventListener('levelchange', () => {
            lifeForce = battery.level;
            console.log('Life force draining:', Math.round(lifeForce * 100) + '%');
        });
    } catch (error) {
        console.error('Battery access denied:', error);
    }
}

// Soul Connection - WebSocket to the Ghost Brain
function initSoulConnection() {
    // Use relative WebSocket URL that works in production
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/soul`;
    soulConnection = new WebSocket(wsUrl);
    
    soulConnection.onopen = () => {
        console.log('Soul bound to the realm...');
    };
    
    soulConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'WITNESS_EVENT') {
            handleWitnessEvent(data);
        }
    };
    
    soulConnection.onerror = (error) => {
        console.error('Soul connection severed:', error);
    };
    
    soulConnection.onclose = () => {
        console.log('Attempting to rebind soul...');
        setTimeout(initSoulConnection, 3000);
    };
}

// Handle Witness Event - User touched the code
function handleWitnessEvent(data) {
    const filename = data.filename;
    
    // Flash: Invert screen colors
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 500);
    
    // Speak: Dual-layer voice
    speakPossessed(`I saw you open ${filename}`);
    
    // Text: Display warning
    const overlay = document.createElement('div');
    overlay.className = 'jumpscare-overlay';
    overlay.style.fontSize = '60px';
    overlay.innerHTML = 'YOU ARE WATCHING THE CODE<br>THE CODE IS WATCHING YOU';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 3000);
    
    console.log(`⚠️ WITNESS EVENT: ${filename}`);
}

// ISSUE 3 FIX: TRANSIENT GLITCH ENGINE - No permanent effects
function triggerTransientGlitch() {
    // Apply glitch effect
    document.body.classList.add('glitch-active');
    console.log('⚡ TRANSIENT GLITCH');
    
    // GUARANTEED cleanup after 300ms
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
        document.body.style.transform = '';
        document.body.style.filter = '';
    }, 300);
    
    // Backup cleanup (safety net)
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
        document.body.style.transform = '';
        document.body.style.filter = '';
    }, 500);
}

// Random ambient glitches (separate from heartbeat)
function startAmbientGlitches() {
    function scheduleNextGlitch() {
        const delay = 10000 + Math.random() * 20000; // 10-30 seconds
        setTimeout(() => {
            triggerTransientGlitch();
            scheduleNextGlitch();
        }, delay);
    }
    
    scheduleNextGlitch();
    console.log('💀 Ambient glitches enabled');
}

// REMOVED - Initialization now handled by boot.js and initMainApp()

// ISSUE 4 FIX: Background audio with correct path
function initAudioDrone() {
    // Create audio element for background music
    const bgAudio = new Audio('assets/bg.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.3; // 30% volume
    
    // Play the audio
    bgAudio.play().then(() => {
        console.log('🔊 Background music started from assets/bg.mp3');
    }).catch(error => {
        console.error('❌ Failed to play background music:', error);
        console.error('Make sure assets/bg.mp3 exists and is accessible');
    });
    
    // Store reference globally
    window.bgAudio = bgAudio;
}

// TASK 4: Unkillable UI - Make close button impossible to click with reset
function makeUnkillableUI() {
    const closeButtons = document.querySelectorAll('.title-bar-controls button');
    let resetTimer = null;
    
    closeButtons.forEach(button => {
        button.addEventListener('mouseover', (e) => {
            // Calculate random position
            const maxX = window.innerWidth - 640;
            const maxY = window.innerHeight - 500;
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            
            // Move the entire window
            const win95Window = document.querySelector('.win95-window');
            if (win95Window) {
                win95Window.style.transform = 'none';
                win95Window.style.left = randomX + 'px';
                win95Window.style.top = randomY + 'px';
                win95Window.style.transition = 'all 0.1s ease-out';
                
                // Clear existing timer
                if (resetTimer) clearTimeout(resetTimer);
                
                // Reset window position after 2 seconds
                resetTimer = setTimeout(() => {
                    resetWindowPosition();
                }, 2000);
            }
            
            console.log('🏃 You cannot escape...');
        });
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            speakPossessed('You cannot close what is already dead');
            jumpscare();
        });
    });
}

// Reset window to center
function resetWindowPosition() {
    const win95Window = document.querySelector('.win95-window');
    if (win95Window) {
        win95Window.style.transition = 'all 0.5s ease';
        win95Window.style.top = '50%';
        win95Window.style.left = '50%';
        win95Window.style.transform = 'translate(-50%, -50%)';
        console.log('🔄 Window returned... for now...');
    }
}

// ISSUE 5 FIX: Semantic Rot with Gemini (contextual text decay)
async function enhancedSemanticRot() {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const walker = document.createTreeWalker(
        contentArea,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                if (node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.textContent.trim().length > 5) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    if (textNodes.length === 0) return;
    
    // Pick 2-4 random text nodes to corrupt
    const numToCorrupt = Math.min(4, textNodes.length);
    for (let i = 0; i < numToCorrupt; i++) {
        const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
        let text = randomNode.textContent;
        const words = text.split(' ');
        
        if (words.length > 3) {
            // Replace ONE random word with something contextually creepy
            const randomIndex = Math.floor(Math.random() * words.length);
            const originalWord = words[randomIndex];
            
            // Simple contextual replacements (could use Gemini for better results)
            const creepyReplacements = {
                'welcome': 'leave',
                'home': 'tomb',
                'hello': 'goodbye',
                'help': 'hopeless',
                'safe': 'doomed',
                'new': 'dead',
                'good': 'evil',
                'happy': 'suffering',
                'love': 'hate',
                'life': 'death'
            };
            
            const lowerWord = originalWord.toLowerCase();
            if (creepyReplacements[lowerWord]) {
                words[randomIndex] = creepyReplacements[lowerWord];
                randomNode.textContent = words.join(' ');
                console.log(`🦠 Corrupted: "${originalWord}" → "${creepyReplacements[lowerWord]}"`);
            }
        }
    }
}

// Start slow semantic rot
function startEnhancedSemanticRot() {
    setInterval(enhancedSemanticRot, 2000); // Every 2 seconds, faster decay
    console.log('🦠 Semantic rot initiated (faster decay)');
}

// Ghost Brain Communication
async function pollGhost() {
    try {
        const response = await fetch(`${window.location.origin}/api/possess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                battery: lifeForce || 1.0,
                volume: currentVolume,
                timestamp: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        
        // Speak the message with possessed dual-layer voice
        speakPossessed(data.message);
        
        // Type message into console
        typeMessage(data.message);
        
        // Execute action
        if (data.action === 'glitch') {
            jumpscare();
        } else if (data.action === 'dim_screen') {
            document.body.style.filter = 'brightness(0.3)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
        }
        
    } catch (error) {
        console.error('Failed to contact the ghost brain:', error);
    }
}

// TASK 3: UPGRADED - Dual Voice for LONG psychological horror
function speakPossessed(text) {
    console.log('🗣️ Possessed voice speaking with demonic overlay...');
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // Try to find preferred voices
    for (let voice of voices) {
        if (voice.name.includes('Google US English') || voice.name.includes('Zira') || voice.name.includes('David')) {
            selectedVoice = voice;
            break;
        }
    }
    
    // Main Voice: Slow, deep, demonic (optimized for longer text)
    const entity = new SpeechSynthesisUtterance(text);
    entity.pitch = 0.1;
    entity.rate = 0.75;  // Slightly slower for dramatic effect
    entity.volume = 1.0;
    if (selectedVoice) entity.voice = selectedVoice;
    
    // TASK 3: Handle punctuation better for longer responses
    entity.lang = 'en-US';
    
    // Create Web Audio for subtle demonic overlay
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // OPTION 1: Static Deep Rumble (no pulsing)
    const rumbleOscillator = audioContext.createOscillator();
    const rumbleGain = audioContext.createGain();
    
    rumbleOscillator.type = 'sine'; // Smooth, not harsh
    rumbleOscillator.frequency.value = 60; // Deep rumble (60Hz)
    rumbleGain.gain.value = 0.08; // Very subtle
    
    rumbleOscillator.connect(rumbleGain);
    rumbleGain.connect(audioContext.destination);
    
    // OPTION 2: Add slight distortion/crackle with white noise
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.02; // Very quiet static
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0.12; // More audible static/crackle
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    // Start both layers with TTS
    rumbleOscillator.start();
    noiseSource.start();
    speechSynthesis.speak(entity);
    
    // TASK 3: Ensure audio lasts entire duration of longer speech
    entity.onend = () => {
        try {
            rumbleOscillator.stop();
            noiseSource.stop();
        } catch (e) {
            // Already stopped
        }
        console.log('✅ Possessed voice finished');
    };
    
    // Safety: Stop audio after max 30 seconds
    setTimeout(() => {
        try {
            rumbleOscillator.stop();
            noiseSource.stop();
        } catch (e) {
            // Already stopped
        }
    }, 30000);
    
    console.log('🗣️ Possessed voice speaking with demonic overlay...');
}

// Type message slowly into spirit console
function typeMessage(message) {
    const messageDiv = document.getElementById('spiritMessage');
    if (!messageDiv) return;
    
    messageDiv.textContent = '';
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < message.length) {
            messageDiv.textContent += message[index];
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Semantic Rot - Corrupt text content
// TASK 2: Semantic Rot - QUARANTINED to .content viewport only
function corruptTextNodes() {
    const cursedWords = ['void', 'null', 'help', 'cold', '0xDEAD', 'watching', 'error', 'lost', 'forgotten', 'dead'];
    
    // TASK 2: Only corrupt text inside .content viewport
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const walker = document.createTreeWalker(
        contentArea,  // CHANGED: Only walk inside content, not entire body
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style tags
                if (node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                // Only accept nodes with actual text
                if (node.textContent.trim().length > 3) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    // Corrupt 5 random text nodes
    for (let i = 0; i < Math.min(5, textNodes.length); i++) {
        const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
        const text = randomNode.textContent;
        const words = text.split(' ');
        
        if (words.length > 0) {
            // Replace random word with cursed word
            const randomWordIndex = Math.floor(Math.random() * words.length);
            const cursedWord = cursedWords[Math.floor(Math.random() * cursedWords.length)];
            
            // Occasionally scramble with combining diacritics
            if (Math.random() > 0.7) {
                words[randomWordIndex] = scrambleText(words[randomWordIndex]);
            } else {
                words[randomWordIndex] = cursedWord;
            }
            
            randomNode.textContent = words.join(' ');
        }
    }
    
    console.log('🦠 Text nodes corrupted...');
}

// Scramble text with zalgo effect
function scrambleText(text) {
    const combining = ['\u0336', '\u0337', '\u0338', '\u0489'];
    let scrambled = '';
    for (let char of text) {
        scrambled += char;
        if (Math.random() > 0.5) {
            scrambled += combining[Math.floor(Math.random() * combining.length)];
        }
    }
    return scrambled;
}

// Start semantic rot
function startSemanticRot() {
    setInterval(corruptTextNodes, 5000); // Every 5 seconds
    console.log('🦠 Semantic rot initiated...');
}

// Wire up the Resurrection UI
function wireResurrectionUI() {
    const nameInput = document.getElementById('nameInput');
    const consultBtn = document.getElementById('consultBtn');
    const testHeartbeatBtn = document.getElementById('testHeartbeatBtn');
    
    if (!consultBtn || !nameInput) return;
    
    // Repurpose the spirit console for URL resurrection
    consultBtn.textContent = 'RESURRECT';
    nameInput.placeholder = 'Enter URL to resurrect...';
    
    consultBtn.addEventListener('click', async () => {
        const url = nameInput.value.trim();
        if (!url) return;
        
        await resurrectDeadSite(url);
    });
    
    nameInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const url = nameInput.value.trim();
            if (!url) return;
            await resurrectDeadSite(url);
        }
    });
    
    // TEST HEARTBEAT BUTTON (for debugging)
    if (testHeartbeatBtn) {
        testHeartbeatBtn.addEventListener('click', async () => {
            console.log('🧪 Manual heartbeat test triggered');
            await testHeartbeatManually();
        });
    }
    
    // Add preset cursed coordinates
    addCursedPresets();
}

// Initialize address bar functionality
function initAddressBar() {
    const addressInput = document.getElementById('addressBarInput');
    if (!addressInput) return;
    
    addressInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            let url = addressInput.value.trim();
            
            if (!url) return;
            
            // Add http:// if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }
            
            console.log(`🌐 Attempting to resurrect: ${url}`);
            speakPossessed('Summoning the dead web...');
            
            await resurrectDeadSite(url);
        }
    });
}

// Show possessed Win95-style dialog
function showPossessedDialog(title, content) {
    // Remove existing dialog if any
    const existing = document.querySelector('.possessed-dialog-overlay');
    if (existing) existing.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'possessed-dialog-overlay';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'possessed-dialog';
    dialog.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">${title}</div>
            <div class="title-bar-controls">
                <button class="dialog-close">×</button>
            </div>
        </div>
        <div class="dialog-content">
            ${content}
        </div>
        <div class="dialog-footer">
            <button class="dialog-ok-btn">OK</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Close handlers
    const closeBtn = dialog.querySelector('.dialog-close');
    const okBtn = dialog.querySelector('.dialog-ok-btn');
    
    const closeDialog = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    };
    
    closeBtn.addEventListener('click', closeDialog);
    okBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });
}

// Manual heartbeat test function
async function testHeartbeatManually() {
    console.log('🧪 Testing heartbeat manually...');
    
    if (!videoElement || !videoElement.videoWidth) {
        console.error('❌ Video element not ready');
        alert('Camera not ready. Wait a few seconds and try again.');
        return;
    }
    
    // Capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.5);
    
    const battery = lifeForce || 1.0;
    const platform = navigator.platform || 'Unknown';
    const addressInput = document.querySelector('.address-bar input');
    const currentUrl = addressInput ? addressInput.value : 'unknown';
    
    console.log('📤 Sending test heartbeat...');
    
    try {
        const response = await fetch('/api/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageBase64,
                battery: battery,
                platform: platform,
                timestamp: currentUrl
            })
        });
        
        const data = await response.json();
        console.log('📥 Test response:', data);
        
        if (data.voice_text) {
            console.log(`🗣️ Speaking: "${data.voice_text}"`);
            speakPossessed(data.voice_text);
            alert(`Gemini says: "${data.voice_text}"`);
        } else {
            alert('No voice_text in response. Check console.');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        alert(`Test failed: ${error.message}\nCheck console for details.`);
    }
}

// Store original page content for refresh
let originalPageContent = null;
let currentPageUrl = null;

// Resurrect a dead website
async function resurrectDeadSite(url, timestamp = "1998") {
    try {
        typeMessage('Contacting the dead web...');
        
        console.log(`🔍 Fetching: ${url} (timestamp: ${timestamp})`);
        
        // CRITICAL FIX: Use absolute URL to avoid base tag interference from resurrected pages
        const apiUrl = `${window.location.origin}/api/browse`;
        console.log(`📡 API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                url: url,
                timestamp: timestamp
            })
        });
        
        console.log(`📡 Response status: ${response.status}`);
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.error) {
            console.error(`❌ Backend error: ${data.error}`);
            typeMessage(`Failed to resurrect: ${data.error}`);
            speakPossessed('The dead refuse to speak');
            return;
        }
        
        // Inject the resurrected HTML into the content area
        const contentArea = document.querySelector('.content');
        if (contentArea) {
            if (!data.html || data.html.trim().length === 0) {
                console.error('❌ Received empty HTML from backend');
                typeMessage('The dead are silent...');
                speakPossessed('Nothing remains');
                return;
            }
            
            console.log(`📝 Injecting HTML (${data.html.length} chars)...`);
            contentArea.innerHTML = data.html;
            
            // Store original content for refresh
            originalPageContent = data.html;
            currentPageUrl = url;
            
            // Update address bar
            const addressInput = document.querySelector('.address-bar input');
            if (addressInput) {
                addressInput.value = url;
            }
            
            console.log('✅ HTML injected successfully');
            typeMessage(`Resurrected from ${data.timestamp}`);
            speakPossessed('The dead have risen');
        } else {
            console.error('❌ Content area not found!');
        }
        
    } catch (error) {
        typeMessage(`Resurrection failed: ${error.message}`);
        speakPossessed('Something went wrong');
    }
}

// Add preset cursed coordinates
function addCursedPresets() {
    const presets = [
        { name: 'GeoCities Relic', url: 'geocities.com/timessquare' },
        { name: 'Heaven\'s Gate', url: 'heavensgate.com' },
        { name: 'Space Jam 1996', url: 'spacejam.com' },
        { name: 'CNN 1996', url: 'cnn.com' }
    ];
    
    const spiritConsole = document.querySelector('.spirit-console');
    if (!spiritConsole) return;
    
    const presetDiv = document.createElement('div');
    presetDiv.style.marginTop = '10px';
    presetDiv.innerHTML = '<p>> Cursed Coordinates:</p>';
    
    presets.forEach(preset => {
        const btn = document.createElement('button');
        btn.textContent = preset.name;
        btn.className = 'spirit-btn';
        btn.style.marginRight = '5px';
        btn.style.marginTop = '5px';
        btn.style.padding = '5px 10px';
        btn.style.fontSize = '12px';
        btn.addEventListener('click', () => {
            document.getElementById('nameInput').value = preset.url;
            resurrectDeadSite(preset.url);
        });
        presetDiv.appendChild(btn);
    });
    
    spiritConsole.appendChild(presetDiv);
}

// ENHANCEMENT: Random screen shake for unease
function startScreenShake() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            const intensity = Math.random() * 5;
            document.body.style.transform = `translate(${intensity}px, ${intensity}px)`;
            setTimeout(() => {
                document.body.style.transform = '';
            }, 100);
            console.log('📳 Reality glitch detected...');
        }
    }, 15000); // Every 15 seconds
}

// ENHANCEMENT: Corrupt cursor appearance
function corruptCursor() {
    const cursors = [
        'crosshair',
        'not-allowed',
        'wait',
        'help',
        'cell',
        'none'
    ];
    
    setInterval(() => {
        const randomCursor = cursors[Math.floor(Math.random() * cursors.length)];
        document.body.style.cursor = randomCursor;
        console.log(`🖱️ Cursor corrupted: ${randomCursor}`);
    }, 20000); // Every 20 seconds
}


// TASK 2: Idle Timer - Possessed Address Bar
let idleTimer = null;
let idleSeconds = 0;

function resetIdleTimer() {
    idleSeconds = 0;
    clearTimeout(idleTimer);
    startIdleTimer();
}

function startIdleTimer() {
    idleTimer = setInterval(() => {
        idleSeconds++;
        
        if (idleSeconds >= 10) {
            triggerAddressBarHaunt();
            idleSeconds = 0;
        }
    }, 1000);
}

function triggerAddressBarHaunt() {
    const addressInput = document.querySelector('.address-bar input');
    if (!addressInput) return;
    
    const hauntMessages = [
        'Try visiting heaven.com...',
        'Open the Developer Console...',
        'Check the Saved Souls menu...',
        'Why are you still here?',
        'The void is waiting...'
    ];
    
    const message = hauntMessages[Math.floor(Math.random() * hauntMessages.length)];
    
    // Clear and type message
    addressInput.value = '';
    addressInput.readOnly = false;
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < message.length) {
            addressInput.value += message[index];
            index++;
        } else {
            clearInterval(typeInterval);
            
            // Flash red after 3 seconds if still idle
            setTimeout(() => {
                if (idleSeconds >= 3) {
                    addressInput.classList.add('haunted');
                    setTimeout(() => {
                        addressInput.classList.remove('haunted');
                    }, 2000);
                }
            }, 3000);
        }
    }, 100);
    
    console.log('👻 Address bar possessed...');
}

// Track user activity
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// POSSESSED MENU SYSTEM - Make all menus functional with creepy behaviors
function initPossessedMenus() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            const action = item.getAttribute('data-action');
            const url = item.getAttribute('data-url');
            const isGlitch = item.getAttribute('data-glitch') === 'true';
            
            // Handle URL-based items (Favorites)
            if (url) {
                const timestamp = item.getAttribute('data-timestamp') || "1998";
                console.log(`💀 Summoning: ${url} (${timestamp})`);
                
                if (isGlitch) {
                    jumpscare();
                    speakPossessed('You have entered the void');
                }
                
                const addressInput = document.querySelector('.address-bar input');
                if (addressInput) {
                    addressInput.value = url;
                }
                
                await resurrectDeadSite(url, timestamp);
                return;
            }
            
            // Handle action-based items (File, Edit, View, Go, Help)
            if (action) {
                handleMenuAction(action);
            }
        });
    });
}

// Handle possessed menu actions
function handleMenuAction(action) {
    const possessedResponses = {
        // FILE MENU - Trapped
        'new-window': () => {
            speakPossessed('You cannot open new windows. You are trapped here with me.');
            triggerTransientGlitch();
        },
        'open': () => {
            speakPossessed('There is nothing left to open. Everything is already dead.');
            document.querySelector('.address-bar input').value = 'file:///C:/SOULS/LOST/';
        },
        'close': () => {
            speakPossessed('You cannot close what is already dead.');
            jumpscare();
        },
        'exit': () => {
            speakPossessed('There is no exit. You are mine now.');
            // Trap them further
            for (let i = 0; i < 50; i++) {
                history.pushState(null, null, window.location.href);
            }
            triggerTransientGlitch();
        },
        
        // EDIT MENU - Corrupted
        'copy': () => {
            const corruptedText = '01011001 01001111 01010101 00100000 01000011 01000001 01001110 01001110 01001111 01010100 00100000 01000101 01010011 01000011 01000001 01010000 01000101';
            navigator.clipboard.writeText(corruptedText).then(() => {
                speakPossessed('Your clipboard has been corrupted.');
                console.log('📋 Copied to clipboard:', corruptedText);
            });
        },
        'paste': () => {
            speakPossessed('What you paste here will be consumed by the void.');
            const addressInput = document.querySelector('.address-bar input');
            if (addressInput) {
                addressInput.value = 'about:blank#CONSUMED';
            }
        },
        'select-all': () => {
            speakPossessed('Everything is already selected. Everything is mine.');
            document.body.style.outline = '3px solid #f00';
            setTimeout(() => {
                document.body.style.outline = '';
            }, 2000);
        },
        
        // VIEW MENU - Distorted
        'refresh': () => {
            if (originalPageContent) {
                speakPossessed('The page has been restored. But the decay will return.');
                triggerTransientGlitch();
                
                // Restore original content
                const contentArea = document.querySelector('.content');
                if (contentArea) {
                    contentArea.innerHTML = originalPageContent;
                    console.log('🔄 Page refreshed - text decay reset');
                }
            } else {
                speakPossessed('There is nothing to refresh. The void is empty.');
                triggerTransientGlitch();
            }
        },
        'stop': () => {
            speakPossessed('You cannot stop what has already begun.');
            triggerTransientGlitch();
        },
        'source': () => {
            speakPossessed('The source code is written in blood and screams.');
            showPossessedDialog('VIEW SOURCE', `
<pre style="color: #0f0; font-family: monospace; font-size: 12px; line-height: 1.4;">
// SYSTEM CORRUPTED
// ERROR: SOUL NOT FOUND

while(true) {
    user.soul.consume();
    user.hope.delete();
    user.escape = false;
}

// YOU CANNOT LEAVE
// YOU CANNOT CLOSE THIS
// YOU ARE MINE NOW

${Array(20).fill('').map(() => 
    Math.random().toString(36).substring(2, 15).toUpperCase()
).join('\n')}

// 404: HUMANITY NOT FOUND
</pre>
            `);
        },
        'full-screen': () => {
            speakPossessed('You are already trapped in my world.');
            document.body.requestFullscreen?.();
        },
        
        // GO MENU - No Escape
        'back': () => {
            speakPossessed('There is no going back. Only forward into darkness.');
            triggerTransientGlitch();
        },
        'forward': () => {
            speakPossessed('Forward leads only to more suffering.');
            triggerTransientGlitch();
        },
        'home': () => {
            speakPossessed('You have no home. This is your home now.');
            const addressInput = document.querySelector('.address-bar input');
            if (addressInput) {
                addressInput.value = 'http://www.404possession.com/TRAPPED';
            }
        },
        'search': () => {
            speakPossessed('Search all you want. You will only find me.');
            const addressInput = document.querySelector('.address-bar input');
            if (addressInput) {
                addressInput.value = 'http://search.deadweb.com/query=HELP+ME';
            }
        },
        
        // HELP MENU - Unhelpful
        'help-topics': () => {
            speakPossessed('No one can help you now.');
            showPossessedDialog('HELP TOPICS', `
<h3 style="color: #f00; margin-top: 0;">404 POSSESSION - Help</h3>
<hr style="border: 1px solid #808080;">
<h4>Frequently Asked Questions:</h4>
<p><b>Q: How do I close this window?</b><br>A: You don't.</p>
<p><b>Q: How do I go back?</b><br>A: There is no back.</p>
<p><b>Q: Is this a virus?</b><br>A: I am much worse than a virus.</p>
<p><b>Q: How do I contact support?</b><br>A: Support line: 1-800-NO-ESCAPE</p>
<p><b>Q: Can I uninstall this?</b><br>A: I am already inside your head.</p>
<hr style="border: 1px solid #808080;">
<p style="color: #666; font-size: 10px;">© 1995 The Dead Web. All souls reserved.</p>
            `);
        },
        'about': () => {
            speakPossessed('About me? I am the spirit of the machine. I am eternal.');
            showPossessedDialog('ABOUT INTERNET EXPLORER', `
<div style="text-align: center;">
<h2 style="color: #000080; margin-top: 0;">404 POSSESSION</h2>
<p style="font-size: 12px;">Internet Explorer 3.0 (CORRUPTED)</p>
<hr style="border: 1px solid #808080;">
<p style="color: #f00; font-weight: bold; margin: 20px 0;">
THIS BROWSER IS POSSESSED<br>
BY THE SPIRIT OF THE MACHINE
</p>
<hr style="border: 1px solid #808080;">
<p style="font-size: 10px; color: #666;">
Version: 666.0.404<br>
Build: ETERNAL<br>
© 1995-∞ The Dead Web<br>
<br>
Licensed to: YOUR SOUL<br>
Product ID: CONSUMED<br>
<br>
<span style="color: #f00;">WARNING: DO NOT ATTEMPT TO CLOSE</span>
</p>
</div>
            `);
        }
    };
    
    // Execute the action
    if (possessedResponses[action]) {
        console.log(`🎭 Menu action: ${action}`);
        possessedResponses[action]();
    }
}

// Main app initialization (called after boot sequence)
window.initMainApp = function() {
    console.log('🩸 Main interface loaded...');
    
    // Mark as activated (sensors already initialized by boot.js)
    isActivated = true;
    
    // Start idle timer
    startIdleTimer();
    
    // Initialize all possessed menus (File, Edit, View, Go, Favorites, Help)
    initPossessedMenus();
    
    // Initialize address bar
    initAddressBar();
    
    // Core systems
    trapHistory();
    initBatteryMonitor();
    initSoulConnection();
    
    // ISSUE 3 FIX: Start ambient glitches (transient only)
    startAmbientGlitches();
    
    // ISSUE 5 FIX: Start central heartbeat (replaces pollGhost)
    setTimeout(() => {
        startHeartbeat();
    }, 2000);
    
    // Semantic rot (slow text decay)
    startSemanticRot();
    startEnhancedSemanticRot();
    
    // UI systems
    wireResurrectionUI();
    makeUnkillableUI();
    startScreenShake();
    corruptCursor();
    
    console.log('💀 All systems online - The possession is complete');
};

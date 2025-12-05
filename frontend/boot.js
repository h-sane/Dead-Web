// BOOT SEQUENCE - The Calibration Ritual
let bootStage = 0;
let bootAudioContext = null;
let bootAnalyser = null;
let bootMicrophone = null;
let bootDataArray = null;
let bootVideoStream = null;

// Initialize boot sequence
window.addEventListener('load', () => {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    
    // Stage 0: Click to initialize
    bootScreen.addEventListener('click', async () => {
        if (bootStage === 0) {
            bootStage = 1;
            
            // ISSUE 4 FIX: Start background music IMMEDIATELY on first click
            const bgAudio = new Audio('assets/bg.mp3');
            bgAudio.loop = true;
            bgAudio.volume = 0.3;
            bgAudio.play().catch(error => {
                console.error('❌ Failed to play bg.mp3:', error);
            });
            window.bgAudio = bgAudio;
            
            await startAudioCalibration();
        }
    }, { once: true });
});

// TASK 1: Stage 1 - Request BOTH audio and video permissions ONCE
async function startAudioCalibration() {
    const bootText = document.getElementById('boot-text');
    const progressBar = document.getElementById('boot-progress');
    const progressFill = document.getElementById('boot-progress-fill');
    
    await typeBootText('INITIALIZING SYSTEM...\n\n');
    await sleep(1000);
    await typeBootText('CALIBRATING SENSORS...\n');
    await typeBootText('SCREAM TO CONTINUE.\n\n');
    
    progressBar.style.display = 'block';
    
    try {
        // TASK 1: Request BOTH audio and video in ONE call
        window.globalSensorStream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: true 
        });
        
        bootAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        bootAnalyser = bootAudioContext.createAnalyser();
        bootMicrophone = bootAudioContext.createMediaStreamSource(window.globalSensorStream);
        
        bootAnalyser.fftSize = 256;
        const bufferLength = bootAnalyser.frequencyBinCount;
        bootDataArray = new Uint8Array(bufferLength);
        
        bootMicrophone.connect(bootAnalyser);
        await bootAudioContext.resume();
        
        monitorBootVolume(progressFill);
        
    } catch (error) {
        await typeBootText('ERROR: SENSORS OFFLINE\n');
        await typeBootText('PROCEEDING WITHOUT SENSORS...\n\n');
        await sleep(2000);
        startVisionCalibration();
    }
}

function monitorBootVolume(progressFill) {
    bootAnalyser.getByteFrequencyData(bootDataArray);
    
    let sum = 0;
    for (let i = 0; i < bootDataArray.length; i++) {
        sum += bootDataArray[i];
    }
    const average = sum / bootDataArray.length;
    
    // Update progress bar
    const progress = Math.min((average / 50) * 100, 100);
    progressFill.style.width = progress + '%';
    
    // Check if threshold met
    if (average > 50) {
        bootStage = 2;
        startVisionCalibration();
        return;
    }
    
    requestAnimationFrame(() => monitorBootVolume(progressFill));
}

// TASK 1: Stage 2 - Vision Calibration (uses existing stream)
async function startVisionCalibration() {
    const bootText = document.getElementById('boot-text');
    const progressBar = document.getElementById('boot-progress');
    const bootCamera = document.getElementById('boot-camera');
    
    progressBar.style.display = 'none';
    
    await typeBootText('\n✓ AUDIO CALIBRATED\n\n');
    await sleep(500);
    await typeBootText('CALIBRATING OPTICAL SENSORS...\n');
    
    try {
        // TASK 1: Use existing global stream (already has video)
        if (!window.globalSensorStream) {
            throw new Error('No sensor stream available');
        }
        
        bootCamera.style.display = 'block';
        const ctx = bootCamera.getContext('2d');
        
        const video = document.createElement('video');
        video.srcObject = window.globalSensorStream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });
        
        // Wait for video to actually start playing
        await video.play();
        
        // Wait a bit more for frames to be available
        await sleep(500);
        
        bootCamera.width = video.videoWidth || 640;
        bootCamera.height = video.videoHeight || 480;
        
        // Flash the camera feed
        for (let i = 0; i < 5; i++) {
            if (video.readyState >= 2) {
                ctx.drawImage(video, 0, 0, bootCamera.width, bootCamera.height);
            }
            await sleep(200);
            ctx.clearRect(0, 0, bootCamera.width, bootCamera.height);
            await sleep(100);
        }
        
        // Final frame
        if (video.readyState >= 2) {
            ctx.drawImage(video, 0, 0, bootCamera.width, bootCamera.height);
        }
        await sleep(1000);
        
        await typeBootText('\n✓ SUBJECT IDENTIFIED\n\n');
        await sleep(1000);
        
        launchMainInterface();
        
    } catch (error) {
        await typeBootText('\nERROR: OPTICAL SENSORS OFFLINE\n');
        await typeBootText('PROCEEDING WITHOUT VISION...\n\n');
        await sleep(2000);
        launchMainInterface();
    }
}

// TASK 3: Stage 3 - Launch main interface and activate sensors immediately
async function launchMainInterface() {
    const bootText = document.getElementById('boot-text');
    
    await typeBootText('SYSTEM ONLINE\n');
    await typeBootText('LOADING INTERFACE...\n\n');
    await sleep(1000);
    await typeBootText('CONNECTION ESTABLISHED WITH THE VOID\n');
    await sleep(1500);
    
    // Fade out boot screen
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.style.transition = 'opacity 2s ease';
    bootScreen.style.opacity = '0';
    
    setTimeout(() => {
        bootScreen.style.display = 'none';
        document.querySelector('.win95-window').style.display = 'flex';
        
        // Activate sensors using global stream
        if (window.initAudioTrap) {
            window.initAudioTrap();
        }
        if (window.initVision) {
            window.initVision();
        }
        
        // Trigger main app initialization
        if (window.initMainApp) {
            window.initMainApp();
        }
    }, 2000);
}

// Typewriter effect for boot text
async function typeBootText(text) {
    const bootText = document.getElementById('boot-text');
    
    for (let char of text) {
        bootText.textContent += char;
        await sleep(50);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

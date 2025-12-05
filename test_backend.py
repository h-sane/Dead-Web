#!/usr/bin/env python3
"""
Quick test script to verify backend /api/heartbeat endpoint
"""
import requests
import base64
from io import BytesIO
from PIL import Image

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (320, 240), color='red')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    return f"data:image/jpeg;base64,{img_base64}"

def test_heartbeat():
    """Test the /api/heartbeat endpoint"""
    print("🧪 Testing /api/heartbeat endpoint...")
    print("=" * 50)
    
    # Create test data
    test_image = create_test_image()
    
    payload = {
        "image": test_image,
        "battery": 0.75,
        "platform": "Win32",
        "timestamp": "http://test.com"
    }
    
    try:
        # Send request
        print("📤 Sending request to http://localhost:8000/api/heartbeat")
        response = requests.post(
            'http://localhost:8000/api/heartbeat',
            json=payload,
            timeout=10
        )
        
        print(f"📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ SUCCESS! Response received:")
            print(f"   Voice Text: {data.get('voice_text')}")
            print(f"   Glitch Intensity: {data.get('glitch_intensity')}")
            print(f"   Haunt Level: {data.get('haunt_level')}")
            
            if data.get('voice_text'):
                print("\n🎉 Backend is working correctly!")
                print("   If you're not hearing responses in the browser,")
                print("   the issue is likely in the frontend or TTS.")
            else:
                print("\n⚠️ Response received but no voice_text")
        else:
            print(f"\n❌ ERROR: Unexpected status code {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend")
        print("   Make sure backend is running:")
        print("   cd backend && python main.py")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_heartbeat()

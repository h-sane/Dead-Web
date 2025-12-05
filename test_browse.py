#!/usr/bin/env python3
"""
Test the /api/browse endpoint with actual favorite URLs
"""
import requests
import json

# Test URLs from favorites
test_cases = [
    {"url": "http://www.heavensgate.com", "timestamp": "19970327", "name": "THE CULT"},
    {"url": "http://www.cnn.com/US/OJ/", "timestamp": "19960101", "name": "THE MURDER"},
    {"url": "http://theshadowlands.net", "timestamp": "19970710", "name": "THE GHOSTS"},
]

print("🧪 Testing /api/browse endpoint with favorites...")
print("=" * 60)

for test in test_cases:
    print(f"\n📡 Testing: {test['name']}")
    print(f"   URL: {test['url']}")
    print(f"   Timestamp: {test['timestamp']}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/browse",
            json={"url": test['url'], "timestamp": test['timestamp']},
            timeout=30
        )
        
        print(f"   Status: {response.status_code}")
        
        data = response.json()
        
        if data.get('error'):
            print(f"   ❌ ERROR: {data['error']}")
        elif data.get('html'):
            html_size = len(data['html'])
            print(f"   ✅ SUCCESS! HTML size: {html_size} bytes")
            print(f"   Snapshot URL: {data.get('snapshot_url', 'N/A')}")
            print(f"   Timestamp: {data.get('timestamp', 'N/A')}")
        else:
            print(f"   ⚠️ UNEXPECTED: {data}")
            
    except requests.exceptions.Timeout:
        print(f"   ❌ TIMEOUT: Request took longer than 30 seconds")
    except Exception as e:
        print(f"   ❌ EXCEPTION: {type(e).__name__}: {e}")

print("\n" + "=" * 60)
print("✅ Test complete!")

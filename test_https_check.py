#!/usr/bin/env python3
"""
Verify that returned HTML has HTTPS URLs, not HTTP
"""
import requests

print("🔍 Testing HTTPS conversion in returned HTML...")
print("=" * 60)

response = requests.post(
    "http://localhost:8000/api/browse",
    json={"url": "http://www.heavensgate.com", "timestamp": "19970327"},
    timeout=30
)

data = response.json()
html = data.get('html', '')

# Check for HTTP URLs that should have been converted
http_archive_count = html.count('http://web.archive.org/')
https_archive_count = html.count('https://web.archive.org/')

print(f"\n📊 URL Analysis:")
print(f"   HTTP archive URLs: {http_archive_count}")
print(f"   HTTPS archive URLs: {https_archive_count}")

if http_archive_count > 0:
    print(f"\n❌ PROBLEM: Found {http_archive_count} HTTP URLs that should be HTTPS!")
    print("   This will cause mixed content errors in production.")
else:
    print(f"\n✅ PERFECT: All archive URLs are HTTPS!")
    print("   No mixed content errors expected.")

# Check base tag
if 'base href="https://' in html:
    print(f"✅ Base tag uses HTTPS")
elif 'base href="http://' in html:
    print(f"❌ Base tag uses HTTP - will cause issues!")
else:
    print(f"⚠️ No base tag found")

print("\n" + "=" * 60)

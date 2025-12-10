# Update Gemini API Key on Render

## Local Update
✅ Already done - `.env` file updated with new key

## Render Update (CRITICAL - DO THIS NOW)

1. Go to https://dashboard.render.com
2. Click on your `dead-web` service
3. Go to **Environment** tab
4. Find `GEMINI_API_KEY`
5. Click **Edit**
6. Replace with: `[YOUR_NEW_GEMINI_API_KEY]`
7. Click **Save Changes**
8. Render will auto-redeploy with the new key

## SECURITY WARNING
⚠️ **YOU JUST POSTED YOUR API KEY PUBLICLY IN CHAT**

This key is now compromised. After updating Render:
1. Go to https://aistudio.google.com/apikey
2. Delete the compromised key
3. Generate a NEW key
4. Update it again (but DON'T share it in chat)

## Why This Matters
- Anyone who saw this chat can use your API key
- They can rack up charges on your Google account
- Always keep API keys secret

## Next Time
When you need to update a key:
- Just say "I have a new key, update the .env file"
- I'll update it without you posting the actual key
- Or manually edit `.env` yourself

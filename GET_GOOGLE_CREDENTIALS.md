# Google OAuth Credentials - Step-by-Step Guide

## What Are Client IDs?

**Client ID** and **Client Secret** are credentials issued by Google that allow your app to authenticate users through Google's login system.

---

## Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Sign in with your Google account

---

## Step 2: Create a New Project

1. Look for the **Project selector** at the top (shows project name)
2. Click on it
3. Click **NEW PROJECT**
4. Enter project name: `SkillSync`
5. Click **CREATE**
6. Wait for project to be created (this takes a moment)

---

## Step 3: Enable Google+ API

1. In the left sidebar, go to **APIs & Services**
2. Click on **Library**
3. Search for `Google+ API`
4. Click on it and press **ENABLE**

---

## Step 4: Create OAuth Consent Screen

1. In left sidebar: **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Click **CREATE**
4. Fill in:
   - **App name**: `SkillSync`
   - **User support email**: Your email (e.g., your@gmail.com)
   - **Developer contact information**: Your email again
5. Click **SAVE AND CONTINUE**
6. Skip the scopes section - just click **SAVE AND CONTINUE**
7. Click **SAVE AND CONTINUE** again on the summary page

---

## Step 5: Create OAuth 2.0 Credentials (THIS IS WHERE YOU GET CLIENT ID & SECRET)

1. In left sidebar: **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** (top button)
3. Select **OAuth client ID**
4. Choose application type: **Web application**
5. Give it a name: `SkillSync Web Client`
6. Under "Authorized redirect URIs", add these two URLs:
   ```
   http://localhost:3000/auth/v1/callback
   https://rwbeslmvltfgobnchhsy.supabase.co/auth/v1/callback
   ```
7. Click **CREATE**
8. A popup will appear with:
   - **Your Client ID** (long string like `123456789.apps.googleusercontent.com`)
   - **Your Client Secret** (another long string)
9. **COPY AND SAVE BOTH OF THESE** - you need them in Supabase

---

## Step 6: Add Credentials to Supabase

1. Go to: https://supabase.com/dashboard
2. Click on your project (`skillsync`)
3. In left sidebar: **Authentication** > **Providers**
4. Find and click on **Google**
5. You'll see two input fields:
   - **Client ID** - Paste the Client ID from Step 5
   - **Client Secret** - Paste the Client Secret from Step 5
6. Click **SAVE**

---

## What You'll Get (Example):

- **Client ID**: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-1234567890abcdefghijk`

These are sensitive credentials - don't share them publicly!

---

## Troubleshooting

**"Error: Invalid client" or "Client not found"**
- Make sure you copied the credentials correctly
- Check for extra spaces when pasting
- Verify they're in the right fields in Supabase

**"Redirect URI mismatch"**
- The redirect URI must match EXACTLY what you put in Google Cloud Console
- For local development: `http://localhost:3000/auth/v1/callback` (note: http, not https, and includes /auth/v1/callback)

**Can't find the credentials popup after creating OAuth client**
- Don't worry! Go to **Credentials** page again
- Find your created credential in the list under "OAuth 2.0 Client IDs"
- Click on it to see the Client ID and Secret again


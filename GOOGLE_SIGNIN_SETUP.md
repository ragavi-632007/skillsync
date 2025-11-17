# Google Sign-In Setup Guide

This guide explains how to set up Google OAuth authentication for your SkillSync app using Supabase.

## Prerequisites

- A Google Cloud Project (create one at [Google Cloud Console](https://console.cloud.google.com/))
- Your Supabase project already configured

## Steps to Set Up Google OAuth

### 1. Create a Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Select **External** user type and click **Create**
5. Fill in the required fields:
   - App name: "SkillSync"
   - User support email: Your email
   - Developer contact: Your email
6. Click **Save and Continue** through all screens
7. Go to **Credentials** in the left sidebar
8. Click **Create Credentials** > **OAuth client ID**
9. Select **Web application**
10. Add authorized redirect URIs:
    - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
    - `http://localhost:3000` (for local development)
11. Click **Create** and save your Client ID and Client Secret

### 2. Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and enable it
5. Paste your Google OAuth credentials:
   - Client ID
   - Client Secret
6. Click **Save**

### 3. Update Your Redirect URL (if needed)

If you're deploying to a custom domain, update:
- The `redirectTo` in `supabaseService.ts` if needed
- Your Google OAuth redirect URIs to match your production domain

### 4. Test the Implementation

1. Start your dev server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. You should be redirected to Google's login
5. After authentication, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" Error
- Ensure the redirect URI in Google Cloud Console exactly matches your app's URL
- For localhost, make sure it's `http://localhost:3000` (not https)

### "Client ID not found" Error
- Check that you've properly configured the Google provider in Supabase
- Verify your credentials are correct

### User not logged in after redirect
- Check browser console for errors
- Ensure Supabase session is being properly stored
- Clear browser cache and try again

## Next Steps

After successful Google sign-in, users will be authenticated in Supabase. You can:
- Access user data via `getCurrentUser()`
- Store additional user info in your `users` table
- Use Supabase row-level security for data protection


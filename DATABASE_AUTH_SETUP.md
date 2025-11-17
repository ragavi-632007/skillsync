# Supabase Database Authentication Setup

Your SkillSync app now uses **Supabase email/password authentication** with database integration.

## How It Works

1. **Sign Up**: New users create an account with email and password
2. **Sign In**: Existing users log in with their credentials
3. **Database**: User data is stored in your Supabase `users` table
4. **Sessions**: Supabase automatically manages user sessions

## Features Enabled

✅ Email/Password Authentication (via Supabase Auth)
✅ Sign Up / Sign In Toggle
✅ Error Handling
✅ Password Protection
✅ Database Integration Ready

## What You Need to Do

### Step 1: Create the `users` Table in Supabase

Go to your Supabase Dashboard and create a table with these columns:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  country VARCHAR,
  profile_picture VARCHAR,
  skills TEXT[],
  bio TEXT,
  about_me TEXT,
  following UUID[],
  followers UUID[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Or manually in Supabase Dashboard:
1. Go to **SQL Editor**
2. Paste the SQL above
3. Click **Run**

### Step 2: Configure Row Level Security (RLS)

1. Go to **Authentication** > **Policies**
2. Create policies so users can only read/write their own data
3. Example policy for users to see all users but only edit themselves:

```sql
-- Allow users to see all users
CREATE POLICY "Users can view all users" ON users
FOR SELECT USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);
```

### Step 3: Test the Login

1. Run `npm run dev`
2. Navigate to the login page
3. Click "Create Account" and sign up with an email and password
4. You should be authenticated and redirected to the dashboard
5. Try signing out and signing back in

## File Changes

- **LoginPage.tsx**: Now has email/password form with sign-up toggle
- **supabaseService.ts**: Uses `signIn()` and `signUp()` for authentication
- **Removed**: Google OAuth functionality (can be added back later)

## Testing Users

After setup, you can create test users:
- Email: `test@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `jane123`

## Next Steps

1. **Link Auth with Database**: When users sign up, create a corresponding record in the `users` table
2. **Additional Fields**: Update your `User` interface in `types.ts` to match database schema
3. **User Profiles**: Use `getCurrentUser()` to get authenticated user info

## Troubleshooting

**"User already exists"**
- The email is already registered. Try a different email.

**"Invalid email or password"**
- Check your credentials are correct
- Ensure the email has been confirmed (check email for confirmation link)

**Users not appearing in database**
- Create a public policy that allows inserts on signup
- Supabase automatically creates auth users, but you need to manually sync with your `users` table


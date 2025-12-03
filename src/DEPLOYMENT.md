# ISD Car Reservation - Deployment Guide

## ⚠️ Important: This App Requires Backend Services

This application uses **Supabase** for database, authentication, and storage. It cannot run as a static site on GitHub Pages without additional configuration.

## Recommended Deployment Options

### Option 1: Figma Make Hosting (Simplest)
This app is already hosted on Figma Make with all services configured.
- ✅ Supabase backend pre-configured
- ✅ Asset hosting included
- ✅ No additional setup needed
- **Just share your Figma Make preview URL!**

### Option 2: Deploy to Vercel/Netlify (Custom Domain)

If you need a custom domain, deploy to Vercel or Netlify:

#### A. Create Your Own Supabase Project

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Note these values from Project Settings → API:
   - `Project URL` (SUPABASE_URL)
   - `anon/public key` (SUPABASE_ANON_KEY)
   - `service_role key` (SUPABASE_SERVICE_ROLE_KEY)

#### B. Set Up Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users_3f59598d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings_3f59598d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_3f59598d(id),
  employee_name TEXT NOT NULL,
  employee_email TEXT NOT NULL,
  department TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  passengers INTEGER NOT NULL,
  vehicle_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  special_requirements TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles_3f59598d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  license_plate TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

-- KV Store table
CREATE TABLE kv_store_3f59598d (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users_3f59598d ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings_3f59598d ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles_3f59598d ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_store_3f59598d ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for service role)
CREATE POLICY "Enable all for service role" ON users_3f59598d FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON bookings_3f59598d FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON vehicles_3f59598d FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON kv_store_3f59598d FOR ALL USING (true);
```

#### C. Deploy Edge Functions

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
3. Deploy functions: `supabase functions deploy make-server-3f59598d --project-ref YOUR_PROJECT_REF`

#### D. Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
5. Deploy!

#### E. Deploy Frontend to Netlify

1. Push your code to GitHub
2. Go to https://netlify.com
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
5. Deploy!

## Why GitHub Pages Doesn't Work

GitHub Pages only serves static files and cannot:
- Run server-side code (Supabase Edge Functions)
- Inject environment variables at build time
- Handle API routes
- Manage authentication sessions properly

## Need Help?

If you're getting a blank page:
1. ✅ Check browser console for errors (F12)
2. ✅ Verify Supabase environment variables are set
3. ✅ Ensure Edge Functions are deployed
4. ✅ Check Supabase database tables exist
5. ✅ Verify CORS settings in Supabase

## Quick Start (Development)

To run locally:

1. Clone the repository
2. Copy environment variables to `.env.local`:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## Test Accounts

Once deployed, the app auto-creates these test accounts:

- **Admin**: admin@school.edu / password123
- **Employee**: employee@school.edu / password123
- **Driver**: driver@school.edu / password123

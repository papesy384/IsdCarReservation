# ISD Car Reservation

A modern, professional vehicle booking system for schools with admin dashboard, employee booking interface, and driver management.

## ⚠️ IMPORTANT: GitHub Pages is Blank (This is Normal!)

**Your code is perfect!** GitHub Pages shows a blank page because this is a **full-stack application** that requires:
- ✅ Database (Supabase PostgreSQL)
- ✅ Backend API (Edge Functions)  
- ✅ Authentication System
- ✅ Environment Variables

**GitHub Pages can only host simple HTML/CSS/JS** - it cannot run backend services.

---

## 🚀 Live Demo

**[🔗 View Live Application](https://tcdrkhfd0dr3nv1ps73ge6.figma-make.dev)**

> **This is the working version!** The app is fully functional on Figma Make's hosting platform.

**📚 Quick Reference:**
- **[LIVE_URLS.md](./LIVE_URLS.md)** - All URLs, test accounts, and quick start
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - Testing checklist (200+ tests)

### Test Accounts
Try the app with these demo accounts:
- **Admin**: `admin@school.edu` / `password123`
- **Employee**: `employee@school.edu` / `password123`
- **Driver**: `driver@school.edu` / `password123`

---

## 📦 How to Share Your App

### Option 1: Share Figma Make URL (Recommended)
Your app is already deployed and working! Just share your Figma Make preview URL:
```
https://[your-project-id].figma-make.dev
```

### Option 2: Deploy to Vercel/Netlify
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions on deploying to production hosting.

## ✨ Features

### Admin Dashboard
- 📊 Reports & Analytics with interactive charts
- ✅ Approve/Deny bookings instantly
- 🚗 Vehicle management (CRUD operations)
- 👥 User management
- 📈 Real-time statistics

### Employee Portal
- 📝 Book vehicles with validation
- 📅 View booking history
- ✏️ Edit/Cancel bookings
- 🔔 Status notifications

### Driver Interface
- 🗺️ Map-centric design
- 📋 Today's assignments
- ✓ Complete trip functionality
- 📱 Mobile-optimized

## 🎨 Design System

- **Branding**: Gold (#FFD700) & Black
- **UI Kit**: Untitled UI Components
- **Design**: High-contrast, professional aesthetic
- **Responsive**: Mobile-first approach

## 🔐 Authentication

Auto-created test accounts:
- **Admin**: admin@school.edu / password123
- **Employee**: employee@school.edu / password123
- **Driver**: driver@school.edu / password123

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Untitled UI Kit)
- **Backend**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## 📱 Features Overview

### Booking Flow
1. Employee fills out booking form
2. Admin receives in "Pending Approvals"
3. Admin approves/denies with one click
4. Employee sees status in "My Bookings"
5. Driver sees assignment in Driver Interface

### Data Persistence
- All data stored in Supabase PostgreSQL
- Real-time updates across users
- Auto-seeding on first load
- Persistent authentication sessions

## 🌍 Internationalization

Full bilingual support:
- 🇬🇧 English (EN)
- 🇫🇷 French (FR)

Language switcher in navigation bar.

## 📊 Reports Dashboard

- **Total Bookings**: Overview statistics
- **Status Breakdown**: Pending, Approved, Denied, Cancelled
- **Department Analytics**: Pie chart of bookings by department
- **Vehicle Usage**: Bar chart of vehicle type distribution
- **CSV Export**: Download full booking reports

## 🔧 Local Development

This is a Figma Make project. To make changes:

1. Open in Figma Make
2. Edit components in the file browser
3. Preview updates in real-time
4. Changes auto-save

## 📝 Project Structure

```
/
├── components/
│   ├── AdminDashboard.tsx      # Admin main view
│   ├── BookingForm.tsx         # Employee booking form
│   ├── DriverInterface.tsx     # Driver mobile view
│   ├── MyBookings.tsx          # Employee bookings list
│   ├── Navigation.tsx          # Main navigation
│   ├── LandingPage.tsx         # Public landing page
│   ├── Login.tsx               # Login page
│   ├── Signup.tsx              # Signup page
│   └── admin/
│       ├── ApprovalsTab.tsx    # Pending approvals
│       ├── ReportsTab.tsx      # Analytics & reports
│       ├── VehiclesTab.tsx     # Vehicle management
│       └── UsersTab.tsx        # User management
├── utils/
│   ├── api.ts                  # API client
│   ├── seedData.ts             # Database seeding
│   └── supabase/
│       └── info.tsx            # Supabase config
├── supabase/functions/server/
│   ├── index.tsx               # Edge Functions API
│   └── kv_store.tsx            # KV storage utility
└── App.tsx                     # Main app component
```

## 🐛 Bug Fixes Completed

### P0 Critical Bugs ✅
- Authentication with auto-created test accounts
- Booking workflow with proper data flow
- Admin approval/denial persistence
- Cancelled booking disappearance

### P1 Core UX ✅
- Newest bookings first (sorted by creation date)
- Immediate approve/deny actions (no "View Details")
- Date validation in booking form
- Admin refresh functionality
- Reports dashboard with real analytics

## 🎯 Key Improvements

1. **Removed "View Details"** - Direct Approve/Deny actions
2. **Fixed Sorting** - New bookings appear at top
3. **Added Reports** - Full analytics dashboard with charts
4. **CSV Export** - Download booking reports
5. **Real-time Updates** - Instant status changes
6. **Mobile Optimization** - Driver interface is mobile-first

## 📞 Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 License

Built with Figma Make - A Figma web application builder
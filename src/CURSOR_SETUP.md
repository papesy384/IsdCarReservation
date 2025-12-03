# 🚀 Setting Up ISD Car Reservation in Cursor AI

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Cursor AI** - [Download here](https://cursor.sh/)
- **Supabase Account** - Already set up ✅

---

## 📥 Step 1: Download & Open Project

### Option A: From Figma Make
1. Click the **Download/Export** button in Figma Make
2. Extract the ZIP file to your projects folder
3. Open **Cursor AI**
4. `File` → `Open Folder` → Select the extracted folder

### Option B: Clone from GitHub (if you've pushed it)
```bash
git clone https://github.com/yourusername/isd-car-reservation.git
cd isd-car-reservation
```

---

## 📦 Step 2: Install Dependencies

Open the terminal in Cursor AI (`Ctrl/Cmd + ~`) and run:

```bash
npm install
```

**Alternative package managers:**
```bash
# Using Yarn
yarn install

# Using pnpm
pnpm install
```

---

## 🔑 Step 3: Environment Variables

Your Supabase project is already configured in Figma Make:
- **Project ID:** `syxniswirynimbokvpvq`
- **Anon Key:** Already embedded in the code

The app is **ready to work** with your existing Supabase backend! No additional configuration needed.

---

## 🎯 Step 4: Run the Development Server

```bash
npm run dev
```

The app will open at: `http://localhost:5173`

---

## 🧪 Step 5: Test Login

Use these test accounts:

### Admin Account
- **Email:** `admin@school.edu`
- **Password:** `password123`

### Employee Account
- **Email:** `employee@school.edu`
- **Password:** `password123`

### Driver Account
- **Email:** `driver@school.edu`
- **Password:** `password123`

**Or click the quick login buttons on the signin page!** ✨

---

## 🏗️ Project Structure

```
isd-car-reservation/
├── components/           # React components
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   ├── Login.tsx        # Sign-in page (landing)
│   ├── Signup.tsx       # Registration page
│   ├── AdminDashboard.tsx
│   ├── BookingForm.tsx
│   ├── DriverInterface.tsx
│   ├── MyBookings.tsx
│   └── Navigation.tsx
├── utils/
│   ├── api.ts           # API calls to Supabase
│   ├── seedData.ts      # Database seeding
│   └── supabase/        # Supabase configuration
├── supabase/functions/  # Backend Edge Functions
│   └── server/          # Hono web server
├── styles/
│   └── globals.css      # Global styles + Tailwind
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

---

## 🎨 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Custom Design System
- **UI Components:** Custom components (Gold & Black theme)
- **Backend:** Supabase (PostgreSQL + Edge Functions + Auth)
- **Server:** Hono.js (running on Supabase Edge Functions)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** Leaflet (for Driver Interface)

---

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

---

## 🌐 Backend API Endpoints

All backend endpoints are available at:
```
https://syxniswirynimbokvpvq.supabase.co/functions/v1/make-server-3f59598d
```

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Sign in (handled by Supabase client)
- `GET /auth/session` - Get current user
- `POST /auth/logout` - Sign out

### Bookings
- `GET /bookings` - Get all bookings
- `GET /bookings/user/:userId` - Get user's bookings
- `GET /bookings/pending` - Get pending bookings
- `POST /bookings` - Create booking
- `PATCH /bookings/:id/status` - Approve/Deny
- `DELETE /bookings/:id` - Cancel booking

### Vehicles
- `GET /vehicles` - Get all vehicles
- `POST /vehicles` - Create vehicle
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

### Users
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Driver
- `GET /driver/trips` - Get today's trips
- `PATCH /driver/trips/:id` - Update trip status

---

## 🎯 Key Features

### ✅ Completed Features
- **Beautiful Sign-In Page** (Gold & Black branding)
- **Role-Based Access Control** (Admin, Employee, Driver)
- **Admin Dashboard** with CRUD operations
- **Booking System** with approval workflow
- **My Bookings** page with cancel/edit
- **Driver Interface** with map and trip management
- **Reports Dashboard** with charts and CSV export
- **EN/FR Language Switching**
- **Real-Time Updates** via Supabase
- **Mobile-First Design** with responsive layouts
- **Auto-Seeding Database** on first load

### 🔐 Authentication
- Persistent sessions with Supabase Auth
- Auto token refresh
- Role-based routing
- Social login support (Google, GitHub, etc.)

---

## 🚀 Making Changes in Cursor AI

### Use Cursor's AI Features:
1. **Cmd/Ctrl + K** - AI inline edit
2. **Cmd/Ctrl + L** - AI chat
3. **Ask Cursor:** "Explain this component" or "Add a feature to..."

### Best Practices:
- ✅ Keep Gold (#FFD700) and Black color scheme
- ✅ Maintain responsive design
- ✅ Follow existing component patterns
- ✅ Test all three user roles (Admin, Employee, Driver)
- ✅ Check both EN and FR translations

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Supabase Connection Issues
- Check if Supabase project is active in dashboard
- Verify API keys in `/utils/supabase/info.tsx`
- Check browser console for error messages

### Database Not Seeded
- Clear browser localStorage
- Refresh the page
- Check console for "Initializing database..." message

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Useful Resources

- **Supabase Dashboard:** https://app.supabase.com/project/syxniswirynimbokvpvq
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons
- **Recharts Docs:** https://recharts.org/
- **Hono Docs:** https://hono.dev/

---

## 🎨 Design System

### Colors
- **Primary Gold:** `#FFD700` (Lightning Yellow)
- **Background:** `#000000` (Black)
- **Text Light:** `#FFFFFF` (White)
- **Text Dark:** `#000000` (Black)
- **Accent Orange:** `#FFA500`
- **Gray Scale:** `#111111`, `#1F1F1F`, `#333333`, etc.

### Typography
- **Font Family:** System fonts (defined in globals.css)
- **Headings:** Bold, White or Gold
- **Body:** Regular, Gray-400

---

## 🤝 Contributing

When making changes:
1. Test all user roles
2. Check responsive design (mobile + desktop)
3. Verify EN/FR translations
4. Test in both light and dark scenarios
5. Keep the Gold & Black branding consistent

---

## 📞 Support

- **GitHub Issues:** Report bugs or request features
- **Supabase Support:** https://supabase.com/support
- **Cursor AI Discord:** https://discord.gg/cursor

---

## ✨ Happy Coding in Cursor AI! ✨

Your app is fully configured and ready to go. Just run `npm run dev` and start building! 🚀

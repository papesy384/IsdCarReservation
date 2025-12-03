# 🚗 ISD Car Reservation System

<div align="center">

![ISD Car Reservation](https://img.shields.io/badge/ISD-Car%20Reservation-FFD700?style=for-the-badge&logo=car&logoColor=black)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Professional Vehicle Booking System with Gold & Black Branding**

[Live Demo](#) • [Features](#-features) • [Setup](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Design System](#-design-system)
- [Contributing](#-contributing)

---

## 🎯 Overview

**ISD Car Reservation** is a comprehensive, enterprise-grade vehicle booking system built with modern web technologies. Featuring a stunning Gold and Black design, role-based access control, real-time updates, and advanced analytics.

### Why ISD Car Reservation?

- ✅ **Beautiful UI/UX** - Premium design with animated backgrounds and glassmorphism
- ✅ **Role-Based Access** - Separate interfaces for Admins, Employees, and Drivers
- ✅ **Real-Time Updates** - Instant notifications and status changes via Supabase
- ✅ **Mobile-First** - Fully responsive design for all devices
- ✅ **Bilingual** - EN/FR language support
- ✅ **Advanced Analytics** - Reports dashboard with charts and CSV export

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Beautiful Sign-In Page** with animated background
- **Social Login Support** (Google, GitHub)
- **Persistent Sessions** with auto token refresh
- **Password Visibility Toggle**
- **Quick Login Buttons** for testing (Admin/Employee/Driver)
- **Role-Based Auto-Routing**

### 👨‍💼 Admin Dashboard
- **Vehicle Management** - CRUD operations for fleet
- **User Management** - Create and manage accounts
- **Booking Approvals** - Instant approve/deny with persistence
- **Reports & Analytics** - Interactive charts and CSV export
- **Real-Time Data** - Live updates without refresh

### 📝 Employee Portal
- **Booking Form** with validation
- **Conditional Logic** - Dynamic form fields
- **My Bookings Page** - View, edit, cancel reservations
- **Status Tracking** - Pending, Approved, Denied, Completed
- **Real-Time Notifications**

### 🚗 Driver Interface
- **Map-Centric Design** using Leaflet
- **Today's Trips** overview
- **Trip Status Updates** - Upcoming, In-Progress, Completed
- **Sequential Workflow** for efficient route management
- **Mobile-Optimized** for on-the-go use

### 📊 Reports Dashboard
- **Booking Statistics** with interactive charts
- **Vehicle Utilization** analysis
- **Department Breakdown**
- **Date Range Filtering**
- **CSV Export** for all data
- **Real Data Visualization** using Recharts

### 🌐 Internationalization
- **EN/FR Language Toggle** in navigation
- **Complete Translations** across all components
- **Language Persistence** in session

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool & dev server
- **Tailwind CSS 4.0** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Leaflet** - Interactive maps
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Edge Functions (Hono.js server)
  - Authentication & Authorization
  - Real-time subscriptions
- **Hono.js** - Web framework for Edge Functions

### Design System
- **Custom Components** with Gold (#FFD700) & Black theme
- **Glassmorphism** effects
- **Animated Backgrounds** with gradient orbs
- **High Contrast** for accessibility

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Cursor AI ([Download](https://cursor.sh/))
- Supabase account (Already configured ✅)

### Installation

1. **Open in Cursor AI**
   ```bash
   # If you have the ZIP from Figma Make
   # Extract and open the folder in Cursor AI
   
   # Or clone from GitHub
   git clone https://github.com/yourusername/isd-car-reservation.git
   cd isd-car-reservation
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Use test accounts (see [Usage](#-usage))

---

## 📖 Usage

### Test Accounts

The app comes with pre-configured test accounts:

#### 👨‍💼 Admin Account
```
Email: admin@school.edu
Password: password123
```
**Access:** Full dashboard, vehicle/user management, booking approvals, reports

#### 👨‍💻 Employee Account
```
Email: employee@school.edu
Password: password123
```
**Access:** Booking form, my bookings, status tracking

#### 🚗 Driver Account
```
Email: driver@school.edu
Password: password123
```
**Access:** Driver interface, trip management, map view

**💡 Tip:** Click the quick login buttons on the sign-in page for instant access!

---

## 📁 Project Structure

```
isd-car-reservation/
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── Login.tsx                # Sign-in page (landing)
│   ├── Signup.tsx               # Registration page
│   ├── AdminDashboard.tsx       # Admin interface
│   ├── BookingForm.tsx          # Employee booking form
│   ├── DriverInterface.tsx      # Driver map interface
│   ├── MyBookings.tsx           # User bookings page
│   ├── Reports.tsx              # Analytics dashboard
│   └── Navigation.tsx           # App navigation
├── utils/
│   ├── api.ts                   # API client
│   ├── seedData.ts              # Database seeding
│   └── supabase/
│       └── info.tsx             # Supabase config
├── supabase/functions/
│   └── server/
│       ├── index.tsx            # Hono server
│       └── kv_store.tsx         # Key-value store
├── styles/
│   └── globals.css              # Global styles + Tailwind
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
└── package.json                 # Dependencies
```

---

## 🔌 API Documentation

### Base URL
```
https://syxniswirynimbokvpvq.supabase.co/functions/v1/make-server-3f59598d
```

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "department": "IT",
  "role": "employee"
}
```

#### Get Session
```http
GET /auth/session
Authorization: Bearer {access_token}
```

### Booking Endpoints

#### Get All Bookings
```http
GET /bookings
Authorization: Bearer {anon_key}
```

#### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "userId": "uuid",
  "vehicleId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "purpose": "Business trip",
  "destination": "New York"
}
```

#### Update Booking Status
```http
PATCH /bookings/{id}/status
Content-Type: application/json

{
  "status": "approved" | "denied"
}
```

### Vehicle Endpoints

#### Get All Vehicles
```http
GET /vehicles
Authorization: Bearer {anon_key}
```

#### Create Vehicle
```http
POST /vehicles
Content-Type: application/json

{
  "name": "Toyota Camry",
  "type": "Sedan",
  "licensePlate": "ABC-1234",
  "capacity": 5,
  "status": "available"
}
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--gold: #FFD700;          /* Lightning Yellow */
--black: #000000;         /* Deep Black */
--white: #FFFFFF;         /* Pure White */

/* Accent */
--orange: #FFA500;        /* Accent Orange */

/* Grayscale */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-400: #9CA3AF;
--gray-900: #111827;
```

### Typography

```css
/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  color: #FFFFFF or #FFD700;
}

/* Body Text */
body {
  font-family: system-ui, -apple-system, sans-serif;
  color: #9CA3AF;
}
```

### Components

All components follow a consistent pattern:
- **Gold accents** for primary actions
- **Black backgrounds** for cards and sections
- **Glassmorphism** with backdrop blur
- **Hover states** with smooth transitions
- **Focus states** with gold borders

---

## 🧪 Testing

### Manual Testing Workflow

1. **Sign In** with each role (Admin, Employee, Driver)
2. **Test CRUD operations** in Admin dashboard
3. **Create bookings** as Employee
4. **Approve/Deny** bookings as Admin
5. **Update trip status** as Driver
6. **Switch languages** (EN ↔ FR)
7. **Test on mobile** devices

### Key Areas to Test

- ✅ Authentication flows
- ✅ Role-based routing
- ✅ Real-time updates
- ✅ Form validation
- ✅ CRUD operations
- ✅ Language switching
- ✅ Responsive design

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- Follow existing patterns
- Maintain Gold & Black branding
- Keep components responsive
- Add translations for new text
- Test all user roles

---

## 📝 License

MIT License - feel free to use this project for your own purposes!

---

## 🙏 Acknowledgments

- **Untitled UI Kit** - Component design inspiration
- **Supabase** - Amazing backend infrastructure
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **SimplyBook.me** - UX/UI reference

---

## 📞 Support

- **Issues:** [GitHub Issues](#)
- **Email:** support@isdcarreservation.com
- **Docs:** [Full Documentation](./CURSOR_SETUP.md)

---

<div align="center">

**Made with ❤️ and ☕ for ISD**

⭐ Star this repo if you find it helpful!

</div>

# School Transport Hub - Supabase Backend Integration

## Overview

This document explains the backend integration for the School Transport Hub application. The app now uses Supabase for persistent data storage, real-time updates, and secure data management.

## Architecture

```
Frontend (React) ←→ API Layer (/utils/api.ts) ←→ Supabase Edge Function (/supabase/functions/server/index.tsx) ←→ KV Store
```

## Backend Components

### 1. Server (`/supabase/functions/server/index.tsx`)

The Hono-based web server provides RESTful API endpoints for:

#### Bookings API
- `GET /bookings` - Fetch all bookings
- `GET /bookings/user/:userId` - Get bookings for a specific user
- `GET /bookings/pending` - Get pending approval requests
- `POST /bookings` - Create new booking
- `PATCH /bookings/:id/status` - Approve or deny booking
- `DELETE /bookings/:id` - Cancel booking

#### Vehicles API
- `GET /vehicles` - Fetch all vehicles
- `POST /vehicles` - Add new vehicle
- `PUT /vehicles/:id` - Update vehicle details
- `DELETE /vehicles/:id` - Remove vehicle

#### Users API
- `GET /users` - Fetch all users
- `POST /users` - Add new user
- `PUT /users/:id` - Update user details
- `DELETE /users/:id` - Remove user

#### Driver API
- `GET /driver/trips` - Get today's approved trips
- `PATCH /driver/trips/:id` - Update trip status (start/complete)

### 2. API Utilities (`/utils/api.ts`)

Clean, organized functions for frontend-backend communication:

```typescript
import { bookingAPI, vehicleAPI, userAPI, driverAPI } from '../utils/api';

// Example usage
const response = await bookingAPI.create(bookingData);
if (response.success) {
  // Handle success
}
```

### 3. React Hooks (`/hooks/useBackend.ts`)

Custom hooks for easy data fetching with loading states:

```typescript
import { useBookings, useVehicles, useUsers, useDriverTrips } from '../hooks/useBackend';

// In component
const { bookings, loading, error, refetch } = useBookings();
```

### 4. Seed Data (`/utils/seedData.ts`)

Initializes the database with sample data on first load:
- 4 vehicles (Sedan, SUV, Minibus, Bus)
- 5 users (Employees, Admin, Driver)
- 4 sample bookings (mix of pending and approved)

## Data Models

### Booking
```typescript
{
  id: string;              // booking:timestamp
  userId: string;          // user:timestamp
  employeeName: string;
  department: string;
  email: string;
  phone: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM
  destination: string;
  passengers: number;
  vehicleType: string;    // Sedan, SUV, Minibus, Bus
  purpose: string;
  otherPurpose: string;
  status: string;         // pending, approved, denied, cancelled
  tripStatus?: string;    // upcoming, in-progress, completed
  createdAt: string;
  updatedAt: string;
}
```

### Vehicle
```typescript
{
  id: string;             // vehicle:timestamp
  name: string;
  type: string;           // Sedan, SUV, Minibus, Bus
  capacity: number;
  plateNumber: string;
  status: string;         // available, in-use, maintenance
  createdAt: string;
  updatedAt: string;
}
```

### User
```typescript
{
  id: string;             // user:timestamp
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;           // employee, admin, driver
  createdAt: string;
  updatedAt: string;
}
```

## Connected Components

### ✅ ApprovalsTab
- Fetches pending bookings in real-time
- Approve/Deny actions update backend immediately
- Auto-refreshes after status changes

### ✅ VehiclesTab
- Full CRUD operations for vehicle management
- Live updates when vehicles are added/edited/deleted

### ✅ UsersTab
- Full CRUD operations for user management
- Supports Employee, Admin, and Driver roles

### ✅ BookingForm
- Creates new bookings via backend API
- Validates data before submission
- Shows confirmation on successful booking

### ✅ MyBookings
- Displays user's bookings from backend
- Cancel functionality updates status
- Edit capability for pending bookings

### ✅ DriverInterface
- Fetches today's approved trips
- Start/Complete trip updates backend
- Real-time trip status management

## Environment Variables

The following environment variables are pre-configured:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key for frontend
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for backend (protected)

## TODO: Future Enhancements

1. **User Authentication**
   - Implement Supabase Auth for login/logout
   - Replace hardcoded user IDs with authenticated user
   - Add role-based access control

2. **Real-time Updates**
   - Add Supabase Realtime subscriptions
   - Auto-refresh when data changes
   - Show notifications for new bookings

3. **Enhanced Booking Data**
   - Add pickup location field
   - Store vehicle assignments
   - Track driver assignments

4. **File Storage**
   - Upload trip documents/receipts
   - Store user profile photos
   - Backup/export functionality

5. **Analytics & Reporting**
   - Dashboard statistics
   - Usage reports
   - Vehicle utilization metrics

## Testing the Backend

### Health Check
```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-3f59598d/health
```

### Create Booking
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/make-server-3f59598d/bookings \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user:1",
    "employeeName": "Test User",
    "department": "IT",
    "email": "test@school.edu",
    "phone": "+1-555-0000",
    "date": "2025-11-20",
    "time": "10:00",
    "destination": "Test Location",
    "passengers": 5,
    "vehicleType": "SUV",
    "purpose": "Meeting"
  }'
```

## Troubleshooting

### Data Not Loading
1. Check browser console for errors
2. Verify Supabase credentials in environment variables
3. Check network tab for API response errors

### Database Not Seeding
1. Clear localStorage: `localStorage.removeItem('db_seeded')`
2. Refresh the page to re-trigger seeding

### API Errors
1. Check server logs in Supabase dashboard
2. Verify the API endpoint format
3. Ensure proper authorization headers

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the Supabase Edge Functions logs
3. Verify all environment variables are set correctly
4. Ensure the backend server is deployed and running

---

**Note:** This is a prototype system. For production use, implement proper authentication, authorization, data validation, and security measures.

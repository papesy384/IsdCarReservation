import { Hono } from 'npm:hono@4.6.14';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Auth helper
const getUserFromToken = async (token: string | null) => {
  if (!token) return null;
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error('Auth error:', error);
    return null;
  }
  return user;
};

// ==================== AUTHENTICATION ====================

// Sign up
app.post('/make-server-3f59598d/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, phone, department, role } = body;

    // Create Supabase Auth user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, department, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      
      // Handle specific error cases
      if (authError.message.includes('already been registered') || authError.status === 422) {
        return c.json({ 
          success: false, 
          error: 'An account with this email already exists. Please use a different email or try logging in.' 
        }, 409);
      }
      
      return c.json({ success: false, error: authError.message }, 400);
    }

    // Create user profile in KV store
    const userId = `user:${authData.user.id}`;
    const userProfile = {
      id: userId,
      authId: authData.user.id,
      name,
      email,
      phone,
      department,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(userId, userProfile);

    // Sign in to get access token
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !sessionData.session) {
      console.error('Error signing in after signup:', signInError);
      return c.json({ success: false, error: 'Account created but login failed' }, 400);
    }

    return c.json({
      success: true,
      accessToken: sessionData.session.access_token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ success: false, error: 'Failed to create account' }, 500);
  }
});

// Login
app.post('/make-server-3f59598d/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('Login error:', error);
      return c.json({ success: false, error: 'Invalid email or password' }, 401);
    }

    // Get user profile from KV store - try by authId first
    let userProfile = await kv.get(`user:${data.user.id}`);
    
    // If not found, search by email (for legacy accounts)
    if (!userProfile) {
      const allUsers = await kv.getByPrefix('user:');
      userProfile = allUsers.find((u: any) => u.email === email);
    }

    if (!userProfile) {
      console.error('User profile not found for:', email);
      return c.json({ success: false, error: 'User profile not found' }, 404);
    }

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ success: false, error: 'Failed to login' }, 500);
  }
});

// Get current session
app.get('/make-server-3f59598d/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ success: false, error: 'Invalid session' }, 401);
    }

    // Get user profile from KV store - try by authId first
    let userProfile = await kv.get(`user:${user.id}`);
    
    // If not found, search by email (for legacy accounts)
    if (!userProfile) {
      const allUsers = await kv.getByPrefix('user:');
      userProfile = allUsers.find((u: any) => u.email === user.email);
    }

    if (!userProfile) {
      return c.json({ success: false, error: 'User profile not found' }, 404);
    }

    return c.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return c.json({ success: false, error: 'Failed to get session' }, 500);
  }
});

// Logout
app.post('/make-server-3f59598d/auth/logout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: true, message: 'No active session' });
    }

    const supabase = getSupabaseClient();
    
    // Note: With client-side Supabase auth, logout is handled on the frontend
    // This endpoint is kept for backwards compatibility but is optional
    try {
      const { error } = await supabase.auth.admin.signOut(accessToken);
      
      if (error) {
        console.error('Admin signOut error:', error);
        // Don't fail if session is already gone
        if (error.message?.includes('session') || error.status === 400) {
          return c.json({ success: true, message: 'Session already cleared' });
        }
        return c.json({ success: false, error: 'Failed to logout' }, 500);
      }
    } catch (error: any) {
      // Handle AuthSessionMissingError gracefully
      if (error.name === 'AuthSessionMissingError' || error.message?.includes('session')) {
        return c.json({ success: true, message: 'Session already cleared' });
      }
      throw error;
    }

    return c.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return c.json({ success: false, error: 'Failed to logout' }, 500);
  }
});

// ==================== BOOKINGS ====================

// Get all bookings
app.get('/make-server-3f59598d/bookings', async (c) => {
  try {
    const bookings = await kv.getByPrefix('booking:');
    return c.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});

// Get bookings by user
app.get('/make-server-3f59598d/bookings/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const allBookings = await kv.getByPrefix('booking:');
    const userBookings = allBookings.filter((b: any) => b.userId === userId);
    return c.json({ success: true, data: userBookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return c.json({ success: false, error: 'Failed to fetch user bookings' }, 500);
  }
});

// Get pending bookings for approval
app.get('/make-server-3f59598d/bookings/pending', async (c) => {
  try {
    const allBookings = await kv.getByPrefix('booking:');
    console.log('All bookings from KV store:', allBookings);
    const pendingBookings = allBookings.filter((b: any) => b.status === 'pending');
    console.log('Filtered pending bookings:', pendingBookings);
    return c.json({ success: true, data: pendingBookings });
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    return c.json({ success: false, error: 'Failed to fetch pending bookings' }, 500);
  }
});

// Create booking
app.post('/make-server-3f59598d/bookings', async (c) => {
  try {
    const body = await c.req.json();
    const bookingId = `booking:${Date.now()}`;
    
    const booking = {
      id: bookingId,
      userId: body.userId,
      employeeName: body.employeeName,
      department: body.department,
      email: body.email,
      phone: body.phone,
      date: body.date,
      time: body.time,
      destination: body.destination,
      passengers: body.passengers,
      vehicleType: body.vehicleType,
      purpose: body.purpose,
      otherPurpose: body.otherPurpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(bookingId, booking);
    return c.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ success: false, error: 'Failed to create booking' }, 500);
  }
});

// Update booking status (approve/deny)
app.patch('/make-server-3f59598d/bookings/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const booking = await kv.get(`booking:${id}`);
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    
    const updatedBooking = {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`booking:${id}`, updatedBooking);
    return c.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return c.json({ success: false, error: 'Failed to update booking status' }, 500);
  }
});

// Cancel booking
app.delete('/make-server-3f59598d/bookings/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const booking = await kv.get(`booking:${id}`);
    
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    
    const updatedBooking = {
      ...booking,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`booking:${id}`, updatedBooking);
    return c.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return c.json({ success: false, error: 'Failed to cancel booking' }, 500);
  }
});

// ==================== VEHICLES ====================

// Get all vehicles
app.get('/make-server-3f59598d/vehicles', async (c) => {
  try {
    const vehicles = await kv.getByPrefix('vehicle:');
    return c.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return c.json({ success: false, error: 'Failed to fetch vehicles' }, 500);
  }
});

// Create vehicle
app.post('/make-server-3f59598d/vehicles', async (c) => {
  try {
    const body = await c.req.json();
    const vehicleId = `vehicle:${Date.now()}`;
    
    const vehicle = {
      id: vehicleId,
      name: body.name,
      type: body.type,
      capacity: body.capacity,
      plateNumber: body.plateNumber,
      status: body.status || 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(vehicleId, vehicle);
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return c.json({ success: false, error: 'Failed to create vehicle' }, 500);
  }
});

// Update vehicle
app.put('/make-server-3f59598d/vehicles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const vehicle = await kv.get(`vehicle:${id}`);
    if (!vehicle) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404);
    }
    
    const updatedVehicle = {
      ...vehicle,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`vehicle:${id}`, updatedVehicle);
    return c.json({ success: true, data: updatedVehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return c.json({ success: false, error: 'Failed to update vehicle' }, 500);
  }
});

// Delete vehicle
app.delete('/make-server-3f59598d/vehicles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`vehicle:${id}`);
    return c.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return c.json({ success: false, error: 'Failed to delete vehicle' }, 500);
  }
});

// ==================== USERS ====================

// Get all users
app.get('/make-server-3f59598d/users', async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

// Create user
app.post('/make-server-3f59598d/users', async (c) => {
  try {
    const body = await c.req.json();
    const userId = `user:${Date.now()}`;
    
    const user = {
      id: userId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      department: body.department,
      role: body.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(userId, user);
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ success: false, error: 'Failed to create user' }, 500);
  }
});

// Update user
app.put('/make-server-3f59598d/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const user = await kv.get(`user:${id}`);
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    const updatedUser = {
      ...user,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`user:${id}`, updatedUser);
    return c.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: 'Failed to update user' }, 500);
  }
});

// Delete user
app.delete('/make-server-3f59598d/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`user:${id}`);
    return c.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: 'Failed to delete user' }, 500);
  }
});

// ==================== DRIVER TRIPS ====================

// Get trips for driver (today's trips)
app.get('/make-server-3f59598d/driver/trips', async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allBookings = await kv.getByPrefix('booking:');
    const todaysTrips = allBookings.filter((b: any) => 
      b.status === 'approved' && b.date === today
    );
    
    return c.json({ success: true, data: todaysTrips });
  } catch (error) {
    console.error('Error fetching driver trips:', error);
    return c.json({ success: false, error: 'Failed to fetch driver trips' }, 500);
  }
});

// Update trip status (start/complete)
app.patch('/make-server-3f59598d/driver/trips/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { tripStatus } = await c.req.json();
    
    const booking = await kv.get(`booking:${id}`);
    if (!booking) {
      return c.json({ success: false, error: 'Trip not found' }, 404);
    }
    
    const updatedBooking = {
      ...booking,
      tripStatus,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`booking:${id}`, updatedBooking);
    return c.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating trip status:', error);
    return c.json({ success: false, error: 'Failed to update trip status' }, 500);
  }
});

// Health check
app.get('/make-server-3f59598d/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== INITIALIZATION ====================

// Seed/Reset test accounts endpoint
app.post('/make-server-3f59598d/seed', async (c) => {
  try {
    console.log('Manual seed initiated...');
    const supabase = getSupabaseClient();

    const testAccounts = [
      {
        email: 'admin@school.edu',
        password: 'password123',
        name: 'Admin User',
        phone: '+1-555-0001',
        department: 'Administration',
        role: 'admin',
      },
      {
        email: 'employee@school.edu',
        password: 'password123',
        name: 'Employee User',
        phone: '+1-555-0002',
        department: 'Mathematics',
        role: 'employee',
      },
      {
        email: 'driver@school.edu',
        password: 'password123',
        name: 'Driver User',
        phone: '+1-555-0003',
        department: 'Transport',
        role: 'driver',
      },
    ];

    const results = [];

    for (const account of testAccounts) {
      try {
        // Try to create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          user_metadata: {
            name: account.name,
            phone: account.phone,
            department: account.department,
            role: account.role,
          },
          email_confirm: true,
        });

        let userId;
        let authId;

        if (authError) {
          if (authError.message.includes('already been registered')) {
            // User exists, get their ID by listing all users
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            if (!listError) {
              const existingUser = users.find((u: any) => u.email === account.email);
              if (existingUser) {
                authId = existingUser.id;
                userId = `user:${existingUser.id}`;
                results.push({ email: account.email, status: 'auth_exists', userId });
              }
            }
          } else {
            console.error(`Error creating auth account ${account.email}:`, authError);
            results.push({ email: account.email, status: 'error', error: authError.message });
            continue;
          }
        } else {
          authId = authData.user.id;
          userId = `user:${authData.user.id}`;
          results.push({ email: account.email, status: 'created', userId });
        }

        // Create or update user profile in KV store
        if (userId && authId) {
          const userProfile = {
            id: userId,
            authId: authId,
            name: account.name,
            email: account.email,
            phone: account.phone,
            department: account.department,
            role: account.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await kv.set(userId, userProfile);
          console.log(`✓ Profile synced for: ${account.email} -> ${userId}`);
        }
      } catch (error) {
        console.error(`Error processing account ${account.email}:`, error);
        results.push({ email: account.email, status: 'error', error: String(error) });
      }
    }

    return c.json({ 
      success: true, 
      message: 'Seed completed',
      results 
    });
  } catch (error) {
    console.error('Error during seed:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize test accounts on server start
async function initializeTestAccounts() {
  try {
    console.log('Checking for test accounts...');
    const supabase = getSupabaseClient();

    const testAccounts = [
      {
        email: 'admin@school.edu',
        password: 'password123',
        name: 'Admin User',
        phone: '+1-555-0001',
        department: 'Administration',
        role: 'admin',
      },
      {
        email: 'employee@school.edu',
        password: 'password123',
        name: 'Employee User',
        phone: '+1-555-0002',
        department: 'Mathematics',
        role: 'employee',
      },
      {
        email: 'driver@school.edu',
        password: 'password123',
        name: 'Driver User',
        phone: '+1-555-0003',
        department: 'Transport',
        role: 'driver',
      },
    ];

    for (const account of testAccounts) {
      try {
        // Check if user already exists in KV store by email
        const allUsers = await kv.getByPrefix('user:');
        const existingUser = allUsers.find((u: any) => u.email === account.email);
        
        if (existingUser) {
          console.log(`✓ Test account already exists: ${account.email}`);
          continue;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          user_metadata: {
            name: account.name,
            phone: account.phone,
            department: account.department,
            role: account.role,
          },
          email_confirm: true,
        });

        if (authError) {
          if (authError.message.includes('already been registered')) {
            console.log(`✓ Auth account already exists: ${account.email}`);
            // Still create KV profile if it doesn't exist
            const userId = `user:${account.email.split('@')[0]}`;
            const userProfile = {
              id: userId,
              authId: 'temp-' + Date.now(),
              name: account.name,
              email: account.email,
              phone: account.phone,
              department: account.department,
              role: account.role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await kv.set(userId, userProfile);
          } else {
            console.error(`Error creating auth account ${account.email}:`, authError);
          }
          continue;
        }

        // Create user profile in KV store
        const userId = `user:${authData.user.id}`;
        const userProfile = {
          id: userId,
          authId: authData.user.id,
          name: account.name,
          email: account.email,
          phone: account.phone,
          department: account.department,
          role: account.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await kv.set(userId, userProfile);
        console.log(`✓ Created test account: ${account.email}`);
      } catch (error) {
        console.error(`Error creating test account ${account.email}:`, error);
      }
    }

    console.log('Test accounts initialization complete!');
  } catch (error) {
    console.error('Error initializing test accounts:', error);
  }
}

// Initialize on server start
initializeTestAccounts();

// Start server
Deno.serve(app.fetch);
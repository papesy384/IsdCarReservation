import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3f59598d`;

// Create Supabase client for auth
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

const getHeaders = (accessToken?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken || publicAnonKey}`,
});

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ==================== AUTHENTICATION ====================

export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    department: string;
    role: string;
  }) => {
    // First create the account on the backend
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // If signup successful, sign in with Supabase client to persist session
    if (result.success && result.accessToken) {
      // Sign in to create a persistent session
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError && process.env.NODE_ENV === 'development') {
        console.error('Error creating session after signup:', authError);
        // Still return success since account was created
      }
    }
    
    return result;
  },

  login: async (email: string, password: string) => {
    // Use Supabase client to sign in (this will persist the session)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', authError);
      }
      return { success: false, error: authError?.message || 'Invalid email or password' };
    }

    // Fetch user profile from our backend
    const response = await fetch(`${API_BASE}/auth/session`, {
      headers: getHeaders(authData.session.access_token),
    });
    const userData = await response.json();

    if (!userData.success) {
      return { success: false, error: 'Failed to fetch user profile' };
    }

    return {
      success: true,
      accessToken: authData.session.access_token,
      user: userData.user,
    };
  },

  getSession: async (accessToken: string) => {
    const response = await fetch(`${API_BASE}/auth/session`, {
      headers: getHeaders(accessToken),
    });
    return response.json();
  },

  logout: async (accessToken: string) => {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(accessToken),
    });
    return response.json();
  },
};

// ==================== BOOKINGS ====================

export const bookingAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/bookings`, { headers });
    return response.json();
  },

  getByUser: async (userId: string) => {
    const response = await fetch(`${API_BASE}/bookings/user/${userId}`, { headers });
    return response.json();
  },

  getPending: async () => {
    const response = await fetch(`${API_BASE}/bookings/pending`, { headers });
    return response.json();
  },

  create: async (booking: any) => {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(booking),
    });
    return response.json();
  },

  updateStatus: async (id: string, status: 'approved' | 'denied') => {
    const response = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  cancel: async (id: string) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  },
};

// ==================== VEHICLES ====================

export const vehicleAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/vehicles`, { headers });
    return response.json();
  },

  create: async (vehicle: any) => {
    const response = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(vehicle),
    });
    return response.json();
  },

  update: async (id: string, vehicle: any) => {
    const response = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(vehicle),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  },
};

// ==================== USERS ====================

export const userAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/users`, { headers });
    return response.json();
  },

  create: async (user: any) => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    });
    return response.json();
  },

  update: async (id: string, user: any) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(user),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  },
};

// ==================== DRIVER ====================

export const driverAPI = {
  getTodaysTrips: async () => {
    const response = await fetch(`${API_BASE}/driver/trips`, { headers });
    return response.json();
  },

  updateTripStatus: async (id: string, tripStatus: 'upcoming' | 'in-progress' | 'completed') => {
    const response = await fetch(`${API_BASE}/driver/trips/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ tripStatus }),
    });
    return response.json();
  },
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async () => {
  const response = await fetch(`${API_BASE}/health`, { headers });
  return response.json();
};
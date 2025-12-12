import { useState, useEffect } from 'react';
import { bookingAPI, vehicleAPI, userAPI, driverAPI } from '../utils/api';

export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = userId 
        ? await bookingAPI.getByUser(userId)
        : await bookingAPI.getAll();
      
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch bookings');
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function usePendingBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getPending();
      
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch pending bookings');
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  return { bookings, loading, error, refetch: fetchPendingBookings };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAll();
      
      if (response.success) {
        setVehicles(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch vehicles');
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch users');
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}

export function useDriverTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await driverAPI.getTodaysTrips();
      
      if (response.success) {
        setTrips(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch trips');
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { trips, loading, error, refetch: fetchTrips };
}

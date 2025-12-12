import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingForm } from './components/BookingForm';
import { DriverInterface } from './components/DriverInterface';
import { MyBookings } from './components/MyBookings';
import { Navigation } from './components/Navigation';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Toaster } from './components/ui/sonner';
import { seedDatabase } from './utils/seedData';
import { authAPI, supabase } from './utils/api';

export type UserRole = 'guest' | 'employee' | 'admin' | 'driver';
export type Language = 'en' | 'fr';

interface User {
  id: string;
  authId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard' | 'booking' | 'driver' | 'my-bookings'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Initialize database with seed data on first load
  useEffect(() => {
    const initDB = async () => {
      const hasSeeded = localStorage.getItem('db_seeded');
      if (!hasSeeded) {
        console.log('Initializing database...');
        await seedDatabase();
        localStorage.setItem('db_seeded', 'true');
      }
      setIsInitialized(true);
    };
    initDB();
  }, []);

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    if (!isInitialized) return;

    const checkSession = async () => {
      try {
        // Get current session from Supabase (this also refreshes expired tokens)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsCheckingAuth(false);
          return;
        }

        if (session?.access_token) {
          // Fetch user profile from our backend
          const data = await authAPI.getSession(session.access_token);
          
          if (data.success && data.user) {
            setAccessToken(session.access_token);
            setUser(data.user);
            
            // Navigate to appropriate page based on role
            if (data.user.role === 'admin') {
              setCurrentPage('dashboard');
            } else if (data.user.role === 'employee') {
              setCurrentPage('booking');
            } else if (data.user.role === 'driver') {
              setCurrentPage('driver');
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
      
      setIsCheckingAuth(false);
    };

    checkSession();

    // Listen for auth state changes (handles token refresh automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccessToken(null);
        setCurrentPage('login');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed automatically');
        setAccessToken(session.access_token);
      } else if (session) {
        // Update token if session exists
        setAccessToken(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  const handleAuthentication = async (token: string) => {
    try {
      const data = await authAPI.getSession(token);
      
      if (data.success && data.user) {
        setAccessToken(token);
        setUser(data.user);
        localStorage.setItem('access_token', token);
        
        // Navigate to appropriate page based on role
        if (data.user.role === 'admin') {
          setCurrentPage('dashboard');
        } else if (data.user.role === 'employee') {
          setCurrentPage('booking');
        } else if (data.user.role === 'driver') {
          setCurrentPage('driver');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase (this will trigger the onAuthStateChange listener)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clean up local state
    setUser(null);
    setAccessToken(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login
            onLogin={handleAuthentication}
            onSwitchToSignup={() => setCurrentPage('signup')}
            language={language}
            setLanguage={setLanguage}
          />
        );
      case 'signup':
        return (
          <Signup
            onSignup={handleAuthentication}
            onSwitchToLogin={() => setCurrentPage('login')}
            language={language}
          />
        );
      case 'dashboard':
        return <AdminDashboard language={language} />;
      case 'booking':
        return <BookingForm language={language} user={user} />;
      case 'driver':
        return <DriverInterface language={language} />;
      case 'my-bookings':
        return <MyBookings language={language} userId={user?.id} />;
      default:
        return (
          <Login
            onLogin={handleAuthentication}
            onSwitchToSignup={() => setCurrentPage('signup')}
            language={language}
          />
        );
    }
  };

  if (!isInitialized || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent"></div>
          <p className="mt-4 text-white">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {user && currentPage !== 'login' && currentPage !== 'signup' && (
          <Navigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            userRole={user.role}
            userName={user.name}
            language={language}
            setLanguage={setLanguage}
            onLogout={handleLogout}
          />
        )}
        {renderPage()}
      </div>
      <Toaster />
    </div>
  );
}
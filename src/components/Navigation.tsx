import React from 'react';
import { Menu, LogOut, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { UserRole, Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import schoolLogo from 'figma:asset/4bd846bf67c44fcbc0a58285b6a6f879210a7b3c.png';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: 'dashboard' | 'booking' | 'driver' | 'my-bookings') => void;
  userRole: UserRole;
  userName?: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  onLogout: () => void;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    newBooking: 'New Booking',
    myBookings: 'My Bookings',
    driverView: 'Driver View',
    logout: 'Logout',
  },
  fr: {
    dashboard: 'Tableau de bord',
    newBooking: 'Nouvelle réservation',
    myBookings: 'Mes réservations',
    driverView: 'Vue conducteur',
    logout: 'Déconnexion',
  },
};

export function Navigation({ currentPage, setCurrentPage, userRole, userName, language, setLanguage, onLogout }: NavigationProps) {
  const t = translations[language];

  const navItems = [];
  
  if (userRole === 'admin') {
    navItems.push({ id: 'dashboard', label: t.dashboard });
    navItems.push({ id: 'booking', label: t.newBooking });
    navItems.push({ id: 'my-bookings', label: t.myBookings });
  } else if (userRole === 'employee') {
    navItems.push({ id: 'booking', label: t.newBooking });
    navItems.push({ id: 'my-bookings', label: t.myBookings });
  } else if (userRole === 'driver') {
    navItems.push({ id: 'driver', label: t.driverView });
  }

  const NavContent = () => (
    <div className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id as any)}
          className={`px-4 py-3 rounded-lg text-left transition-colors ${
            currentPage === item.id
              ? 'bg-[#FFD700] text-black'
              : 'text-white hover:bg-white/10'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="bg-black/80 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-black/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <ImageWithFallback src={schoolLogo} alt="ISD Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">ISD Car Reservation</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#FFD700] text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Logout */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <Globe className="h-5 w-5" />
            </button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-l border-white/10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center">
                      <ImageWithFallback src={schoolLogo} alt="ISD Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span>ISD Car Reservation</span>
                  </div>
                  <NavContent />
                  <div className="mt-auto">
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.logout}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
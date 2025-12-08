import { MapPin, Navigation, CheckCircle, Clock, Phone, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { StatusBadge } from './ui/status-badge';
import { toast } from 'sonner@2.0.3';
import { Language } from '../App';
import { useDriverTrips } from '../hooks/useBackend';
import { driverAPI } from '../utils/api';
import { EmptyState } from './ui/empty-state';
import { BookingListSkeleton } from './ui/loading-skeletons';

interface Trip {
  id: string;
  requestor: string;
  phone: string;
  pickupLocation: string;
  destination: string;
  scheduledTime: string;
  passengers: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  order: number;
}

const translations = {
  en: {
    title: 'Driver Dashboard',
    todayTrips: 'Today\'s Trips',
    upcoming: 'Upcoming',
    inProgress: 'In Progress',
    completed: 'Completed',
    pickup: 'Pickup',
    dropoff: 'Drop-off',
    scheduledTime: 'Scheduled Time',
    passengers: 'Passengers',
    requestedBy: 'Requested by',
    startTrip: 'Start Trip',
    completeTrip: 'Complete Trip',
    navigate: 'Navigate',
    call: 'Call',
    tripStarted: 'Trip started',
    tripCompleted: 'Trip completed successfully',
    noTrips: 'No trips scheduled',
    emptyTitle: 'No trips scheduled today',
    emptyDescription: 'When trips are assigned to you, they will appear here. Check back later or contact dispatch.',
    mapView: 'Map View',
  },
  fr: {
    title: 'Tableau de bord du conducteur',
    todayTrips: 'Voyages d\'aujourd\'hui',
    upcoming: 'À venir',
    inProgress: 'En cours',
    completed: 'Terminé',
    pickup: 'Ramassage',
    dropoff: 'Dépose',
    scheduledTime: 'Heure prévue',
    passengers: 'Passagers',
    requestedBy: 'Demandé par',
    startTrip: 'Commencer le voyage',
    completeTrip: 'Terminer le voyage',
    navigate: 'Naviguer',
    call: 'Appeler',
    tripStarted: 'Voyage commencé',
    tripCompleted: 'Voyage terminé avec succès',
    noTrips: 'Aucun voyage prévu',
    emptyTitle: 'Aucun voyage prévu aujourd\'hui',
    emptyDescription: 'Lorsque des voyages vous sont attribués, ils apparaîtront ici. Revenez plus tard ou contactez la répartition.',
    mapView: 'Vue de la carte',
  },
};

export function DriverInterface({ language }: { language: Language }) {
  const t = translations[language];
  const { trips, loading, refetch } = useDriverTrips();

  const handleStartTrip = async (id: string) => {
    const tripId = id.replace('booking:', '');
    const response = await driverAPI.updateTripStatus(tripId, 'in-progress');
    
    if (response.success) {
      toast.success(t.tripStarted);
      refetch();
    } else {
      toast.error('Échec du démarrage du voyage');
    }
  };

  const handleCompleteTrip = async (id: string) => {
    const tripId = id.replace('booking:', '');
    const response = await driverAPI.updateTripStatus(tripId, 'completed');
    
    if (response.success) {
      toast.success(t.tripCompleted);
      refetch();
    } else {
      toast.error('Échec de la finalisation du voyage');
    }
  };

  const handleNavigate = (destination: string) => {
    toast.info(`Ouverture de la navigation vers ${destination}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-4 md:py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <BookingListSkeleton count={3} />
        </div>
      </div>
    );
  }

  // Map backend data to Trip interface
  const mappedTrips: Trip[] = trips.map((booking: any, index: number) => ({
    id: booking.id,
    requestor: booking.employeeName || 'Unknown',
    phone: booking.phone || '',
    pickupLocation: 'School Campus',
    destination: booking.destination,
    scheduledTime: booking.time,
    passengers: booking.passengers,
    status: booking.tripStatus || 'upcoming',
    order: index,
  }));

  const upcomingTrips = mappedTrips.filter(t => t.status === 'upcoming').sort((a, b) => a.order - b.order);
  const inProgressTrips = mappedTrips.filter(t => t.status === 'in-progress');
  const completedTrips = mappedTrips.filter(t => t.status === 'completed');

  // Show empty state if no trips
  if (mappedTrips.length === 0) {
    return (
      <div className="min-h-screen py-4 md:py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">{t.title}</h1>
            <p className="text-gray-400">Manage your daily trips and deliveries</p>
          </div>
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <EmptyState
              icon={MapPin}
              title={t.emptyTitle}
              description={t.emptyDescription}
            />
          </Card>
        </div>
      </div>
    );
  }

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Card className="p-5 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{trip.requestor}</h3>
          <p className="text-gray-400 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {trip.scheduledTime}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          trip.status === 'upcoming' ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' :
          trip.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
          'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {trip.status === 'upcoming' ? t.upcoming : trip.status === 'in-progress' ? t.inProgress : t.completed}
        </span>
      </div>

      {/* Map Placeholder with Glassmorphism */}
      <div className="bg-white/5 rounded-lg p-8 mb-4 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent"></div>
        <div className="flex items-center justify-center text-gray-400 relative z-10">
          <MapPin className="h-12 w-12" />
        </div>
        <p className="text-center text-gray-400 mt-2 text-sm relative z-10">{t.mapView}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
          <MapPin className="h-5 w-5 text-green-400 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-green-400">{t.pickup}</p>
            <p className="text-white font-medium">{trip.pickupLocation}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <MapPin className="h-5 w-5 text-red-400 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-red-400">{t.dropoff}</p>
            <p className="text-white font-medium">{trip.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
          <span>{t.passengers}: <span className="text-white font-semibold">{trip.passengers}</span></span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">{trip.requestor}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <Button
          onClick={() => handleNavigate(trip.destination)}
          variant="outline"
          className="flex-1 border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {t.navigate}
        </Button>
        <Button
          onClick={() => window.open(`tel:${trip.phone}`)}
          variant="outline"
          className="flex-1 border border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          <Phone className="h-4 w-4 mr-2" />
          {t.call}
        </Button>
      </div>

      {trip.status === 'upcoming' && (
        <Button
          onClick={() => handleStartTrip(trip.id)}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 h-12 shadow-lg shadow-[#FFD700]/20"
        >
          {t.startTrip}
        </Button>
      )}

      {trip.status === 'in-progress' && (
        <Button
          onClick={() => handleCompleteTrip(trip.id)}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-12 shadow-lg shadow-green-500/20"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          {t.completeTrip}
        </Button>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen py-4 md:py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">{t.title}</h1>
          <p className="text-gray-400">Manage your daily trips and deliveries</p>
        </div>

        {/* In Progress Trips - Highest Priority */}
        {inProgressTrips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"></div>
              {t.inProgress}
            </h2>
            <div className="space-y-4">
              {inProgressTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </div>
        )}

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.upcoming}</h2>
            <div className="space-y-4">
              {upcomingTrips.map((trip, index) => (
                <div key={trip.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -left-2 top-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
                      Next
                    </div>
                  )}
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Trips */}
        {completedTrips.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">{t.completed}</h2>
            <div className="space-y-4 opacity-50">
              {completedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
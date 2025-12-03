import { useState } from 'react';
import { Calendar, MapPin, Users, Car, Search, Filter, Trash2, Edit, CheckCircle, XCircle, Clock, X, Download, CheckSquare, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Language } from '../App';
import { useBookings } from '../hooks/useBackend';
import { bookingAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { DateRangePicker, DateRange } from './DateRangePicker';
import { exportBookingsToCSV } from '../utils/export';

interface Booking {
  id: string;
  date: string;
  time: string;
  destination: string;
  passengers: number;
  vehicleType: string;
  purpose?: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  createdAt?: string;
}

const translations = {
  en: {
    title: 'My Bookings',
    noBookings: 'No bookings found',
    dateTime: 'Date & Time',
    destination: 'Destination',
    passengers: 'Passengers',
    vehicle: 'Vehicle',
    status: 'Status',
    pending: 'Pending',
    approved: 'Approved',
    denied: 'Denied',
    cancelled: 'Cancelled',
    cancel: 'Cancel Booking',
    edit: 'Modify Booking',
    cancelled_msg: 'Booking cancelled successfully',
    cannotModify: 'Cannot modify approved bookings',
    editBooking: 'Edit Booking',
    saveChanges: 'Save Changes',
    cancelDialog: 'Cancel',
    date: 'Date',
    time: 'Time',
    numPassengers: 'Number of Passengers',
    vehicleType: 'Vehicle Type',
    purpose: 'Purpose',
    updated_msg: 'Booking updated successfully',
    cancelConfirmTitle: 'Cancel Booking?',
    cancelConfirmDesc: 'Are you sure you want to cancel this booking? This action cannot be undone.',
    confirmCancel: 'Yes, Cancel Booking',
    searchPlaceholder: 'Search bookings...',
    filterByStatus: 'Filter by status',
    allStatuses: 'All Statuses',
    totalBookings: 'Total Bookings',
    actions: 'Actions',
    export: 'Export Bookings',
  },
  fr: {
    title: 'Mes réservations',
    noBookings: 'Aucune réservation trouvée',
    dateTime: 'Date et heure',
    destination: 'Destination',
    passengers: 'Passagers',
    vehicle: 'Véhicule',
    status: 'Statut',
    pending: 'En attente',
    approved: 'Approuvé',
    denied: 'Refusé',
    cancelled: 'Annulé',
    cancel: 'Annuler la réservation',
    edit: 'Modifier la réservation',
    cancelled_msg: 'Réservation annulée avec succès',
    cannotModify: 'Impossible de modifier les réservations approuvées',
    editBooking: 'Modifier la réservation',
    saveChanges: 'Enregistrer les modifications',
    cancelDialog: 'Annuler',
    date: 'Date',
    time: 'Heure',
    numPassengers: 'Nombre de passagers',
    vehicleType: 'Type de véhicule',
    purpose: 'Objectif',
    updated_msg: 'Réservation mise à jour avec succès',
    cancelConfirmTitle: 'Annuler la réservation?',
    cancelConfirmDesc: 'Êtes-vous sûr de vouloir annuler cette réservation? Cette action ne peut pas être annulée.',
    confirmCancel: 'Oui, annuler la réservation',
    searchPlaceholder: 'Rechercher des réservations...',
    filterByStatus: 'Filtrer par statut',
    allStatuses: 'Tous les statuts',
    totalBookings: 'Total des réservations',
    actions: 'Actions',
    export: 'Exporter les réservations',
  },
};

export function MyBookings({ language, userId }: { language: Language; userId?: string }) {
  const t = translations[language];
  const { bookings, loading, refetch } = useBookings(userId || 'user:1');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' });

  const handleCancel = async (id: string) => {
    const bookingId = id.replace('booking:', '');
    const response = await bookingAPI.cancel(bookingId);
    
    if (response.success) {
      toast.success(t.cancelled_msg);
      refetch();
    } else {
      toast.error('Failed to cancel booking');
    }
  };

  const handleEdit = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking?.status === 'approved') {
      toast.error(t.cannotModify);
    } else {
      toast.info('Edit functionality would open the booking form with pre-filled data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const approvedBookings = bookings.filter(b => b.status === 'approved').length;
  const deniedBookings = bookings.filter(b => b.status === 'denied').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    
    // Date range filter - only apply if both dates are set
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to && b.createdAt) {
      const bookingDate = new Date(b.createdAt);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      matchesDateRange = bookingDate >= fromDate && bookingDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  }).sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">{t.title}</h1>
          <p className="text-gray-400">View and manage your booking requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <p className="text-sm text-gray-400 mb-1">{t.totalBookings}</p>
            <p className="text-3xl font-bold text-white">{totalBookings}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <p className="text-sm text-gray-400 mb-1">{t.pending}</p>
            <p className="text-3xl font-bold text-[#FFD700]">{pendingBookings}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <p className="text-sm text-gray-400 mb-1">{t.approved}</p>
            <p className="text-3xl font-bold text-green-500">{approvedBookings}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <p className="text-sm text-gray-400 mb-1">{t.denied}</p>
            <p className="text-3xl font-bold text-red-500">{deniedBookings}</p>
          </Card>
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <p className="text-sm text-gray-400 mb-1">{t.cancelled}</p>
            <p className="text-3xl font-bold text-gray-400">{cancelledBookings}</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                <Filter className="h-4 w-4 mr-2 text-[#FFD700]" />
                <SelectValue>
                  {filterStatus === 'all' ? t.allStatuses : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="all" className="text-white hover:bg-white/10">{t.allStatuses}</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-white/10">{t.pending}</SelectItem>
                <SelectItem value="approved" className="text-white hover:bg-white/10">{t.approved}</SelectItem>
                <SelectItem value="denied" className="text-white hover:bg-white/10">{t.denied}</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/10">{t.cancelled}</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <Button
              variant="outline"
              className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20"
              onClick={() => exportBookingsToCSV(filteredBookings, language)}
            >
              <Download className="h-4 w-4 mr-2" />
              {t.export}
            </Button>
          </div>
        </Card>

        {filteredBookings.length === 0 ? (
          <Card className="p-12 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-400">{t.noBookings}</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-[#FFD700]" />
                    <div>
                      <p className="text-sm text-gray-400">{t.dateTime}</p>
                      <p className="text-lg text-white font-medium">{booking.date} at {booking.time}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === 'pending' ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' :
                    booking.status === 'approved' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                    booking.status === 'denied' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <p className="text-sm text-gray-400">{t.destination}</p>
                      <p className="text-white font-medium">{booking.destination}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">{t.passengers}</p>
                    <p className="text-white font-medium">{booking.passengers} passengers</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">{t.vehicle}</p>
                    <p className="text-white font-medium">{booking.vehicleType}</p>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="flex gap-3">
                    <EditBookingDialog booking={booking} onUpdate={refetch} t={t} language={language} />
                    <CancelBookingDialog bookingId={booking.id} onCancel={handleCancel} t={t} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EditBookingDialogProps {
  booking: Booking;
  onUpdate: () => void;
  t: typeof translations['en'];
  language: Language;
}

function EditBookingDialog({ booking, onUpdate, t, language }: EditBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const [destination, setDestination] = useState(booking.destination);
  const [passengers, setPassengers] = useState(booking.passengers);
  const [vehicleType, setVehicleType] = useState(booking.vehicleType);
  const [purpose, setPurpose] = useState(booking.purpose || '');

  const handleSave = async () => {
    const bookingId = booking.id.replace('booking:', '');
    const response = await bookingAPI.update(bookingId, {
      date,
      time,
      destination,
      passengers,
      vehicleType,
      purpose,
    });
    
    if (response.success) {
      toast.success(t.updated_msg);
      onUpdate();
      setIsOpen(false);
    } else {
      toast.error('Failed to update booking');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20 border-0"
        >
          <Edit className="h-4 w-4 mr-2" />
          {t.edit}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">{t.editBooking}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-white">{t.date}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time" className="text-white">{t.time}</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination" className="text-white">{t.destination}</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passengers" className="text-white">{t.numPassengers}</Label>
            <Input
              id="passengers"
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vehicleType" className="text-white">{t.vehicleType}</Label>
            <Select value={vehicleType} onValueChange={(value) => setVehicleType(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="Sedan" className="text-white hover:bg-white/10">Sedan</SelectItem>
                <SelectItem value="SUV" className="text-white hover:bg-white/10">SUV</SelectItem>
                <SelectItem value="Minibus" className="text-white hover:bg-white/10">Minibus</SelectItem>
                <SelectItem value="Bus" className="text-white hover:bg-white/10">Bus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purpose" className="text-white">{t.purpose}</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {t.cancelDialog}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90"
          >
            {t.saveChanges}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CancelBookingDialogProps {
  bookingId: string;
  onCancel: (id: string) => void;
  t: typeof translations['en'];
}

function CancelBookingDialog({ bookingId, onCancel, t }: CancelBookingDialogProps) {
  const handleConfirmCancel = () => {
    onCancel(bookingId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          <X className="h-4 w-4 mr-2" />
          {t.cancel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{t.cancelConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {t.cancelConfirmDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            {t.cancelDialog}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmCancel}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t.confirmCancel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
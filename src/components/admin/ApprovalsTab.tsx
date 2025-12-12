import { Check, X, Calendar, Users, MapPin, Search, Filter, RefreshCw, Download, CheckSquare, Square, Clock, TrendingUp, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StatusBadge } from '../ui/status-badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Language } from '../../App';
import { usePendingBookings } from '../../hooks/useBackend';
import { bookingAPI } from '../../utils/api';
import { useState } from 'react';
import { exportBookingsToCSV } from '../../utils/export';
import { EmptyState } from '../ui/empty-state';
import { TableSkeleton } from '../ui/skeleton';
import { FilterChip } from '../ui/filter-chip';

interface BookingRequest {
  id: string;
  employeeName: string;
  department: string;
  date: string;
  time: string;
  destination: string;
  passengers: number;
  vehicleType: string;
  purpose: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

const translations = {
  en: {
    noPending: 'No pending approvals',
    requestFrom: 'Request from',
    department: 'Department',
    dateTime: 'Date & Time',
    destination: 'Destination',
    passengers: 'Passengers',
    vehicleType: 'Vehicle Type',
    purpose: 'Purpose',
    approve: 'Approve',
    deny: 'Deny',
    approved: 'Booking approved successfully',
    denied: 'Booking denied',
    status: 'Status',
    approveConfirmTitle: 'Approve Booking?',
    approveConfirmDesc: 'This will approve the booking and notify the employee. A vehicle will need to be assigned.',
    denyConfirmTitle: 'Deny Booking?',
    denyConfirmDesc: 'Please provide a reason for denying this booking request. The employee will be notified.',
    denyReason: 'Reason for denial',
    denyReasonPlaceholder: 'e.g., No vehicles available, Outside service hours...',
    confirmApprove: 'Confirm Approval',
    confirmDeny: 'Confirm Denial',
    cancel: 'Cancel',
    searchPlaceholder: 'Search by name, destination, or department...',
    filterByDept: 'All Departments',
    results: 'results',
    emptyTitle: 'All caught up!',
    emptyDescription: 'No pending booking approvals at the moment. New requests will appear here.',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: 'selected',
    bulkApprove: 'Approve Selected',
    bulkDeny: 'Deny Selected',
    approving: 'Approving...',
    denying: 'Denying...',
    failedToApprove: 'Failed to approve booking',
    failedToApproveSome: 'Failed to approve some bookings',
    failedToDeny: 'Failed to deny booking',
    failedToDenySome: 'Failed to deny some bookings',
    pastDateWarning: 'This booking date has already passed',
    cannotApprovePast: 'Cannot approve a booking for a past date',
    cannotDenyPast: 'Cannot deny a booking for a past date',
    cannotCancelPast: 'Cannot cancel a booking for a past date',
    pastBookings: 'Past Bookings',
    upcomingBookings: 'Upcoming Bookings',
    setReminder: 'Set Reminder',
    reminderSet: 'Reminder Set',
    reminder12Hours: 'Reminder 12 hours before',
    reminderActive: 'Reminder active',
    noPastBookings: 'No past bookings',
    statsPending: 'Pending',
    statsApproved: 'Approved',
    statsDenied: 'Denied',
    statsCancelled: 'Cancelled',
    statsTotal: 'Total',
    clearFilters: 'Clear All Filters',
    activeReminders: 'Active Reminders',
    activeFilters: 'Active filters',
  },
  fr: {
    noPending: 'Aucune approbation en attente',
    requestFrom: 'Demande de',
    department: 'Département',
    dateTime: 'Date et heure',
    destination: 'Destination',
    passengers: 'Passagers',
    vehicleType: 'Type de véhicule',
    purpose: 'Objectif',
    approve: 'Approuver',
    deny: 'Refuser',
    approved: 'Réservation approuvée avec succès',
    denied: 'Réservation refusée',
    status: 'Statut',
    approveConfirmTitle: 'Approuver la réservation?',
    approveConfirmDesc: 'Cela approuvera la réservation et notifiera l\'employé. Un véhicule devra être attribué.',
    denyConfirmTitle: 'Refuser la réservation?',
    denyConfirmDesc: 'Veuillez fournir une raison pour refuser cette demande de réservation. L\'employé sera notifié.',
    denyReason: 'Raison du refus',
    denyReasonPlaceholder: 'ex: Aucun véhicule disponible, En dehors des heures de service...',
    confirmApprove: 'Confirmer l\'approbation',
    confirmDeny: 'Confirmer le refus',
    cancel: 'Annuler',
    searchPlaceholder: 'Rechercher par nom, destination ou département...',
    filterByDept: 'Tous les départements',
    results: 'résultats',
    emptyTitle: 'Tout est à jour!',
    emptyDescription: 'Aucune approbation de réservation en attente pour le moment. Les nouvelles demandes apparaîtront ici.',
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner',
    selected: 'sélectionné(s)',
    bulkApprove: 'Approuver la sélection',
    bulkDeny: 'Refuser la sélection',
    approving: 'Approbation...',
    denying: 'Refus...',
    failedToApprove: 'Échec de l\'approbation de la réservation',
    failedToApproveSome: 'Échec de l\'approbation de certaines réservations',
    failedToDeny: 'Échec du refus de la réservation',
    failedToDenySome: 'Échec du refus de certaines réservations',
    pastDateWarning: 'La date de cette réservation est déjà passée',
    cannotApprovePast: 'Impossible d\'approuver une réservation pour une date passée',
    cannotDenyPast: 'Impossible de refuser une réservation pour une date passée',
    cannotCancelPast: 'Impossible d\'annuler une réservation pour une date passée',
    pastBookings: 'Réservations passées',
    upcomingBookings: 'Réservations à venir',
    setReminder: 'Définir un rappel',
    reminderSet: 'Rappel défini',
    reminder12Hours: 'Rappel 12 heures avant',
    reminderActive: 'Rappel actif',
    noPastBookings: 'Aucune réservation passée',
    statsPending: 'En attente',
    statsApproved: 'Approuvé',
    statsDenied: 'Refusé',
    statsCancelled: 'Annulé',
    statsTotal: 'Total',
    clearFilters: 'Effacer tous les filtres',
    activeReminders: 'Rappels actifs',
    activeFilters: 'Filtres actifs',
  },
};

export function ApprovalsTab({ language }: { language: Language }) {
  const t = translations[language];
  const { bookings: requests, loading, refetch } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPastBookings, setShowPastBookings] = useState(false);
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  const isBookingDatePassed = (request: BookingRequest): boolean => {
    try {
      const bookingDateTime = new Date(`${request.date}T${request.time}`);
      const now = new Date();
      return bookingDateTime < now;
    } catch {
      return false;
    }
  };

  const getBookingDateTime = (request: BookingRequest): Date => {
    try {
      return new Date(`${request.date}T${request.time}`);
    } catch {
      return new Date();
    }
  };

  const isReminderTime = (request: BookingRequest): boolean => {
    const bookingDateTime = getBookingDateTime(request);
    const now = new Date();
    const reminderTime = new Date(bookingDateTime.getTime() - 12 * 60 * 60 * 1000); // 12 hours before
    return now >= reminderTime && now < bookingDateTime && reminders.has(request.id);
  };

  const handleSetReminder = (requestId: string) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(requestId)) {
      newReminders.delete(requestId);
      toast.success('Reminder removed');
    } else {
      newReminders.add(requestId);
      toast.success(t.reminderSet);
    }
    setReminders(newReminders);
    localStorage.setItem('booking_reminders', JSON.stringify(Array.from(newReminders)));
  };

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem('booking_reminders');
    if (savedReminders) {
      setReminders(new Set(JSON.parse(savedReminders)));
    }
  }, []);

  // Check for reminder times and show notifications
  useEffect(() => {
    const checkReminders = () => {
      requests.forEach((request: BookingRequest) => {
        if (isReminderTime(request) && request.status === 'approved') {
          toast.info(`Reminder: Booking for ${request.employeeName} is in 12 hours!`, {
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [requests, reminders]);

  const handleApprove = async (id: string, request: BookingRequest) => {
    // Check if booking date has passed
    if (isBookingDatePassed(request)) {
      toast.error(t.cannotApprovePast);
      return;
    }

    setIsProcessing(true);
    const bookingId = id.replace('booking:', '');
    const response = await bookingAPI.updateStatus(bookingId, 'approved');
    
    if (response.success) {
      toast.success(t.approved);
      refetch();
    } else {
      toast.error(t.failedToApprove);
    }
    setIsProcessing(false);
  };

  const handleBulkApprove = async () => {
    // Filter out past-dated bookings
    const validRequests = Array.from(selectedRequests)
      .map(id => requests.find(r => r.id === id))
      .filter((r): r is BookingRequest => r !== undefined && !isBookingDatePassed(r));
    
    const pastRequests = Array.from(selectedRequests)
      .map(id => requests.find(r => r.id === id))
      .filter((r): r is BookingRequest => r !== undefined && isBookingDatePassed(r));

    if (pastRequests.length > 0) {
      toast.error(`${pastRequests.length} ${t.cannotApprovePast}`);
    }

    if (validRequests.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const promises = validRequests.map(request => {
      const bookingId = request.id.replace('booking:', '');
      return bookingAPI.updateStatus(bookingId, 'approved');
    });
    
    try {
      await Promise.all(promises);
      toast.success(`${validRequests.length} ${t.approved}`);
      setSelectedRequests(new Set());
      refetch();
    } catch (error) {
      toast.error(t.failedToApproveSome);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeny = async () => {
    // Filter out past-dated bookings
    const validRequests = Array.from(selectedRequests)
      .map(id => requests.find(r => r.id === id))
      .filter((r): r is BookingRequest => r !== undefined && !isBookingDatePassed(r));
    
    const pastRequests = Array.from(selectedRequests)
      .map(id => requests.find(r => r.id === id))
      .filter((r): r is BookingRequest => r !== undefined && isBookingDatePassed(r));

    if (pastRequests.length > 0) {
      toast.error(`${pastRequests.length} ${t.cannotDenyPast}`);
    }

    if (validRequests.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const promises = validRequests.map(request => {
      const bookingId = request.id.replace('booking:', '');
      return bookingAPI.updateStatus(bookingId, 'denied');
    });
    
    try {
      await Promise.all(promises);
      toast.success(`${validRequests.length} ${t.denied}`);
      setSelectedRequests(new Set());
      refetch();
    } catch (error) {
      toast.error(t.failedToDenySome);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRequests.size === filteredRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(filteredRequests.map(r => r.id)));
    }
  };

  const toggleRequestSelection = (id: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRequests(newSelected);
  };

  const handleDeny = async (id: string, request: BookingRequest) => {
    // Check if booking date has passed
    if (isBookingDatePassed(request)) {
      toast.error(t.cannotDenyPast);
      return;
    }

    setIsProcessing(true);
    const bookingId = id.replace('booking:', '');
    const response = await bookingAPI.updateStatus(bookingId, 'denied');
    
    if (response.success) {
      toast.error(t.denied);
      refetch();
    } else {
      toast.error(t.failedToDeny);
    }
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={3} />
      </div>
    );
  }

  // Get unique departments for filter
  const departments = Array.from(new Set(requests.map((r: BookingRequest) => r.department)));

  // Separate past and upcoming bookings
  const pastBookings = requests.filter((request: BookingRequest) => isBookingDatePassed(request));
  const upcomingBookings = requests.filter((request: BookingRequest) => !isBookingDatePassed(request));

  // Calculate statistics
  const stats = {
    pending: requests.filter((r: BookingRequest) => r.status === 'pending' && !isBookingDatePassed(r)).length,
    approved: requests.filter((r: BookingRequest) => r.status === 'approved' && !isBookingDatePassed(r)).length,
    denied: requests.filter((r: BookingRequest) => r.status === 'denied' && !isBookingDatePassed(r)).length,
    cancelled: requests.filter((r: BookingRequest) => r.status === 'cancelled' && !isBookingDatePassed(r)).length,
    total: upcomingBookings.length,
    activeReminders: Array.from(reminders).filter(id => {
      const request = requests.find(r => r.id === id);
      return request && !isBookingDatePassed(request) && request.status === 'approved';
    }).length,
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || departmentFilter !== 'all' || statusFilter !== 'all';

  // Filter bookings based on search, department, and status
  const bookingsToShow = showPastBookings ? pastBookings : upcomingBookings;
  
  const filteredRequests = bookingsToShow.filter((request: BookingRequest) => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || request.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Sort by date/time (upcoming first, or past last)
  const sortedRequests = [...filteredRequests].sort((a: BookingRequest, b: BookingRequest) => {
    if (showPastBookings) {
      // For past bookings, sort by date descending (most recent first)
      const dateA = getBookingDateTime(a).getTime();
      const dateB = getBookingDateTime(b).getTime();
      return dateB - dateA;
    } else {
      // For upcoming bookings, sort by date ascending (soonest first)
      const dateA = getBookingDateTime(a).getTime();
      const dateB = getBookingDateTime(b).getTime();
      return dateA - dateB;
    }
  });

  if (requests.length === 0 && !loading) {
    return (
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <EmptyState
          icon={CheckSquare}
          title={t.emptyTitle}
          description={t.emptyDescription}
        />
      </Card>
    );
  }

  const clearAllFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {!showPastBookings && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="text-2xl font-bold text-[#FFD700]">{stats.total}</div>
            <div className="text-sm text-gray-400">{t.statsTotal}</div>
          </Card>
          <Card className="p-4 border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-gray-400">{t.statsPending}</div>
          </Card>
          <Card className="p-4 border border-green-500/30 bg-green-500/10 backdrop-blur-xl">
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            <div className="text-sm text-gray-400">{t.statsApproved}</div>
          </Card>
          <Card className="p-4 border border-red-500/30 bg-red-500/10 backdrop-blur-xl">
            <div className="text-2xl font-bold text-red-500">{stats.denied}</div>
            <div className="text-sm text-gray-400">{t.statsDenied}</div>
          </Card>
          <Card className="p-4 border border-gray-500/30 bg-gray-500/10 backdrop-blur-xl">
            <div className="text-2xl font-bold text-gray-400">{stats.cancelled}</div>
            <div className="text-sm text-gray-400">{t.statsCancelled}</div>
          </Card>
          {stats.activeReminders > 0 && (
            <Card className="p-4 border border-[#FFD700]/50 bg-[#FFD700]/20 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#FFD700]" />
                <div>
                  <div className="text-2xl font-bold text-[#FFD700]">{stats.activeReminders}</div>
                  <div className="text-sm text-gray-400">{t.activeReminders}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {selectedRequests.size > 0 && (
        <Card className="p-4 border border-[#FFD700] bg-[#FFD700]/10 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-[#FFD700]" />
              <span className="text-white font-medium">
                {selectedRequests.size} {t.selected}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleBulkApprove}
                disabled={isProcessing}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t.approving}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t.bulkApprove}
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDeny}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t.denying}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    {t.bulkDeny}
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRequests(new Set())}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {filteredRequests.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 md:w-auto w-full"
          >
            {selectedRequests.size === filteredRequests.length ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                {t.deselectAll}
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                {t.selectAll}
              </>
            )}
          </Button>
        )}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
              <Filter className="h-4 w-4 mr-2 text-[#FFD700]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">{t.filterByDept}</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept} className="text-white hover:bg-white/10">{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          className="h-12 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
          title="Refresh bookings"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400">{t.activeFilters}:</span>
          {searchQuery && (
            <FilterChip
              label={`Search: "${searchQuery}"`}
              onRemove={() => setSearchQuery('')}
            />
          )}
          {departmentFilter !== 'all' && (
            <FilterChip
              label={`Department: ${departmentFilter}`}
              onRemove={() => setDepartmentFilter('all')}
            />
          )}
          {statusFilter !== 'all' && (
            <FilterChip
              label={`Status: ${t[`status${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}` as keyof typeof t] || statusFilter}`}
              onRemove={() => setStatusFilter('all')}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-1" />
            {t.clearFilters}
          </Button>
        </div>
      )}

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-400">
          {filteredRequests.length} {t.results}
        </div>
      )}

      {/* Bookings Grid */}
      {filteredRequests.length === 0 ? (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <EmptyState
            icon={Search}
            title={showPastBookings ? t.noPastBookings : (hasActiveFilters ? "No bookings match your filters" : t.emptyTitle)}
            description={showPastBookings ? "All past bookings are displayed here for reference." : (hasActiveFilters ? "Try adjusting your search or filter criteria to see more results." : t.emptyDescription)}
            secondaryActionLabel={showPastBookings ? undefined : (hasActiveFilters ? "Clear Filters" : undefined)}
            onSecondaryAction={showPastBookings ? undefined : (hasActiveFilters ? clearAllFilters : undefined)}
          />
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedRequests.map((request) => (
            <Card key={request.id} className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all group">
              <div className="flex gap-4">
                {/* Selection Checkbox */}
                <div className="flex items-start pt-1">
                  <button
                    onClick={() => toggleRequestSelection(request.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {selectedRequests.has(request.id) ? (
                      <CheckSquare className="h-5 w-5 text-[#FFD700]" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-white mb-1">
                        {t.requestFrom} <span className="font-semibold text-[#FFD700]">{request.employeeName}</span>
                      </h3>
                      <p className="text-gray-400">{t.department}: {request.department}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-[#FFD700]" />
                      <div>
                        <p className="text-sm text-gray-400">{t.dateTime}</p>
                        <p className="text-white">{request.date} at {request.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#FFD700]" />
                      <div>
                        <p className="text-sm text-gray-400">{t.destination}</p>
                        <p className="text-white">{request.destination}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-[#FFD700]" />
                      <div>
                        <p className="text-sm text-gray-400">{t.passengers}</p>
                        <p className="text-white">{request.passengers}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">{t.vehicleType}</p>
                      <p className="text-white">{request.vehicleType}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-400">{t.purpose}</p>
                      <p className="text-white">{request.purpose}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 shadow-lg"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {t.approving}
                              </>
                            ) : (
                              <>
                                <Check className="h-5 w-5 mr-2" />
                                {t.approve}
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">{t.approveConfirmTitle}</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              {t.approveConfirmDesc}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                              {t.cancel}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleApprove(request.id, request)}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            >
                              {t.confirmApprove}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <DenyDialog 
                        requestId={request.id} 
                        request={request}
                        onDeny={handleDeny} 
                        t={t} 
                        isProcessing={isProcessing}
                        isPastDate={isBookingDatePassed(request)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface DenyDialogProps {
  requestId: string;
  request: BookingRequest;
  onDeny: (id: string, request: BookingRequest) => void;
  t: typeof translations['en'];
  isProcessing: boolean;
  isPastDate: boolean;
}

function DenyDialog({ requestId, request, onDeny, t, isProcessing, isPastDate }: DenyDialogProps) {
  const [reason, setReason] = useState('');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing || isPastDate}
        >
          {isProcessing ? (
            <>
              <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t.denying}
            </>
          ) : (
            <>
              <X className="h-5 w-5 mr-2" />
              {t.deny}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black/95 backdrop-blur-xl border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{t.denyConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {t.denyConfirmDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <Label htmlFor="denyReason" className="text-white">{t.denyReason}</Label>
          <Textarea
            id="denyReason"
            placeholder={t.denyReasonPlaceholder}
            className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            {t.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDeny(requestId, request)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            disabled={isPastDate}
          >
            {t.confirmDeny}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
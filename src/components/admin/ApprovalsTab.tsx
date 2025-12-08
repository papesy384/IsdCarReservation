import { Check, X, Calendar, Users, MapPin, Search, Filter, RefreshCw, Download, CheckSquare, Square } from 'lucide-react';
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
import { BookingListSkeleton } from '../ui/loading-skeletons';

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
  },
};

export function ApprovalsTab({ language }: { language: Language }) {
  const t = translations[language];
  const { bookings: requests, loading, refetch } = usePendingBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    const bookingId = id.replace('booking:', '');
    const response = await bookingAPI.updateStatus(bookingId, 'approved');
    
    if (response.success) {
      toast.success(t.approved);
      refetch();
    } else {
      toast.error('Échec de l\'approbation de la réservation');
    }
    setIsProcessing(false);
  };

  const handleBulkApprove = async () => {
    setIsProcessing(true);
    const promises = Array.from(selectedRequests).map(id => {
      const bookingId = id.replace('booking:', '');
      return bookingAPI.updateStatus(bookingId, 'approved');
    });
    
    try {
      await Promise.all(promises);
      toast.success(`${selectedRequests.size} ${t.approved}`);
      setSelectedRequests(new Set());
      refetch();
    } catch (error) {
      toast.error('Échec de l\'approbation de certaines réservations');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeny = async () => {
    setIsProcessing(true);
    const promises = Array.from(selectedRequests).map(id => {
      const bookingId = id.replace('booking:', '');
      return bookingAPI.updateStatus(bookingId, 'denied');
    });
    
    try {
      await Promise.all(promises);
      toast.success(`${selectedRequests.size} ${t.denied}`);
      setSelectedRequests(new Set());
      refetch();
    } catch (error) {
      toast.error('Échec du refus de certaines réservations');
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

  const handleDeny = async (id: string) => {
    setIsProcessing(true);
    const bookingId = id.replace('booking:', '');
    const response = await bookingAPI.updateStatus(bookingId, 'denied');
    
    if (response.success) {
      toast.error(t.denied);
      refetch();
    } else {
      toast.error('Échec du refus de la réservation');
    }
    setIsProcessing(false);
  };

  if (loading) {
    return <BookingListSkeleton count={5} />;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  // Get unique departments for filter
  const departments = Array.from(new Set(requests.map((r: BookingRequest) => r.department)));

  // Filter bookings based on search and department
  const filteredRequests = requests.filter((request: BookingRequest) => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || request.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Sort by createdAt (newest first)
  const sortedRequests = [...filteredRequests].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  if (pendingRequests.length === 0) {
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

  return (
    <div className="space-y-6">
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

      {/* Results Count */}
      {(searchQuery || departmentFilter !== 'all') && (
        <div className="text-sm text-gray-400">
          {filteredRequests.length} {t.results}
        </div>
      )}

      {/* Bookings Grid */}
      {filteredRequests.length === 0 ? (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <EmptyState
            icon={Search}
            title="No approvals match your filters"
            description="Try adjusting your search or filter criteria"
            secondaryActionLabel="Clear Filters"
            onSecondaryAction={() => {
              setSearchQuery('');
              setDepartmentFilter('all');
            }}
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
                              onClick={() => handleApprove(request.id)}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            >
                              {t.confirmApprove}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <DenyDialog requestId={request.id} onDeny={handleDeny} t={t} isProcessing={isProcessing} />
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
  onDeny: (id: string) => void;
  t: typeof translations['en'];
  isProcessing: boolean;
}

function DenyDialog({ requestId, onDeny, t, isProcessing }: DenyDialogProps) {
  const [reason, setReason] = useState('');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-12 shadow-lg"
          disabled={isProcessing}
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
            onClick={() => onDeny(requestId)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            {t.confirmDeny}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
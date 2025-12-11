import { FileText, Download, Calendar, TrendingUp, Users, Car, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Language } from '../../App';
import { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const translations = {
  en: {
    title: 'Reports & Analytics',
    subtitle: 'Track bookings and analyze trends',
    overview: 'Overview',
    totalBookings: 'Total Bookings',
    pendingBookings: 'Pending',
    approvedBookings: 'Approved',
    deniedBookings: 'Denied',
    cancelledBookings: 'Cancelled',
    bookingsByDepartment: 'Bookings by Department',
    bookingsByStatus: 'Bookings by Status',
    bookingsByVehicleType: 'Bookings by Vehicle Type',
    downloadReport: 'Download CSV Report',
    noData: 'No data available',
    loading: 'Loading reports...',
    allBookings: 'All Bookings',
    searchPlaceholder: 'Search by employee, department, destination...',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    employee: 'Employee',
    department: 'Department',
    dateTime: 'Date & Time',
    destination: 'Destination',
    passengers: 'Passengers',
    vehicleType: 'Vehicle Type',
    purpose: 'Purpose',
    status: 'Status',
    noBookingsFound: 'No bookings found',
  },
  fr: {
    title: 'Rapports et analyses',
    subtitle: 'Suivez les réservations et analysez les tendances',
    overview: 'Aperçu',
    totalBookings: 'Réservations totales',
    pendingBookings: 'En attente',
    approvedBookings: 'Approuvé',
    deniedBookings: 'Refusé',
    cancelledBookings: 'Annulé',
    bookingsByDepartment: 'Réservations par département',
    bookingsByStatus: 'Réservations par statut',
    bookingsByVehicleType: 'Réservations par type de véhicule',
    downloadReport: 'Télécharger le rapport CSV',
    noData: 'Aucune donnée disponible',
    loading: 'Chargement des rapports...',
    allBookings: 'Toutes les réservations',
    searchPlaceholder: 'Rechercher par employé, département, destination...',
    filterByStatus: 'Filtrer par statut',
    allStatuses: 'Tous les statuts',
    employee: 'Employé',
    department: 'Département',
    dateTime: 'Date et heure',
    destination: 'Destination',
    passengers: 'Passagers',
    vehicleType: 'Type de véhicule',
    purpose: 'Objectif',
    status: 'Statut',
    noBookingsFound: 'Aucune réservation trouvée',
  },
};

const COLORS = ['#FFD700', '#FFA500', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export function ReportsTab({ language }: { language: Language }) {
  const t = translations[language];
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await bookingAPI.getAll();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent"></div>
          <p className="mt-4 text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const approvedBookings = bookings.filter(b => b.status === 'approved').length;
  const deniedBookings = bookings.filter(b => b.status === 'denied').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  // Group by department
  const departmentData = bookings.reduce((acc: any, booking: any) => {
    const dept = booking.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({ name, value }));

  // Group by status
  const statusData = bookings.reduce((acc: any, booking: any) => {
    const status = booking.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const statusChartData = Object.entries(statusData).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }));

  // Group by vehicle type
  const vehicleTypeData = bookings.reduce((acc: any, booking: any) => {
    const type = booking.vehicleType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const vehicleTypeChartData = Object.entries(vehicleTypeData).map(([name, value]) => ({ name, value }));

  // Generate CSV report
  const downloadCSVReport = () => {
    const headers = ['Date', 'Time', 'Employee', 'Department', 'Destination', 'Passengers', 'Vehicle Type', 'Purpose', 'Status'];
    const rows = bookings.map(b => [
      b.date || '',
      b.time || '',
      b.employeeName || '',
      b.department || '',
      b.destination || '',
      b.passengers || '',
      b.vehicleType || '',
      b.purpose || '',
      b.status || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent">{t.title}</h2>
          <p className="text-gray-400 mt-1">{t.subtitle}</p>
        </div>
        <Button 
          onClick={downloadCSVReport}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20"
        >
          <Download className="h-4 w-4 mr-2" />
          {t.downloadReport}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-[#FFD700]" />
            <div>
              <p className="text-sm text-gray-400">{t.totalBookings}</p>
              <p className="text-3xl font-bold text-white">{totalBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-[#FFD700]"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.pendingBookings}</p>
              <p className="text-3xl font-bold text-[#FFD700]">{pendingBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.approvedBookings}</p>
              <p className="text-3xl font-bold text-green-500">{approvedBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.deniedBookings}</p>
              <p className="text-3xl font-bold text-red-500">{deniedBookings}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-gray-500/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.cancelledBookings}</p>
              <p className="text-3xl font-bold text-gray-400">{cancelledBookings}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Department */}
        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-[#FFD700]" />
            <h3 className="text-xl font-semibold text-white">{t.bookingsByDepartment}</h3>
          </div>
          {departmentChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#FFD700"
                  dataKey="value"
                >
                  {departmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-gray-400">{t.noData}</p>
          )}
        </Card>

        {/* Bookings by Status */}
        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-[#FFD700]" />
            <h3 className="text-xl font-semibold text-white">{t.bookingsByStatus}</h3>
          </div>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statusChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill="#FFD700" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-gray-400">{t.noData}</p>
          )}
        </Card>

        {/* Bookings by Vehicle Type */}
        <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Car className="h-6 w-6 text-[#FFD700]" />
            <h3 className="text-xl font-semibold text-white">{t.bookingsByVehicleType}</h3>
          </div>
          {vehicleTypeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={vehicleTypeChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#FFA500" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-8 text-gray-400">{t.noData}</p>
          )}
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#FFD700]" />
            <h3 className="text-2xl font-semibold text-white">{t.allBookings}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                <Filter className="h-4 w-4 mr-2 text-[#FFD700]" />
                <SelectValue>
                  {filterStatus === 'all' ? t.allStatuses : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                <SelectItem value="all" className="text-white hover:bg-white/10">{t.allStatuses}</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-white/10">{t.pendingBookings}</SelectItem>
                <SelectItem value="approved" className="text-white hover:bg-white/10">{t.approvedBookings}</SelectItem>
                <SelectItem value="denied" className="text-white hover:bg-white/10">{t.deniedBookings}</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/10">{t.cancelledBookings}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/10 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.employee}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.department}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.dateTime}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.destination}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.passengers}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.vehicleType}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.purpose}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id || index} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{booking.employeeName}</td>
                    <td className="px-6 py-4 text-gray-400">{booking.department}</td>
                    <td className="px-6 py-4 text-gray-400">
                      <div>{booking.date}</div>
                      <div className="text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{booking.destination}</td>
                    <td className="px-6 py-4 text-gray-400">{booking.passengers}</td>
                    <td className="px-6 py-4 text-gray-400">{booking.vehicleType}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate" title={booking.purpose}>
                      {booking.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'pending' ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' :
                        booking.status === 'approved' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                        booking.status === 'denied' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        booking.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">{t.noBookingsFound}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
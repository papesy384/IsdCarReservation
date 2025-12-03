// CSV Export Utility Functions

export function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return '';

  // Create CSV header row
  const headerRow = headers.join(',');

  // Create CSV data rows
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header] || '';
      // Escape quotes and wrap in quotes if contains comma or newline
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function exportBookingsToCSV(bookings: any[], language?: string): void {
  const headers = [
    'id',
    'employeeName',
    'department',
    'email',
    'phone',
    'date',
    'time',
    'destination',
    'passengers',
    'vehicleType',
    'purpose',
    'status',
  ];

  const csv = convertToCSV(bookings, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `bookings-export-${timestamp}.csv`);
}

export function exportUsersToCSV(users: any[]): void {
  const headers = ['id', 'name', 'email', 'phone', 'department', 'role'];
  const csv = convertToCSV(users, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `users-export-${timestamp}.csv`);
}

export function exportVehiclesToCSV(vehicles: any[]): void {
  const headers = ['id', 'name', 'type', 'capacity', 'licensePlate', 'status'];
  const csv = convertToCSV(vehicles, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `vehicles-export-${timestamp}.csv`);
}
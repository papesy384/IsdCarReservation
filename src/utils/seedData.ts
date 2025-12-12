import { vehicleAPI, userAPI, bookingAPI } from './api';

export async function seedDatabase() {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Starting database seeding...');
    }

    // Seed Vehicles
    const vehicles = [
      { name: 'Toyota Camry 2024', type: 'Sedan', capacity: 4, plateNumber: 'ABC-1234', status: 'available' },
      { name: 'Ford Explorer', type: 'SUV', capacity: 7, plateNumber: 'XYZ-5678', status: 'available' },
      { name: 'Mercedes Sprinter', type: 'Minibus', capacity: 15, plateNumber: 'MNO-9012', status: 'in-use' },
      { name: 'School Bus Large', type: 'Bus', capacity: 30, plateNumber: 'BUS-3456', status: 'available' },
    ];

    for (const vehicle of vehicles) {
      await vehicleAPI.create(vehicle);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('✓ Vehicles seeded');
    }

    // Seed Users
    const users = [
      { name: 'John Smith', email: 'j.smith@school.edu', phone: '+1-555-0101', department: 'Mathematics', role: 'employee' },
      { name: 'Sarah Johnson', email: 's.johnson@school.edu', phone: '+1-555-0102', department: 'Administration', role: 'admin' },
      { name: 'Michael Brown', email: 'm.brown@school.edu', phone: '+1-555-0103', department: 'Sports', role: 'employee' },
      { name: 'David Wilson', email: 'd.wilson@school.edu', phone: '+1-555-0104', department: 'Transport', role: 'driver' },
      { name: 'Emily Davis', email: 'e.davis@school.edu', phone: '+1-555-0105', department: 'Science', role: 'employee' },
    ];

    for (const user of users) {
      await userAPI.create(user);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('✓ Users seeded');
    }

    // Seed Bookings
    const bookings = [
      {
        userId: 'user:1',
        employeeName: 'John Smith',
        department: 'Mathematics',
        email: 'j.smith@school.edu',
        phone: '+1-555-0101',
        date: '2025-11-10',
        time: '09:00',
        destination: 'City Science Museum',
        passengers: 15,
        vehicleType: 'Minibus',
        purpose: 'Field Trip',
        otherPurpose: '',
        status: 'pending',
      },
      {
        userId: 'user:1',
        employeeName: 'Sarah Johnson',
        department: 'Administration',
        email: 's.johnson@school.edu',
        phone: '+1-555-0102',
        date: '2025-11-12',
        time: '14:00',
        destination: 'District Office',
        passengers: 3,
        vehicleType: 'Sedan',
        purpose: 'Meeting',
        otherPurpose: '',
        status: 'pending',
      },
      {
        userId: 'user:3',
        employeeName: 'Michael Brown',
        department: 'Sports',
        email: 'm.brown@school.edu',
        phone: '+1-555-0103',
        date: '2025-11-15',
        time: '08:00',
        destination: 'Regional Sports Complex',
        passengers: 20,
        vehicleType: 'Bus',
        purpose: 'Competition',
        otherPurpose: '',
        status: 'pending',
      },
      {
        userId: 'user:1',
        employeeName: 'John Smith',
        department: 'Mathematics',
        email: 'j.smith@school.edu',
        phone: '+1-555-0101',
        date: '2025-11-08',
        time: '14:00',
        destination: 'District Office',
        passengers: 3,
        vehicleType: 'Sedan',
        purpose: 'Meeting',
        otherPurpose: '',
        status: 'approved',
      },
    ];

    for (const booking of bookings) {
      await bookingAPI.create(booking);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('✓ Bookings seeded');
      console.log('Database seeding completed successfully!');
    }
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error seeding database:', error);
    }
    return { success: false, error: 'Failed to seed database' };
  }
}

import { useState } from 'react';
import { Calendar, MapPin, Users, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { Language } from '../App';
import { bookingAPI } from '../utils/api';

interface User {
  id: string;
  authId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
}

interface BookingFormProps {
  user?: User;
  language: Language;
}

const translations = {
  en: {
    title: 'New Booking Request',
    tripDetails: 'Trip Details',
    date: 'Date',
    time: 'Departure Time',
    destination: 'Destination',
    passengers: 'Number of Passengers',
    vehicleType: 'Vehicle Type',
    purpose: 'Purpose',
    otherPurpose: 'Please specify purpose',
    selectVehicle: 'Select Vehicle Type',
    sedan: 'Sedan (4 passengers)',
    suv: 'SUV (7 passengers)',
    minibus: 'Minibus (15 passengers)',
    bus: 'Bus (30 passengers)',
    fieldTrip: 'Field Trip',
    meeting: 'Meeting',
    competition: 'Competition',
    training: 'Training',
    other: 'Other',
    capacityWarning: 'Passenger count exceeds vehicle capacity!',
    submit: 'Submit Booking Request',
    success: 'Booking request submitted successfully!',
    pleaseSelect: 'Please select a vehicle type',
  },
  fr: {
    title: 'Nouvelle demande de réservation',
    tripDetails: 'Détails du voyage',
    date: 'Date',
    time: 'Heure de départ',
    destination: 'Destination',
    passengers: 'Nombre de passagers',
    vehicleType: 'Type de véhicule',
    purpose: 'Objectif',
    otherPurpose: 'Veuillez préciser l\'objectif',
    selectVehicle: 'Sélectionner le type de véhicule',
    sedan: 'Berline (4 passagers)',
    suv: 'SUV (7 passagers)',
    minibus: 'Minibus (15 passagers)',
    bus: 'Bus (30 passagers)',
    fieldTrip: 'Sortie éducative',
    meeting: 'Réunion',
    competition: 'Compétition',
    training: 'Formation',
    other: 'Autre',
    capacityWarning: 'Le nombre de passagers dépasse la capacité du véhicule!',
    submit: 'Soumettre la demande de réservation',
    success: 'Demande de réservation soumise avec succès!',
    pleaseSelect: 'Veuillez sélectionner un type de véhicule',
  },
};

const vehicleCapacities = {
  'Sedan': 4,
  'SUV': 7,
  'Minibus': 15,
  'Bus': 30,
};

export function BookingForm({ user, language }: BookingFormProps) {
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    destination: '',
    passengers: '',
    vehicleType: '',
    purpose: '',
    otherPurpose: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passengerCount = parseInt(formData.passengers) || 0;
  const selectedCapacity = formData.vehicleType ? vehicleCapacities[formData.vehicleType as keyof typeof vehicleCapacities] : 0;
  const isCapacityExceeded = formData.vehicleType && passengerCount > selectedCapacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleType) {
      toast.error(t.pleaseSelect);
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error(language === 'en' ? 'Cannot book a trip for a past date' : 'Impossible de réserver un voyage pour une date passée');
      return;
    }

    if (isCapacityExceeded) {
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    const bookingData = {
      userId: user?.id || 'user:1',
      employeeName: user?.name || 'Current User',
      department: user?.department || 'Department',
      email: user?.email || 'user@school.edu',
      phone: user?.phone || '+1-555-0000',
      date: formData.date,
      time: formData.time,
      destination: formData.destination,
      passengers: parseInt(formData.passengers),
      vehicleType: formData.vehicleType,
      purpose: formData.purpose === 'Other' ? formData.otherPurpose : formData.purpose,
      otherPurpose: formData.purpose === 'Other' ? formData.otherPurpose : '',
    };
    
    const response = await bookingAPI.create(bookingData);
    
    if (response.success) {
      toast.success(t.success);
      setFormData({
        date: '',
        time: '',
        destination: '',
        passengers: '',
        vehicleType: '',
        purpose: '',
        otherPurpose: '',
      });
      setShowConfirmation(false);
    } else {
      toast.error('Failed to create booking');
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 border border-green-500/30 bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-white bg-clip-text text-transparent mb-2">Booking Confirmation</h2>
              <p className="text-gray-400 mb-6">Please review your booking details</p>
              
              <div className="text-left space-y-4 mb-8 bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-medium">{formData.date}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Destination:</span>
                  <span className="text-white font-medium">{formData.destination}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Passengers:</span>
                  <span className="text-white font-medium">{formData.passengers}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="text-white font-medium">{formData.vehicleType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Purpose:</span>
                  <span className="text-white font-medium">{formData.purpose === 'Other' ? formData.otherPurpose : formData.purpose}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={confirmSubmit}
                  className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">{t.title}</h1>
          <p className="text-gray-400">Fill out the form below to request a vehicle</p>
        </div>

        <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-[#FFD700]" />
                {t.tripDetails}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="text-white">{t.date}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]"
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-white">{t.time}</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="destination" className="text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FFD700]" />
                {t.destination}
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Enter destination address"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
              />
            </div>

            <div>
              <Label htmlFor="vehicleType" className="text-white flex items-center gap-2">
                <Car className="h-4 w-4 text-[#FFD700]" />
                {t.vehicleType}
              </Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                required
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                  <SelectValue placeholder={t.selectVehicle} />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="Sedan" className="text-white hover:bg-white/10">{t.sedan}</SelectItem>
                  <SelectItem value="SUV" className="text-white hover:bg-white/10">{t.suv}</SelectItem>
                  <SelectItem value="Minibus" className="text-white hover:bg-white/10">{t.minibus}</SelectItem>
                  <SelectItem value="Bus" className="text-white hover:bg-white/10">{t.bus}</SelectItem>
                </SelectContent>
              </Select>
              {formData.vehicleType && (
                <p className="text-sm text-gray-400 mt-2">
                  Maximum capacity: {selectedCapacity} passengers
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="passengers" className="text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-[#FFD700]" />
                {t.passengers}
              </Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]"
              />
            </div>

            {isCapacityExceeded && (
              <Alert variant="destructive" className="bg-red-500/20 border border-red-500/30 backdrop-blur-xl">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <AlertDescription className="text-red-300">
                  {t.capacityWarning}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="purpose" className="text-white">{t.purpose}</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                required
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#FFD700]">
                  <SelectValue placeholder={t.purpose} />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="Field Trip" className="text-white hover:bg-white/10">{t.fieldTrip}</SelectItem>
                  <SelectItem value="Meeting" className="text-white hover:bg-white/10">{t.meeting}</SelectItem>
                  <SelectItem value="Competition" className="text-white hover:bg-white/10">{t.competition}</SelectItem>
                  <SelectItem value="Training" className="text-white hover:bg-white/10">{t.training}</SelectItem>
                  <SelectItem value="Other" className="text-white hover:bg-white/10">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.purpose === 'Other' && (
              <div>
                <Label htmlFor="otherPurpose" className="text-white">{t.otherPurpose}</Label>
                <Textarea
                  id="otherPurpose"
                  value={formData.otherPurpose}
                  onChange={(e) => setFormData({ ...formData, otherPurpose: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
                  rows={3}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isCapacityExceeded}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 h-14 shadow-lg shadow-[#FFD700]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.submit}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Plus, Edit, Trash2, Car, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Language } from '../../App';
import { useVehicles } from '../../hooks/useBackend';
import { vehicleAPI } from '../../utils/api';
import { ConfirmDialog } from '../ConfirmDialog';
import { exportVehiclesToCSV } from '../../utils/export';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  plateNumber: string;
  status: 'available' | 'in-use' | 'maintenance';
}

const translations = {
  en: {
    addVehicle: 'Add Vehicle',
    editVehicle: 'Edit Vehicle',
    edit: 'Edit',
    deleteVehicle: 'Delete Vehicle',
    delete: 'Delete',
    vehicleName: 'Vehicle Name',
    vehicleType: 'Vehicle Type',
    capacity: 'Capacity',
    plateNumber: 'Plate Number',
    status: 'Status',
    save: 'Save',
    cancel: 'Cancel',
    available: 'Available',
    inUse: 'In Use',
    maintenance: 'Maintenance',
    sedan: 'Sedan',
    suv: 'SUV',
    minibus: 'Minibus',
    bus: 'Bus',
    vehicleAdded: 'Vehicle added successfully',
    vehicleUpdated: 'Vehicle updated successfully',
    vehicleDeleted: 'Vehicle deleted successfully',
    failedToAdd: 'Failed to add vehicle',
    failedToUpdate: 'Failed to update vehicle',
    failedToDelete: 'Failed to delete vehicle',
    deleteConfirmDescription: 'Are you sure you want to delete',
    deleteConfirmSuffix: 'This action cannot be undone.',
  },
  fr: {
    addVehicle: 'Ajouter un véhicule',
    editVehicle: 'Modifier le véhicule',
    edit: 'Modifier',
    deleteVehicle: 'Supprimer le véhicule',
    delete: 'Supprimer',
    vehicleName: 'Nom du véhicule',
    vehicleType: 'Type de véhicule',
    capacity: 'Capacité',
    plateNumber: 'Numéro de plaque',
    status: 'Statut',
    save: 'Enregistrer',
    cancel: 'Annuler',
    available: 'Disponible',
    inUse: 'En cours d\'utilisation',
    maintenance: 'Maintenance',
    sedan: 'Berline',
    suv: 'SUV',
    minibus: 'Minibus',
    bus: 'Bus',
    vehicleAdded: 'Véhicule ajouté avec succès',
    vehicleUpdated: 'Véhicule mis à jour avec succès',
    vehicleDeleted: 'Véhicule supprimé avec succès',
    failedToAdd: 'Échec de l\'ajout du véhicule',
    failedToUpdate: 'Échec de la mise à jour du véhicule',
    failedToDelete: 'Échec de la suppression du véhicule',
    deleteConfirmDescription: 'Êtes-vous sûr de vouloir supprimer',
    deleteConfirmSuffix: 'Cette action ne peut pas être annulée.',
  },
};

export function VehiclesTab({ language }: { language: Language }) {
  const t = translations[language];
  const { vehicles, loading, refetch } = useVehicles();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleAdd = async () => {
    const newVehicle = {
      name: formData.name || '',
      type: formData.type || 'Sedan',
      capacity: formData.capacity || 4,
      plateNumber: formData.plateNumber || '',
      status: 'available',
    };
    
    const response = await vehicleAPI.create(newVehicle);
    
    if (response.success) {
      setIsAddOpen(false);
      setFormData({});
      toast.success(t.vehicleAdded);
      refetch();
    } else {
      toast.error(t.failedToAdd);
    }
  };

  const handleEdit = async () => {
    if (editingVehicle) {
      const vehicleId = editingVehicle.id.replace('vehicle:', '');
      const response = await vehicleAPI.update(vehicleId, formData);
      
      if (response.success) {
        setEditingVehicle(null);
        setFormData({});
        toast.success(t.vehicleUpdated);
        refetch();
      } else {
        toast.error(t.failedToUpdate);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const vehicleId = id.replace('vehicle:', '');
    const response = await vehicleAPI.delete(vehicleId);
    
    if (response.success) {
      toast.success(t.vehicleDeleted);
      refetch();
    } else {
      toast.error(t.failedToDelete);
    }
  };

  const VehicleForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">{t.vehicleName}</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Toyota Camry 2024"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="type" className="text-white">{t.vehicleType}</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder={t.vehicleType} />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
            <SelectItem value="Sedan" className="text-white hover:bg-white/10">{t.sedan}</SelectItem>
            <SelectItem value="SUV" className="text-white hover:bg-white/10">{t.suv}</SelectItem>
            <SelectItem value="Minibus" className="text-white hover:bg-white/10">{t.minibus}</SelectItem>
            <SelectItem value="Bus" className="text-white hover:bg-white/10">{t.bus}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="capacity" className="text-white">{t.capacity}</Label>
        <Input
          id="capacity"
          type="number"
          value={formData.capacity || ''}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <div>
        <Label htmlFor="plateNumber" className="text-white">{t.plateNumber}</Label>
        <Input
          id="plateNumber"
          value={formData.plateNumber || ''}
          onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
          placeholder="ABC-1234"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <Button onClick={onSubmit} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90">
        {t.save}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20">
              <Plus className="h-5 w-5 mr-2" />
              {t.addVehicle}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-white">{t.addVehicle}</DialogTitle>
            </DialogHeader>
            <VehicleForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <Car className="h-6 w-6 text-[#FFD700]" />
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                vehicle.status === 'available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                vehicle.status === 'in-use' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {vehicle.status === 'available' ? t.available :
                 vehicle.status === 'in-use' ? t.inUse : t.maintenance}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">{vehicle.name}</h3>
            <p className="text-gray-400 mb-1">{vehicle.type}</p>
            <p className="text-gray-400 mb-1">{t.capacity}: <span className="text-white font-medium">{vehicle.capacity}</span></p>
            <p className="text-gray-400 mb-4 font-mono">{vehicle.plateNumber}</p>

            <div className="flex gap-2">
              <Dialog open={editingVehicle?.id === vehicle.id} onOpenChange={(open) => {
                if (open) {
                  setEditingVehicle(vehicle);
                  setFormData(vehicle);
                } else {
                  setEditingVehicle(null);
                  setFormData({});
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 border border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <Edit className="h-4 w-4 mr-2" />
                    {t.edit}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white" aria-describedby={undefined}>
                  <DialogHeader>
                    <DialogTitle className="text-white">{t.editVehicle}</DialogTitle>
                  </DialogHeader>
                  <VehicleForm onSubmit={handleEdit} />
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                onClick={() => {
                  setVehicleToDelete(vehicle);
                  setDeleteConfirmOpen(true);
                }}
                className="flex-1 bg-red-600/80 hover:bg-red-700 border border-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.delete}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => vehicleToDelete && handleDelete(vehicleToDelete.id)}
        title={t.deleteVehicle}
        description={`${t.deleteConfirmDescription} "${vehicleToDelete?.name}"? ${t.deleteConfirmSuffix}`}
        confirmText={t.delete}
        cancelText={t.cancel}
        variant="destructive"
      />

      <Button
        variant="outline"
        onClick={() => exportVehiclesToCSV(vehicles)}
        className="mt-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20"
      >
        <Download className="h-5 w-5 mr-2" />
        Export to CSV
      </Button>
    </div>
  );
}
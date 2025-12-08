import { useState } from 'react';
import { Plus, Edit, Trash2, User, Search, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Language } from '../../App';
import { useUsers } from '../../hooks/useBackend';
import { userAPI } from '../../utils/api';
import { ConfirmDialog } from '../ConfirmDialog';
import { exportUsersToCSV } from '../../utils/export';
import { BookingListSkeleton } from '../ui/loading-skeletons';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: 'employee' | 'admin' | 'driver';
}

const translations = {
  en: {
    addUser: 'Add User',
    editUser: 'Edit User',
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number',
    department: 'Department',
    role: 'Role',
    save: 'Save',
    employee: 'Employee',
    admin: 'Admin',
    driver: 'Driver',
    userAdded: 'User added successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully',
    searchPlaceholder: 'Search users...',
    filterByRole: 'Filter by role',
    allRoles: 'All Roles',
    edit: 'Edit',
    delete: 'Delete',
    deleteUser: 'Delete User',
    deleteUserConfirm: 'Are you sure you want to delete',
    deleteUserConfirmDesc: 'This action cannot be undone.',
    exportCSV: 'Export CSV',
    cancel: 'Cancel',
  },
  fr: {
    addUser: 'Ajouter un utilisateur',
    editUser: 'Modifier l\'utilisateur',
    name: 'Nom',
    email: 'Email',
    phone: 'Numéro de téléphone',
    department: 'Département',
    role: 'Rôle',
    save: 'Enregistrer',
    employee: 'Employé',
    admin: 'Administrateur',
    driver: 'Conducteur',
    userAdded: 'Utilisateur ajouté avec succès',
    userUpdated: 'Utilisateur mis à jour avec succès',
    userDeleted: 'Utilisateur supprimé avec succès',
    searchPlaceholder: 'Rechercher des utilisateurs...',
    filterByRole: 'Filtrer par rôle',
    allRoles: 'Tous les rôles',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteUser: 'Supprimer l\'utilisateur',
    deleteUserConfirm: 'Êtes-vous sûr de vouloir supprimer',
    deleteUserConfirmDesc: 'Cette action ne peut pas être annulée.',
    exportCSV: 'Exporter CSV',
    cancel: 'Annuler',
  },
};

export function UsersTab({ language }: { language: Language }) {
  const t = translations[language];
  const { users, loading, refetch } = useUsers();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const handleAdd = async () => {
    const newUser = {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      department: formData.department || '',
      role: formData.role || 'employee',
    };
    
    const response = await userAPI.create(newUser);
    
    if (response.success) {
      setIsAddOpen(false);
      setFormData({});
      toast.success(t.userAdded);
      refetch();
    } else {
      toast.error('Échec de l\'ajout de l\'utilisateur');
    }
  };

  const handleEdit = async () => {
    if (editingUser) {
      const userId = editingUser.id.replace('user:', '');
      const response = await userAPI.update(userId, formData);
      
      if (response.success) {
        setEditingUser(null);
        setFormData({});
        toast.success(t.userUpdated);
        refetch();
      } else {
        toast.error('Échec de la mise à jour de l\'utilisateur');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const userId = id.replace('user:', '');
    const response = await userAPI.delete(userId);
    
    if (response.success) {
      toast.success(t.userDeleted);
      refetch();
    } else {
      toast.error('Échec de la suppression de l\'utilisateur');
    }
  };

  if (loading) {
    return <BookingListSkeleton count={5} />;
  }

  const UserForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">{t.name}</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white">{t.email}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-white">{t.phone}</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1-555-0100"
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="department" className="text-white">{t.department}</Label>
        <Input
          id="department"
          value={formData.department || ''}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="role" className="text-white">{t.role}</Label>
        <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder={t.role} />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
            <SelectItem value="employee" className="text-white hover:bg-white/10">{t.employee}</SelectItem>
            <SelectItem value="admin" className="text-white hover:bg-white/10">{t.admin}</SelectItem>
            <SelectItem value="driver" className="text-white hover:bg-white/10">{t.driver}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSubmit} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90">
        {t.save}
      </Button>
    </div>
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <Card className="flex-1 p-4 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
            />
          </div>
        </Card>

        {/* Role Filter */}
        <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
          <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white backdrop-blur-xl focus:border-[#FFD700]">
            <SelectValue placeholder={t.filterByRole} />
          </SelectTrigger>
          <SelectContent className="bg-black/95 backdrop-blur-xl border-white/10">
            <SelectItem value="all" className="text-white hover:bg-white/10">{t.allRoles}</SelectItem>
            <SelectItem value="employee" className="text-white hover:bg-white/10">{t.employee}</SelectItem>
            <SelectItem value="admin" className="text-white hover:bg-white/10">{t.admin}</SelectItem>
            <SelectItem value="driver" className="text-white hover:bg-white/10">{t.driver}</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Button */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20 whitespace-nowrap">
              <Plus className="h-5 w-5 mr-2" />
              {t.addUser}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-white">{t.addUser}</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>

        {/* Export Button */}
        <Button
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 shadow-lg shadow-[#FFD700]/20 whitespace-nowrap"
          onClick={() => exportUsersToCSV(users)}
        >
          <Download className="h-5 w-5 mr-2" />
          {t.exportCSV}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <User className="h-6 w-6 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-300">{user.phone}</p>
              <p className="text-sm text-gray-300">{user.department}</p>
            </div>

            <div className="flex gap-2">
              <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                if (open) {
                  setEditingUser(user);
                  setFormData(user);
                } else {
                  setEditingUser(null);
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
                    <DialogTitle className="text-white">{t.editUser}</DialogTitle>
                  </DialogHeader>
                  <UserForm onSubmit={handleEdit} />
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                onClick={() => {
                  setUserToDelete(user);
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
        onConfirm={() => userToDelete && handleDelete(userToDelete.id)}
        title={t.deleteUser}
        description={`${t.deleteUserConfirm} "${userToDelete?.name}"? ${t.deleteUserConfirmDesc}`}
        confirmText={t.delete}
        cancelText={t.cancel}
        variant="destructive"
      />
    </div>
  );
}
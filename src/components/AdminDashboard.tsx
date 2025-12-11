import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ApprovalsTab } from './admin/ApprovalsTab';
import { VehiclesTab } from './admin/VehiclesTab';
import { UsersTab } from './admin/UsersTab';
import { ReportsTab } from './admin/ReportsTab';
import { Language } from '../App';

interface AdminDashboardProps {
  language: Language;
}

const translations = {
  en: {
    title: 'Admin Dashboard',
    approvals: 'Pending Approvals',
    vehicles: 'Vehicle Management',
    users: 'User Management',
    reports: 'Reports',
  },
  fr: {
    title: 'Tableau de bord administrateur',
    approvals: 'Approbations en attente',
    vehicles: 'Gestion des véhicules',
    users: 'Gestion des utilisateurs',
    reports: 'Rapports',
  },
};

export function AdminDashboard({ language }: AdminDashboardProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('approvals');

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">{t.title}</h1>
          <p className="text-gray-400">Manage your fleet, users, and bookings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 mb-8 p-1">
            <TabsTrigger 
              value="approvals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t.approvals}
            </TabsTrigger>
            <TabsTrigger 
              value="vehicles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t.vehicles}
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t.users}
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t.reports}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <ApprovalsTab language={language} />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehiclesTab language={language} />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab language={language} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
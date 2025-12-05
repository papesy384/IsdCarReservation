import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ApprovalsTab } from './admin/ApprovalsTab';
import { VehiclesTab } from './admin/VehiclesTab';
import { UsersTab } from './admin/UsersTab';
import { ReportsTab } from './admin/ReportsTab';
import { Language } from '../App';
import { Button } from './ui/button';

interface AdminDashboardProps {
  language: Language;
}

export function AdminDashboard({ language }: AdminDashboardProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('approvals');

  // Sync i18n language with prop
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-white bg-clip-text text-transparent mb-2">
                {t('admin.admin_dashboard_title')}
              </h1>
              <p className="text-gray-400">{t('admin.dashboard_subtitle')}</p>
            </div>
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => i18n.changeLanguage('en')}
                className={`border-white/20 bg-white/5 text-white hover:bg-white/10 ${
                  i18n.language === 'en' ? 'bg-[#FFD700]/20 border-[#FFD700]' : ''
                }`}
              >
                EN
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => i18n.changeLanguage('fr')}
                className={`border-white/20 bg-white/5 text-white hover:bg-white/10 ${
                  i18n.language === 'fr' ? 'bg-[#FFD700]/20 border-[#FFD700]' : ''
                }`}
              >
                FR
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 mb-8 p-1">
            <TabsTrigger 
              value="approvals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t('admin.pendingApprovals')}
            </TabsTrigger>
            <TabsTrigger 
              value="vehicles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t('admin.vehicleManagement')}
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t('admin.userManagement')}
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#FFA500] data-[state=active]:text-black text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#FFD700]/20"
            >
              {t('admin.reports')}
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
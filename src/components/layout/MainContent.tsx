import { useSidebar } from '@/hooks/useSidebar';
import { DashboardContent } from './DashboardContent';
import { HomePage } from './HomePage';
import { GeneralSettings } from '@/components/sidebar/settings/sections/GeneralSettings';
import { AccountSettings } from '@/components/sidebar/settings/sections/AccountSettings';
import { ConnectorsSettings } from '@/components/sidebar/settings/sections/ConnectorsSettings';
import { DataSettings } from '@/components/sidebar/settings/sections/DataSettings';
import { AboutSettings } from '@/components/sidebar/settings/sections/AboutSettings';

export function MainContent() {
  const { activeSettingsSection, isSettingsOpen, theme } = useSidebar();
  const dk = theme === 'dark';

  if (!isSettingsOpen) return <HomePage />;

  if (activeSettingsSection === 'dashboard') return <DashboardContent />;

  const bg = dk ? 'bg-[#161616]' : 'bg-[#f8f8f8]';

  return (
    <div className={`flex-1 h-full overflow-y-auto ${bg}`}>
      <div className="max-w-[680px] mx-auto pt-[60px] pb-[80px] px-[40px]">
        {activeSettingsSection === 'general' && <GeneralSettings />}
        {activeSettingsSection === 'account' && <AccountSettings />}
        {activeSettingsSection === 'connectors' && <ConnectorsSettings />}
        {activeSettingsSection === 'data' && <DataSettings />}
        {activeSettingsSection === 'about' && <AboutSettings />}
      </div>
    </div>
  );
}

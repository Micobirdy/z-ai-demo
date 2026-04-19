import { useSidebar } from '@/hooks/useSidebar';
import { GeneralSettings } from './sections/GeneralSettings';
import { AccountSettings } from './sections/AccountSettings';
import { DashboardSettings } from './sections/DashboardSettings';
import { ConnectorsSettings } from './sections/ConnectorsSettings';
import { DataSettings } from './sections/DataSettings';
import { AboutSettings } from './sections/AboutSettings';

export function SettingsContent() {
  const { activeSettingsSection } = useSidebar();

  return (
    <div className="px-4 py-4">
      {activeSettingsSection === 'general' && <GeneralSettings />}
      {activeSettingsSection === 'account' && <AccountSettings />}
      {activeSettingsSection === 'dashboard' && <DashboardSettings />}
      {activeSettingsSection === 'connectors' && <ConnectorsSettings />}
      {activeSettingsSection === 'data' && <DataSettings />}
      {activeSettingsSection === 'about' && <AboutSettings />}
    </div>
  );
}

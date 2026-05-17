import { useSidebar } from '@/hooks/useSidebar';
import { DashboardContent } from './DashboardContent';
import { HomePage } from './HomePage';
import { ChatPage } from '@/components/chat/ChatPage';
import { SettingsSidebar } from '@/components/sidebar/settings/SettingsSidebar';
import { GeneralSettings } from '@/components/sidebar/settings/sections/GeneralSettings';
import { AccountSettings } from '@/components/sidebar/settings/sections/AccountSettings';
import { ConnectorsSettings } from '@/components/sidebar/settings/sections/ConnectorsSettings';
import { DataSettings } from '@/components/sidebar/settings/sections/DataSettings';
import { AboutSettings } from '@/components/sidebar/settings/sections/AboutSettings';

export function MainContent() {
  const { activeSettingsSection, isSettingsOpen, chatInitialMessage, chatAgentKey, theme } = useSidebar();
  const dk = theme === 'dark';

  // Chat page
  if (chatInitialMessage !== null) {
    return <ChatPage initialMessage={chatInitialMessage} agentKey={chatAgentKey} />;
  }

  // Home page
  if (!isSettingsOpen) return <HomePage />;

  // Settings
  return (
    <div className="flex-1 h-full overflow-y-auto bg-bg-page">
      <div className="mx-auto mt-4 w-full flex-1 px-4 md:px-8 lg:mt-6 max-w-7xl">
        <div className="flex gap-8">
          <div className="w-[220px] shrink-0 pt-8">
            <div className="px-4 pb-4 border-b mb-2 border-border-default">
              <h1 className="text-2xl font-bold leading-8 text-text-primary"
                style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif' }}>
                Settings
              </h1>
            </div>
            <SettingsSidebar />
          </div>
          <div className="flex-1 min-w-0 pt-8 pb-20">
            {activeSettingsSection === 'dashboard' && <DashboardContent />}
            {activeSettingsSection === 'general' && <GeneralSettings />}
            {activeSettingsSection === 'account' && <AccountSettings />}
            {activeSettingsSection === 'connectors' && <ConnectorsSettings />}
            {activeSettingsSection === 'data' && <DataSettings />}
            {activeSettingsSection === 'about' && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

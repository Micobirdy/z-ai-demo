import { useSidebar } from '@/hooks/useSidebar';
import { DashboardContent } from './DashboardContent';
import { HomePage } from './HomePage';
import { FolderPage } from './FolderPage';
import { ChatPage } from '@/components/chat/ChatPage';
import { SettingsSidebar } from '@/components/sidebar/settings/SettingsSidebar';
import { GeneralSettings } from '@/components/sidebar/settings/sections/GeneralSettings';
import { AccountSettings } from '@/components/sidebar/settings/sections/AccountSettings';
import { ConnectorsSettings } from '@/components/sidebar/settings/sections/ConnectorsSettings';
import { DataSettings } from '@/components/sidebar/settings/sections/DataSettings';
import { AboutSettings } from '@/components/sidebar/settings/sections/AboutSettings';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

const easeOut = [0.4, 0, 0.2, 1] as const;

export function MainContent() {
  const { activeSettingsSection, isSettingsOpen, chatInitialMessage, chatAgentKey, activeNav, closeSettings, settingsFromTasks } = useSidebar();

  const view = isSettingsOpen
    ? 'settings'
    : chatInitialMessage !== null
      ? 'chat'
      : activeNav === 'folder'
        ? 'folder'
        : 'home';

  return (
    <AnimatePresence mode="wait">
      {view === 'chat' && (
        <motion.div
          key="chat"
          className="flex-1 h-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: easeOut }}
        >
          <ChatPage initialMessage={chatInitialMessage} agentKey={chatAgentKey} />
        </motion.div>
      )}

      {view === 'home' && (
        <motion.div
          key="home"
          className="flex-1 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: easeOut }}
        >
          <HomePage />
        </motion.div>
      )}

      {view === 'folder' && (
        <motion.div
          key="folder"
          className="flex-1 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: easeOut }}
        >
          <FolderPage />
        </motion.div>
      )}

      {view === 'settings' && (
        <motion.div
          key="settings"
          className="flex-1 h-full overflow-y-auto bg-bg-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: easeOut }}
        >
          <div className="mx-auto w-full flex-1 px-4 md:px-8 max-w-7xl">
            {/* Title row — aligned */}
            <div className="flex gap-8 pt-8 pb-4 border-b border-border-default">
              <div className="w-[220px] shrink-0 px-4">
                {settingsFromTasks && (
                  <button
                    onClick={closeSettings}
                    className="flex items-center gap-1.5 mb-3 text-[13px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  >
                    <ArrowLeft className="size-[14px]" />
                    Back
                  </button>
                )}
                <h1 className="text-[24px] font-bold leading-[32px] text-text-primary"
                  style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif' }}>
                  Settings
                </h1>
              </div>
              <div className="flex-1 min-w-0 flex items-end">
                <h1 className="text-[24px] font-bold leading-[32px] tracking-[-0.18px] text-text-primary" style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>
                  {activeSettingsSection === 'dashboard' ? 'Dashboard' :
                   activeSettingsSection === 'general' ? 'General' :
                   activeSettingsSection === 'account' ? 'Account' :
                   activeSettingsSection === 'connectors' ? 'Connectors' :
                   activeSettingsSection === 'data' ? 'Data & Privacy' : 'About'}
                </h1>
              </div>
            </div>
            {/* Body */}
            <div className="flex gap-8">
              <div className="w-[220px] shrink-0 pt-2">
                <SettingsSidebar />
              </div>
              <div className="flex-1 min-w-0 pt-6 pb-20">
                {activeSettingsSection === 'dashboard' && <DashboardContent />}
                {activeSettingsSection === 'general' && <GeneralSettings />}
                {activeSettingsSection === 'account' && <AccountSettings />}
                {activeSettingsSection === 'connectors' && <ConnectorsSettings />}
                {activeSettingsSection === 'data' && <DataSettings />}
                {activeSettingsSection === 'about' && <AboutSettings />}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

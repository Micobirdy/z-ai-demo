import { useSidebar } from '@/hooks/useSidebar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SettingsPanel } from '@/components/sidebar/settings/SettingsPanel';
import { MainContent } from './MainContent';

export function AppLayout() {
  const { isSettingsOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8f8]">
      {/* Navigation sidebar */}
      <Sidebar />

      {/* Settings sidebar */}
      {isSettingsOpen && <SettingsPanel />}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <MainContent />
      </main>
    </div>
  );
}

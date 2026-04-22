import { useSidebar } from '@/hooks/useSidebar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SettingsPanel } from '@/components/sidebar/settings/SettingsPanel';
import { MainContent } from './MainContent';

export function AppLayout() {
  const { isSettingsOpen, theme } = useSidebar();
  const dk = theme === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden ${dk ? 'bg-[#161616]' : 'bg-[#F8F8F8]'}`}>
      <Sidebar />
      {isSettingsOpen && <SettingsPanel />}
      <main className="flex-1 overflow-auto">
        <MainContent />
      </main>
    </div>
  );
}

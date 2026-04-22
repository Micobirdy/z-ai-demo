import { useSidebar } from '@/hooks/useSidebar';
import { DashboardContent } from './DashboardContent';
import { HomePage } from './HomePage';

export function MainContent() {
  const { activeSettingsSection, isSettingsOpen } = useSidebar();

  if (isSettingsOpen && activeSettingsSection === 'dashboard') {
    return <DashboardContent />;
  }

  if (isSettingsOpen) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8f8f8]">
        <p className="text-[14px] text-[#0d0d0d]/40">Select Dashboard to view content</p>
      </div>
    );
  }

  return <HomePage />;
}

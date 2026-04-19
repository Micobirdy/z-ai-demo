import { useSidebar } from '@/hooks/useSidebar';
import { DashboardContent } from './DashboardContent';

export function MainContent() {
  const { activeSettingsSection, isSettingsOpen } = useSidebar();

  // When settings is open and Dashboard is selected, show the Dashboard content
  // Otherwise show default content
  if (isSettingsOpen && activeSettingsSection === 'dashboard') {
    return <DashboardContent />;
  }

  if (isSettingsOpen) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8f8f8]">
        <p className="text-[14px] text-[#0d0d0d] opacity-40">
          Select Dashboard to view content
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#f8f8f8]">
      <div className="flex max-w-md flex-col items-center gap-6 px-8 text-center">
        <div className="w-[48px] h-[48px] rounded-[16px] bg-[#f8f8f8] flex items-center justify-center">
          <img src="/icons/edit-05.svg" alt="" className="w-[24px] h-[24px]" />
        </div>
        <div>
          <h1 className="mb-2 text-[24px] font-medium text-[#0d0d0d] tracking-[-0.18px]">
            How can I help you today?
          </h1>
          <p className="text-[14px] text-[#0d0d0d] opacity-60 tracking-[-0.18px]">
            Start a new conversation or select one from the sidebar.
          </p>
        </div>
      </div>
    </div>
  );
}

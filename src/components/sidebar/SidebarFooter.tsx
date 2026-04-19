import clsx from 'clsx';
import { Settings } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

interface SidebarFooterProps {
  isExpanded: boolean;
}

export function SidebarFooter({ isExpanded }: SidebarFooterProps) {
  const { openSettings, isSettingsOpen } = useSidebar();

  return (
    <div className="border-t border-[#dbdbdb] p-[8px] shrink-0">
      <div className={clsx('flex items-center gap-[6px] p-[6px] min-w-0 rounded-[6px]', !isExpanded && 'justify-center')}>
        {/* Avatar */}
        <div className="size-[24px] shrink-0 rounded-full overflow-hidden bg-[#ccc]">
          <img src="/icons/avatar.png" alt="" className="size-full object-cover" />
        </div>

        {isExpanded && (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d] truncate">Mico Yun</span>
              <span className="text-[12px] leading-[16px] tracking-[-0.18px] text-[#0d0d0d]/50 truncate">Lite plan</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); openSettings(); }}
              aria-label="Settings"
              className={clsx(
                'size-[24px] shrink-0 rounded-[6px] flex items-center justify-center transition-colors cursor-pointer',
                isSettingsOpen
                  ? 'bg-[#0d0d0d]/[0.06] text-[#0d0d0d]/80'
                  : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04] active:bg-[#0d0d0d]/[0.08]'
              )}
            >
              <Settings className="size-[16px]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

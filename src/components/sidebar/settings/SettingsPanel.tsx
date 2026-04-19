import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { SettingsSidebar } from './SettingsSidebar';

export function SettingsPanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      className={clsx(
        'flex h-full w-[180px] shrink-0 flex-col border-r border-[#dbdbdb] bg-[#f8f8f8] overflow-hidden',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
    >
      {/* Settings title */}
      <div className="flex items-center gap-[8px] pl-[16px] pr-[8px] py-[16px] shrink-0">
        <span className="flex-1 text-[18px] font-medium leading-[20px] tracking-[-0.18px] text-[#0d0d0d] opacity-80 capitalize">
          Settings
        </span>
      </div>

      {/* Settings nav */}
      <SettingsSidebar />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom user (hidden/opacity-0 in Figma) */}
      <div className="p-[8px] opacity-0">
        <div className="flex items-center gap-[6px] p-[6px] rounded-[6px]">
          <div className="w-[32px] h-[36px] shrink-0" />
          <div className="flex-1 flex flex-col min-w-0">
            <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d] truncate">Mico Yun</span>
            <span className="text-[12px] leading-[16px] tracking-[-0.18px] text-[#0d0d0d] opacity-40 truncate">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

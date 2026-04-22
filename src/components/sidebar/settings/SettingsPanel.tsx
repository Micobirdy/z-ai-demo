import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import { SettingsSidebar } from './SettingsSidebar';

export function SettingsPanel() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      className={clsx(
        'flex h-full w-[180px] shrink-0 flex-col overflow-hidden',
        dk ? 'border-r border-white/[0.06] bg-[#161616]' : 'border-r border-[#dbdbdb] bg-[#f8f8f8]',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
    >
      <div className="flex items-center gap-[8px] pl-[16px] pr-[8px] py-[16px] shrink-0">
        <span className={`flex-1 text-[18px] font-medium leading-[20px] tracking-[-0.18px] opacity-80 capitalize ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>
          Settings
        </span>
      </div>
      <SettingsSidebar />
      <div className="flex-1" />
    </div>
  );
}

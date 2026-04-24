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
        'flex h-full w-72 shrink-0 flex-col overflow-hidden',
        dk ? 'border-r border-white/[0.06] bg-[#161616]' : 'border-r border-[#dbdbdb] bg-[#f8f8f8]',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
    >
      <div className="px-8 pt-14 flex flex-col gap-4">
        <div className="self-stretch flex flex-col">
          {/* Title with bottom border */}
          <div className={clsx(
            'px-4 pb-4 border-b flex items-start',
            dk ? 'border-white/[0.06]' : 'border-[#dbdbdb]'
          )}>
            <span className={clsx(
              'flex-1 text-2xl font-bold leading-8',
              dk ? 'text-white' : 'text-stone-950'
            )} style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif' }}>
              Settings
            </span>
          </div>
          {/* Nav items */}
          <SettingsSidebar />
        </div>
      </div>
      <div className="flex-1" />
    </div>
  );
}

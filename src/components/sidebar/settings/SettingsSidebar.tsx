import { type ComponentType } from 'react';
import { Settings, User, Gauge, Route, Database, Home } from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import type { SettingsSection } from '@/types/sidebar';

const categories: { id: SettingsSection; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'connectors', label: 'Connected apps', icon: Route },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'about', label: 'About', icon: Home },
];

export function SettingsSidebar() {
  const { activeSettingsSection, setActiveSettingsSection, theme } = useSidebar();
  const dk = theme === 'dark';

  return (
    <div className="flex flex-col gap-[4px] p-[6px]">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeSettingsSection === cat.id;
        return (
          <button key={cat.id} type="button" onClick={() => setActiveSettingsSection(cat.id)}
            className={clsx(
              'flex items-center gap-[8px] h-[36px] px-[8px] text-left transition-colors cursor-pointer rounded-[6px]',
              isActive
                ? dk ? 'bg-white/[0.08]' : 'bg-[#0d0d0d]/[0.06]'
                : dk ? 'hover:bg-white/[0.04]' : 'hover:bg-[#0d0d0d]/[0.03]'
            )}>
            <Icon className={clsx('size-[16px] shrink-0', isActive ? dk ? 'text-white' : 'text-[#0d0d0d]' : dk ? 'text-white/50' : 'text-[#0d0d0d]/60')} />
            <span className={clsx('text-[14px] leading-[20px] tracking-[-0.18px] min-w-0', isActive ? dk ? 'text-white' : 'text-[#0d0d0d]' : dk ? 'text-white/60' : 'text-[#0d0d0d]/70')}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

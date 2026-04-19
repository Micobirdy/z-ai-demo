import { type ComponentType } from 'react';
import {
  Settings,
  User,
  Gauge,
  Route,
  Database,
  Home,
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import type { SettingsSection } from '@/types/sidebar';

const categories: {
  id: SettingsSection;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'connectors', label: 'Connected apps', icon: Route },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'about', label: 'About', icon: Home },
];

export function SettingsSidebar() {
  const { activeSettingsSection, setActiveSettingsSection } = useSidebar();

  return (
    <div className="flex flex-col gap-[4px] p-[6px]">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeSettingsSection === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveSettingsSection(cat.id)}
            className={clsx(
              'flex items-center gap-[8px] h-[36px] px-[8px] text-left transition-colors cursor-pointer',
              isActive
                ? 'bg-[#0d0d0d]/[0.06] rounded-[6px]'
                : 'rounded-[6px] hover:bg-[#0d0d0d]/[0.03] active:bg-[#0d0d0d]/[0.06]'
            )}
          >
            <Icon className={clsx('size-[16px] shrink-0', isActive ? 'text-[#0d0d0d]' : 'text-[#0d0d0d]/60')} />
            <span className={clsx(
              'text-[14px] leading-[20px] tracking-[-0.18px] min-w-0',
              isActive ? 'text-[#0d0d0d]' : 'text-[#0d0d0d]/70'
            )}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

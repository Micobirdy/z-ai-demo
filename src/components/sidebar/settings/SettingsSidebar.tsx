import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import type { SettingsSection } from '@/types/sidebar';

const categories: { id: SettingsSection; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: '/icons/settings-02.svg' },
  { id: 'account', label: 'Account', icon: '/icons/user-02.svg' },
  { id: 'dashboard', label: 'Dashboard', icon: '/icons/speedometer-03.svg' },
  { id: 'connectors', label: 'Connectors', icon: '/icons/route.svg' },
  { id: 'data', label: 'Data & Privacy', icon: '/icons/database-02.svg' },
  { id: 'about', label: 'About', icon: '/icons/home-smile.svg' },
];

export function SettingsSidebar() {
  const { activeSettingsSection, setActiveSettingsSection, theme } = useSidebar();
  const dk = theme === 'dark';
  const iconFilter = dk ? 'invert(1)' : 'none';

  return (
    <div className="p-1.5 flex flex-col gap-2">
      {categories.map((cat) => {
        const isActive = activeSettingsSection === cat.id;
        return (
          <button key={cat.id} type="button" onClick={() => setActiveSettingsSection(cat.id)}
            className={clsx(
              'self-stretch h-9 p-2 rounded-md inline-flex justify-start items-center gap-2 overflow-hidden transition-colors cursor-pointer',
              isActive
                ? dk ? 'bg-white/[0.08]' : 'bg-stone-950/5'
                : dk ? 'hover:bg-white/[0.04]' : 'hover:bg-stone-950/[0.03]'
            )}>
            <div className={clsx('w-5 h-5 relative flex items-center justify-center', !isActive && 'opacity-80')}>
              <img src={cat.icon} alt="" className="w-4 h-4" style={{ filter: iconFilter }} />
            </div>
            <span className={clsx(
              'flex-1 text-sm font-normal leading-5 text-left',
              isActive
                ? dk ? 'text-white' : 'text-stone-950'
                : dk ? 'text-white/80 opacity-80' : 'text-stone-950 opacity-80'
            )} style={{ fontFamily: "'Geist', sans-serif" }}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

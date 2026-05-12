import { useRef, useState } from 'react';
import {
  PanelLeftClose, PanelLeftOpen, ArrowUpCircle, ChevronDown, Settings,
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';
import type { NavItemId } from '@/types/sidebar';

interface NavConfig {
  id: NavItemId;
  icon: string;
  label: string;
  badge?: string;
}

const cardItems: NavConfig[] = [
  { id: 'chat', icon: '/icons/edit-05.svg', label: 'Chat' },
  { id: 'agent', icon: '/icons/face-id-square.svg', label: 'Agent' },
];

const listItems: NavConfig[] = [
  { id: 'new-task', icon: '/icons/new-task.svg', label: 'New Task' },
  { id: 'expert', icon: '/icons/graduation-hat.svg', label: 'Expert', badge: 'New' },
  { id: 'folder', icon: '/icons/folder.svg', label: 'Folder' },
];

const recentItems = [
  'Design systems and scalability',
  'Onboarding teams to design sys...',
];

export function Sidebar() {
  const {
    isCollapsed, toggleCollapse,
    isExpanded, activeNav, setActiveNav, theme,
    openSettings, closeSettings, isSettingsOpen,
  } = useSidebar();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const dk = theme === 'dark';

  const showExpanded = isExpanded;

  const fg = 'text-text-primary';
  const fgMuted = 'text-text-tertiary';
  const hoverBg = 'hover:bg-bg-hover';
  const activeBg = 'bg-interactive-secondary-selected';
  const activeBgPress = 'active:bg-interactive-secondary-press';
  const toggleFg = 'text-icon-tertiary hover:text-icon-secondary';
  const sidebarBg = 'bg-bg-page';
  const borderColor = 'border-border-default';
  const iconFilter = dk ? 'invert(1)' : 'none';

  return (
    <div className={clsx(
      'relative shrink-0 transition-[width] duration-[320ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
      isCollapsed ? 'w-[56px]' : 'w-[260px]'
    )}>
      <div
        ref={sidebarRef}
        className={clsx(
          'flex h-full flex-col w-full overflow-hidden', sidebarBg, 'border-r', borderColor,
        )}
      >
        {/* Header — always same structure, collapse button fades */}
        <div className="flex items-center justify-between pl-[16px] pr-[10px] py-[10px] shrink-0">
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div className={clsx(
              'w-[24px] h-[24px] rounded-[6px] bg-[#2d2d2d] border-[0.8px] border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#444] transition-all',
              isCollapsed && logoHovered && 'opacity-0'
            )}>
              <img src="/icons/zai-logo.png" alt="Z" className="w-[16px] h-[16px] object-cover" />
            </div>
            {isCollapsed && logoHovered && (
              <button
                type="button"
                onClick={toggleCollapse}
                aria-label="Expand sidebar"
                className={`absolute inset-0 flex items-center justify-center rounded-[6px] ${toggleFg} ${hoverBg} ${activeBgPress} transition-all cursor-pointer`}
              >
                <PanelLeftOpen className="size-[16px]" />
              </button>
            )}
          </div>
          <button type="button" onClick={toggleCollapse} aria-label="Collapse sidebar"
            className={clsx(
              'w-9 h-9 flex items-center justify-center rounded-[8px] transition-all duration-200 cursor-pointer shrink-0',
              toggleFg, hoverBg, activeBgPress,
              showExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            )}>
            <PanelLeftClose className="size-[18px]" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 flex flex-col pt-[4px] px-[6px] overflow-y-auto min-h-0">
          <div className="flex flex-col gap-[16px]">
            {/* Card group — single DOM, text clips on collapse */}
            <div className={clsx(
              'relative flex flex-col gap-[2px] p-[4px] rounded-[8px] transition-[background-color,box-shadow] duration-[320ms]',
              dk ? 'bg-interactive-secondary-selected' : 'bg-bg-bg shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]'
            )}>
              {cardItems.map((item) => (
                <button key={item.id} type="button" onClick={() => { setActiveNav(item.id); closeSettings(); }}
                  className={clsx(
                    'flex items-center gap-[8px] px-[8px] py-[7px] rounded-[6px] w-full text-left cursor-pointer overflow-hidden transition-all opacity-80 hover:opacity-100',
                    activeNav === item.id ? `opacity-100 ${activeBg}` : `${hoverBg} ${activeBgPress}`
                  )}>
                  <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                    <img src={item.icon} alt="" className="w-[16px] h-[16px]" style={{ filter: iconFilter }} />
                  </div>
                  <span className={clsx(
                    'text-[14px] leading-[20px] tracking-[-0.18px] whitespace-nowrap transition-opacity duration-200',
                    fg,
                    showExpanded ? 'opacity-100' : 'opacity-0'
                  )}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* List group — single DOM */}
            <div className="flex flex-col">
              {listItems.map((item) => (
                <button key={item.id} type="button"
                  title={!showExpanded ? item.label : undefined}
                  onClick={() => { setActiveNav(item.id); closeSettings(); }}
                  className={clsx(
                    'flex items-center gap-[8px] px-[12px] py-[7px] rounded-[6px] w-full text-left cursor-pointer overflow-hidden transition-all opacity-80 hover:opacity-100',
                    activeNav === item.id ? `opacity-100 ${activeBg}` : `${hoverBg} ${activeBgPress}`
                  )}>
                  <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                    <img src={item.icon} alt="" className="w-[16px] h-[16px]" style={{ filter: iconFilter }} />
                  </div>
                  <span className={clsx(
                    'text-[14px] leading-[20px] tracking-[-0.18px] whitespace-nowrap transition-opacity duration-200 flex items-center gap-[8px] flex-1 min-w-0',
                    showExpanded ? 'opacity-100' : 'opacity-0'
                  )}>
                    <span className={fg}>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-[6px] py-[1px] rounded-[4px] text-[10px] font-medium leading-[14px] bg-interactive-primary text-text-inverted">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Recents — collapse with opacity + max-height */}
            <div className={clsx(
              'flex flex-col overflow-hidden transition-all duration-[320ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
              showExpanded ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0'
            )}>
              <button className="flex items-center gap-[4px] px-[12px] py-[6px] group cursor-pointer">
                <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fgMuted} transition-colors whitespace-nowrap`}>Zai Web</span>
                <ChevronDown className="size-[14px] text-icon-tertiary transition-colors" />
              </button>
              {recentItems.map((item, i) => (
                <button key={i} type="button" className={`px-[12px] py-[6px] text-left rounded-[6px] ${hoverBg} ${activeBgPress} transition-colors cursor-pointer`}>
                  <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg} block truncate whitespace-nowrap`}>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade */}
        <div className="flex items-center justify-center py-[8px] shrink-0 overflow-hidden">
          <button className={clsx(
            'flex items-center gap-[4px] rounded-full py-[4px] transition-all duration-[320ms] cursor-pointer',
            dk ? 'bg-[#0068e0]/20 hover:bg-[#0068e0]/30' : 'bg-[#daeeff] hover:bg-[#c3dcf9]',
            showExpanded ? 'pl-[6px] pr-[12px]' : 'px-[8px]'
          )}>
            <ArrowUpCircle className="size-[16px] text-[#0068e0] shrink-0" />
            <span className={clsx(
              'text-[13px] leading-[20px] text-[#0068e0] whitespace-nowrap overflow-hidden transition-all duration-200',
              showExpanded ? 'opacity-100 max-w-[80px]' : 'opacity-0 max-w-0'
            )}>Upgrade</span>
          </button>
        </div>

        {/* Footer */}
        <div className={`border-t p-[8px] shrink-0 ${borderColor}`}>
          <div className="flex items-center gap-[6px] p-[6px] min-w-0 rounded-[6px] overflow-hidden">
            <div className="size-[24px] shrink-0 rounded-full overflow-hidden bg-[#ccc]">
              <img src="/icons/avatar.png" alt="" className="size-full object-cover" />
            </div>
            <div className={clsx(
              'flex items-center gap-[6px] flex-1 min-w-0 transition-opacity duration-200',
              showExpanded ? 'opacity-100' : 'opacity-0'
            )}>
              <div className="flex-1 flex flex-col min-w-0">
                <span className={`text-[14px] leading-[20px] tracking-[-0.18px] truncate whitespace-nowrap ${fg}`}>{user?.name || 'User'}</span>
                <span className="text-[12px] leading-[16px] tracking-[-0.18px] truncate whitespace-nowrap text-text-tertiary">{user?.plan ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan` : ''}</span>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); openSettings(); }} aria-label="Settings"
                className={clsx(
                  'size-[24px] shrink-0 rounded-[6px] flex items-center justify-center transition-colors cursor-pointer',
                  isSettingsOpen
                    ? 'bg-interactive-secondary-selected text-icon-primary'
                    : 'text-icon-tertiary hover:text-icon-secondary hover:bg-bg-hover'
                )}>
                <Settings className="size-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

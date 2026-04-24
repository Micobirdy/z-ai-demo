import { useRef, useState, useEffect, type ComponentType } from 'react';
import {
  SquarePen, ScanFace, Plus, GraduationCap, Folder,
  PanelLeftClose, PanelLeftOpen, ArrowUpCircle, ChevronDown, Settings,
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import type { NavItemId } from '@/types/sidebar';

interface NavConfig {
  id: NavItemId;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

const cardItems: NavConfig[] = [
  { id: 'chat', icon: SquarePen, label: 'Chat' },
  { id: 'agent', icon: ScanFace, label: 'Agent' },
];

const listItems: NavConfig[] = [
  { id: 'new-task', icon: Plus, label: 'New Task' },
  { id: 'expert', icon: GraduationCap, label: 'Expert', badge: 'New' },
  { id: 'folder', icon: Folder, label: 'Folder' },
];

const recentItems = [
  'Design systems and scalability',
  'Onboarding teams to design sys...',
];

export function Sidebar() {
  const {
    isCollapsed, toggleCollapse, isHoverExpanded, setHoverExpanded,
    isExpanded, activeNav, setActiveNav, theme,
    openSettings, closeSettings, isSettingsOpen,
  } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const dk = theme === 'dark';

  const showExpanded = isExpanded;

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/50' : 'text-[#0d0d0d]/50';
  const hoverBg = dk ? 'hover:bg-white/[0.06]' : 'hover:bg-[#0d0d0d]/[0.04]';
  const activeBg = dk ? 'bg-white/[0.08]' : 'bg-[#0d0d0d]/[0.04]';
  const activeBgPress = dk ? 'active:bg-white/[0.1]' : 'active:bg-[#0d0d0d]/[0.08]';
  const toggleFg = dk ? 'text-white/40 hover:text-white/80' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/80';
  const sidebarBg = dk ? 'bg-[#161616]' : 'bg-[#f8f8f8]';
  const borderColor = dk ? 'border-white/[0.06]' : 'border-[#dbdbdb]';

  return (
    <div className={clsx(
      'relative shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
      isCollapsed ? 'w-[56px]' : 'w-[260px]'
    )}>
      <div
        ref={sidebarRef}
        onMouseEnter={() => isCollapsed && setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
        className={clsx(
          'flex h-full flex-col overflow-hidden', sidebarBg, 'border-r', borderColor,
          isCollapsed && isHoverExpanded && `absolute left-0 top-0 z-40 w-[260px] rounded-r-2xl ${dk ? 'shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.12)]'}`,
          !(isCollapsed && isHoverExpanded) && 'w-full',
          'transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-[16px] pr-[10px] py-[10px] shrink-0">
          {/* Logo area */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div className={clsx(
              'w-[28px] h-[28px] rounded-[6px] bg-[#2d2d2d] border-[0.8px] border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#444] transition-all',
              isCollapsed && logoHovered && 'opacity-0'
            )}>
              <img src="/icons/zai-logo.png" alt="Z" className="w-[22px] h-[22px] object-cover" />
            </div>
            {isCollapsed && logoHovered && (
              <button
                type="button"
                onClick={toggleCollapse}
                aria-label="Expand sidebar"
                className={`absolute inset-0 flex items-center justify-center rounded-[6px] ${toggleFg} ${hoverBg} ${activeBgPress} transition-all cursor-pointer`}
              >
                <PanelLeftOpen className="size-[18px]" />
              </button>
            )}
          </div>
          {/* Collapse button */}
          <button type="button" onClick={toggleCollapse} aria-label="Collapse sidebar"
            className={clsx(
              'w-9 h-9 flex items-center justify-center rounded-[8px] transition-all cursor-pointer shrink-0',
              toggleFg, hoverBg, activeBgPress,
              showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'
            )}>
            <PanelLeftClose className="size-[18px]" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 flex flex-col pt-[4px] px-[6px] overflow-y-auto min-h-0">
          <div className="flex flex-col gap-[16px]">
            {/* Card group */}
            <div className={clsx(
              'relative flex flex-col gap-[2px] p-[4px] rounded-[8px] transition-all duration-300',
              showExpanded
                ? dk ? 'bg-white/[0.06]' : 'bg-white shadow-[0_0_0_1px_rgba(219,219,219,0.8),0_2px_8px_rgba(0,0,0,0.06)]'
                : 'bg-transparent shadow-none'
            )}>
              {cardItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" onClick={() => { setActiveNav(item.id); closeSettings(); }}
                    className={clsx(
                      'flex items-center gap-[8px] px-[8px] py-[7px] rounded-[6px] w-full text-left transition-colors cursor-pointer',
                      activeNav === item.id ? activeBg : `${hoverBg} ${activeBgPress}`
                    )}>
                    <Icon className={`size-[18px] shrink-0 ${fg}`} />
                    <span className={clsx(
                      'text-[14px] leading-[20px] tracking-[-0.18px] whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-300',
                      fg,
                      showExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                    )}>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* List group */}
            <div className="flex flex-col">
              {listItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" title={!showExpanded ? item.label : undefined} onClick={() => { setActiveNav(item.id); closeSettings(); }}
                    className={clsx(
                      'flex items-center gap-[8px] px-[12px] py-[7px] rounded-[6px] w-full text-left transition-colors cursor-pointer',
                      hoverBg, activeBgPress,
                      activeNav === item.id && activeBg
                    )}>
                    <Icon className={`size-[18px] shrink-0 ${fg}`} />
                    <span className={clsx(
                      'flex items-center gap-[8px] flex-1 min-w-0 whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-300',
                      showExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
                    )}>
                      <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto px-[6px] py-[1px] rounded-[4px] text-[10px] font-medium leading-[14px] ${dk ? 'bg-white text-[#111]' : 'bg-[#0d0d0d] text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Recents */}
            <div className={clsx(
              'flex flex-col overflow-hidden transition-[opacity,max-height] duration-300',
              showExpanded ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0'
            )}>
              <button className="flex items-center gap-[4px] px-[12px] py-[6px] group cursor-pointer">
                <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fgMuted} transition-colors whitespace-nowrap`}>Zai Web</span>
                <ChevronDown className={`size-[14px] ${dk ? 'text-white/30' : 'text-[#0d0d0d]/30'} transition-colors`} />
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
        <div className="flex items-center py-[8px] px-[6px] shrink-0">
          <button className={clsx(
            'flex items-center gap-[4px] rounded-full py-[4px] transition-all cursor-pointer overflow-hidden',
            dk ? 'bg-[#0068e0]/20 hover:bg-[#0068e0]/30' : 'bg-[#daeeff] hover:bg-[#c3dcf9]',
            showExpanded ? 'pl-[6px] pr-[12px] mx-auto' : 'justify-center size-[32px] mx-auto p-0'
          )}>
            <ArrowUpCircle className={clsx('text-[#0068e0] shrink-0', showExpanded ? 'size-[18px]' : 'size-[16px]')} />
            <span className={clsx(
              'text-[13px] leading-[20px] text-[#0068e0] whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-300',
              showExpanded ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'
            )}>Upgrade</span>
          </button>
        </div>

        {/* Footer */}
        <div className={`border-t p-[8px] shrink-0 ${borderColor}`}>
          <div className="flex items-center gap-[6px] p-[6px] min-w-0 rounded-[6px]">
            <div className="size-[24px] shrink-0 rounded-full overflow-hidden bg-[#ccc]">
              <img src="/icons/avatar.png" alt="" className="size-full object-cover" />
            </div>
            <div className={clsx(
              'flex items-center gap-[6px] flex-1 min-w-0 overflow-hidden transition-[opacity,max-width] duration-300',
              showExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'
            )}>
              <div className="flex-1 flex flex-col min-w-0">
                <span className={`text-[14px] leading-[20px] tracking-[-0.18px] truncate whitespace-nowrap ${fg}`}>Mico Yun</span>
                <span className={`text-[12px] leading-[16px] tracking-[-0.18px] truncate whitespace-nowrap ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>Lite plan</span>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); openSettings(); }} aria-label="Settings"
                className={clsx(
                  'size-[24px] shrink-0 rounded-[6px] flex items-center justify-center transition-colors cursor-pointer',
                  isSettingsOpen
                    ? dk ? 'bg-white/[0.1] text-white/80' : 'bg-[#0d0d0d]/[0.06] text-[#0d0d0d]/80'
                    : dk ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]'
                )}>
                <Settings className="size-[16px]" />
              </button>
            </div>
            {/* Collapsed: settings gear */}
            <button type="button" onClick={openSettings} title="Settings"
              className={clsx(
                'size-[24px] shrink-0 rounded-[6px] flex items-center justify-center transition-all cursor-pointer',
                showExpanded ? 'opacity-0 w-0 overflow-hidden pointer-events-none' : 'opacity-100 mt-0',
                isSettingsOpen
                  ? dk ? 'bg-white/[0.1] text-white/80' : 'bg-[#0d0d0d]/[0.06] text-[#0d0d0d]/80'
                  : dk ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]'
              )}>
              <Settings className="size-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

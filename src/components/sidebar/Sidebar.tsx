import { useRef, useState } from 'react';
import {
  PanelLeftClose, PanelLeftOpen, ArrowUpCircle, ChevronDown, Settings,
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';

const CHAT_HISTORY = [
  {
    group: 'Zai Web',
    items: ['Design systems and scalability', 'Onboarding teams to design syst...'],
  },
  {
    group: 'Discord',
    items: ['Design systems and scalability', 'The role of typography in design s...'],
  },
  {
    group: 'Lark',
    items: ['Design systems and scalability', 'The role of typography in design s...'],
  },
  {
    group: 'WeChat',
    items: ['Design systems and scalability', 'The role of typography in design s...'],
  },
];

export function Sidebar() {
  const {
    isCollapsed, toggleCollapse,
    isExpanded, activeNav, setActiveNav, theme,
    openSettings, closeSettings, isSettingsOpen,
    chatHistory, clearChat,
  } = useSidebar();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'Zai Web': true });
  const dk = theme === 'dark';
  const effectiveNav = isSettingsOpen ? null : activeNav;

  const showExpanded = isExpanded;

  const fg = 'text-text-primary';
  const hoverBg = 'hover:bg-bg-hover';
  const activeBgPress = 'active:bg-interactive-secondary-press';
  const toggleFg = 'text-icon-tertiary hover:text-icon-secondary';
  const sidebarBg = 'bg-bg-page';
  const borderColor = 'border-border-default';
  const iconFilter = dk ? 'invert(1)' : 'none';

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className={clsx(
      'relative shrink-0 transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0,1)]',
      isCollapsed ? 'w-[56px]' : 'w-[260px]'
    )}>
      <div
        ref={sidebarRef}
        className={clsx(
          'flex h-full flex-col w-full overflow-hidden', sidebarBg, 'border-r', borderColor,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[8px] py-[8px] shrink-0">
          <div
            className="relative p-[8px]"
            onMouseEnter={() => isCollapsed && setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div className={clsx(
              'w-[24px] h-[24px] rounded-[4px] bg-[#2d2d2d] border-[0.8px] border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#444] transition-all',
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
                  <path d="M5.5 2.5v11" stroke="currentColor" strokeWidth="1.33"/>
                </svg>
              </button>
            )}
          </div>
          <button type="button" onClick={toggleCollapse} aria-label="Collapse sidebar"
            className={clsx(
              'w-9 h-9 flex items-center justify-center rounded-[8px] transition-all duration-200 cursor-pointer shrink-0',
              'text-icon-secondary hover:text-icon-primary hover:bg-bg-hover active:bg-interactive-secondary-press',
              showExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            )}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.33"/>
              <path d="M5.5 2.5v11" stroke="currentColor" strokeWidth="1.33"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 flex flex-col px-[8px] pt-[6px] overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
          <div className="flex flex-col gap-[20px]">

            {/* Group 1: New Chat / Agent / Folder */}
            <div className="flex flex-col gap-[4px]">
              {/* New Chat */}
              <button type="button"
                onClick={() => { setActiveNav('chat'); closeSettings(); clearChat(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200',
                  effectiveNav ==='chat' ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <div className={clsx(
                    "w-[20px] h-[20px] rounded-full flex items-center justify-center",
                    dk ? "bg-white/10" : "bg-neutral-900/10"
                  )}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1.5v7M1.5 5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={fg} />
                    </svg>
                  </div>
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>New Chat</span>
              </button>

              {/* Agent */}
              <button type="button"
                onClick={() => { setActiveNav('agent'); closeSettings(); clearChat(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200 overflow-hidden',
                  effectiveNav ==='agent'
                    ? clsx('bg-interactive-secondary-selected', 'opacity-100')
                    : 'opacity-80 hover:opacity-100 hover:bg-bg-hover'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <img src="/icons/face-id-square.svg" alt="" className="w-[16px] h-[16px]" style={{ filter: iconFilter }} />
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>Agent</span>
              </button>

              {/* Folder */}
              <button type="button"
                onClick={() => { setActiveNav('folder'); closeSettings(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200 overflow-hidden',
                  effectiveNav ==='folder'
                    ? clsx('bg-interactive-secondary-selected', 'opacity-100')
                    : 'opacity-80 hover:opacity-100 hover:bg-bg-hover'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <img src="/icons/folder.svg" alt="" className="w-[15px] h-[15px]" style={{ filter: iconFilter }} />
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>Folder</span>
              </button>
            </div>

            {/* Group 2: AI PPT / Full-stack / Expert */}
            <div className="flex flex-col gap-[4px]">
              {/* AI PPT */}
              <button type="button"
                onClick={() => { setActiveNav('ai-ppt'); closeSettings(); clearChat(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200 overflow-hidden',
                  effectiveNav ==='ai-ppt'
                    ? clsx('bg-interactive-secondary-selected', 'opacity-100')
                    : 'opacity-80 hover:opacity-100 hover:bg-bg-hover'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4.6665 3.99826V2.8427C4.6665 2.2536 5.14406 1.77603 5.73317 1.77603H10.2665C10.8556 1.77603 11.3332 2.2536 11.3332 2.8427V3.99826" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.3335 6.66667V5.33333C3.3335 4.59695 3.93045 4 4.66683 4H11.3335C12.0699 4 12.6668 4.59695 12.6668 5.33333V6.66667" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.6667 6.66666H3.33333C2.59695 6.66666 2 7.26359 2 7.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.4031 14.6667 14 14.0697 14 13.3333V7.99999C14 7.26359 13.4031 6.66666 12.6667 6.66666Z" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>AI PPT</span>
              </button>

              {/* Full-stack */}
              <button type="button"
                onClick={() => { setActiveNav('full-stack'); closeSettings(); clearChat(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200 overflow-hidden',
                  effectiveNav ==='full-stack'
                    ? clsx('bg-interactive-secondary-selected', 'opacity-100')
                    : 'opacity-80 hover:opacity-100 hover:bg-bg-hover'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14.6666 6H1.33325M9.33325 11.6667L10.9999 10L9.33325 8.33333M6.66659 8.33333L4.99992 10L6.66659 11.6667M1.33325 5.2L1.33325 10.8C1.33325 11.9201 1.33325 12.4802 1.55124 12.908C1.74299 13.2843 2.04895 13.5903 2.42527 13.782C2.85309 14 3.41315 14 4.53325 14H11.4666C12.5867 14 13.1467 14 13.5746 13.782C13.9509 13.5903 14.2569 13.2843 14.4486 12.908C14.6666 12.4802 14.6666 11.9201 14.6666 10.8V5.2C14.6666 4.0799 14.6666 3.51984 14.4486 3.09202C14.2569 2.7157 13.9509 2.40973 13.5746 2.21799C13.1467 2 12.5867 2 11.4666 2L4.53325 2C3.41315 2 2.85309 2 2.42527 2.21799C2.04895 2.40973 1.74299 2.71569 1.55124 3.09202C1.33325 3.51984 1.33325 4.0799 1.33325 5.2Z" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>Full-stack</span>
              </button>

              {/* Expert */}
              <button type="button"
                onClick={() => { setActiveNav('expert'); closeSettings(); }}
                className={clsx(
                  'flex items-center gap-[8px] px-[10px] py-[8px] rounded-[6px] w-full text-left cursor-pointer transition-all duration-200 overflow-hidden',
                  effectiveNav ==='expert'
                    ? clsx('bg-interactive-secondary-selected', 'opacity-100')
                    : 'opacity-80 hover:opacity-100 hover:bg-bg-hover'
                )}>
                <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                  <img src="/icons/graduation-hat.svg" alt="" className="w-[18px] h-[18px]" style={{ filter: iconFilter }} />
                </div>
                <span className={clsx(
                  'text-[14px] leading-[20px] whitespace-nowrap transition-opacity duration-200',
                  fg,
                  showExpanded ? 'opacity-100' : 'opacity-0'
                )} style={{ fontFamily: "'Geist', sans-serif" }}>Expert</span>
              </button>
            </div>

            {/* Group 3: Chat history folders */}
            <div className={clsx(
              'flex flex-col gap-[10px] overflow-hidden transition-all duration-[320ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
              showExpanded ? 'opacity-100 max-h-[600px]' : 'opacity-0 max-h-0'
            )}>
              {CHAT_HISTORY.map((section) => {
                const isOpen = expandedGroups[section.group] ?? false;
                return (
                  <div key={section.group} className="flex flex-col">
                    <button
                      onClick={() => toggleGroup(section.group)}
                      className="flex items-center gap-[6px] px-[16px] py-[8px] cursor-pointer rounded-[10px] hover:bg-bg-hover transition-colors"
                    >
                      <span className="text-[14px] leading-[20px] opacity-60 text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{section.group}</span>
                      <ChevronDown className={clsx(
                        "size-[16px] text-icon-primary opacity-40 transition-transform duration-200",
                        !isOpen && "-rotate-90"
                      )} />
                    </button>
                    <div className={clsx(
                      'flex flex-col overflow-hidden transition-all duration-200',
                      isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                    )}>
                      {(chatHistory.length > 0 ? chatHistory.slice(0, 2).map(h => h.title) : section.items).map((item, i) => (
                        <button
                          key={i}
                          className="px-[16px] py-[8px] text-left rounded-[6px] hover:bg-bg-hover transition-colors cursor-pointer overflow-hidden"
                        >
                          <span className="text-[14px] leading-[20px] text-text-primary opacity-80 block truncate" style={{ fontFamily: "'Geist', sans-serif" }}>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upgrade */}
        <div className="flex items-center justify-center py-[8px] mb-[8px] shrink-0">
          <button className={clsx(
            'flex items-center justify-center gap-[4px] rounded-full py-[4px] transition-all duration-[320ms] cursor-pointer min-w-[28px]',
            dk ? 'bg-[#0068e0]/20 hover:bg-[#0068e0]/30' : 'bg-[#dbeafe] hover:bg-[#bfdbfe]',
            showExpanded ? 'pl-[8px] pr-[12px]' : 'p-[6px]'
          )}>
            <ArrowUpCircle className="size-[16px] text-[#0068e0] shrink-0 flex-none" />
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
                <span className={`text-[14px] leading-[20px] truncate whitespace-nowrap ${fg}`} style={{ fontFamily: "'Geist', sans-serif" }}>{user?.name || 'User'}</span>
                <span className="text-[12px] leading-[16px] truncate whitespace-nowrap text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{user?.plan ? `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan` : ''}</span>
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

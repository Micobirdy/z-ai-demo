import { useRef, type ComponentType } from 'react';
import {
  PenSquare,
  ScanFace,
  Plus,
  GraduationCap,
  FolderClosed,
  PanelLeft,
  ArrowUpCircle,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '@/hooks/useSidebar';
import { SidebarFooter } from './SidebarFooter';
import type { NavItemId } from '@/types/sidebar';

interface NavConfig {
  id: NavItemId;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

const cardItems: NavConfig[] = [
  { id: 'chat', icon: PenSquare, label: 'Chat' },
  { id: 'agent', icon: ScanFace, label: 'Agent' },
];

const listItems: NavConfig[] = [
  { id: 'new-task', icon: Plus, label: 'New Task' },
  { id: 'expert', icon: GraduationCap, label: 'Expert', badge: 'New' },
  { id: 'folder', icon: FolderClosed, label: 'Folder' },
];

const recentItems = [
  'Design systems and scalability',
  'Onboarding teams to design sys...',
];

export function Sidebar() {
  const {
    isCollapsed,
    toggleCollapse,
    isHoverExpanded,
    setHoverExpanded,
    isExpanded,
    activeNav,
    setActiveNav,
  } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={clsx(
        'relative shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        isCollapsed ? 'w-[56px]' : 'w-[260px]'
      )}
    >
      <div
        ref={sidebarRef}
        onMouseEnter={() => isCollapsed && setHoverExpanded(true)}
        onMouseLeave={() => setHoverExpanded(false)}
        className={clsx(
          'flex h-full flex-col border-r border-[#dbdbdb] bg-[#f8f8f8]',
          isCollapsed && isHoverExpanded
            ? 'absolute left-0 top-0 z-40 w-[260px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-r-2xl'
            : 'w-full',
          'transition-[width,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]'
        )}
      >
        {/* ── Header: Logo + Toggle ── */}
        <div className="flex items-center justify-between pl-[16px] pr-[10px] py-[10px] shrink-0">
          <div
            className="w-[28px] h-[28px] rounded-[6px] bg-[#2d2d2d] border-[0.8px] border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#444] transition-colors"
            onClick={isCollapsed ? toggleCollapse : undefined}
          >
            <img src="/icons/zai-logo.png" alt="Z" className="w-[22px] h-[22px] object-cover" />
          </div>
          {isExpanded && !isHoverExpanded && (
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              className="size-[28px] flex items-center justify-center rounded-[6px] text-[#0d0d0d]/40 hover:text-[#0d0d0d]/80 hover:bg-[#0d0d0d]/[0.04] active:bg-[#0d0d0d]/[0.08] transition-all cursor-pointer"
            >
              <PanelLeft className="size-[18px]" />
            </button>
          )}
        </div>

        {/* ── Nav area ── */}
        <div className="flex-1 flex flex-col pt-[4px] px-[6px] overflow-y-auto min-h-0">
          <div className="flex flex-col gap-[16px]">

            {/* Card group: Chat & Agent */}
            {isExpanded ? (
              <div className="relative flex flex-col gap-[2px] p-[4px] rounded-[8px] bg-white shadow-[0_0_0_1px_rgba(219,219,219,0.8),0_2px_8px_rgba(0,0,0,0.06)]">
                {cardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={clsx(
                        'flex items-center gap-[8px] px-[8px] py-[7px] rounded-[6px] w-full text-left transition-colors cursor-pointer',
                        activeNav === item.id
                          ? 'bg-[#0d0d0d]/[0.04]'
                          : 'hover:bg-[#0d0d0d]/[0.03] active:bg-[#0d0d0d]/[0.06]'
                      )}
                    >
                      <Icon className="size-[18px] shrink-0 text-[#0d0d0d]" />
                      <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[2px]">
                {cardItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.label}
                      onClick={() => setActiveNav(item.id)}
                      className={clsx(
                        'flex items-center justify-center size-[36px] rounded-[6px] transition-colors cursor-pointer',
                        activeNav === item.id
                          ? 'bg-[#0d0d0d]/[0.04]'
                          : 'hover:bg-[#0d0d0d]/[0.04] active:bg-[#0d0d0d]/[0.08]'
                      )}
                    >
                      <Icon className="size-[18px] text-[#0d0d0d]" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* List group: New Task, Expert, Folder */}
            <div className={clsx('flex flex-col', !isExpanded && 'items-center gap-[2px]')}>
              {listItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={!isExpanded ? item.label : undefined}
                    onClick={() => setActiveNav(item.id)}
                    className={clsx(
                      'flex items-center transition-colors cursor-pointer',
                      isExpanded
                        ? 'gap-[8px] px-[12px] py-[7px] w-full text-left rounded-[6px] hover:bg-[#0d0d0d]/[0.03] active:bg-[#0d0d0d]/[0.06]'
                        : 'justify-center size-[36px] rounded-[6px] hover:bg-[#0d0d0d]/[0.04] active:bg-[#0d0d0d]/[0.08]',
                      activeNav === item.id && 'bg-[#0d0d0d]/[0.04]'
                    )}
                  >
                    <Icon className="size-[18px] shrink-0 text-[#0d0d0d]" />
                    {isExpanded && (
                      <>
                        <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d]">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-[6px] py-[1px] rounded-[4px] bg-[#0d0d0d] text-[10px] font-medium text-white leading-[14px]">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Recents */}
            {isExpanded && (
              <div className="flex flex-col">
                <button className="flex items-center gap-[4px] px-[12px] py-[6px] group cursor-pointer">
                  <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d]/50 group-hover:text-[#0d0d0d]/70 transition-colors">
                    Zai Web
                  </span>
                  <ChevronDown className="size-[14px] text-[#0d0d0d]/30 group-hover:text-[#0d0d0d]/50 transition-colors" />
                </button>
                {recentItems.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    className="px-[12px] py-[6px] text-left rounded-[6px] hover:bg-[#0d0d0d]/[0.03] active:bg-[#0d0d0d]/[0.06] transition-colors cursor-pointer"
                  >
                    <span className="text-[14px] leading-[20px] tracking-[-0.18px] text-[#0d0d0d] block truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Upgrade ── */}
        <div className="flex items-center justify-center py-[8px] shrink-0">
          {isExpanded ? (
            <button className="flex items-center gap-[4px] bg-[#daeeff] rounded-full pl-[6px] pr-[12px] py-[4px] hover:bg-[#c3dcf9] active:bg-[#b0d0f5] transition-colors cursor-pointer">
              <ArrowUpCircle className="size-[18px] text-[#0068e0]" />
              <span className="text-[13px] leading-[20px] text-[#0068e0]">Upgrade</span>
            </button>
          ) : (
            <button title="Upgrade" className="flex items-center justify-center size-[32px] rounded-full bg-[#daeeff] hover:bg-[#c3dcf9] active:bg-[#b0d0f5] transition-colors cursor-pointer">
              <ArrowUpCircle className="size-[16px] text-[#0068e0]" />
            </button>
          )}
        </div>

        {/* ── Footer ── */}
        <SidebarFooter isExpanded={isExpanded} />
      </div>
    </div>
  );
}

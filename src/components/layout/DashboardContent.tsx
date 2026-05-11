import { useState } from 'react';
import { Info, RefreshCw, Lock, ExternalLink, Star, ClipboardList, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSidebar } from '@/hooks/useSidebar';

export function DashboardContent() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';

  return (
    <div className="flex flex-col gap-[32px]">
      {/* Title */}
      <div>
        <h1 className="text-[24px] font-medium leading-[32px] tracking-[-0.18px] text-text-primary"
          style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif' }}>
          Dashboard
        </h1>
      </div>

        {/* Pro alert */}
        <div className={`rounded-[12px] border border-border-default overflow-hidden ${dk ? 'bg-bg-overlay' : 'bg-bg-bg'}`}>
          <div className="px-[16px]">
            <div className="flex items-center justify-between py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Star className="size-[16px] text-text-primary fill-text-primary" />
                <span className="text-[16px] font-medium leading-[32px] tracking-[-0.18px] text-text-primary">Pro</span>
              </div>
              <button className="flex items-center gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[13px] leading-[20px] transition-colors cursor-pointer bg-interactive-primary text-text-inverted hover:opacity-90">
                Manage
                <ExternalLink className="size-[14px]" />
              </button>
            </div>
            <div className="h-px bg-border-default" />
            <div className="flex items-center justify-between py-[12px]">
              <span className="text-[13px] leading-[20px] tracking-[-0.18px] text-text-tertiary">Developer Professional Edition</span>
              <span className="text-[13px] leading-[20px] tracking-[-0.18px] text-text-tertiary">Valid until: May 3, 2026</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3">
          <StatCard label="Tokens used today" value="84.3K" sub="+12% vs. yesterday" badge="Usage" first dk={dk} />
          <StatCard label="Total tokens used" value="1.03M" sub="Month to date (MTD)" badge="Usage" dk={dk} />
          <StatCard label="Total Available Tokens" value="15%" sub="Package" badge="Details" last dk={dk} />
        </div>

        {/* Functional Quota */}
        <div className="flex flex-col">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] text-text-primary">Functional Quota</h2>
          <p className="text-[12px] leading-[16px] tracking-[-0.18px] mb-[12px] text-text-tertiary">
            All usage statistics and quota resets are calculated based on the UTC+0 time zone.
          </p>
          <div className="flex flex-col gap-[4px]">
            <QuotaRow label="Advanced Search" value="Unlimited" progress={100} dk={dk} />
            <QuotaRow label="Agent Mode" value="0 / 20" progress={0} hasInfo dk={dk} />
            <QuotaRow label="Long-running task" value="1 / 3" progress={33} hasInfo dk={dk} />
            <QuotaRow label="Cron jobs" value="2 / 5" progress={40} dk={dk} />
          </div>
        </div>

        {/* Cron jobs */}
        <div className="flex flex-col">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] text-text-primary">Cron jobs</h2>
          <div className="flex flex-col gap-[16px] mt-[4px]">
            <CronGroup platform="Lark" platformIcon="lark" dk={dk} tasks={[
              { id: '1', text: 'Summarize the report and share it with everyone in the group within ten minutes.', interval: 'Every 2 hours', status: 'running' },
              { id: '2', text: 'Send me stock market open reminders every morning.', interval: 'Weds at 7AM', status: 'idle' },
            ]} />
            <CronGroup platform="WeChat" platformIcon="wechat" dk={dk} tasks={[
              { id: '3', text: 'Complete the research document for the prospective AI product before 3 PM.', interval: 'Starts in 30min', status: 'idle' },
            ]} />
            <CronGroup platform="Discord" platformIcon="discord" dk={dk} tasks={[
              { id: '4', text: 'Design a banner on the canvas and develop it to the cursor.', interval: 'Daily 8PM', status: 'idle' },
            ]} />
          </div>
        </div>

        {/* Sandbox */}
        <div className="flex flex-col">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] text-text-primary">Sandbox</h2>
          <div className="grid grid-cols-2 gap-[16px] mt-[4px]">
            <SandboxCard status="Live" expiryLabel="Expires in" expiryValue="5D" title="Super Z AI Assistant Manual" tag="Release" dk={dk} />
            <SandboxCard status="Live" expiryLabel="Expires in" expiryValue="2h" title="StarCraft Game Dev Update" tag="Release" dk={dk} />
          </div>
        </div>
      </div>
  );
}

function StatCard({ label, value, sub, badge, first, last, dk }: {
  label: string; value: string; sub: string; badge: string; first?: boolean; last?: boolean; dk: boolean;
}) {
  return (
    <div className={`border border-border-default p-[24px] flex flex-col justify-between h-[148px] ${
      dk ? 'bg-bg-overlay' : 'bg-bg-bg'
    } ${first ? 'rounded-l-[12px]' : '-ml-px'} ${last ? 'rounded-r-[12px]' : ''}`}>
      <div>
        <p className="text-[13px] leading-[24px] tracking-[-0.18px] text-text-tertiary">{label}</p>
        <p className="text-[32px] font-medium leading-[40px] tracking-[-0.5px] text-text-primary">{value}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <span className="text-[13px] leading-[24px] tracking-[-0.18px] text-text-tertiary">{sub}</span>
        <span className={`px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-bg-subtle text-text-tertiary' : 'bg-bg-surface text-text-tertiary'}`}>{badge}</span>
      </div>
    </div>
  );
}

function QuotaRow({ label, value, progress, hasInfo, dk }: {
  label: string; value: string; progress: number; hasInfo?: boolean; dk: boolean;
}) {
  return (
    <div className="py-[6px]">
      <div className="flex items-center justify-between mb-[6px]">
        <div className="flex items-center gap-[4px]">
          <span className="text-[12px] leading-[16px] tracking-[-0.18px] text-text-secondary">{label}</span>
          {hasInfo && <Info className="size-[14px] cursor-help text-icon-tertiary" />}
        </div>
        <span className="text-[12px] leading-[16px] tracking-[-0.18px] text-text-secondary">{value}</span>
      </div>
      <Progress value={progress} className={`[&_[data-slot=progress-track]]:h-[6px] [&_[data-slot=progress-indicator]]:rounded-full ${
        dk
          ? '[&_[data-slot=progress-track]]:bg-bg-subtle [&_[data-slot=progress-indicator]]:bg-text-tertiary'
          : '[&_[data-slot=progress-track]]:bg-bg-surface [&_[data-slot=progress-indicator]]:bg-text-tertiary'
      }`} />
    </div>
  );
}

const PLATFORM_ICONS: Record<string, JSX.Element> = {
  lark: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="4" fill="#3370FF"/><path d="M5.5 8.5L10 5l4.5 3.5L10 12 5.5 8.5z" fill="#fff"/><path d="M10 12v3l4.5-3.5" fill="#fff" fillOpacity="0.7"/></svg>
  ),
  wechat: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="4" fill="#07C160"/><circle cx="8" cy="9" r="3.5" fill="#fff"/><circle cx="12.5" cy="11" r="2.8" fill="#fff" fillOpacity="0.85"/></svg>
  ),
  discord: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="4" fill="#7C5CFC"/><path d="M7.5 8.5a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2z" fill="#fff"/><path d="M6 7c1.5-1 3-1.2 4-1.2s2.5.2 4 1.2M6 13c1.5 1 3 1.2 4 1.2s2.5-.2 4-1.2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
  ),
};

interface CronTask {
  id: string;
  text: string;
  interval: string;
  status: 'running' | 'paused' | 'idle';
}

function CronGroup({ platform, platformIcon, tasks: initialTasks, dk }: {
  platform: string; platformIcon: string; tasks: CronTask[]; dk: boolean;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const togglePause = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'paused' ? 'running' : 'paused' as CronTask['status'] } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-[8px] py-[6px]">
        {PLATFORM_ICONS[platformIcon] || <div className="size-[20px] rounded-full bg-text-tertiary" />}
        <span className="text-[14px] leading-[20px] tracking-[-0.18px] font-medium text-text-primary">{platform}</span>
      </div>
      {tasks.map((task) => {
        const isHovered = hoveredId === task.id;
        const isRunning = task.status === 'running';
        const isPaused = task.status === 'paused';
        return (
          <div
            key={task.id}
            onMouseEnter={() => setHoveredId(task.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`flex items-center gap-[8px] py-[10px] px-[8px] -mx-[8px] rounded-[10px] transition-colors ${
              isRunning && !isPaused
                ? dk ? 'bg-accent-blue-subtle/40' : 'bg-bg-surface'
                : isHovered
                  ? dk ? 'bg-bg-subtle/50' : 'bg-bg-surface'
                  : ''
            } ${isPaused ? 'opacity-50' : ''}`}
          >
            <div className="size-[16px] flex items-center justify-center shrink-0">
              {isRunning && !isPaused ? (
                <div className="size-[8px] rounded-full bg-accent-green animate-pulse" />
              ) : (
                <div className="size-[12px] rounded-full border-[1.5px] border-border-default" />
              )}
            </div>
            <span className={`flex-1 text-[14px] leading-[20px] tracking-[-0.18px] ${isPaused ? 'line-through' : ''} text-text-secondary`}>{task.text}</span>

            {/* Right side — fixed width, swap content on hover */}
            <div className="w-[140px] flex items-center justify-end shrink-0">
              {isHovered ? (
                <div className="flex items-center gap-[2px]">
                  <button className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors text-icon-tertiary hover:text-icon-primary hover:bg-bg-hover" title="Details">
                    <ClipboardList className="size-[14px]" />
                  </button>
                  <button onClick={() => togglePause(task.id)} className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors text-icon-tertiary hover:text-icon-primary hover:bg-bg-hover" title={isPaused ? 'Resume' : 'Pause'}>
                    {isPaused ? <PlayCircle className="size-[14px]" /> : <PauseCircle className="size-[14px]" />}
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors text-icon-tertiary hover:text-accent-red hover:bg-accent-red-subtle" title="Delete">
                    <Trash2 className="size-[14px]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-[4px]">
                  <RefreshCw className="size-[14px] text-accent-green" />
                  <span className="text-[12px] leading-[20px] text-accent-green tracking-[-0.18px] whitespace-nowrap">{task.interval}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SandboxCard({ status, expiryLabel, expiryValue, title, tag, dk }: {
  status: string; expiryLabel: string; expiryValue: string; title: string; tag: string; dk: boolean;
}) {
  return (
    <div className={`rounded-[12px] border border-border-default overflow-hidden relative h-[120px] flex flex-col justify-between p-[16px] hover:shadow-sm transition-shadow cursor-pointer ${
      dk ? 'bg-bg-overlay' : 'bg-bg-bg'
    }`}>
      <div className="flex items-center justify-between relative z-10">
        <span className="px-[6px] py-[2px] rounded-[4px] text-[12px] leading-[16px] font-medium bg-accent-green-subtle text-accent-green-text">{status}</span>
        <span className="text-[12px] leading-[20px] tracking-[-0.18px] text-text-tertiary">
          {expiryLabel} <span className="text-accent-green font-medium">{expiryValue}</span>
        </span>
      </div>
      <span className="text-[14px] leading-[20px] tracking-[-0.18px] relative z-10 text-text-primary">{title}</span>
      <div className="relative z-10">
        <span className={`inline-block px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-bg-subtle text-text-tertiary' : 'bg-bg-surface text-text-tertiary'}`}>{tag}</span>
      </div>
    </div>
  );
}

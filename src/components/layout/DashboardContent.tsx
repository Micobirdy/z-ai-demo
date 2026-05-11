import { Info, RefreshCw, Lock, ExternalLink, Star } from 'lucide-react';
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
            <CronGroup platform="Lark" dotColor="#3b82f6" dk={dk} tasks={[
              { text: 'Summarize the report and share it with everyone in the group within ten minutes.', interval: 'Every 2 hours' },
              { text: 'Send me stock market open reminders every morning.', interval: 'Weds at 7AM' },
            ]} />
            <CronGroup platform="WeChat" dotColor="#22c55e" dk={dk} tasks={[
              { text: 'Complete the research document for the prospective AI product before 3 PM.', interval: 'Starts in 30min' },
            ]} />
            <CronGroup platform="Discord" dotColor="#a78bfa" dk={dk} tasks={[
              { text: 'Design a banner on the canvas and develop it to the cursor.', interval: 'Daily 8PM' },
            ]} />
          </div>
        </div>

        {/* Sandbox */}
        <div className="flex flex-col">
          <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] text-text-primary">Sandbox</h2>
          <div className="grid grid-cols-3 gap-[16px] mt-[4px]">
            <SandboxCard status="Live" expiry="Expires in 5D" title="Super Z AI Assistant Manual" tag="Release" dk={dk} />
            <SandboxCard status="Live" expiry="Expires in 2h" title="StarCraft Game Dev Update" tag="Release" dk={dk} />
            <SandboxCard status="" expiry="" title="—" tag="Unavailable on Trial" locked dk={dk} />
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

function CronGroup({ platform, dotColor, tasks, dk }: {
  platform: string; dotColor: string; tasks: { text: string; interval: string }[]; dk: boolean;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[6px] px-[4px]">
        <div className="size-[20px] flex items-center justify-center">
          <div className="size-[10px] rounded-full" style={{ backgroundColor: dotColor }} />
        </div>
        <span className="text-[14px] leading-[20px] tracking-[-0.18px] font-medium text-text-primary">{platform}</span>
      </div>
      {tasks.map((task, i) => (
        <div key={i} className="flex items-start gap-[6px] px-[4px]">
          <div className="size-[20px] flex items-center justify-center shrink-0 mt-px">
            <div className="size-[12px] rounded-full border-[1.5px] border-border-default" />
          </div>
          <span className="flex-1 text-[14px] leading-[20px] tracking-[-0.18px] text-text-secondary">{task.text}</span>
          <div className="flex items-center gap-[4px] shrink-0 ml-[8px]">
            <RefreshCw className="size-[14px] text-accent-green" />
            <span className="text-[12px] leading-[20px] text-accent-green tracking-[-0.18px] whitespace-nowrap">{task.interval}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SandboxCard({ status, expiry, title, tag, locked, dk }: {
  status: string; expiry: string; title: string; tag: string; locked?: boolean; dk: boolean;
}) {
  return (
    <div className={`rounded-[12px] border border-border-default overflow-hidden relative h-[120px] flex flex-col justify-between p-[16px] hover:shadow-sm transition-shadow cursor-pointer ${
      dk ? 'bg-bg-overlay' : 'bg-bg-bg'
    }`}>
      <div className={`absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none ${dk ? 'bg-gradient-to-t from-[#161616]/40 to-transparent' : 'bg-gradient-to-t from-[#f8f8f8]/40 to-transparent'}`} />
      <div className="flex items-center justify-between relative z-10">
        {status ? (
          <span className="px-[4px] py-[2px] rounded-[4px] text-[12px] leading-[16px] font-medium bg-accent-green-subtle text-accent-green-text">{status}</span>
        ) : <span />}
        {expiry && <span className="text-[12px] leading-[20px] tracking-[-0.18px] text-text-tertiary">{expiry}</span>}
      </div>
      <span className="text-[14px] leading-[20px] tracking-[-0.18px] relative z-10 text-text-primary">{title}</span>
      <div className="relative z-10">
        {locked ? (
          <span className={`inline-flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-bg-subtle text-text-tertiary' : 'bg-bg-surface text-text-tertiary'}`}>
            <Lock className="size-[12px]" />
            {tag}
          </span>
        ) : (
          <span className={`inline-block px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-bg-subtle text-text-tertiary' : 'bg-bg-surface text-text-tertiary'}`}>{tag}</span>
        )}
      </div>
    </div>
  );
}

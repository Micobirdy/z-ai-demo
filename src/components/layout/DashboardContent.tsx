import { Info, RefreshCw, Lock, ExternalLink, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSidebar } from '@/hooks/useSidebar';

export function DashboardContent() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';

  return (
    <div className={`flex-1 overflow-y-auto ${dk ? 'bg-[#161616]' : 'bg-[#f8f8f8]'}`}>
      <div className="max-w-[680px] mx-auto pt-[60px] pb-[80px] px-[40px] flex flex-col gap-[32px]">
        {/* Title */}
        <div>
          <h1 className={`text-[24px] font-medium leading-[32px] tracking-[-0.18px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>Dashboard</h1>
          <div className={`mt-[16px] h-px w-[70%] ${dk ? 'bg-white/[0.08]' : 'bg-[#e5e5e5]'}`} />
        </div>

        {/* Pro alert */}
        <div className={`rounded-[12px] border overflow-hidden ${dk ? 'border-white/[0.08] bg-white/[0.04]' : 'border-[#e5e5e5] bg-white'}`}>
          <div className="px-[16px]">
            <div className="flex items-center justify-between py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Star className={`size-[16px] ${dk ? 'text-white fill-white' : 'text-[#0d0d0d] fill-[#0d0d0d]'}`} />
                <span className={`text-[16px] font-medium leading-[32px] tracking-[-0.18px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>Pro</span>
              </div>
              <button className={`flex items-center gap-[6px] px-[12px] py-[4px] rounded-[6px] text-[13px] leading-[20px] transition-colors cursor-pointer ${
                dk ? 'bg-white text-[#161616] hover:bg-white/90' : 'bg-[#0d0d0d] text-white hover:bg-[#333]'
              }`}>
                Manage
                <ExternalLink className="size-[14px]" />
              </button>
            </div>
            <div className={`h-px ${dk ? 'bg-white/[0.08]' : 'bg-[#e5e5e5]'}`} />
            <div className="flex items-center justify-between py-[12px]">
              <span className={`text-[13px] leading-[20px] tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>Developer Professional Edition</span>
              <span className={`text-[13px] leading-[20px] tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>Valid until: May 3, 2026</span>
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
          <h2 className={`text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>Functional Quota</h2>
          <p className={`text-[12px] leading-[16px] tracking-[-0.18px] mb-[12px] ${dk ? 'text-white/30' : 'text-[#0d0d0d]/40'}`}>
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
          <h2 className={`text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>Cron jobs</h2>
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
          <h2 className={`text-[14px] font-medium leading-[20px] tracking-[-0.18px] py-[8px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>Sandbox</h2>
          <div className="grid grid-cols-3 gap-[16px] mt-[4px]">
            <SandboxCard status="Live" expiry="Expires in 5D" title="Super Z AI Assistant Manual" tag="Release" dk={dk} />
            <SandboxCard status="Live" expiry="Expires in 2h" title="StarCraft Game Dev Update" tag="Release" dk={dk} />
            <SandboxCard status="" expiry="" title="—" tag="Unavailable on Trial" locked dk={dk} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, badge, first, last, dk }: {
  label: string; value: string; sub: string; badge: string; first?: boolean; last?: boolean; dk: boolean;
}) {
  return (
    <div className={`border p-[24px] flex flex-col justify-between h-[148px] ${
      dk ? 'border-white/[0.08] bg-white/[0.04]' : 'border-[#e5e5e5] bg-white'
    } ${first ? 'rounded-l-[12px]' : '-ml-px'} ${last ? 'rounded-r-[12px]' : ''}`}>
      <div>
        <p className={`text-[13px] leading-[24px] tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>{label}</p>
        <p className={`text-[32px] font-medium leading-[40px] tracking-[-0.5px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>{value}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <span className={`text-[13px] leading-[24px] tracking-[-0.18px] ${dk ? 'text-white/30' : 'text-[#0d0d0d]/40'}`}>{sub}</span>
        <span className={`px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-white/[0.06] text-white/40' : 'bg-[#f5f5f5] text-[#0d0d0d]/50'}`}>{badge}</span>
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
          <span className={`text-[12px] leading-[16px] tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>{label}</span>
          {hasInfo && <Info className={`size-[14px] cursor-help ${dk ? 'text-white/20' : 'text-[#0d0d0d]/30'}`} />}
        </div>
        <span className={`text-[12px] leading-[16px] tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>{value}</span>
      </div>
      <Progress value={progress} className={`[&_[data-slot=progress-track]]:h-[6px] [&_[data-slot=progress-indicator]]:rounded-full ${
        dk
          ? '[&_[data-slot=progress-track]]:bg-white/[0.06] [&_[data-slot=progress-indicator]]:bg-white/20'
          : '[&_[data-slot=progress-track]]:bg-[#f0f0f0] [&_[data-slot=progress-indicator]]:bg-[#0d0d0d]/20'
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
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] font-medium ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>{platform}</span>
      </div>
      {tasks.map((task, i) => (
        <div key={i} className="flex items-start gap-[6px] px-[4px]">
          <div className="size-[20px] flex items-center justify-center shrink-0 mt-px">
            <div className={`size-[12px] rounded-full border-[1.5px] ${dk ? 'border-white/20' : 'border-[#d4d4d4]'}`} />
          </div>
          <span className={`flex-1 text-[14px] leading-[20px] tracking-[-0.18px] ${dk ? 'text-white/50' : 'text-[#0d0d0d]/60'}`}>{task.text}</span>
          <div className="flex items-center gap-[4px] shrink-0 ml-[8px]">
            <RefreshCw className="size-[14px] text-[#22c55e]/70" />
            <span className="text-[12px] leading-[20px] text-[#22c55e]/80 tracking-[-0.18px] whitespace-nowrap">{task.interval}</span>
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
    <div className={`rounded-[12px] border overflow-hidden relative h-[120px] flex flex-col justify-between p-[16px] hover:shadow-sm transition-shadow cursor-pointer ${
      dk ? 'border-white/[0.08] bg-white/[0.04]' : 'border-[#e5e5e5] bg-white'
    }`}>
      <div className={`absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none ${dk ? 'bg-gradient-to-t from-[#161616]/40 to-transparent' : 'bg-gradient-to-t from-[#f8f8f8]/40 to-transparent'}`} />
      <div className="flex items-center justify-between relative z-10">
        {status ? (
          <span className={`px-[4px] py-[2px] rounded-[4px] text-[12px] leading-[16px] font-medium ${dk ? 'bg-[#16a34a]/20 text-[#4ade80]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>{status}</span>
        ) : <span />}
        {expiry && <span className={`text-[12px] leading-[20px] tracking-[-0.18px] ${dk ? 'text-white/30' : 'text-[#0d0d0d]/40'}`}>{expiry}</span>}
      </div>
      <span className={`text-[14px] leading-[20px] tracking-[-0.18px] relative z-10 ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>{title}</span>
      <div className="relative z-10">
        {locked ? (
          <span className={`inline-flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-white/[0.06] text-white/30' : 'bg-[#f5f5f5] text-[#0d0d0d]/40'}`}>
            <Lock className="size-[12px]" />
            {tag}
          </span>
        ) : (
          <span className={`inline-block px-[8px] py-[4px] rounded-[6px] text-[11px] leading-[16px] ${dk ? 'bg-white/[0.06] text-white/40' : 'bg-[#f5f5f5] text-[#0d0d0d]/50'}`}>{tag}</span>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';

const TASKS = [
  { name: 'E-commerce Construction', schedule: 'Every 2 hours', type: 'Cron jobs' },
  { name: 'GitHub Daily Report', schedule: 'Starts in 30m', type: 'Cron jobs' },
  { name: 'StarCraft Game Dev Update', schedule: null, type: 'Full Stack' },
  { name: 'Build an official website for pet food', schedule: null, type: 'AI PPT' },
];

export function BackgroundTasksDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openSettingsFromTasks, setActiveSettingsSection } = useSidebar();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const goToDashboard = () => {
    setOpen(false);
    setActiveSettingsSection('dashboard');
    openSettingsFromTasks();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="pl-[6px] pr-[8px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden hover:bg-bg-surface transition-colors cursor-pointer"
      >
        <div className="p-[4px] rounded-full flex items-center justify-center">
          <div className="w-[8px] h-[8px] relative">
            <div className="w-[6px] h-[6px] absolute left-[1px] top-[1px] bg-green-500 rounded-full outline outline-[3px] outline-green-500/20" />
          </div>
        </div>
        <span className="opacity-80 text-[14px] font-normal leading-[20px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>
          Background Tasks
        </span>
        <div className="w-[16px] h-[16px] relative opacity-40 flex items-center justify-center">
          <ChevronDown className={cn("size-[12px] text-text-primary transition-transform duration-200", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 w-[420px] pt-[8px] bg-bg-bg rounded-[8px] overflow-hidden"
          style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.08), 0px 1px 2px rgba(16,24,40,0.05), 0px 0px 0px 1px var(--border-default), 0px 0px 1px rgba(0,0,0,0.11)' }}
        >
          <div className="px-[8px] flex flex-col gap-[2px]">
            {TASKS.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "min-h-[32px] px-[8px] py-[8px] rounded-[6px] flex items-center justify-between gap-[8px] cursor-pointer transition-colors",
                  i === 0 ? "bg-interactive-secondary-selected" : "hover:bg-bg-hover"
                )}
              >
                <div className="flex-1 flex items-center gap-[4px] min-w-0">
                  <div className="w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-spin" style={{ animationDuration: '3s' }}>
                      <circle cx="6" cy="6" r="4.5" stroke="var(--border-default)" strokeWidth="1.33" />
                      <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" stroke="var(--text-primary)" strokeWidth="1.33" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  </div>
                  <span className="opacity-80 text-[14px] font-normal leading-[20px] text-text-primary truncate" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {task.name}
                  </span>
                  {task.schedule && (
                    <div className="shrink-0 px-[4px] py-[2px] rounded-[4px] flex items-center gap-[4px]" style={{ backgroundColor: '#F4EBFF' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60 shrink-0">
                        <path d="M7 3.5v3.5l2.5 1.5" stroke="#7F56D9" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="7" cy="7" r="5" stroke="#7F56D9" strokeWidth="1.17"/>
                      </svg>
                      <span className="text-[12px] font-medium leading-[16px] whitespace-nowrap" style={{ fontFamily: "'Geist', sans-serif", color: '#7F56D9' }}>
                        {task.schedule}
                      </span>
                    </div>
                  )}
                </div>
                <span className="opacity-60 text-[12px] font-normal leading-[20px] text-text-primary whitespace-nowrap shrink-0" style={{ fontFamily: "'Geist', sans-serif" }}>
                  {task.type}
                </span>
              </div>
            ))}
          </div>

          <div className="p-[12px] border-t border-border-default mt-[4px]">
            <button
              onClick={goToDashboard}
              className="w-full px-[8px] py-[8px] bg-bg-bg rounded-[8px] flex items-center justify-center cursor-pointer transition-colors hover:bg-bg-surface"
              style={{ boxShadow: '0px 2px 3px -1px rgba(0,0,0,0.08), 0px 1px 0px rgba(0,0,0,0.02), 0px 0px 0px 1px var(--border-default)' }}
            >
              <span className="opacity-80 text-[14px] font-normal leading-[16px] text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
                Go to Dashboard
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

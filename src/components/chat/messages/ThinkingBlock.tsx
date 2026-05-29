import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  content: string;
  autoCollapse?: boolean;
  onCollapseComplete?: () => void;
}

export function ThinkingBlock({ content, autoCollapse, onCollapseComplete }: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const [visibleChunks, setVisibleChunks] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const chunkIndexRef = useRef(0);
  const autoCollapsedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chunks = useMemo(() => content.split(/\n\n+/).filter(Boolean), [content]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (chunkIndexRef.current >= chunks.length) {
      setDone(true);
      return;
    }
    const i = chunkIndexRef.current;
    const ratio = i / chunks.length;
    const baseDelay = i === 0 ? 50 : ratio < 0.15 ? 600 : ratio > 0.85 ? 450 : 250 + Math.random() * 200;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisibleChunks(prev => [...prev, chunks[chunkIndexRef.current]]);
      chunkIndexRef.current++;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      });
    }, baseDelay);
  }, [visibleChunks.length, chunks]);

  const collapseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!done || !autoCollapse || autoCollapsedRef.current) return;
    autoCollapsedRef.current = true;
    setExpanded(false);
    clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => onCollapseComplete?.(), 500);
  }, [done, autoCollapse, onCollapseComplete]);

  return (
    <div className="w-full pb-1">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="pb-2 flex items-center gap-[6px] cursor-pointer"
      >
        <div className="w-[16px] h-[20px] flex items-center justify-center shrink-0 ml-[1px]">
          {!done ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-pulse" style={{ animationDuration: '2s' }}>
              <path d="M8 12V3.33337" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 8.66667C9.4232 8.49806 8.91656 8.14708 8.556 7.66633C8.19544 7.18558 8.00036 6.60094 8 6C7.99964 6.60094 7.80456 7.18558 7.444 7.66633C7.08344 8.14708 6.5768 8.49806 6 8.66667" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.732 4.33334C11.8854 4.06767 11.9756 3.77026 11.9957 3.46414C12.0158 3.15801 11.9652 2.85137 11.8478 2.56794C11.7304 2.2845 11.5494 2.03187 11.3187 1.82959C11.0881 1.62731 10.814 1.4808 10.5176 1.4014C10.2213 1.322 9.91069 1.31183 9.6098 1.37168C9.30891 1.43154 9.02583 1.55981 8.78244 1.74657C8.53906 1.93333 8.3419 2.17358 8.20623 2.44873C8.07055 2.72388 7.99999 3.02656 8 3.33334C8.00001 3.02656 7.92945 2.72388 7.79377 2.44873C7.6581 2.17358 7.46094 1.93333 7.21756 1.74657C6.97417 1.55981 6.69109 1.43154 6.3902 1.37168C6.08931 1.31183 5.77868 1.322 5.48236 1.4014C5.18603 1.4808 4.91193 1.62731 4.68129 1.82959C4.45064 2.03187 4.26961 2.2845 4.15222 2.56794C4.03483 2.85137 3.98421 3.15801 4.00429 3.46414C4.02436 3.77026 4.11459 4.06767 4.268 4.33334" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9979 3.41663C12.3898 3.51738 12.7536 3.70599 13.0618 3.96817C13.37 4.23034 13.6144 4.55921 13.7767 4.92986C13.939 5.30051 14.0148 5.70322 13.9983 6.1075C13.9819 6.51178 13.8737 6.90702 13.6819 7.26329" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12C12.587 12 13.1576 11.8063 13.6233 11.449C14.089 11.0916 14.4238 10.5906 14.5757 10.0236C14.7276 9.45657 14.6882 8.85528 14.4636 8.31296C14.239 7.77063 13.8417 7.31758 13.3333 7.02405" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3114 11.6554C13.3581 12.0169 13.3303 12.3841 13.2295 12.7344C13.1287 13.0847 12.9572 13.4106 12.7256 13.692C12.4939 13.9734 12.207 14.2044 11.8826 14.3706C11.5582 14.5368 11.2032 14.6347 10.8394 14.6583C10.4757 14.6819 10.111 14.6307 9.76782 14.5078C9.42466 14.3849 9.11033 14.193 8.84424 13.9439C8.57815 13.6948 8.36596 13.3938 8.22077 13.0594C8.07558 12.7251 8.00047 12.3646 8.00008 12.0001C7.99969 12.3646 7.92458 12.7251 7.77939 13.0594C7.6342 13.3938 7.42201 13.6948 7.15592 13.9439C6.88983 14.193 6.5755 14.3849 6.23234 14.5078C5.88917 14.6307 5.52446 14.6819 5.16073 14.6583C4.797 14.6347 4.44197 14.5368 4.11756 14.3706C3.79315 14.2044 3.50626 13.9734 3.2746 13.692C3.04294 13.4106 2.87144 13.0847 2.77067 12.7344C2.66991 12.3841 2.64202 12.0169 2.68875 11.6554" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.99992 12C3.41292 12 2.84233 11.8063 2.37663 11.449C1.91094 11.0916 1.57617 10.5906 1.42424 10.0236C1.27231 9.45657 1.31171 8.85528 1.53634 8.31296C1.76096 7.77063 2.15825 7.31758 2.66659 7.02405" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.00199 3.41663C3.61013 3.51738 3.24633 3.70599 2.93815 3.96817C2.62997 4.23034 2.38549 4.55921 2.22322 4.92986C2.06096 5.30051 1.98517 5.70322 2.00159 6.1075C2.01801 6.51178 2.12621 6.90702 2.31799 7.26329" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12V3.33337" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 8.66667C9.4232 8.49806 8.91656 8.14708 8.556 7.66633C8.19544 7.18558 8.00036 6.60094 8 6C7.99964 6.60094 7.80456 7.18558 7.444 7.66633C7.08344 8.14708 6.5768 8.49806 6 8.66667" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.732 4.33334C11.8854 4.06767 11.9756 3.77026 11.9957 3.46414C12.0158 3.15801 11.9652 2.85137 11.8478 2.56794C11.7304 2.2845 11.5494 2.03187 11.3187 1.82959C11.0881 1.62731 10.814 1.4808 10.5176 1.4014C10.2213 1.322 9.91069 1.31183 9.6098 1.37168C9.30891 1.43154 9.02583 1.55981 8.78244 1.74657C8.53906 1.93333 8.3419 2.17358 8.20623 2.44873C8.07055 2.72388 7.99999 3.02656 8 3.33334C8.00001 3.02656 7.92945 2.72388 7.79377 2.44873C7.6581 2.17358 7.46094 1.93333 7.21756 1.74657C6.97417 1.55981 6.69109 1.43154 6.3902 1.37168C6.08931 1.31183 5.77868 1.322 5.48236 1.4014C5.18603 1.4808 4.91193 1.62731 4.68129 1.82959C4.45064 2.03187 4.26961 2.2845 4.15222 2.56794C4.03483 2.85137 3.98421 3.15801 4.00429 3.46414C4.02436 3.77026 4.11459 4.06767 4.268 4.33334" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9979 3.41663C12.3898 3.51738 12.7536 3.70599 13.0618 3.96817C13.37 4.23034 13.6144 4.55921 13.7767 4.92986C13.939 5.30051 14.0148 5.70322 13.9983 6.1075C13.9819 6.51178 13.8737 6.90702 13.6819 7.26329" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12C12.587 12 13.1576 11.8063 13.6233 11.449C14.089 11.0916 14.4238 10.5906 14.5757 10.0236C14.7276 9.45657 14.6882 8.85528 14.4636 8.31296C14.239 7.77063 13.8417 7.31758 13.3333 7.02405" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3114 11.6554C13.3581 12.0169 13.3303 12.3841 13.2295 12.7344C13.1287 13.0847 12.9572 13.4106 12.7256 13.692C12.4939 13.9734 12.207 14.2044 11.8826 14.3706C11.5582 14.5368 11.2032 14.6347 10.8394 14.6583C10.4757 14.6819 10.111 14.6307 9.76782 14.5078C9.42466 14.3849 9.11033 14.193 8.84424 13.9439C8.57815 13.6948 8.36596 13.3938 8.22077 13.0594C8.07558 12.7251 8.00047 12.3646 8.00008 12.0001C7.99969 12.3646 7.92458 12.7251 7.77939 13.0594C7.6342 13.3938 7.42201 13.6948 7.15592 13.9439C6.88983 14.193 6.5755 14.3849 6.23234 14.5078C5.88917 14.6307 5.52446 14.6819 5.16073 14.6583C4.797 14.6347 4.44197 14.5368 4.11756 14.3706C3.79315 14.2044 3.50626 13.9734 3.2746 13.692C3.04294 13.4106 2.87144 13.0847 2.77067 12.7344C2.66991 12.3841 2.64202 12.0169 2.68875 11.6554" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.99992 12C3.41292 12 2.84233 11.8063 2.37663 11.449C1.91094 11.0916 1.57617 10.5906 1.42424 10.0236C1.27231 9.45657 1.31171 8.85528 1.53634 8.31296C1.76096 7.77063 2.15825 7.31758 2.66659 7.02405" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.00199 3.41663C3.61013 3.51738 3.24633 3.70599 2.93815 3.96817C2.62997 4.23034 2.38549 4.55921 2.22322 4.92986C2.06096 5.30051 1.98517 5.70322 2.00159 6.1075C2.01801 6.51178 2.12621 6.90702 2.31799 7.26329" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-[14px] font-normal text-text-tertiary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
          思考过程
        </span>
        <div className="w-5 h-5 flex items-center justify-center">
          <ChevronRight className={cn(
            "size-[14px] text-icon-tertiary transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
            expanded && "rotate-90"
          )} />
        </div>
      </button>

      {/* Content */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          maxHeight: expanded ? '220px' : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div
          ref={scrollRef}
          className="max-h-[200px] overflow-y-auto pr-4"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}
        >
          <div className="flex">
            {/* Timeline — aligned with header icon center */}
            <div className="pl-[8px] pr-[8px] shrink-0">
              <div className="w-[1.33px] h-full bg-border-default" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5 pb-2 pr-1">
              {visibleChunks.map((chunk, i) => (
                <p
                  key={i}
                  className="text-[14px] font-normal text-text-tertiary leading-5 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out"
                  style={{ fontFamily: "'Geist', sans-serif" }}
                >
                  {chunk}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

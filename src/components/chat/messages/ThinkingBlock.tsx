import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  content: string;
  autoCollapse?: boolean;
  onCollapseComplete?: () => void;
}

export function ThinkingBlock({ content, autoCollapse, onCollapseComplete }: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const [phase, setPhase] = useState<'streaming' | 'done'>('streaming');
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const streamDuration = Math.min(content.length * 25, 6000);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPhase('done');
      if (autoCollapse) {
        setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 500);
        }, 1500);
      }
    }, streamDuration);
    return () => clearTimeout(timerRef.current);
  }, [streamDuration, autoCollapse, onCollapseComplete]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (phase !== 'streaming' || !scrollRef.current) return;
    const el = scrollRef.current;
    const totalScroll = el.scrollHeight - el.clientHeight;
    if (totalScroll <= 0) return;

    let start: number;
    let rafId: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / streamDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.scrollTop = totalScroll * eased;
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [phase, streamDuration]);

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors",
          phase === 'streaming' ? "border-accent-blue" : "border-border-default"
        )}>
          {phase === 'streaming' ? (
            <span className="w-[6px] h-[6px] rounded-full bg-accent-blue animate-pulse" />
          ) : (
            <span className="text-[9px] text-text-tertiary">⊕</span>
          )}
        </span>
        <span className="font-medium">思考过程</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-300", expanded && "rotate-90")} />
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "max-h-[172px] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
      )}>
        <div
          ref={scrollRef}
          className="relative h-[172px] overflow-y-auto pl-[28px] pr-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="text-[13px] leading-[24px] text-text-tertiary whitespace-pre-wrap" style={{ fontFamily: "'Geist', sans-serif" }}>
            {content}
          </div>

          {/* Bottom fade mask during streaming */}
          {phase === 'streaming' && (
            <div
              className="sticky bottom-0 left-0 right-0 h-[40px] pointer-events-none"
              style={{ background: 'linear-gradient(transparent, var(--bg-page))' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

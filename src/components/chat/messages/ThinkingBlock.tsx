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
  const [phase, setPhase] = useState<'reveal' | 'done'>('reveal');
  const [revealProgress, setRevealProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const startRef = useRef<number>();

  const revealDuration = 4000;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / revealDuration, 1);
      setRevealProgress(progress);

      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        if (maxScroll > 0) {
          scrollRef.current.scrollTop = maxScroll * progress;
        }
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('done');
        if (autoCollapse) {
          setTimeout(() => {
            setExpanded(false);
            setTimeout(() => onCollapseComplete?.(), 500);
          }, 1500);
        }
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [revealDuration, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors",
          phase === 'reveal' ? "border-accent-blue" : "border-border-default"
        )}>
          {phase === 'reveal' ? (
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
          className="h-[172px] overflow-y-auto pl-[28px] pr-2 relative"
          style={{ scrollbarWidth: 'none' }}
        >
          <div
            className="text-[13px] leading-[24px] text-text-tertiary whitespace-pre-wrap"
            style={{
              fontFamily: "'Geist', sans-serif",
              maskImage: phase === 'reveal'
                ? `linear-gradient(to bottom, black ${revealProgress * 100}%, transparent ${revealProgress * 100 + 8}%)`
                : 'none',
              WebkitMaskImage: phase === 'reveal'
                ? `linear-gradient(to bottom, black ${revealProgress * 100}%, transparent ${revealProgress * 100 + 8}%)`
                : 'none',
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [visibleChunks, setVisibleChunks] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const chunkIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Split content into paragraph chunks (by double newline or single newline groups)
  const chunks = content.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    if (chunkIndexRef.current >= chunks.length) {
      setDone(true);
      if (autoCollapse) {
        const t = setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 500);
        }, 1500);
        return () => clearTimeout(t);
      }
      return;
    }

    // Variable delay per chunk — longer for first/last, shorter in middle
    const i = chunkIndexRef.current;
    const ratio = i / chunks.length;
    const baseDelay = ratio < 0.2 ? 800 : ratio > 0.8 ? 600 : 350;
    const delay = baseDelay + Math.random() * 200;

    const timer = setTimeout(() => {
      setVisibleChunks(prev => [...prev, chunks[chunkIndexRef.current]]);
      chunkIndexRef.current++;

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleChunks.length, chunks, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-2">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1 group"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors",
          !done ? "border-accent-blue" : "border-border-default"
        )}>
          {!done ? (
            <span className="w-[6px] h-[6px] rounded-full bg-accent-blue animate-pulse" />
          ) : (
            <span className="text-[9px] text-text-tertiary">✓</span>
          )}
        </span>
        <span className="font-medium">{!done ? '思考中...' : '思考过程'}</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-300", expanded && "rotate-90")} />
        {!done && <span className="text-[11px] text-accent-blue ml-1 tabular-nums">{Math.round((chunkIndexRef.current / chunks.length) * 100)}%</span>}
      </button>

      {/* Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "max-h-[200px] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
      )}>
        <div
          ref={scrollRef}
          className="h-[180px] overflow-y-auto border-l-2 border-border-default ml-[8px] pl-[18px] pr-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex flex-col gap-3 py-1">
            {visibleChunks.map((chunk, i) => (
              <div
                key={i}
                className="text-[13px] leading-[22px] text-text-tertiary whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-1 duration-500"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                {chunk}
              </div>
            ))}
            {!done && (
              <div className="flex items-center gap-1 h-[22px]">
                <span className="w-[3px] h-[3px] rounded-full bg-text-tertiary/50" style={{ animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '0ms' }} />
                <span className="w-[3px] h-[3px] rounded-full bg-text-tertiary/50" style={{ animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '200ms' }} />
                <span className="w-[3px] h-[3px] rounded-full bg-text-tertiary/50" style={{ animation: 'pulse 1.4s ease-in-out infinite', animationDelay: '400ms' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

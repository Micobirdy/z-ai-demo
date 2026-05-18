import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

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

    const i = chunkIndexRef.current;
    const ratio = i / chunks.length;
    const baseDelay = i === 0 ? 50 : ratio < 0.15 ? 800 : ratio > 0.85 ? 700 : 300 + Math.random() * 250;

    const timer = setTimeout(() => {
      setVisibleChunks(prev => [...prev, chunks[chunkIndexRef.current]]);
      chunkIndexRef.current++;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      });
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [visibleChunks.length, chunks, autoCollapse, onCollapseComplete]);

  return (
    <div className="pb-4 inline-flex flex-col justify-start items-start overflow-hidden w-full">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="self-stretch pb-2 inline-flex justify-start items-center gap-1 cursor-pointer group"
      >
        {/* Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {!done ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin" style={{ animationDuration: '2s' }}>
              <circle cx="8" cy="8" r="6" stroke="var(--icon-tertiary)" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="var(--icon-tertiary)" strokeWidth="1" />
              <path d="M5.5 8L7.5 10L11 6" stroke="var(--icon-tertiary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-[14px] font-normal text-text-tertiary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
          思考过程
        </span>
        <ChevronDown className={cn("size-[16px] text-icon-tertiary transition-transform duration-300", !expanded && "-rotate-90")} />
      </button>

      {/* Content — fixed height 176px */}
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-full",
        expanded ? "max-h-[176px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="h-[176px] flex justify-start items-start">
          {/* Left line */}
          <div className="h-full px-2 flex justify-center items-center">
            <div className="w-0 h-full outline outline-1 outline-offset-[-0.5px] outline-border-default" />
          </div>

          {/* Text content */}
          <div
            ref={scrollRef}
            className="flex-1 h-full overflow-y-auto pr-2"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex flex-col gap-2.5 py-0.5">
              {visibleChunks.map((chunk, i) => (
                <div
                  key={i}
                  className="text-[14px] font-medium leading-5 text-text-tertiary whitespace-pre-wrap animate-in fade-in duration-400"
                  style={{ fontFamily: "'Geist', sans-serif" }}
                >
                  {chunk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

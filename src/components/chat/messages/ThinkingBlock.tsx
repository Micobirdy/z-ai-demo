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
  const [lineHeight, setLineHeight] = useState(0);
  const chunkIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const chunks = content.split(/\n\n+/).filter(Boolean);

  useEffect(() => {
    if (chunkIndexRef.current >= chunks.length) {
      setDone(true);
      if (autoCollapse) {
        const t = setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 600);
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
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
        if (contentRef.current) {
          setLineHeight(contentRef.current.scrollHeight);
        }
      });
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [visibleChunks.length, chunks, autoCollapse, onCollapseComplete]);

  return (
    <div className="w-full">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 cursor-pointer group py-1 mb-1"
      >
        {/* Atom icon */}
        <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
          {!done ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin" style={{ animationDuration: '3s' }}>
              <circle cx="8" cy="8" r="6" stroke="var(--text-tertiary)" strokeWidth="1.2" strokeDasharray="25" strokeDashoffset="8" strokeLinecap="round" opacity="0.6" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="var(--text-tertiary)" strokeWidth="1" opacity="0.5" />
              <path d="M5.5 8L7.5 10L11 6" stroke="var(--text-tertiary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          )}
        </div>
        <span className="text-[14px] text-text-tertiary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
          思考过程
        </span>
        <ChevronRight className={cn(
          "size-[14px] text-icon-tertiary transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
          expanded && "rotate-90"
        )} />
      </button>

      {/* Content — ease in/out collapse */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          expanded ? "opacity-100" : "opacity-0"
        )}
        style={{ maxHeight: expanded ? '200px' : '0px' }}
      >
        <div className="flex items-stretch">
          {/* Left timeline line — grows with content */}
          <div className="w-[20px] flex justify-center shrink-0 pt-0.5">
            <div
              className="w-[1px] bg-border-default transition-[height] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ height: lineHeight > 0 ? Math.min(lineHeight, 180) : 0 }}
            />
          </div>

          {/* Text content */}
          <div
            ref={scrollRef}
            className="flex-1 max-h-[180px] overflow-y-auto pr-2"
            style={{ scrollbarWidth: 'none' }}
          >
            <div ref={contentRef} className="flex flex-col gap-3 pb-2">
              {visibleChunks.map((chunk, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-[22px] text-text-tertiary whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out"
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

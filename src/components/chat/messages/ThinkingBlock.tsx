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
  const [displayedContent, setDisplayedContent] = useState('');
  const [phase, setPhase] = useState<'streaming' | 'done'>('streaming');
  const scrollRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= content.length) {
      setPhase('done');
      if (autoCollapse) {
        const t = setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 500);
        }, 1500);
        return () => clearTimeout(t);
      }
      return;
    }

    // Variable speed: fast on normal chars, pause on punctuation/newlines
    const char = content[indexRef.current];
    const isPause = char === '\n' || char === '。' || char === '…' || char === '：';
    const isSlow = char === '、' || char === '，' || char === '；';
    const delay = isPause ? 180 + Math.random() * 120
      : isSlow ? 60 + Math.random() * 40
      : 18 + Math.random() * 22;

    const chunkSize = isPause ? 1 : isSlow ? 1 : Math.floor(Math.random() * 3) + 2;

    const timer = setTimeout(() => {
      const end = Math.min(indexRef.current + chunkSize, content.length);
      indexRef.current = end;
      setDisplayedContent(content.slice(0, end));

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayedContent, content, autoCollapse, onCollapseComplete]);

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
          className="h-[172px] overflow-y-auto pl-[28px] pr-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <div
            className="text-[13px] leading-[24px] text-text-tertiary whitespace-pre-wrap"
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            {displayedContent}
          </div>
        </div>
      </div>
    </div>
  );
}

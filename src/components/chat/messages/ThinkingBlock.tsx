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
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const indexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indexRef.current >= content.length) {
      setIsStreaming(false);
      if (autoCollapse) {
        const timer = setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 500);
        }, 1500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const delay = 35 + Math.random() * 25;
    const timer = setTimeout(() => {
      const chunkSize = Math.floor(Math.random() * 2) + 1;
      const nextIndex = Math.min(indexRef.current + chunkSize, content.length);
      setDisplayedText(content.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayedText, content, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[16px] h-[16px] rounded-full border flex items-center justify-center text-[10px] transition-colors",
          isStreaming ? "border-accent-blue text-accent-blue" : "border-border-default text-text-tertiary"
        )}>⊕</span>
        <span>{isStreaming ? '思考中...' : '思考过程'}</span>
        <ChevronDown className={cn("size-[14px] transition-transform duration-300", expanded ? "rotate-0" : "-rotate-90")} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div
          ref={scrollRef}
          className="mt-1.5 pl-[26px] max-h-[140px] overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="text-[13px] leading-[22px] text-text-tertiary whitespace-pre-wrap" style={{ fontFamily: "'Geist', sans-serif" }}>
            {displayedText}
            {isStreaming && <span className="inline-block w-[1.5px] h-[13px] bg-text-tertiary ml-0.5 animate-pulse align-middle" />}
          </div>
        </div>
      </div>
    </div>
  );
}

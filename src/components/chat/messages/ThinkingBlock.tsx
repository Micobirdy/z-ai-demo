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
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const indexRef = useRef(0);

  // Simulate streaming text
  useEffect(() => {
    if (indexRef.current >= content.length) {
      setIsStreaming(false);
      if (autoCollapse) {
        const timer = setTimeout(() => {
          setExpanded(false);
          setTimeout(() => onCollapseComplete?.(), 400);
        }, 1500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      const chunkSize = Math.floor(Math.random() * 2) + 1;
      const nextIndex = Math.min(indexRef.current + chunkSize, content.length);
      setDisplayedText(content.slice(0, nextIndex));
      indexRef.current = nextIndex;
    }, 45);

    return () => clearTimeout(timer);
  }, [displayedText, content, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className="w-[16px] h-[16px] rounded-full border border-border-default flex items-center justify-center text-[10px]">⊕</span>
        <span>思考过程</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-200", expanded && "rotate-90")} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="mt-2 pl-[26px] text-[13px] leading-[20px] text-text-tertiary whitespace-pre-wrap" style={{ fontFamily: "'Geist', sans-serif" }}>
          {displayedText}
          {isStreaming && <span className="inline-block w-[2px] h-[14px] bg-text-tertiary ml-0.5 animate-pulse align-middle" />}
        </div>
      </div>
    </div>
  );
}

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
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const lineIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const allLines = content.split('\n');

  useEffect(() => {
    if (lineIndexRef.current >= allLines.length) {
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

    const currentLine = allLines[lineIndexRef.current];
    const isBlank = currentLine.trim() === '';
    const delay = isBlank ? 200 : 80 + Math.random() * 120;

    const timer = setTimeout(() => {
      setVisibleLines(prev => [...prev, currentLine]);
      lineIndexRef.current++;

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleLines.length, allLines, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-1">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-colors",
          isStreaming ? "border-accent-blue text-accent-blue" : "border-border-default text-text-tertiary"
        )}>
          {isStreaming ? (
            <span className="w-[6px] h-[6px] rounded-full bg-accent-blue animate-pulse" />
          ) : (
            <span className="text-[9px]">⊕</span>
          )}
        </span>
        <span className="font-medium">{isStreaming ? '思考过程' : '思考过程'}</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-300", expanded && "rotate-90")} />
      </button>

      {/* Content area — fixed 172px height */}
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "max-h-[172px] opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
      )}>
        <div
          ref={scrollRef}
          className="h-[172px] overflow-y-auto pl-[28px] pr-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "text-[13px] leading-[24px] text-text-tertiary",
                "animate-in fade-in duration-300"
              )}
              style={{
                fontFamily: "'Geist', sans-serif",
                animationDelay: '0ms',
                animationFillMode: 'both',
              }}
            >
              {line || ' '}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

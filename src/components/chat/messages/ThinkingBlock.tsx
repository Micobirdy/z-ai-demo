import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  content: string;
  autoCollapse?: boolean;
  onCollapseComplete?: () => void;
}

export function ThinkingBlock({ content, autoCollapse, onCollapseComplete }: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const [lines, setLines] = useState<{ text: string; opacity: number }[]>([]);
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
    const delay = isBlank ? 120 : 60 + Math.random() * 80;

    const timer = setTimeout(() => {
      setLines(prev => [...prev, { text: currentLine, opacity: 0 }]);
      lineIndexRef.current++;

      // Fade in the new line
      requestAnimationFrame(() => {
        setLines(prev => {
          const updated = [...prev];
          if (updated.length > 0) updated[updated.length - 1].opacity = 1;
          return updated;
        });
      });

      // Auto-scroll to bottom
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [lines.length, allLines, autoCollapse, onCollapseComplete]);

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className={cn(
          "w-[16px] h-[16px] rounded-full border flex items-center justify-center text-[10px] transition-colors",
          isStreaming ? "border-accent-blue animate-pulse text-accent-blue" : "border-border-default text-text-tertiary"
        )}>⊕</span>
        <span>{isStreaming ? '思考中...' : '思考过程'}</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-300", expanded && "rotate-90")} />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        expanded ? "max-h-[180px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div
          ref={scrollRef}
          className="mt-2 pl-[26px] max-h-[160px] overflow-y-auto scrollbar-none"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-[13px] leading-[22px] text-text-tertiary transition-all duration-300"
              style={{
                fontFamily: "'Geist', sans-serif",
                opacity: line.opacity,
                transform: line.opacity === 1 ? 'translateY(0)' : 'translateY(4px)',
              }}
            >
              {line.text || ' '}
            </div>
          ))}
          {isStreaming && (
            <span className="inline-block w-[2px] h-[14px] bg-accent-blue ml-0.5 animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}

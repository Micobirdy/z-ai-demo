import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  content: string;
}

export function ThinkingBlock({ content }: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1 group"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className="w-[16px] h-[16px] rounded-full border border-border-default flex items-center justify-center text-[10px]">⊕</span>
        <span>思考过程</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-200", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="mt-2 pl-[26px] text-[13px] leading-[20px] text-text-tertiary whitespace-pre-wrap" style={{ fontFamily: "'Geist', sans-serif" }}>
          {content}
        </div>
      )}
    </div>
  );
}

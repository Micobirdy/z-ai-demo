import { useState, useRef, useEffect } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 px-4 pb-4 pt-2">
      <div className={cn(
        "max-w-[720px] xl:max-w-[800px] 2xl:max-w-[860px] mx-auto rounded-[12px] overflow-hidden",
        dk ? "bg-zinc-800" : "bg-white"
      )} style={{
        boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.05)',
        outline: dk ? '1px solid rgba(64,64,64,0.8)' : '1px solid #d4d4d8',
        outlineOffset: '-1px',
      }}>
        <div className="p-3 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            className={cn(
              "w-full resize-none outline-none bg-transparent text-[14px] leading-[22px]",
              dk ? "text-white placeholder:text-white/30" : "text-[#0d0d0d] placeholder:text-[#0d0d0d]/30"
            )}
            style={{ fontFamily: "'Geist', sans-serif" }}
          />
        </div>
        <div className="px-3 pb-2.5 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <button className={cn(
              "w-[28px] h-[28px] rounded-[999px] flex justify-center items-center transition-opacity opacity-60 hover:opacity-100",
            )} aria-label="Attach">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10V12.66C14 13.4 13.4 14 12.66 14H3.34C2.6 14 2 13.4 2 12.66V10M8 2V10M8 2L4.67 5.33M8 2L11.33 5.33" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className={cn(
              "w-[28px] h-[28px] rounded-[8px] flex justify-center items-center overflow-hidden transition-all",
              value.trim()
                ? dk
                  ? "bg-white text-black"
                  : "bg-[#0d0d0d] text-white"
                : dk
                  ? "opacity-25 bg-white"
                  : "bg-neutral-200"
            )}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12.6667V3.33333M8 3.33333L3.33333 8M8 3.33333L12.6667 8" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

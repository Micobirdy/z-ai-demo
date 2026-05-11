import { useRef, useEffect } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';

export function ChatMessages({ messages }: { messages: Message[] }) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[720px] mx-auto px-4 py-6 flex flex-col gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' && "justify-end")}>
            {msg.role === 'assistant' && (
              <div className="w-[28px] h-[28px] rounded-[8px] bg-[#2d2d2d] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                <img src="/icons/zai-logo.png" alt="Z" className="w-[18px] h-[18px] object-cover" />
              </div>
            )}
            <div className={cn(
              "max-w-[85%] rounded-[16px] px-4 py-3 text-[14px] leading-[22px]",
              msg.role === 'user'
                ? dk
                  ? "bg-white/[0.08] text-white"
                  : "bg-[#0d0d0d]/[0.05] text-[#0d0d0d]"
                : dk
                  ? "text-white/90"
                  : "text-[#0d0d0d]"
            )} style={{ fontFamily: "'Geist', sans-serif" }}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.files && msg.files.length > 0 && (
                <div className={cn(
                  "mt-3 flex flex-wrap gap-2"
                )}>
                  {msg.files.map((f, i) => (
                    <span key={i} className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium",
                      dk ? "bg-white/[0.06] text-white/60" : "bg-[#0d0d0d]/[0.04] text-[#0d0d0d]/60"
                    )}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M3.5 1V0.5H9.5C10.05 0.5 10.5 0.95 10.5 1.5V8.5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

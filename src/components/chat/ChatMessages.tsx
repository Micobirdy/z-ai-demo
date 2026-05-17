import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThinkingBlock } from './messages/ThinkingBlock';
import { PPTWizardCard } from './messages/PPTWizardCard';
import type { Message, PPTPreferences } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  onPPTSubmit?: (prefs: PPTPreferences) => void;
  onPPTSkip?: () => void;
  onThinkingDone?: () => void;
}

export function ChatMessages({ messages, onPPTSubmit, onPPTSkip, onThinkingDone }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[720px] mx-auto px-4 py-6 flex flex-col gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' && "justify-end")}>
            <div className={cn(
              "max-w-[85%]",
              msg.role === 'user' && "rounded-[16px] px-4 py-3 bg-interactive-secondary-selected"
            )}>
              {renderMessageContent(msg, onPPTSubmit, onPPTSkip, onThinkingDone)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function renderMessageContent(
  msg: Message,
  onPPTSubmit?: (prefs: PPTPreferences) => void,
  onPPTSkip?: () => void,
  onThinkingDone?: () => void,
) {
  switch (msg.type) {
    case 'thinking':
      return <ThinkingBlock content={msg.content} autoCollapse onCollapseComplete={onThinkingDone} />;

    case 'ppt-wizard':
      return (
        <PPTWizardCard
          onSubmit={onPPTSubmit || (() => {})}
          onSkip={onPPTSkip || (() => {})}
        />
      );

    case 'generating':
      return (
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-[4px]">
            <span className="w-[5px] h-[5px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
            <span className="w-[5px] h-[5px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
            <span className="w-[5px] h-[5px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
          </div>
          <span className="text-[14px] leading-[22px] text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>
            {msg.content}
          </span>
        </div>
      );

    default:
      return (
        <>
          <p className={cn(
            "text-[14px] leading-[22px] whitespace-pre-wrap",
            msg.role === 'user' ? "text-text-primary" : "text-text-primary"
          )} style={{ fontFamily: "'Geist', sans-serif" }}>
            {msg.content}
          </p>
          {msg.files && msg.files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {msg.files.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-bg-surface text-text-secondary">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="1" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 1V0.5H9.5C10.05 0.5 10.5 0.95 10.5 1.5V8.5" stroke="currentColor" strokeWidth="1.2"/></svg>
                  {f.name}
                </span>
              ))}
            </div>
          )}
        </>
      );
  }
}

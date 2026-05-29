import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { ThinkingBlock } from './messages/ThinkingBlock';
import { PPTWizardCard } from './messages/PPTWizardCard';
import { StreamingText } from './messages/StreamingText';
import { PPTSlideCard, PPTSlidesBlock, PPTSummaryCarousel, ToolCallBlock, PPTActionButtons, PPTVersionsBlock } from './messages/PPTPreview';
import type { Message, PPTPreferences } from '@/types/chat';
import type { PPTSlide } from './messages/PPTPreview';

interface ChatMessagesProps {
  messages: Message[];
  onPPTSubmit?: (prefs: PPTPreferences) => void;
  onPPTSkip?: () => void;
  onThinkingDone?: () => void;
  onStreamingDone?: (messageId: string) => void;
  onToolCallDone?: (messageId: string) => void;
  onEditPPT?: () => void;
  scrollTrigger?: number;
}

export function ChatMessages({ messages, onPPTSubmit, onPPTSkip, onThinkingDone, onStreamingDone, onToolCallDone, onEditPPT, scrollTrigger }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);
  const [expandedToolCallId, setExpandedToolCallId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, scrollTrigger]);

  // When wizard card appears, scroll its top into view (not the bottom)
  const lastMsg = messages[messages.length - 1];
  useEffect(() => {
    if (lastMsg?.type === 'ppt-wizard') {
      setTimeout(() => {
        wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, [lastMsg?.type]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
      <div className="max-w-[768px] 2xl:max-w-[860px] min-[1920px]:max-w-[960px] mx-auto px-4 py-6 flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isFirstUser = index === 0 && msg.role === 'user';
          const isWizard = msg.type === 'ppt-wizard';
          return (
          <motion.div
            key={msg.id}
            ref={isWizard ? wizardRef : undefined}
            initial={isFirstUser ? { opacity: 0, y: 36, scale: 0.92 } : isWizard ? { opacity: 0, y: 16 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={isFirstUser
              ? { duration: 0.45, ease: [0.22, 1.2, 0.36, 1] }
              : isWizard
                ? { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
                : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
            }
            className={cn("flex gap-3", msg.role === 'user' && "justify-end")}
          >
            <div className={cn(
              msg.type === 'ppt-slides' || msg.type === 'ppt-summary' || msg.type === 'ppt-actions' || msg.type === 'ppt-versions' || msg.type === 'tool-call' || msg.type === 'ppt-wizard' || msg.type === 'thinking'
                ? "w-full"
                : "max-w-[85%]",
              msg.role === 'user' && "rounded-[12px] px-4 py-3 bg-interactive-secondary-selected"
            )}>
              {renderMessageContent(msg, onPPTSubmit, onPPTSkip, onThinkingDone, onStreamingDone, onToolCallDone, onEditPPT, expandedToolCallId, setExpandedToolCallId)}
            </div>
          </motion.div>
          );
        })}
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
  onStreamingDone?: (messageId: string) => void,
  onToolCallDone?: (messageId: string) => void,
  onEditPPT?: () => void,
  expandedToolCallId?: string | null,
  setExpandedToolCallId?: (id: string | null) => void,
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

    case 'tool-call':
      return (
        <ToolCallBlock
          commands={msg.meta?.commands as string[] || []}
          onDone={() => onToolCallDone?.(msg.id)}
          isExpanded={expandedToolCallId === msg.id}
          onToggleExpand={() => setExpandedToolCallId?.(expandedToolCallId === msg.id ? null : msg.id)}
          slideRange={msg.meta?.slideRange as string | undefined}
        />
      );

    case 'ppt-slides':
      return <PPTSlidesBlock slides={msg.meta?.slides as PPTSlide[] || []} />;

    case 'ppt-summary':
      return null;

    case 'ppt-versions':
      return <PPTVersionsBlock version={msg.meta?.version as number || 1} isNew={msg.meta?.isNew as boolean | undefined} onEdit={onEditPPT} />;

    case 'ppt-actions':
      return <PPTActionButtons onSaveTemplate={() => {}} onEdit={() => {}} />;

    default:
      if (msg.streaming && msg.role === 'assistant') {
        return (
          <StreamingText
            content={msg.content}
            onComplete={() => onStreamingDone?.(msg.id)}
            className="text-[14px] leading-[22px] tracking-[-0.01em] whitespace-pre-wrap text-text-primary"
            style={{ fontFamily: "'Geist', sans-serif" }}
          />
        );
      }
      return (
        <>
          <p className={cn(
            "text-[14px] leading-[22px] tracking-[-0.01em] whitespace-pre-wrap text-text-primary",
            msg.role === 'user' && "font-normal"
          )} style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
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

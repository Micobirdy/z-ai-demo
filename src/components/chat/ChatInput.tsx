import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { Plus, X, Printer } from 'lucide-react';

const CHAR_THRESHOLD = 300;
const MAX_FILES = 7;
const TOAST_COOLDOWN = 5000;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface AttachedFile {
  id: string;
  displayName: string;
  content: string;
  size: number;
  source: 'paste' | 'drop';
  removing?: boolean;
}

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  agentLabel?: string;
  embedded?: boolean;
}

export function ChatInput({ onSend, disabled, placeholder, agentLabel, embedded }: ChatInputProps) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastPasteRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  });

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain');
    if (text && text.length >= CHAR_THRESHOLD) {
      e.preventDefault();
      const now = Date.now();
      setFiles(prev => {
        if (prev.length >= MAX_FILES) {
          if (now - lastPasteRef.current > TOAST_COOLDOWN) {
            clearTimeout(toastTimerRef.current);
            setShowToast(true);
            setToastKey(k => k + 1);
            toastTimerRef.current = setTimeout(() => setShowToast(false), 5000);
          }
          lastPasteRef.current = now;
          return prev;
        }
        lastPasteRef.current = now;
        const bytes = new Blob([text]).size;
        const base = text.slice(0, 16).replace(/[\n\r]/g, ' ').trim();
        return [...prev, {
          id: Math.random().toString(36).substring(2),
          displayName: base.length > 16 ? base.slice(0, 16) + '...' : base,
          content: text,
          size: bytes,
          source: 'paste',
        }];
      });
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, removing: true } : f));
    setTimeout(() => setFiles(prev => prev.filter(f => f.id !== id)), 200);
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if ((!trimmed && files.length === 0) || disabled) return;
    onSend(trimmed || 'Attached files');
    setValue('');
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = value.trim() || files.length > 0;

  return (
    <div className={embedded ? "" : "shrink-0 px-4 pb-4 pt-2"}>
      <div className={cn(
        embedded ? "rounded-[12px]" : "max-w-[768px] 2xl:max-w-[860px] min-[1920px]:max-w-[960px] mx-auto rounded-[12px]",
        dk ? "bg-zinc-800" : "bg-white"
      )} style={{
        boxShadow: embedded ? 'none' : '0px 4px 16px 0px rgba(0,0,0,0.05)',
        outline: dk ? '1px solid rgba(64,64,64,0.8)' : '1px solid #d4d4d8',
        outlineOffset: '-1px',
        overflow: 'visible',
      }}>
        {files.length > 0 && (
          <div className="pt-[12px] px-3 pb-1">
            <div
              ref={scrollElRef}
              className="flex gap-[8px] flex-nowrap overflow-x-scroll"
              style={{ scrollbarWidth: 'none', overscrollBehaviorX: 'contain' } as React.CSSProperties}
            >
              {files.map(file => (
                <div
                  key={file.id}
                  className="relative shrink-0 group/card transition-[opacity,transform] duration-200 ease-in-out"
                  style={{
                    opacity: file.removing ? 0 : 1,
                    transform: file.removing ? 'scale(0.95) translateY(4px)' : 'scale(1) translateY(0)',
                  }}
                >
                  <div
                    className="inline-flex items-center gap-[8px] p-[6px] pr-[28px] rounded-[8px] border border-border-default cursor-pointer transition-colors hover:bg-bg-surface"
                    onClick={() => setPreviewFile(file)}
                  >
                    <div className="w-[40px] h-[40px] shrink-0 rounded-[6px] border border-border-default flex items-center justify-center">
                      <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
                        <path d="M7.33366 0.845703V3.5994C7.33366 3.97277 7.33366 4.15945 7.40632 4.30206C7.47024 4.4275 7.57222 4.52949 7.69767 4.5934C7.84027 4.66606 8.02696 4.66606 8.40033 4.66606H11.154M7.33366 10.666H3.33366M8.66699 7.99935H3.33366M11.3337 5.9915V10.7993C11.3337 11.9195 11.3337 12.4795 11.1157 12.9073C10.9239 13.2837 10.618 13.5896 10.2416 13.7814C9.81382 13.9993 9.25376 13.9993 8.13366 13.9993H3.86699C2.74689 13.9993 2.18683 13.9993 1.75901 13.7814C1.38269 13.5896 1.07673 13.2837 0.884979 12.9073C0.666992 12.4795 0.666992 11.9195 0.666992 10.7993V3.86602C0.666992 2.74591 0.666992 2.18586 0.884979 1.75803C1.07673 1.38171 1.38269 1.07575 1.75901 0.884003C2.18683 0.666016 2.74689 0.666016 3.86699 0.666016H6.00818C6.49736 0.666016 6.74195 0.666016 6.97212 0.721276C7.17619 0.770269 7.37128 0.851078 7.55023 0.960735C7.75206 1.08442 7.92501 1.25737 8.27092 1.60327L10.3964 3.72876C10.7423 4.07466 10.9153 4.24761 11.0389 4.44945C11.1486 4.62839 11.2294 4.82348 11.2784 5.02755C11.3337 5.25773 11.3337 5.50232 11.3337 5.9915Z" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[140px]">
                      <span className="text-[14px] leading-[20px] truncate" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif", color: 'var(--text-primary)' }}>
                        {file.source === 'paste' ? '粘贴了内容 ' : ''}{file.displayName}
                      </span>
                      <span className="text-[12px] text-text-tertiary leading-[16px]" style={{ fontFamily: "'Geist', sans-serif" }}>
                        TXT · {formatSize(file.size)}
                      </span>
                    </div>
                  </div>
                  {/* Close button inside card, top-right corner */}
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(file.id); }}
                    className={cn(
                      "absolute top-[4px] right-[4px] size-[20px] rounded-full flex items-center justify-center cursor-pointer z-20",
                      "transition-opacity duration-200 ease-in-out pointer-events-none",
                      "opacity-0 group-hover/card:opacity-100 group-hover/card:pointer-events-auto",
                      dk ? "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700" : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
                    )}
                  >
                    <X className="size-[12px]" strokeWidth={2} />
                  </button>
                </div>
              ))}
              <div className="shrink-0 w-[1px]" />
            </div>
          </div>
        )}
        <div className="p-3 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder || "Send a message..."}
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
            <button className="w-[28px] h-[28px] rounded-full flex justify-center items-center transition-opacity opacity-60 hover:opacity-100" aria-label="Attach">
              <Plus className="size-[16px]" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth={1.33} />
            </button>
            <button className="w-[28px] h-[28px] rounded-full flex justify-center items-center transition-opacity opacity-60 hover:opacity-100" aria-label="Clear">
              <X className="size-[16px]" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth={1.33} />
            </button>
            {agentLabel && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-border-default text-text-secondary">
                <Printer className="size-[14px]" strokeWidth={1.33} />
                <span className="text-[12px] font-medium leading-[16px]" style={{ fontFamily: "'Geist', sans-serif" }}>{agentLabel}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!hasContent || disabled}
            className={cn(
              "p-[4px] rounded-[6px] flex justify-center items-center overflow-hidden transition-all",
              hasContent
                ? dk ? "bg-white text-black shadow-[0px_1px_2px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-white/20"
                      : "bg-interactive-primary text-text-inverted shadow-[0px_1px_2px_rgba(10,13,20,0.03)]"
                : "bg-bg-bg shadow-[0px_1px_2px_rgba(10,13,20,0.03)] outline outline-1 outline-offset-[-1px] outline-border-default"
            )}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12.6667V3.33333M8 3.33333L3.33333 8M8 3.33333L12.6667 8" stroke={hasContent ? (dk ? '#0d0d0d' : 'white') : 'var(--icon-tertiary)'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && createPortal(
        <div
          key={toastKey}
          className="fixed z-[200] w-[520px] max-w-[calc(100vw-32px)] px-[16px] py-[12px] bg-bg-error rounded-[8px] flex items-center gap-[16px]"
          style={{ top: 60, right: 16, boxShadow: '0px 2px 8px rgba(0,0,0,0.08), inset 0px 0px 1px rgba(0,0,0,0.30)', animation: 'toastSlideIn 0.3s ease-out' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M8 1.33L1.33 13.33h13.34L8 1.33z" stroke="var(--accent-red)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M8 6v2.67M8 11.33h.007" stroke="var(--accent-red)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[14px] text-accent-red leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>粘贴内容已达上限，无法继续粘贴。</span>
        </div>,
        document.body
      )}

      {/* Preview modal */}
      {previewFile && createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40" onClick={() => setPreviewFile(null)}>
          <div
            className="w-[56vw] max-w-[1080px] min-w-[400px] max-h-[80vh] bg-bg-bg rounded-[12px] flex flex-col overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)', outline: '1px solid var(--border-default)', animation: 'scaleIn 0.2s ease-out' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[20px] py-[14px] border-b border-border-default shrink-0">
              <div className="flex items-center gap-[8px]">
                <svg width="16" height="16" viewBox="0 0 12 15" fill="none" className="shrink-0">
                  <path d="M7.33366 0.845703V3.5994C7.33366 3.97277 7.33366 4.15945 7.40632 4.30206C7.47024 4.4275 7.57222 4.52949 7.69767 4.5934C7.84027 4.66606 8.02696 4.66606 8.40033 4.66606H11.154M7.33366 10.666H3.33366M8.66699 7.99935H3.33366M11.3337 5.9915V10.7993C11.3337 11.9195 11.3337 12.4795 11.1157 12.9073C10.9239 13.2837 10.618 13.5896 10.2416 13.7814C9.81382 13.9993 9.25376 13.9993 8.13366 13.9993H3.86699C2.74689 13.9993 2.18683 13.9993 1.75901 13.7814C1.38269 13.5896 1.07673 13.2837 0.884979 12.9073C0.666992 12.4795 0.666992 11.9195 0.666992 10.7993V3.86602C0.666992 2.74591 0.666992 2.18586 0.884979 1.75803C1.07673 1.38171 1.38269 1.07575 1.75901 0.884003C2.18683 0.666016 2.74689 0.666016 3.86699 0.666016H6.00818C6.49736 0.666016 6.74195 0.666016 6.97212 0.721276C7.17619 0.770269 7.37128 0.851078 7.55023 0.960735C7.75206 1.08442 7.92501 1.25737 8.27092 1.60327L10.3964 3.72876C10.7423 4.07466 10.9153 4.24761 11.0389 4.44945C11.1486 4.62839 11.2294 4.82348 11.2784 5.02755C11.3337 5.25773 11.3337 5.50232 11.3337 5.9915Z" stroke="var(--icon-secondary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[15px] font-medium text-text-primary" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                  粘贴的内容.txt
                </span>
              </div>
              <button onClick={() => setPreviewFile(null)} className="p-[4px] rounded-[6px] hover:bg-bg-surface transition-colors cursor-pointer">
                <X className="size-[16px] text-icon-secondary" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-[20px]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
              <pre className="text-[13px] leading-[20px] text-text-primary whitespace-pre-wrap break-all" style={{ fontFamily: "'Geist Mono', 'SF Mono', monospace" }}>
                {previewFile.content}
              </pre>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import type { PPTPreferences } from '@/types/chat';

const AUDIENCES = [
  { key: 'business', label: '泛商务/同事分享' },
  { key: 'executive', label: '管理层/投资人' },
  { key: 'tech', label: '技术团队/工程师' },
  { key: 'education', label: '高校/学生科普' },
];

const STYLES = [
  { key: 'warm-bold', label: '浅灰背景，深蓝标题与橙色点缀', colors: ['#ea580c', '#eab308', '#171717'] },
  { key: 'mint-modern', label: '白色背景，青绿高光与柔和灰文本', colors: ['#5eead4', '#d4d4d8', '#ea580c'] },
  { key: 'sand-gold', label: '暖沙背景，金色标题与棕色点缀', colors: ['#171717', '#171717', '#0d9488'] },
  { key: 'candy-pop', label: '浅灰背景，深蓝标题与橙色点缀', colors: ['#a78bfa', '#fdba74', '#f59e0b'] },
];

interface PPTWizardCardProps {
  onSubmit: (prefs: PPTPreferences) => void;
  onSkip: () => void;
}

export function PPTWizardCard({ onSubmit, onSkip }: PPTWizardCardProps) {
  const [audiences, setAudiences] = useState<string[]>(['business']);
  const [pageCount, setPageCount] = useState('1-12');
  const [styles, setStyles] = useState<string[]>(['mint-modern', 'sand-gold']);
  const [notes, setNotes] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (submitted) return;
    pausedRef.current = true;
    setPaused(true);
  }, [submitted]);

  const handleMouseLeave = useCallback(() => {
    if (submitted) return;
    pausedRef.current = false;
    setPaused(false);
  }, [submitted]);

  useEffect(() => {
    if (!pageDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) setPageDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pageDropdownOpen]);

  useEffect(() => {
    if (countdown === 0 && !submitted) handleSubmit();
  }, [countdown, submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);
    setExpanded(false);
    onSubmit({ audience: audiences.join(','), pageCount, style: styles.join(','), notes });
  }, [submitted, audiences, pageCount, styles, notes, onSubmit]);

  const [skipped, setSkipped] = useState(false);

  const handleSkip = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setSkipped(true);
    clearInterval(timerRef.current);
    setExpanded(false);
    onSkip();
  }, [submitted, onSkip]);

  const toggleExpanded = () => {
    if (!submitted || skipped) return;
    setExpanded(prev => !prev);
  };

  return (
    <div className="w-full">
      {/* Collapsed state — inline pill */}
      {submitted && !expanded && (
        <button
          onClick={toggleExpanded}
          className={cn(
            "w-full px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex justify-start items-center gap-1 overflow-hidden transition-colors",
            skipped ? "cursor-default" : "cursor-pointer hover:bg-bg-surface"
          )}
        >
          <div className="flex justify-start items-center gap-1.5">
            <div className="w-4 h-6 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="var(--icon-secondary)" strokeWidth="1.33" />
                <path d="M5.5 8L7.5 10L10.5 6" stroke="var(--icon-secondary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-text-secondary text-[14px] font-normal leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>规划幻灯片创建</span>
          </div>
          <div className="w-1.5 h-6 flex items-center justify-center">
            <div className="w-[2px] h-[2px] opacity-80 bg-icon-tertiary rounded-full" />
          </div>
          <div className="flex-1 text-text-tertiary text-[12px] font-medium leading-4 tracking-tight text-left" style={{ fontFamily: "'Geist', sans-serif" }}>
            {skipped ? '跳过' : '已完成'}
          </div>
          {!skipped && <ChevronRight className="size-[14px] text-icon-tertiary shrink-0" />}
        </button>
      )}

      {/* Expanded state */}
      {(!submitted || expanded) && (
      <div className="rounded-[8px] border border-border-default overflow-hidden w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Header — entire bar is clickable when submitted */}
      <div
        onClick={toggleExpanded}
        className={cn(
          "flex items-center justify-between px-5 py-3",
          expanded && "border-b border-border-default",
          submitted && "cursor-pointer hover:bg-bg-surface transition-colors"
        )}
      >
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M9.39434 4.48156H13.3635C13.6783 4.48156 13.8356 4.48156 13.9277 4.54774C14.008 4.60548 14.0603 4.69436 14.0718 4.7926C14.0849 4.90519 14.0085 5.04277 13.8556 5.31792L12.9084 7.02298C12.8529 7.12277 12.8252 7.17266 12.8143 7.2255C12.8047 7.27226 12.8047 7.32049 12.8143 7.36726C12.8252 7.4201 12.8529 7.46999 12.9084 7.56978L13.8556 9.27483C14.0085 9.54998 14.0849 9.68756 14.0718 9.80016C14.0603 9.8984 14.008 9.98727 13.9277 10.045C13.8356 10.1112 13.6783 10.1112 13.3635 10.1112H8.40915C8.01504 10.1112 7.81799 10.1112 7.66746 10.0345C7.53505 9.96703 7.42739 9.85937 7.35993 9.72696C7.28323 9.57643 7.28323 9.37938 7.28323 8.98527V7.29638M4.82026 14.3334L2.00545 3.07416M3.06104 7.29638H8.26841C8.66252 7.29638 8.85958 7.29638 9.01011 7.21968C9.14252 7.15221 9.25017 7.04456 9.31764 6.91215C9.39434 6.76162 9.39434 6.56456 9.39434 6.17045V2.79267C9.39434 2.39856 9.39434 2.20151 9.31764 2.05098C9.25017 1.91857 9.14252 1.81091 9.01011 1.74345C8.85958 1.66675 8.66252 1.66675 8.26841 1.66675H3.09565C2.60409 1.66675 2.35832 1.66675 2.19021 1.7686C2.04288 1.85787 1.93341 1.99808 1.88254 2.16266C1.8245 2.35045 1.88412 2.58889 2.00334 3.06576L3.06104 7.29638Z" stroke="var(--text-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[15px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
            规划幻灯片创建
          </span>
          {submitted && !expanded && (
            <span className="text-[13px] text-text-tertiary ml-1">· 已完成</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!submitted ? (
            <>
              <button onClick={(e) => { e.stopPropagation(); handleSkip(); }} className="text-[14px] text-text-tertiary hover:text-text-primary transition-colors duration-150 ease-in-out cursor-pointer" style={{ fontFamily: "'Geist', sans-serif" }}>
                跳过 »
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                className="group/btn relative px-4 py-1.5 rounded-[6px] text-[14px] text-text-primary border border-border-default hover:bg-bg-surface transition-all duration-150 ease-in-out cursor-pointer active:opacity-80 overflow-hidden"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                <div
                  className="absolute inset-0 bg-bg-surface origin-left transition-transform duration-1000 ease-linear"
                  style={{ transform: `scaleX(${1 - countdown / 60})` }}
                />
                <span className="relative z-[1]">
                  {paused ? (
                    <>
                      <span className="transition-opacity duration-150 ease-in-out opacity-100 group-hover/btn:opacity-0 inline group-hover/btn:hidden">已暂停 <span className="text-text-tertiary tabular-nums">{countdown}s</span></span>
                      <span className="transition-opacity duration-150 ease-in-out opacity-0 group-hover/btn:opacity-100 hidden group-hover/btn:inline">继续</span>
                    </>
                  ) : (
                    <>
                      继续 <span className="text-text-tertiary tabular-nums">{countdown}s</span>
                    </>
                  )}
                </span>
              </button>
            </>
          ) : (
            <ChevronRight className={cn(
              "size-[16px] text-text-secondary transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
              expanded && "rotate-90"
            )} />
          )}
        </div>
      </div>

      {/* Body — GPU-accelerated collapse */}
      <div
        className="origin-top transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden"
        style={{
          transform: expanded ? 'scaleY(1)' : 'scaleY(0)',
          opacity: expanded ? 1 : 0,
          height: expanded ? 'auto' : 0,
        }}
      >
        <div className="px-6 py-5 flex flex-col divide-y divide-border-default">
          {/* 目标受众 — 多选 */}
          <div className="pb-6">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[15px] font-semibold text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>目标受众与场景</h4>
              <span className="text-[11px] text-text-tertiary px-1.5 py-0.5 rounded-[4px] bg-bg-surface" style={{ fontFamily: "'Geist', sans-serif" }}>可多选</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>选择一个或多个目标受众</p>
            <div className="flex flex-wrap gap-2.5">
              {AUDIENCES.map(a => (
                <Chip
                  key={a.key}
                  label={a.label}
                  selected={audiences.includes(a.key)}
                  onClick={() => {
                    if (submitted) return;
                    setAudiences(prev =>
                      prev.includes(a.key)
                        ? prev.filter(k => k !== a.key).length > 0 ? prev.filter(k => k !== a.key) : prev
                        : [...prev, a.key]
                    );
                  }}
                  disabled={submitted}
                />
              ))}
            </div>
          </div>

          {/* PPT 页数 */}
          <div className="py-6">
            <h4 className="text-[15px] font-semibold text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>PPT 页数</h4>
            <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>默认12 页可覆盖主题且保持简洁，如需更精炼可选 8–10 页</p>
            <div ref={pageDropdownRef} className="relative w-[120px]">
              <button
                onClick={() => !submitted && setPageDropdownOpen(v => !v)}
                disabled={submitted}
                className="w-full h-10 pl-3.5 pr-9 rounded-[6px] border border-border-default text-text-primary text-[14px] text-left cursor-pointer hover:border-border-strong transition-colors disabled:opacity-40 flex items-center"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                {pageCount}
              </button>
              <ChevronDown className={cn("absolute right-3 top-1/2 -translate-y-1/2 size-[14px] text-icon-tertiary pointer-events-none transition-transform duration-200", pageDropdownOpen && "rotate-180")} />
              {pageDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-[160px] z-50 bg-bg-bg rounded-[8px] border border-border-default shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                  {['1-8', '1-12', '1-15'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setPageCount(opt); setPageDropdownOpen(false); }}
                      className={cn(
                        "w-full px-3.5 h-[40px] flex items-center justify-between text-left text-[14px] cursor-pointer transition-colors",
                        opt === pageCount ? "bg-bg-surface text-text-primary" : "text-text-secondary hover:bg-bg-surface/50"
                      )}
                      style={{ fontFamily: "'Geist', sans-serif" }}
                    >
                      {opt}
                      {opt === pageCount && <Check className="size-[16px] text-text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 视觉风格 — 多选 */}
          <div className="py-6">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[15px] font-semibold text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>视觉风格</h4>
              <span className="text-[11px] text-text-tertiary px-1.5 py-0.5 rounded-[4px] bg-bg-surface" style={{ fontFamily: "'Geist', sans-serif" }}>可多选</span>
            </div>
            <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>主题为AI与科技，优先提供科技与商务场景适配方案</p>
            <div className="grid grid-cols-3 gap-2.5">
              {STYLES.map(s => {
                const selected = styles.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      if (submitted) return;
                      setStyles(prev =>
                        prev.includes(s.key)
                          ? prev.filter(k => k !== s.key)
                          : [...prev, s.key]
                      );
                    }}
                    disabled={submitted}
                    className={cn(
                      "p-2 rounded-[6px] overflow-hidden transition-all cursor-pointer disabled:opacity-40 text-left flex flex-col gap-2",
                      "bg-bg-bg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px]",
                      selected
                        ? "outline-interactive-primary/60"
                        : "outline-border-default hover:outline-border-strong"
                    )}
                  >
                    <div className="h-[32px] w-full rounded-[4px] outline outline-[1.33px] outline-offset-[-1.33px] outline-black/10 overflow-hidden flex">
                      {s.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className={cn(
                        "w-[14px] h-[14px] rounded-[3px] shrink-0 mt-[1px] flex items-center justify-center transition-colors",
                        selected
                          ? "bg-interactive-primary text-text-inverted"
                          : "border border-border-strong"
                      )}>
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[12px] font-normal text-text-secondary leading-4" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                        {s.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 备注 */}
          <div className="pt-6">
            <h4 className="text-[15px] font-semibold text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>备注</h4>
            <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>补充你需要的生成内容，非必填</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              disabled={submitted}
              placeholder="描述"
              rows={3}
              className="w-full px-4 py-3 rounded-[6px] border border-border-default bg-bg-bg text-text-primary text-[14px] leading-[22px] resize-none outline-none placeholder:text-text-placeholder transition-colors hover:border-border-strong focus:border-border-strong disabled:opacity-40"
              style={{ fontFamily: "'Geist', sans-serif" }}
            />
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

function Chip({ label, selected, onClick, disabled }: { label: string; selected: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-[32px] px-3.5 rounded-[6px] text-[13px] leading-[20px] border transition-colors cursor-pointer disabled:opacity-40 active:opacity-80 flex items-center gap-1.5",
        selected
          ? "bg-interactive-primary text-text-inverted border-transparent"
          : "border-border-default text-text-primary hover:border-border-strong hover:bg-bg-surface"
      )}
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
          <path d="M10 3L5 9L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
    </button>
  );
}

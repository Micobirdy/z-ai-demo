import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, FileText, Terminal } from 'lucide-react';
import { AnimatedDotPattern } from '@/components/ui/animated-dots';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { RevealText } from './RevealText';

export interface PPTSlide {
  title: string;
  description?: string;
  pageNumber: number;
  totalPages: number;
  bgColor: string;
  accentColor: string;
  contentPreview: string;
}

// Tool call block — commands appear one by one
interface ToolCallBlockProps {
  commands: string[];
  onDone?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ToolCallBlock({ commands, onDone, isExpanded, onToggleExpand }: ToolCallBlockProps) {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  const expanded = done ? (isExpanded ?? internalExpanded) : internalExpanded;
  const toggleExpand = () => {
    if (done && onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(v => !v);
    }
  };
  const doneCalledRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const totalFiles = commands.filter(c => c.startsWith('Read(') || c.startsWith('Grep(')).length;
  const totalRun = commands.length - totalFiles;

  useEffect(() => {
    if (visibleCount >= commands.length) {
      setDone(true);
      timerRef.current = setTimeout(() => {
        setInternalExpanded(false);
        if (!doneCalledRef.current) {
          doneCalledRef.current = true;
          onDone?.();
        }
      }, 400);
      return;
    }
    const delay = visibleCount === 0 ? 1200 : 600 + Math.random() * 200;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisibleCount(v => v + 1), delay);
  }, [visibleCount, commands.length, onDone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleCount]);

  const runSoFar = commands.slice(0, visibleCount).filter(c => !c.startsWith('Read(') && !c.startsWith('Grep(')).length;
  const fileSoFar = visibleCount - runSoFar;

  return (
    <div className="flex flex-col gap-1">
      {/* Summary header */}
      <button
        onClick={toggleExpand}
        className="px-1 flex items-center gap-1 cursor-pointer"
      >
        <div className="w-4 h-6 flex items-center justify-center shrink-0">
          {!done ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9.49968 1.33325H5.66264C5.54298 1.33325 5.48316 1.33325 5.43034 1.35147C5.38363 1.36758 5.34109 1.39387 5.30579 1.42845C5.26587 1.46754 5.23912 1.52105 5.18561 1.62807L2.38561 7.22807C2.25782 7.48364 2.19393 7.61143 2.20927 7.71531C2.22268 7.80601 2.27285 7.88719 2.34798 7.93974C2.43403 7.99992 2.5769 7.99992 2.86264 7.99992H6.99968L4.99968 14.6666L13.1284 6.23679C13.4027 5.95239 13.5398 5.81019 13.5478 5.68851C13.5548 5.58289 13.5112 5.48024 13.4303 5.41194C13.3371 5.33325 13.1396 5.33325 12.7445 5.33325H7.99968L9.49968 1.33325Z" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 4L6.5 11L3 7.5" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        {visibleCount === 0 && !done ? (
          <AnimatedShinyText className="text-[14px] font-normal leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
            正在分析任务并调用工具...
          </AnimatedShinyText>
        ) : !done ? (
          <AnimatedShinyText className="text-[14px] font-normal leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
            已探索 {fileSoFar}个文件，已运行 {runSoFar}条命令
          </AnimatedShinyText>
        ) : (
          <span className="text-[14px] font-normal text-text-tertiary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
            已探索 {done ? totalFiles : fileSoFar}个文件，{done ? '1次搜索，' : ''}已运行 {done ? totalRun : runSoFar}条命令
          </span>
        )}
        <div className="w-5 h-5 flex items-center justify-center">
          <ChevronRight className={cn("size-[14px] text-icon-tertiary transition-transform duration-200", expanded && "rotate-90")} />
        </div>
      </button>

      {/* Tool display area */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] max-w-[520px]"
        style={{
          maxHeight: expanded ? (done ? '170px' : '40px') : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="relative pl-[28px] pb-2">
          {!done ? (
            /* Running state */
            visibleCount === 0 ? (
              /* Pre-loading: no tool items yet, just empty space */
              <div className="h-[24px]" />
            ) : (
              /* Active: single ticker with curve */
              <div className="relative h-[24px]">
                <svg className="absolute left-[-20px] top-0" width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <path d="M1 0 C1 12, 8 12, 18 12" stroke="var(--border-default)" strokeWidth="1" fill="none" />
                </svg>
                <div
                  key={visibleCount}
                  className="flex items-center gap-1"
                  style={{ animation: 'toolBlurIn 0.4s ease-out forwards' }}
                >
                  <ToolItemContent cmd={commands[visibleCount - 1]} />
                </div>
              </div>
            )
          ) : (
            /* Done: scrollable list with curved brackets */
            <div className="max-h-[160px] overflow-y-auto relative pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
              {commands.map((cmd, i) => {
                const isLast = i === commands.length - 1;
                return (
                  <div key={i} className="relative flex items-center gap-1 py-[3px]">
                    <svg className="absolute left-[-22px] top-0" width="22" height="28" viewBox="0 0 22 28" fill="none">
                      <path
                        d={isLast
                          ? "M1 0 C1 10, 6 14, 20 14"
                          : "M1 0 C1 10, 6 14, 20 14 M1 0 L1 28"
                        }
                        stroke="var(--border-default)" strokeWidth="1" fill="none"
                      />
                    </svg>
                    <ToolItemContent cmd={cmd} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolItemContent({ cmd }: { cmd: string }) {
  const isRead = cmd.startsWith('Read(') || cmd.startsWith('Grep(');
  const toolName = cmd.split('(')[0];
  const toolArgs = cmd.slice(toolName.length);
  return (
    <>
      <div className="w-4 h-6 flex items-center justify-center shrink-0 opacity-90">
        {isRead ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9 1.5H4.5a1.5 1.5 0 0 0-1.5 1.5v10a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5V5.5L9 1.5Z" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="var(--icon-tertiary)" strokeWidth="1.33" />
            <path d="M5 8h6M8 5v6" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-[14px] font-normal text-text-tertiary leading-5 shrink-0" style={{ fontFamily: "'Geist', sans-serif" }}>
          {toolName}
        </span>
        {toolArgs && (
          <>
            <div className="w-[2px] h-[2px] rounded-full bg-text-tertiary/50 shrink-0" />
            <span className="text-[12px] font-normal text-text-tertiary/60 leading-4 truncate" style={{ fontFamily: "'Geist', sans-serif" }}>
              {toolArgs.replace(/^\(|\)$/g, '')}
            </span>
          </>
        )}
      </div>
    </>
  );
}

// Single slide card with optional loading state
interface PPTSlideCardProps {
  slide: PPTSlide;
  loadingDuration?: number;
}

export function PPTSlideCard({ slide, loadingDuration = 0 }: PPTSlideCardProps) {
  // Phase 1: dot pattern loading → Phase 2: outline fade-in → Phase 3: blur mask reveals real content
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(loadingDuration === 0 ? 4 : 1);
  const [zoomed, setZoomed] = useState(false);

  // Phase 1 → 2: dot pattern finishes
  useEffect(() => {
    if (loadingDuration === 0 || phase !== 1) return;
    const t = setTimeout(() => setPhase(2), loadingDuration);
    return () => clearTimeout(t);
  }, [loadingDuration, phase]);

  // Phase 2 → 3: outline displayed, then start blur reveal
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => setPhase(3), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3 → 4: blur clears after writing completes
  useEffect(() => {
    if (phase !== 3) return;
    const t = setTimeout(() => setPhase(4), 4000);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <>
      <div
        className="rounded-[8px] overflow-hidden border border-border-default bg-bg-bg max-w-[540px] cursor-pointer group"
        onClick={() => phase === 4 && setZoomed(true)}
      >
        <div className="aspect-[16/9] relative overflow-hidden bg-bg-bg">

          {/* === PHASE 1: Dot pattern loading === */}
          <div
            className={cn(
              "absolute inset-0 z-10 transition-opacity duration-[800ms] ease-out",
              phase >= 2 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            style={{
              maskImage: 'linear-gradient(135deg, black 0%, black 30%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(135deg, black 0%, black 30%, transparent 75%)',
            }}
          >
            <AnimatedDotPattern
              className="absolute inset-0 size-full"
              width={8}
              height={8}
              cr={0.8}
              maxOpacity={0.5}
              flickerChance={0.06}
            />
          </div>

          {/* === PHASE 2: Outline text — fades in then out === */}
          <div
            className="absolute inset-0 p-[8%] flex flex-col justify-start gap-[6px] z-[1] transition-opacity duration-500"
            style={{ opacity: phase === 2 ? 1 : 0, pointerEvents: 'none' }}
          >
            {phase >= 2 && phase <= 2 && (
              <>
                <div className="text-[18px] font-bold leading-[24px] whitespace-pre-line text-text-primary animate-in fade-in slide-in-from-bottom-1 duration-500" style={{ fontFamily: "'Geist', sans-serif" }}>
                  {slide.title}
                </div>
                {slide.description && (
                  <div className="text-[10px] leading-[16px] text-text-tertiary max-w-[75%] animate-in fade-in slide-in-from-bottom-1 duration-500 delay-200" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {slide.description}
                  </div>
                )}
              </>
            )}
          </div>

          {/* === PHASE 3+4: Rich PPT final design === */}
          {phase >= 3 && (
            <>
              <div className="absolute inset-0 z-[11] p-[6%] flex flex-col justify-between">
                {/* Header — org icon + name */}
                <div className="flex items-center gap-[5px]" style={{ animation: 'renderElement 0.4s ease-out 0.2s both' }}>
                  <div className="w-[14px] h-[14px] rounded-[3px] bg-accent-blue flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 2h5M1 3.5h3.5M1 5h4" stroke="white" strokeWidth="0.6" strokeLinecap="round"/></svg>
                  </div>
                  <span className="text-[7px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                </div>

                {/* Title block */}
                <div className="flex flex-col gap-[4px]" style={{ animation: 'renderElement 0.5s ease-out 0.5s both' }}>
                  <div className="text-[20px] font-bold leading-[25px] whitespace-pre-line text-accent-blue" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {slide.contentPreview}
                  </div>
                  {/* Blue highlight bar */}
                  <div className="h-[12px] w-[55%] rounded-[2px] bg-accent-blue flex items-center px-[6px] mt-[2px]" style={{ animation: 'renderElement 0.4s ease-out 0.9s both' }}>
                    <span className="text-[5px] text-white font-medium tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
                  </div>
                  {slide.description && (
                    <div className="mt-[3px]" style={{ animation: 'renderElement 0.4s ease-out 1.1s both' }}>
                      <span className="text-[7px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.description}</span>
                    </div>
                  )}
                </div>

                {/* Footer — presenter + website */}
                <div className="flex items-end justify-between" style={{ animation: 'renderElement 0.3s ease-out 1.4s both' }}>
                  <div className="flex flex-col gap-[1px]">
                    <span className="text-[5px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンター:</span>
                    <span className="text-[6px] font-medium text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>佐藤 健太</span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <div className="w-[8px] h-[8px] rounded-[2px] bg-accent-blue/15 flex items-center justify-center">
                      <div className="w-[4px] h-[4px] rounded-[1px] bg-accent-blue" />
                    </div>
                    <span className="text-[5px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>www.digitalmarketing.co.jp</span>
                  </div>
                </div>
              </div>

              {/* Blur mask — Phase 3 only */}
              {phase === 3 && (
                <div className="absolute inset-0 z-[12] pointer-events-none" style={{ animation: 'pptReveal 3s ease-in-out forwards' }}>
                  <div className="absolute inset-0 backdrop-blur-[16px] bg-bg-bg/90" />
                </div>
              )}
            </>
          )}

          {/* === PHASE 4: Hover overlay === */}
          {phase === 4 && (
            <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="px-3 py-1.5 rounded-[8px] bg-black/50 backdrop-blur-md flex items-center gap-2">
                  <span className="text-[12px] font-medium text-white leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {slide.title}
                  </span>
                </div>
                <div className="px-2 py-1 rounded-[6px] bg-black/50 backdrop-blur-md">
                  <span className="text-[11px] text-white/80 tabular-nums font-medium" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {slide.pageNumber}/{slide.totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 cursor-pointer"
          onClick={() => setZoomed(false)}
        >
          <div
            className="w-[90vw] max-w-[1200px] aspect-[16/9] rounded-[12px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 fade-in duration-200 bg-bg-bg"
            onClick={() => setZoomed(false)}
          >
            <div className="absolute inset-0 p-[6%] flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-[4px] bg-accent-blue flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 7 7" fill="none"><path d="M1 2h5M1 3.5h3.5M1 5h4" stroke="white" strokeWidth="0.6" strokeLinecap="round"/></svg>
                </div>
                <span className="text-[1vw] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
              </div>
              <div className="flex flex-col gap-[1%]">
                <div className="text-[3.5vw] font-bold leading-[1.2] whitespace-pre-line text-accent-blue" style={{ fontFamily: "'Geist', sans-serif" }}>
                  {slide.contentPreview}
                </div>
                <div className="h-[2.5%] w-[40%] rounded-[3px] bg-accent-blue flex items-center px-[1%] mt-[0.5%]">
                  <span className="text-[0.8vw] text-white font-medium tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
                </div>
                {slide.description && (
                  <div className="text-[1vw] text-text-tertiary mt-[0.5%]" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {slide.description}
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[0.7vw] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンター:</span>
                  <span className="text-[0.9vw] font-medium text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>佐藤 健太</span>
                </div>
                <span className="text-[0.8vw] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>www.digitalmarketing.co.jp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Slides block — frames appear one by one, each with its own loading
interface PPTSlidesBlockProps {
  slides: PPTSlide[];
}

export function PPTSlidesBlock({ slides }: PPTSlidesBlockProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // Pre-compute per-slide loading durations: some fast (0 = instant), some slow
  const loadingDurations = useRef(
    slides.map((_, i) => {
      if (i === 0) return 4800;
      if (i === slides.length - 1) return 2400;
      const fast = Math.random() < 0.2;
      return fast ? 0 : 1800 + Math.floor(Math.random() * 3000);
    })
  ).current;

  useEffect(() => {
    if (visibleCount >= slides.length) return;
    const delay = visibleCount === 0 ? 0 : 700 + Math.floor(Math.random() * 400);
    const t = setTimeout(() => setVisibleCount(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleCount, slides.length]);

  useEffect(() => {
    if (visibleCount > 0) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    }
  }, [visibleCount]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {slides.slice(0, visibleCount).map((slide, i) => (
        <div
          key={i}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          style={{ animationFillMode: 'backwards' }}
        >
          <PPTSlideCard slide={slide} loadingDuration={loadingDurations[i]} />
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

// Summary carousel — wide, with scroll
interface PPTSummaryCarouselProps {
  slides: PPTSlide[];
  title: string;
}

export function PPTSummaryCarousel({ slides, title }: PPTSummaryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
  }, []);

  return (
    <div className="rounded-[8px] border border-border-default bg-bg-bg overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-default">
        <FileText className="size-[14px] text-icon-tertiary" />
        <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{title}</span>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 px-3 py-3 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-[200px] shrink-0 aspect-[16/9] rounded-[6px] overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-accent-blue/30 transition-all bg-bg-bg">
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <div className="text-[8px] font-bold leading-[11px] whitespace-pre-line relative z-10 text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
                  {slide.contentPreview}
                </div>
              </div>
            </div>
          ))}
        </div>
        {canScrollLeft && (
          <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full bg-bg-bg/90 border border-border-default flex items-center justify-center shadow-md hover:bg-bg-hover transition-colors z-10">
            <ChevronLeft className="size-[16px] text-icon-secondary" />
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-[28px] h-[28px] rounded-full bg-bg-bg/90 border border-border-default flex items-center justify-center shadow-md hover:bg-bg-hover transition-colors z-10">
            <ChevronRight className="size-[16px] text-icon-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}

// Action buttons
interface PPTActionButtonsProps {
  onSaveTemplate: () => void;
  onEdit: () => void;
}

export function PPTActionButtons({ onSaveTemplate, onEdit }: PPTActionButtonsProps) {
  const [saveState, setSaveState] = useState<'idle' | 'naming' | 'saved'>('idle');
  const [templateName, setTemplateName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [showTip, setShowTip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (saveState === 'naming') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [saveState]);

  useEffect(() => {
    if (!showTip) return;
    const t = setTimeout(() => setShowTip(false), 3000);
    return () => clearTimeout(t);
  }, [showTip]);

  const handleSave = () => {
    if (!templateName.trim()) return;
    setSavedName(templateName.trim());
    setSaveState('saved');
    setShowTip(true);
    onSaveTemplate();
  };

  return (
    <div className="flex flex-col items-center gap-[8px]">
      {/* Toast tip */}
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxHeight: showTip ? '48px' : '0px', opacity: showTip ? 1 : 0 }}
      >
        <div className="px-4 py-2 bg-accent-green-subtle border border-accent-green-border rounded-[8px] flex items-center gap-2 shadow-lg">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6" stroke="var(--accent-green)" strokeWidth="1.2" />
            <path d="M4.5 7L6.5 9L9.5 5" stroke="var(--accent-green)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[12px] text-accent-green-text font-medium leading-4 tracking-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
            已保存为「{savedName}」· 可在首页 My template 查找
          </span>
        </div>
      </div>

      {/* Action card */}
      <div className="rounded-[8px] px-4 py-3 flex flex-col gap-2.5 bg-bg-bg" style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}>
        <p className="text-[13px] text-text-secondary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
          可将 PPT 文件保存为模版，下次生成直接使用样式，或进入编辑模式继续调整
        </p>
        <div className="flex items-center gap-2">
          {saveState === 'saved' ? (
            <div className="h-[30px] px-3 rounded-[6px] border border-border-default flex items-center gap-1.5 text-[12px] font-medium text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L5 9L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              已保存
            </div>
          ) : saveState === 'naming' ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaveState('idle'); }}
                placeholder="模板名称"
                className="h-[30px] w-[140px] px-2.5 rounded-[6px] border border-border-default text-[12px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-strong transition-colors"
                style={{ fontFamily: "'Geist', sans-serif" }}
              />
              <button
                onClick={handleSave}
                disabled={!templateName.trim()}
                className="h-[30px] px-3 rounded-[6px] bg-interactive-primary text-[12px] font-medium text-text-inverted hover:opacity-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                确定
              </button>
              <button
                onClick={() => { setSaveState('idle'); setTemplateName(''); }}
                className="h-[30px] px-2 rounded-[6px] text-[12px] text-text-tertiary hover:text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSaveState('naming')}
              className="h-[30px] px-3 rounded-[6px] border border-border-default text-[12px] font-medium text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              保存模版
            </button>
          )}
          {saveState !== 'naming' && (
            <button onClick={onEdit} className="h-[30px] px-3 rounded-[6px] bg-interactive-primary text-[12px] font-medium text-text-inverted hover:opacity-90 transition-all cursor-pointer" style={{ fontFamily: "'Geist', sans-serif" }}>
              去编辑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Version download panel
export function PPTVersionsBlock({ version }: { version: number }) {
  const versions = Array.from({ length: version }, (_, i) => ({
    label: i === version - 1 ? `Brand Symphony Method - ${version}` : i === 0 ? 'Brand Symphony - 初始版' : `Brand Symphony Method - ${i}`,
    isLatest: i === version - 1,
  })).reverse();

  return (
    <div className="max-w-[520px] bg-bg-bg rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 0px 0px 6px var(--bg-surface)', outline: '1px var(--border-default) solid' }}>
      <div className="px-[8px] py-[8px] pr-[12px] bg-bg-surface rounded-t-[8px] flex items-center gap-[12px]">
        <div className="flex items-center gap-[4px] opacity-80">
          <div className="w-[20px] h-[20px] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 2h5.5L13 5.5V12a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M9 2v4h4" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[14px] text-text-primary leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            任务中的所有版本
          </span>
        </div>
        <div className="w-[18px] h-[18px] bg-bg-subtle rounded-[2px] flex items-center justify-center">
          <span className="text-[12px] text-text-primary opacity-80 leading-[16px] tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>{version}</span>
        </div>
      </div>
      <div className="p-[6px] flex flex-col gap-[4px]">
        {versions.map((v, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-[4px] px-[6px] py-[4px] rounded-[4px]",
              v.isLatest ? "bg-bg-page" : "hover:bg-bg-hover transition-colors cursor-pointer"
            )}
          >
            <span className={cn(
              "flex-1 text-[14px] leading-[20px]",
              v.isLatest ? "text-text-primary" : "text-text-secondary"
            )} style={{ fontFamily: "'Geist', sans-serif" }}>
              {v.label}
            </span>
            <div className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center">
              {v.isLatest ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin" style={{ animationDuration: '3s' }}>
                  <circle cx="8" cy="8" r="5.5" stroke="var(--border-default)" strokeWidth="1.33" />
                  <path d="M8 2.5a5.5 5.5 0 0 1 5.5 5.5" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-80">
                  <path d="M8 3v7M5 8l3 3 3-3" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 13h10" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

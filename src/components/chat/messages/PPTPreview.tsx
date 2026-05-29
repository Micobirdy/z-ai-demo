import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, FileText, Terminal } from 'lucide-react';
import { AnimatedDotPattern } from '@/components/ui/animated-dots';
import { PixelLoading } from '@/components/ui/pixel-loading';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { useSidebar } from '@/hooks/useSidebar';
import { RevealText } from './RevealText';

export interface PPTSlide {
  title: string;
  description?: string;
  pageNumber: number;
  totalPages: number;
  bgColor: string;
  accentColor: string;
  contentPreview: string;
  slideType?: 'cover' | 'chart' | 'agenda' | 'strategy' | 'data' | 'comparison';
}

// Tool call block — commands appear one by one
interface ToolCallBlockProps {
  commands: string[];
  onDone?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  slideRange?: string;
}

export function ToolCallBlock({ commands, onDone, isExpanded, onToggleExpand, slideRange }: ToolCallBlockProps) {
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
    <div className="flex flex-col">
      {/* Summary header */}
      <button
        onClick={toggleExpand}
        className="pb-[4px] px-[4px] flex items-center gap-[4px] cursor-pointer"
      >
        <div className="w-[16px] h-[20px] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9.49968 1.3335H5.66264C5.54298 1.3335 5.48316 1.3335 5.43034 1.35171C5.38363 1.36783 5.34109 1.39412 5.30579 1.42869C5.26587 1.46778 5.23912 1.5213 5.18561 1.62832L2.38561 7.22831C2.25782 7.48389 2.19393 7.61168 2.20927 7.71555C2.22268 7.80625 2.27285 7.88743 2.34798 7.93998C2.43403 8.00016 2.5769 8.00016 2.86264 8.00016H6.99968L4.99968 14.6668L13.1284 6.23703C13.4027 5.95263 13.5398 5.81043 13.5478 5.68875C13.5548 5.58313 13.5112 5.48049 13.4303 5.41218C13.3371 5.3335 13.1396 5.3335 12.7445 5.3335H7.99968L9.49968 1.3335Z" stroke="var(--icon-secondary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {visibleCount === 0 && !done ? (
          <AnimatedShinyText className="text-[14px] font-normal leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            {slideRange ? `正在创建 ${slideRange} 页PPT...` : '正在分析任务并调用工具...'}
          </AnimatedShinyText>
        ) : !done ? (
          <AnimatedShinyText className="text-[14px] font-normal leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            {slideRange ? `正在创建 ${slideRange} 页PPT，` : ''}已探索 {fileSoFar}个文件，已运行 {runSoFar}条命令
          </AnimatedShinyText>
        ) : (
          <span className="text-[14px] font-normal text-text-secondary leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            {slideRange ? `已完成 ${slideRange} 页PPT，` : ''}已探索 {totalFiles}个文件，{done && !slideRange ? '1次搜索，' : ''}已运行 {totalRun}条命令
          </span>
        )}
        <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0">
          <ChevronRight className={cn("size-[14px] text-icon-secondary transition-transform duration-200", expanded && "rotate-90")} />
        </div>
      </button>

      {/* Tool display area */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          maxHeight: expanded ? (done ? '280px' : '50px') : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        {/* pl-[28px] aligns dot center with header icon center: 4px(parent px) + 8px(icon center) ≈ 12px from edge, curves at left:8px */}
        <div className="relative pl-[28px] pt-[4px] pb-[4px] rounded-[8px]">
          {!done ? (
            visibleCount === 0 ? (
              <div className="h-[28px]" />
            ) : (
              <div className="relative">
                {/* Only curve for running state — no vertical line */}
                <svg className="absolute left-[-19px] top-[0px]" width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <path d="M0.665 0C0.665 12.31 9.19 15.43 13.665 14.93" stroke="var(--border-default)" strokeWidth="1.33"/>
                </svg>
                <div className="flex items-center h-[26px] pr-[8px]">
                  <div className="w-[16px] h-[26px] flex items-center justify-center shrink-0 opacity-90">
                    <div className="w-[6px] h-[6px] rounded-full bg-icon-tertiary" />
                  </div>
                  <div
                    key={visibleCount}
                    className="flex items-center gap-[4px] px-[4px]"
                    style={{ animation: 'toolBlurIn 0.4s ease-out forwards' }}
                  >
                    <ToolItemContent cmd={commands[visibleCount - 1]} />
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="max-h-[260px] overflow-y-auto pr-[28px]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
              <div className="relative flex flex-col gap-[8px]">
                {/* Vertical line spanning all items */}
                <div className="absolute left-[-19px] top-0 bottom-0 w-[1.33px] bg-border-default" />
                {commands.map((cmd, i) => (
                  <div key={i} className="relative flex items-center">
                    <svg className="absolute left-[-19px] top-[3px]" width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path d="M0.665 0C0.665 12.31 9.19 15.43 13.665 14.93" stroke="var(--border-default)" strokeWidth="1.33"/>
                    </svg>
                    <div className="w-[16px] h-[26px] flex items-center justify-center shrink-0 opacity-90">
                      <div className="w-[6px] h-[6px] rounded-full bg-icon-tertiary" />
                    </div>
                    <div className="flex items-center gap-[4px] px-[4px]">
                      <ToolItemContent cmd={cmd} />
                    </div>
                  </div>
                ))}
                {/* Done row */}
                <div className="relative flex items-center">
                  <svg className="absolute left-[-18px] top-[5px]" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M0.665 0C0.665 12.31 9.19 15.43 13.665 14.93" stroke="var(--border-default)" strokeWidth="1.33"/>
                  </svg>
                  <div className="w-[16px] h-[26px] flex items-center justify-center shrink-0 opacity-90">
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="var(--icon-tertiary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="px-[4px] text-[14px] text-text-tertiary leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>完成</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolItemContent({ cmd }: { cmd: string }) {
  const toolName = cmd.split('(')[0];
  const toolArgs = cmd.slice(toolName.length);
  return (
    <div className="flex items-center gap-1 flex-1 min-w-0">
      <span className="text-[14px] font-normal text-text-tertiary leading-[20px] shrink-0" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
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
  );
}

// Single slide card with optional loading state
interface PPTSlideCardProps {
  slide: PPTSlide;
  loadingDuration?: number;
  allSlides?: PPTSlide[];
}

export function PPTSlideCard({ slide, loadingDuration = 0, allSlides }: PPTSlideCardProps) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const pixelColors = useMemo(() => dk ? ['#ffffff', '#bbbbbb', '#666666'] : ['#111111', '#444444', '#888888'], [dk]);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(loadingDuration === 0 ? 4 : 1);
  const [zoomed, setZoomed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const slidesForZoom = allSlides || [slide];

  useEffect(() => {
    if (!zoomed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setZoomIndex(i => Math.max(0, i - 1));
      else if (e.key === 'ArrowRight') setZoomIndex(i => Math.min(slidesForZoom.length - 1, i + 1));
      else if (e.key === 'Escape') setZoomed(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomed, slidesForZoom.length]);

  useEffect(() => {
    if (loadingDuration === 0 || phase !== 1) return;
    clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = setTimeout(() => setPhase(2), loadingDuration);
  }, [loadingDuration, phase]);

  useEffect(() => {
    if (phase !== 2) return;
    clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = setTimeout(() => setPhase(3), 5000);
  }, [phase]);

  useEffect(() => {
    if (phase !== 3) return;
    clearTimeout(phaseTimerRef.current);
    phaseTimerRef.current = setTimeout(() => setPhase(4), 6000);
  }, [phase]);

  return (
    <>
      <div
        className="rounded-[8px] overflow-hidden border border-border-default bg-bg-bg max-w-[540px] cursor-pointer group"
        onClick={() => { if (phase === 4) { setZoomIndex(slidesForZoom.findIndex(s => s.pageNumber === slide.pageNumber)); setZoomed(true); } }}
      >
        <div className="aspect-[16/9] relative overflow-hidden bg-bg-bg">

          {/* === PHASE 1: Pixel loading === */}
          <div
            className={cn(
              "absolute inset-0 z-10 transition-opacity duration-[800ms] ease-out",
              phase >= 2 ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <PixelLoading
              colors={pixelColors}
              duration={loadingDuration || 5000}
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
                {/* Header */}
                <div className="flex items-center justify-between" style={{ animation: 'renderElement 0.4s ease-out 0.2s both' }}>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[14px] h-[14px] rounded-[3px] bg-accent-blue flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 2h5M1 3.5h3.5M1 5h4" stroke="white" strokeWidth="0.6" strokeLinecap="round"/></svg>
                    </div>
                    <span className="text-[7px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                  </div>
                  {slide.slideType !== 'cover' && (
                    <span className="text-[7px] text-text-placeholder tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>
                      {String(slide.pageNumber).padStart(2, '0')} / {String(slide.totalPages).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Content — varies by slideType */}
                <div className="flex-1 flex flex-col justify-center gap-[5px]">
                  {slide.slideType === 'cover' ? (
                    <>
                      <div style={{ animation: 'renderElement 0.5s ease-out 0.5s both' }}>
                        <div className="text-[18px] font-bold leading-[22px] whitespace-pre-line text-accent-blue" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.contentPreview}</div>
                      </div>
                      <div className="h-[12px] w-[55%] rounded-[2px] bg-accent-blue flex items-center px-[6px]" style={{ animation: 'renderElement 0.4s ease-out 0.9s both' }}>
                        <span className="text-[5px] text-white font-medium tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
                      </div>
                      <div style={{ animation: 'renderElement 0.3s ease-out 1.2s both' }}>
                        <span className="text-[7px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>成功へのデジタルロードマップ</span>
                      </div>
                    </>
                  ) : slide.slideType === 'chart' || slide.slideType === 'data' ? (
                    <>
                      <div style={{ animation: 'renderElement 0.5s ease-out 0.4s both' }}>
                        <div className="text-[16px] font-bold leading-[20px] text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.title}</div>
                      </div>
                      <div style={{ animation: 'renderElement 0.4s ease-out 0.7s both' }}>
                        <span className="text-[6px] text-text-secondary leading-[10px] line-clamp-2" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.description}</span>
                      </div>
                      <div className="flex items-center gap-[4px] mt-[2px]" style={{ animation: 'renderElement 0.3s ease-out 1.0s both' }}>
                        <div className="w-[3px] h-[10px] rounded-[1px] bg-accent-blue" />
                        <span className="text-[6px] text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>モバイルファーストの消費者行動が<span className="text-accent-blue font-medium">68%</span>に上昇</span>
                      </div>
                      {/* Charts row */}
                      <div className="flex gap-[4%] mt-[4px]" style={{ animation: 'renderElement 0.5s ease-out 1.3s both' }}>
                        <div className="flex-1 rounded-[3px] border border-border-default p-[4px]">
                          <div className="text-[4px] text-text-tertiary text-center mb-[3px]" style={{ fontFamily: "'Geist', sans-serif" }}>マーケティング手法別成長率</div>
                          <div className="flex items-end gap-[2px] h-[28px]">
                            {[55, 40, 30, 50, 65].map((h, j) => (
                              <div key={j} className="flex-1 rounded-t-[1px]" style={{ height: `${h}%`, backgroundColor: ['#60a5fa','#a78bfa','#f472b6','#fb923c','#34d399'][j] }} />
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 rounded-[3px] border border-border-default p-[4px] flex items-center justify-center">
                          <div className="w-[30px] h-[30px] rounded-full border-[4px] border-accent-blue relative">
                            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#60a5fa 0% 40%, #a78bfa 40% 65%, #f472b6 65% 80%, #fb923c 80% 100%)' }} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : slide.slideType === 'agenda' ? (
                    <>
                      <div className="text-center" style={{ animation: 'renderElement 0.5s ease-out 0.4s both' }}>
                        <div className="text-[16px] font-bold leading-[20px] text-accent-blue" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.contentPreview}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-[3px] mt-[4px]" style={{ animation: 'renderElement 0.5s ease-out 0.8s both' }}>
                        {['ブランド紹介','アジェンダ概要','マーケティング戦略概要','市場分析','競合分析','ブランドポジショニング','ターゲットオーディエンス','マーケティングミックス','デジタルマーケティング'].map((item, j) => (
                          <div key={j} className={cn("rounded-[2px] px-[3px] py-[2px] text-[4px] leading-[6px] flex items-center gap-[2px]",
                            j % 3 === 0 ? "bg-accent-blue text-white" : j % 3 === 1 ? "bg-accent-blue/10 text-text-secondary" : "border border-border-default text-text-tertiary"
                          )} style={{ fontFamily: "'Geist', sans-serif" }}>
                            <span>{j+1}. {item}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ animation: 'renderElement 0.5s ease-out 0.4s both' }}>
                        <div className="text-[16px] font-bold leading-[20px] text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.title}</div>
                      </div>
                      <div style={{ animation: 'renderElement 0.4s ease-out 0.7s both' }}>
                        <span className="text-[6px] text-text-secondary leading-[10px] line-clamp-2" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.description}</span>
                      </div>
                      <div className="h-[3px] w-[35%] bg-accent-blue rounded-full" style={{ animation: 'renderElement 0.3s ease-out 1.0s both' }} />
                      <div className="flex flex-col gap-[3px] mt-[2px]" style={{ animation: 'renderElement 0.4s ease-out 1.3s both' }}>
                        {[80, 65, 72].map((w, j) => (
                          <div key={j} className="flex items-center gap-[3px]">
                            <div className="w-[3px] h-[3px] rounded-full bg-accent-blue shrink-0" />
                            <div className="h-[2.5px] rounded-[1px] bg-text-primary/10" style={{ width: `${w}%` }} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between" style={{ animation: 'renderElement 0.3s ease-out 2.0s both' }}>
                  {slide.slideType === 'cover' ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <span className="text-[5px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                      <span className="text-[5px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>マーケティング戦略 2025</span>
                    </>
                  )}
                </div>
              </div>

              {/* Blur mask — Phase 3 only */}
              {phase === 3 && (
                <div className="absolute inset-0 z-[12] pointer-events-none" style={{ animation: 'pptReveal 5.5s ease-in-out forwards' }}>
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

      {/* Zoom modal with keyboard navigation */}
      {zoomed && (() => {
        const zSlide = slidesForZoom[zoomIndex] || slide;
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
            onClick={() => setZoomed(false)}
          >
            {/* Left arrow */}
            {zoomIndex > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setZoomIndex(i => i - 1); }} className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-[101]">
                <ChevronLeft className="size-[20px] text-white" />
              </button>
            )}
            {/* Right arrow */}
            {zoomIndex < slidesForZoom.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setZoomIndex(i => i + 1); }} className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer z-[101]">
                <ChevronRight className="size-[20px] text-white" />
              </button>
            )}
            {/* Slide */}
            <div
              className="w-[90vw] max-w-[1200px] aspect-[16/9] rounded-[12px] overflow-hidden relative shadow-2xl bg-bg-bg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 p-[6%] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-[20px] h-[20px] rounded-[4px] bg-accent-blue flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 7 7" fill="none"><path d="M1 2h5M1 3.5h3.5M1 5h4" stroke="white" strokeWidth="0.6" strokeLinecap="round"/></svg>
                    </div>
                    <span className="text-[1vw] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                  </div>
                  <span className="text-[1vw] text-text-placeholder tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>{zoomIndex + 1} / {slidesForZoom.length}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-[1%]">
                  <div className="text-[3.5vw] font-bold leading-[1.2] whitespace-pre-line text-accent-blue" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {zSlide.contentPreview}
                  </div>
                  {zSlide.description && (
                    <div className="text-[1vw] text-text-tertiary mt-[0.5%] max-w-[70%]" style={{ fontFamily: "'Geist', sans-serif" }}>
                      {zSlide.description}
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[0.8vw] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                  <span className="text-[0.8vw] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>マーケティング戦略 2025</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
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
          key={slide.pageNumber}
          style={i === visibleCount - 1 ? { animation: 'fadeIn 0.3s ease-out' } : undefined}
        >
          <PPTSlideCard slide={slide} loadingDuration={loadingDurations[i]} allSlides={slides} />
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
  inline?: boolean;
}

export function PPTActionButtons({ onSaveTemplate, onEdit, inline }: PPTActionButtonsProps) {
  const [saveState, setSaveState] = useState<'idle' | 'naming' | 'saving' | 'saved'>('idle');
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
    setSaveState('saving');
    onSaveTemplate();
    setTimeout(() => {
      setSaveState('saved');
    }, 2500);
  };

  if (inline) {
    if (saveState === 'naming') {
      return (
        <div className="flex-1 flex items-center gap-[8px] h-[32px]" style={{ animation: 'slideUpFade 0.35s ease-out forwards' }}>
          <span className="text-[13px] text-text-secondary shrink-0" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>模板名称</span>
          <input
            ref={inputRef}
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setSaveState('idle'); setTemplateName(''); } }}
            placeholder="例如：季度汇报模板"
            className="flex-1 h-[32px] px-[8px] rounded-[6px] border border-border-default bg-bg-bg text-[13px] text-text-primary outline-none placeholder:text-text-placeholder focus:border-border-strong transition-colors"
            style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
          />
          <button
            onClick={handleSave}
            disabled={!templateName.trim()}
            className="h-[32px] px-[12px] rounded-[6px] bg-interactive-primary text-[13px] text-text-inverted hover:opacity-90 cursor-pointer disabled:opacity-30 shrink-0"
            style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
          >
            确定
          </button>
          <button
            onClick={() => { setSaveState('idle'); setTemplateName(''); }}
            className="text-[13px] text-text-tertiary hover:text-text-secondary cursor-pointer shrink-0"
            style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
          >
            取消
          </button>
        </div>
      );
    }

    if (saveState === 'saving') {
      return (
        <div className="flex-1 flex items-center justify-center h-[32px]" style={{ animation: 'slideUpFade 0.45s ease-out forwards' }}>
          <div className="flex items-center gap-[6px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 4.5L5.5 10.5L3 8" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] text-text-secondary" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
              已保存为「{savedName}」可在首页 我的模版 查找。
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-[6px] py-[6px]">
          <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5L13 10.5V3a1 1 0 0 0-1-1z" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M9 14v-4h4" stroke="var(--icon-primary)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[14px] text-text-primary opacity-80 leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            保存为模版或进入编辑模式
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          {saveState === 'saved' ? (
            <div className="h-[30px] px-[12px] rounded-[6px] border border-border-default flex items-center gap-[4px] text-[13px] text-text-tertiary" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L5 9L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              已保存
            </div>
          ) : (
            <button
              onClick={() => setSaveState('naming')}
              className="h-[30px] px-[12px] rounded-[6px] bg-bg-bg border border-border-default text-[13px] text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
              style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
            >
              保存为模版
            </button>
          )}
          <button onClick={onEdit} className="h-[30px] px-[12px] rounded-[6px] bg-interactive-primary-press text-[13px] text-text-inverted hover:opacity-90 transition-all cursor-pointer" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            去编辑
          </button>
        </div>
      </div>
    );
  }

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
export function PPTVersionsBlock({ version, isNew, onEdit }: { version: number; isNew?: boolean; onEdit?: () => void }) {
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleDownload = (idx: number, label: string) => {
    setDownloadingIdx(idx);
    const delay = 5000 + Math.random() * 3000;
    setTimeout(() => {
      setDownloadingIdx(null);
      setToast(`「${label}」已下载成功`);
      setTimeout(() => setToast(null), 3000);
    }, delay);
  };

  const versions = Array.from({ length: version }, (_, i) => ({
    label: i === 0 ? 'Brand Symphony - 初始版' : `Brand Symphony Method - ${i + 1}`,
    isLatest: i === version - 1,
    index: i,
  })).reverse();

  return (
    <>
      {/* Toast at screen top */}
      {toast && (
        <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-[200] px-[16px] py-[10px] bg-bg-bg rounded-[8px] border border-border-default shadow-lg flex items-center gap-[8px]" style={{ animation: 'slideUpFade 0.3s ease-out' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="var(--accent-green)" strokeWidth="1.33"/>
            <path d="M5.5 8L7.5 10L10.5 6" stroke="var(--accent-green)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[13px] text-text-primary" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>{toast}</span>
        </div>
      )}
    <div className="w-[330px] bg-bg-bg rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 0px 0px 6px var(--bg-surface)', outline: '1px var(--border-default) solid', animation: isNew ? 'slideUpFade 0.4s ease-out' : undefined }}>
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
      <div className="p-[6px] flex flex-col gap-[2px]">
        {versions.map((v) => (
          <div
            key={v.index}
            className={cn(
              "flex items-center gap-[4px] px-[6px] py-[4px] rounded-[4px]",
              v.isLatest ? "bg-bg-page" : "hover:bg-bg-hover transition-colors cursor-pointer"
            )}
          >
            <span className={cn(
              "flex-1 text-[14px] leading-[20px] truncate",
              v.isLatest ? "text-text-primary" : "text-text-secondary"
            )} style={{ fontFamily: "'Geist', sans-serif" }}>
              {v.label}
            </span>
            <div className="flex items-center gap-[2px] shrink-0">
              {v.isLatest ? (
                <>
                  {/* Edit icon */}
                  <div onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface cursor-pointer transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 10.5V12h1.5l7-7-1.5-1.5-7 7zM11.5 4l-1.5-1.5L8.5 4 10 5.5 11.5 4z" stroke="var(--icon-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  {/* Download icon — latest */}
                  <div onClick={(e) => { e.stopPropagation(); handleDownload(v.index, v.label); }} className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface cursor-pointer transition-colors">
                    {downloadingIdx === v.index ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin" style={{ animationDuration: '1.5s' }}>
                        <circle cx="7" cy="7" r="5" stroke="var(--border-default)" strokeWidth="1.2"/>
                        <path d="M7 2a5 5 0 0 1 5 5" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v7M4.5 7L7 9.5 9.5 7" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.5 11.5h9" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Play icon */}
                  <div onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface cursor-pointer transition-colors opacity-80">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4.5 3v8l6-4-6-4z" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Download icon — history */}
                  <div onClick={(e) => { e.stopPropagation(); handleDownload(v.index, v.label); }} className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface cursor-pointer transition-colors opacity-80">
                    {downloadingIdx === v.index ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin" style={{ animationDuration: '1.5s' }}>
                        <circle cx="7" cy="7" r="5" stroke="var(--border-default)" strokeWidth="1.2"/>
                        <path d="M7 2a5 5 0 0 1 5 5" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v7M4.5 7L7 9.5 9.5 7" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.5 11.5h9" stroke="var(--icon-primary)" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

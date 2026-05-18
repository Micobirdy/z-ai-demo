import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, FileText, Terminal } from 'lucide-react';

export interface PPTSlide {
  title: string;
  pageNumber: number;
  totalPages: number;
  bgColor: string;
  accentColor: string;
  contentPreview: string;
}

// Tool call block — commands appear one by one
interface ToolCallBlockProps {
  commands: string[];
}

export function ToolCallBlock({ commands }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (visibleCount >= commands.length) {
      setDone(true);
      const t = setTimeout(() => setExpanded(false), 1000);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setVisibleCount(v => v + 1), 600 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [visibleCount, commands.length]);

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        {!done && <span className="w-[14px] h-[14px] rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />}
        {done && <Terminal className="size-[14px]" />}
        <span className="font-medium">已运行 {done ? commands.length : visibleCount} 条命令</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-200", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="pl-[22px] mt-1 flex flex-col gap-0.5 animate-in fade-in duration-200">
          {commands.slice(0, visibleCount).map((cmd, i) => (
            <div
              key={i}
              className="py-1 text-[12px] text-text-tertiary animate-in fade-in duration-300"
              style={{ fontFamily: "'Geist Mono', 'SF Mono', monospace" }}
            >
              <span className="text-icon-tertiary mr-1">→</span> {cmd}
            </div>
          ))}
          {!done && (
            <div className="py-1 flex items-center gap-1.5">
              <span className="w-[4px] h-[4px] rounded-full bg-accent-blue animate-pulse" />
              <span className="text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>执行中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Single slide card
interface PPTSlideCardProps {
  slide: PPTSlide;
}

export function PPTSlideCard({ slide }: PPTSlideCardProps) {
  return (
    <div className="rounded-[8px] overflow-hidden border border-border-default bg-bg-bg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-default">
        <div className="flex items-center gap-1.5">
          <FileText className="size-[14px] text-icon-tertiary" />
          <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.title}</span>
        </div>
        <span className="text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.pageNumber}/{slide.totalPages}</span>
      </div>
      <div className="aspect-[16/9] relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-8" style={{
            background: `linear-gradient(135deg, transparent 30%, ${slide.accentColor} 100%)`
          }} />
          <div className="text-[10px] opacity-30 mb-1" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
            ■ デジタルマーケティング研究所
          </div>
          <div className="text-[16px] font-bold leading-[22px] whitespace-pre-line relative z-10" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
            {slide.contentPreview}
          </div>
        </div>
      </div>
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
            <div key={i} className="w-[200px] shrink-0 aspect-[16/9] rounded-[6px] overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-accent-blue/30 transition-all" style={{ backgroundColor: slide.bgColor }}>
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <div className="text-[8px] font-bold leading-[11px] whitespace-pre-line relative z-10" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
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
  return (
    <div className="rounded-[8px] border border-border-default bg-bg-bg p-4 flex flex-col gap-3">
      <p className="text-[13px] text-text-secondary leading-[20px]" style={{ fontFamily: "'Geist', sans-serif" }}>
        可将 PPT 文件保存为模版，下次生成直接使用样式，或进入编辑模式继续调整
      </p>
      <div className="flex items-center gap-2">
        <button onClick={onSaveTemplate} className="px-4 h-[32px] rounded-[6px] border border-border-default text-[13px] font-medium text-text-primary hover:bg-bg-hover transition-colors cursor-pointer active:opacity-80" style={{ fontFamily: "'Geist', sans-serif" }}>
          保存为模版
        </button>
        <button onClick={onEdit} className="px-4 h-[32px] rounded-[6px] bg-interactive-primary text-[13px] font-medium text-text-inverted hover:opacity-90 transition-all cursor-pointer active:opacity-80" style={{ fontFamily: "'Geist', sans-serif" }}>
          去编辑
        </button>
      </div>
    </div>
  );
}

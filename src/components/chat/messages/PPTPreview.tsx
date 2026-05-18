import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';

export interface PPTSlide {
  title: string;
  pageNumber: number;
  totalPages: number;
  imageUrl?: string;
  bgColor: string;
  accentColor: string;
  contentPreview: string;
}

interface PPTSlideCardProps {
  slide: PPTSlide;
}

export function PPTSlideCard({ slide }: PPTSlideCardProps) {
  return (
    <div className="rounded-[8px] overflow-hidden border border-border-default bg-bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-default">
        <div className="flex items-center gap-1.5">
          <FileText className="size-[14px] text-icon-tertiary" />
          <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.title}</span>
        </div>
        <span className="text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{slide.pageNumber}/{slide.totalPages}</span>
      </div>
      {/* Slide preview */}
      <div className="aspect-[16/9] relative overflow-hidden" style={{ backgroundColor: slide.bgColor }}>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-10" style={{
            background: `linear-gradient(135deg, transparent 30%, ${slide.accentColor} 100%)`
          }} />
          <div className="text-[11px] opacity-40 mb-1" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
            ■ デジタルマーケティング研究所
          </div>
          <div className="text-[18px] font-bold leading-[24px] relative z-10" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
            {slide.contentPreview.split('\n')[0]}
          </div>
          {slide.contentPreview.split('\n')[1] && (
            <div className="text-[14px] font-semibold mt-0.5 relative z-10" style={{ color: slide.accentColor === '#ffffff' || slide.accentColor === '#f3f4f6' ? '#e2e8f0' : slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
              {slide.contentPreview.split('\n')[1]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PPTSummaryCarouselProps {
  slides: PPTSlide[];
  title: string;
}

export function PPTSummaryCarousel({ slides, title }: PPTSummaryCarouselProps) {
  const [scrollPos, setScrollPos] = useState(0);
  const maxScroll = Math.max(0, slides.length - 3);

  return (
    <div className="rounded-[8px] border border-border-default bg-bg-bg overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-default">
        <FileText className="size-[14px] text-icon-tertiary" />
        <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{title}</span>
      </div>
      <div className="relative px-2 py-3">
        <div className="flex gap-2 overflow-hidden">
          {slides.slice(scrollPos, scrollPos + 3).map((slide, i) => (
            <div key={i} className="flex-1 min-w-0 aspect-[16/9] rounded-[6px] overflow-hidden relative" style={{ backgroundColor: slide.bgColor }}>
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <div className="text-[9px] font-bold leading-[12px] relative z-10" style={{ color: slide.accentColor, fontFamily: "'Geist', sans-serif" }}>
                  {slide.contentPreview.split('\n')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Nav arrows */}
        {scrollPos > 0 && (
          <button onClick={() => setScrollPos(p => Math.max(0, p - 1))} className="absolute left-1 top-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-bg-bg border border-border-default flex items-center justify-center shadow-sm hover:bg-bg-hover transition-colors">
            <ChevronLeft className="size-[14px] text-icon-secondary" />
          </button>
        )}
        {scrollPos < maxScroll && (
          <button onClick={() => setScrollPos(p => Math.min(maxScroll, p + 1))} className="absolute right-1 top-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-bg-bg border border-border-default flex items-center justify-center shadow-sm hover:bg-bg-hover transition-colors">
            <ChevronRight className="size-[14px] text-icon-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}

interface ToolCallBlockProps {
  count: number;
  children?: React.ReactNode;
}

export function ToolCallBlock({ count }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer py-1"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        <span className="font-medium">已运行 {count} 条命令</span>
        <ChevronRight className={cn("size-[14px] transition-transform duration-200", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="pl-4 mt-1 flex flex-col gap-1 text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist Mono', monospace" }}>
          <div className="py-0.5">{'→ ppt-maker.initialize(template: "etching")'}</div>
          <div className="py-0.5">{'→ ppt-maker.insert(slides: 6)'}</div>
          <div className="py-0.5">{'→ ppt-maker.update(format: "16:9")'}</div>
        </div>
      )}
    </div>
  );
}

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

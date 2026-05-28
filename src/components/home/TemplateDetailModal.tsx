import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { AnimatedDotPattern } from '@/components/ui/animated-dots';
import { cn } from '@/lib/utils';

interface TemplateDetailModalProps {
  template: {
    title: string;
    subtitle?: string;
    prompt: string;
    coverBg: string;
    coverAccent: string;
    coverTextColor: string;
    tag?: string;
  };
  onClose: () => void;
  onUse: () => void;
}

const SLIDE_TITLES = [
  '封面',
  '目录',
  '市场概览',
  '竞争分析',
  '战略规划',
  '执行路径',
  '数据分析',
  '团队介绍',
  '总结',
];

export function TemplateDetailModal({ template, onClose, onUse }: TemplateDetailModalProps) {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSlides = 7;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < totalSlides; i++) {
      const delay = 3000 + Math.random() * 7000;
      timers.push(setTimeout(() => {
        setLoadedSlides(prev => new Set(prev).add(i));
      }, delay));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const scrollThumbnails = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 140, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-[848px] max-w-[95vw] max-h-[90vh] bg-bg-bg rounded-[12px] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200"
        style={{ boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)', outline: '1px var(--border-default) solid', outlineOffset: '-1px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[16px] shrink-0">
          <span className="text-[18px] font-medium leading-[26px] text-text-primary" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
            模板详情
          </span>
          <button onClick={onClose} className="p-[4px] rounded-[6px] hover:bg-bg-surface transition-colors cursor-pointer">
            <X className="size-[16px] text-icon-secondary opacity-80" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[20px] pb-[20px] flex flex-col gap-[16px]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
          {/* Info row — button vertically centered with text+tags block */}
          <div className="flex items-center gap-[72px]">
            <div className="flex-1 flex flex-col gap-[12px]">
              <div className="flex flex-col gap-[8px]">
                <span className="text-[16px] font-normal leading-[26px] text-text-primary opacity-80" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                  现代营销策略模板
                </span>
                <span className="text-[13px] font-normal leading-[18px] text-text-primary opacity-80" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                  一个现代、专业的演示模板，旨在用于营销策略提案或数字商业计划，具有清晰的结构、强大的蓝色品牌标识、图表和日本排版。
                </span>
              </div>
              {/* Tags */}
              <div className="flex items-center gap-[8px] flex-wrap">
                {['pptx', '19页', '19.16 MB', '商务', '技术'].map(tag => (
                  <span key={tag} className="px-[12px] py-[6px] bg-bg-surface rounded-[4px] text-[12px] text-text-tertiary leading-[16px] tracking-[0.03px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onUse}
              className="shrink-0 min-w-[80px] px-[32px] py-[6px] bg-interactive-primary text-text-inverted text-[13px] font-normal leading-[18px] rounded-[6px] hover:opacity-90 transition-all cursor-pointer"
              style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
            >
              使用模板
            </button>
          </div>

          {/* Main preview */}
          <div className="w-full aspect-[16/9] rounded-[8px] overflow-hidden border border-border-default relative" style={{ backgroundColor: selectedSlide === 0 ? template.coverBg : undefined }}>
            {selectedSlide === 0 ? (
              <CoverSlide template={template} />
            ) : loadedSlides.has(selectedSlide) ? (
              <InnerSlide index={selectedSlide} template={template} />
            ) : (
              <div className="absolute inset-0 bg-bg-bg">
                <AnimatedDotPattern className="absolute inset-0 size-full" width={8} height={8} cr={1} maxOpacity={0.5} flickerChance={0.06} />
              </div>
            )}
          </div>

          {/* Thumbnail carousel */}
          <div className="relative overflow-visible">
            <div ref={scrollRef} className="flex gap-[12px] overflow-x-auto py-[6px] pl-[4px] pr-[4px]" style={{ scrollbarWidth: 'none' }}>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlide(i)}
                  className={cn(
                    "w-[124px] h-[70px] shrink-0 rounded-[6px] overflow-hidden cursor-pointer relative",
                    selectedSlide === i
                      ? "outline outline-2 outline-offset-2 outline-accent-blue/50"
                      : "outline outline-1 outline-offset-[-1px] outline-border-default hover:outline-border-strong"
                  )}
                >
                  {i === 0 ? (
                    <div className="w-full h-full" style={{ backgroundColor: template.coverBg }}>
                      <div className="absolute inset-0 p-1.5 flex flex-col justify-end">
                        <div className="text-[5px] font-bold leading-[7px] whitespace-pre-line" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>
                          {template.title}
                        </div>
                      </div>
                    </div>
                  ) : loadedSlides.has(i) ? (
                    <div className="w-full h-full bg-bg-bg p-1.5 flex flex-col justify-start">
                      <span className="text-[4px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{SLIDE_TITLES[i] || `P${i + 1}`}</span>
                      <span className="text-[6px] font-bold text-text-primary mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>{SLIDE_TITLES[i] || `Page ${i + 1}`}</span>
                      <div className="mt-1 flex flex-col gap-[1.5px]">
                        <div className="h-[1.5px] bg-border-default w-[80%] rounded-[0.5px]" />
                        <div className="h-[1.5px] bg-border-default w-[60%] rounded-[0.5px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full overflow-hidden relative bg-bg-bg">
                      <AnimatedDotPattern className="absolute inset-0 size-full" width={5} height={5} cr={0.7} maxOpacity={0.55} flickerChance={0.08} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {/* Scroll right button */}
            <button
              onClick={() => scrollThumbnails(1)}
              className="absolute right-[-12px] top-1/2 -translate-y-1/2 p-[6px] bg-bg-bg rounded-full shadow-md border border-border-default hover:bg-bg-surface transition-colors cursor-pointer z-10"
              style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.12)' }}
            >
              <ChevronRight className="size-[16px] text-icon-primary opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverSlide({ template }: { template: { coverBg: string; coverAccent: string; coverTextColor: string; title: string; subtitle?: string } }) {
  return (
    <div className="absolute inset-0 p-[6%] flex flex-col justify-between" style={{ backgroundColor: template.coverBg }}>
      <div className="flex items-center gap-[6px]">
        <div className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center" style={{ backgroundColor: template.coverAccent }}>
          <svg width="9" height="9" viewBox="0 0 7 7" fill="none"><path d="M1 2h5M1 3.5h3.5M1 5h4" stroke="white" strokeWidth="0.6" strokeLinecap="round"/></svg>
        </div>
        <span className="text-[9px] opacity-60" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="text-[32px] font-bold leading-[38px] whitespace-pre-line" style={{ color: template.coverAccent, fontFamily: "'Geist', sans-serif" }}>
          {template.title}
        </div>
        <div className="h-[20px] w-[45%] rounded-[3px] flex items-center px-[8px]" style={{ backgroundColor: template.coverAccent }}>
          <span className="text-[8px] text-white font-medium tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
        </div>
        <span className="text-[10px] opacity-60 mt-[2px]" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>成功へのデジタルロードマップ</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[7px] opacity-40" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>プレゼンター:</span>
          <span className="text-[9px] font-medium opacity-70" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>佐藤 健太</span>
        </div>
        <span className="text-[8px] opacity-40" style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}>www.digitalmarketing.co.jp</span>
      </div>
    </div>
  );
}

function InnerSlide({ index, template }: { index: number; template: { coverAccent: string } }) {
  const titles = ['', '目录', '市場概覧', '競合分析', '戦略計画', '実行パス', 'データ分析', '結論'];
  return (
    <div className="absolute inset-0 bg-bg-bg p-[6%] flex flex-col justify-start gap-[4%]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{titles[index] || `Page ${index + 1}`}</span>
        <span className="text-[10px] text-text-tertiary tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="text-[22px] font-bold leading-[28px] text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
        {titles[index] || `Page ${index + 1}`}
      </div>
      <div className="flex-1 flex flex-col gap-[8px] mt-[2%]">
        {[85, 70, 90, 60, 75].map((w, i) => (
          <div key={i} className="h-[4px] rounded-[2px] bg-border-default" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="h-[3px] w-[30%] rounded-full" style={{ backgroundColor: template.coverAccent, opacity: 0.5 }} />
    </div>
  );
}

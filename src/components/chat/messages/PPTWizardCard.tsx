import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { PPTPreferences } from '@/types/chat';

const AUDIENCES = [
  { key: 'business', label: '泛商务/同事分享' },
  { key: 'executive', label: '管理层/投资人' },
  { key: 'tech', label: '技术团队/工程师' },
  { key: 'education', label: '高校/学生科普' },
];

const STYLES = [
  { key: 'cool-blue', label: '浅灰背景，深蓝标题与橙色点缀，商务清爽' },
  { key: 'mint-modern', label: '白色背景，青绿高光与柔和灰文本，简洁现代' },
  { key: 'warm-gold', label: '暖沙背景，金色标题与棕色点缀，稳重温暖' },
  { key: 'dark-tech', label: '深灰背景，明亮青柠标题与炭黑细节，科技感强' },
];

interface PPTWizardCardProps {
  onSubmit: (prefs: PPTPreferences) => void;
  onSkip: () => void;
}

export function PPTWizardCard({ onSubmit, onSkip }: PPTWizardCardProps) {
  const [audience, setAudience] = useState('business');
  const [pageCount, setPageCount] = useState('1-12');
  const [style, setStyle] = useState('mint-modern');
  const [notes, setNotes] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (countdown === 0 && !submitted) handleSubmit();
  }, [countdown, submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);
    onSubmit({ audience, pageCount, style, notes });
  }, [submitted, audience, pageCount, style, notes, onSubmit]);

  const handleSkip = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);
    onSkip();
  }, [submitted, onSkip]);

  return (
    <div className="rounded-[6px] border border-border-default bg-bg-bg overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-[15px]">☘</span>
          <span className="text-[15px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
            规划幻灯片创建
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSkip} disabled={submitted} className="text-[14px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-30" style={{ fontFamily: "'Geist', sans-serif" }}>
            跳过 »
          </button>
          <button onClick={handleSubmit} disabled={submitted} className={cn(
            "px-4 py-2 rounded-[6px] text-[14px] font-medium transition-all cursor-pointer disabled:opacity-30",
            "border border-border-default text-text-primary hover:bg-bg-hover active:opacity-80"
          )} style={{ fontFamily: "'Geist', sans-serif" }}>
            继续 ({countdown})
          </button>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col divide-y divide-border-default">
        {/* 目标受众 */}
        <div className="pb-6">
          <h4 className="text-[15px] font-semibold text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>目标受众与场景</h4>
          <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>常见默认：泛商务/同事分享</p>
          <div className="flex flex-wrap gap-2.5">
            {AUDIENCES.map(a => (
              <Chip key={a.key} label={a.label} selected={audience === a.key} onClick={() => !submitted && setAudience(a.key)} disabled={submitted} />
            ))}
          </div>
        </div>

        {/* PPT 页数 */}
        <div className="py-6">
          <h4 className="text-[15px] font-semibold text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>PPT 页数</h4>
          <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>默认12 页可覆盖主题且保持简洁，如需更精炼可选 8–10 页</p>
          <div className="relative w-[120px]">
            <select
              value={pageCount}
              onChange={e => setPageCount(e.target.value)}
              disabled={submitted}
              className="w-full h-10 pl-3.5 pr-9 rounded-[6px] border border-border-default bg-bg-bg text-text-primary text-[14px] appearance-none outline-none cursor-pointer hover:border-border-strong focus:border-border-strong transition-colors disabled:opacity-40"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <option value="1-12">1-12</option>
              <option value="8-10">8-10</option>
              <option value="5-8">5-8</option>
              <option value="15-20">15-20</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-[14px] text-icon-tertiary pointer-events-none" />
          </div>
        </div>

        {/* 视觉风格 */}
        <div className="py-6">
          <h4 className="text-[15px] font-semibold text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>视觉风格</h4>
          <p className="text-[13px] text-text-tertiary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>主题为AI与科技，优先提供科技与商务场景适配方案</p>
          <div className="flex flex-wrap gap-2.5">
            {STYLES.map(s => (
              <Chip key={s.key} label={s.label} selected={style === s.key} onClick={() => !submitted && setStyle(s.key)} disabled={submitted} />
            ))}
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
  );
}

function Chip({ label, selected, onClick, disabled }: { label: string; selected: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-[32px] px-3.5 rounded-[6px] text-[13px] leading-[20px] border transition-colors cursor-pointer disabled:opacity-40 active:opacity-80",
        selected
          ? "bg-interactive-primary text-text-inverted border-transparent"
          : "border-border-default text-text-primary hover:border-border-strong hover:bg-bg-hover"
      )}
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {label}
    </button>
  );
}

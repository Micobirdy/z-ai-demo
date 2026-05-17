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
  const [countdown, setCountdown] = useState(20);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (countdown === 0 && !submitted) {
      handleSubmit();
    }
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
    <div className="rounded-[12px] border border-border-default bg-bg-bg overflow-hidden w-full max-w-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-[13px]">☘</span>
          <span className="text-[14px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
            规划幻灯片创建
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSkip} disabled={submitted} className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer disabled:opacity-40" style={{ fontFamily: "'Geist', sans-serif" }}>
            跳过 »
          </button>
          <button onClick={handleSubmit} disabled={submitted} className={cn(
            "px-3 py-1 rounded-[8px] text-[13px] font-medium border transition-all cursor-pointer disabled:opacity-40",
            "border-border-default text-text-primary hover:bg-bg-hover"
          )} style={{ fontFamily: "'Geist', sans-serif" }}>
            继续 ({countdown})
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* 目标受众 */}
        <div>
          <h4 className="text-[14px] font-medium text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>目标受众与场景</h4>
          <p className="text-[12px] text-text-tertiary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>常见默认：泛商务/同事分享</p>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(a => (
              <button
                key={a.key}
                onClick={() => !submitted && setAudience(a.key)}
                className={cn(
                  "px-3 py-1.5 rounded-[8px] text-[13px] border transition-all cursor-pointer",
                  audience === a.key
                    ? "bg-interactive-primary text-text-inverted border-transparent"
                    : "border-border-default text-text-secondary hover:border-border-strong"
                )}
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-border-default" />

        {/* PPT 页数 */}
        <div>
          <h4 className="text-[14px] font-medium text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>PPT 页数</h4>
          <p className="text-[12px] text-text-tertiary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>默认12 页可覆盖主题且保持简洁，如需更精炼可选 8–10 页</p>
          <div className="relative w-[120px]">
            <select
              value={pageCount}
              onChange={e => setPageCount(e.target.value)}
              disabled={submitted}
              className="w-full h-9 pl-3 pr-8 rounded-[8px] border border-border-default bg-bg-bg text-text-primary text-[13px] appearance-none outline-none cursor-pointer hover:border-border-strong transition-colors"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <option value="1-12">1-12</option>
              <option value="8-10">8-10</option>
              <option value="5-8">5-8</option>
              <option value="15-20">15-20</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-[14px] text-icon-tertiary pointer-events-none" />
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-border-default" />

        {/* 视觉风格 */}
        <div>
          <h4 className="text-[14px] font-medium text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>视觉风格</h4>
          <p className="text-[12px] text-text-tertiary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>主题为AI与科技，优先提供科技与商务场景适配方案</p>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map(s => (
              <button
                key={s.key}
                onClick={() => !submitted && setStyle(s.key)}
                className={cn(
                  "px-3 py-2.5 rounded-[8px] text-left text-[12px] leading-[18px] border transition-all cursor-pointer",
                  style === s.key
                    ? "bg-interactive-primary text-text-inverted border-transparent"
                    : "border-border-default text-text-secondary hover:border-border-strong"
                )}
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-border-default" />

        {/* 备注 */}
        <div>
          <h4 className="text-[14px] font-medium text-text-primary mb-1" style={{ fontFamily: "'Geist', sans-serif" }}>备注</h4>
          <p className="text-[12px] text-text-tertiary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>补充你需要的生成内容，非必填</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={submitted}
            placeholder="描述"
            rows={3}
            className="w-full px-3 py-2.5 rounded-[8px] border border-border-default bg-bg-bg text-text-primary text-[13px] leading-[20px] resize-none outline-none placeholder:text-text-placeholder transition-colors hover:border-border-strong focus:border-border-strong"
            style={{ fontFamily: "'Geist', sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
}

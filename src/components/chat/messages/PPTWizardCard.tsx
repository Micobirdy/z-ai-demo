import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import type { PPTPreferences } from '@/types/chat';

const AUDIENCES = [
  { key: 'business', label: '泛商务/同事分享' },
  { key: 'executive', label: '管理层/投资人' },
  { key: 'tech', label: '技术团队/工程师' },
  { key: 'education', label: '高校/学生科普' },
];

const STYLES = [
  {
    key: 'cool-blue',
    label: '商务清爽',
    colors: ['#f0f4f8', '#1a365d', '#e07b00', '#f8f8f8'],
    desc: '浅灰背景 · 深蓝标题 · 橙色点缀',
  },
  {
    key: 'mint-modern',
    label: '简洁现代',
    colors: ['#ffffff', '#00d9c0', '#888888', '#f0f0f0'],
    desc: '白色背景 · 青绿高光 · 灰文本',
  },
  {
    key: 'warm-gold',
    label: '稳重温暖',
    colors: ['#fdf6ec', '#c49a2a', '#8b6914', '#f5ead0'],
    desc: '暖沙背景 · 金色标题 · 棕色点缀',
  },
  {
    key: 'dark-tech',
    label: '科技感强',
    colors: ['#1a1a2e', '#00ff88', '#2d2d44', '#0d0d1a'],
    desc: '深灰背景 · 青柠标题 · 炭黑细节',
  },
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
    <div className="rounded-[12px] border border-border-default bg-bg-bg overflow-hidden w-full max-w-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="text-[14px]">☘</span>
          <span className="text-[14px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
            规划幻灯片创建
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSkip} disabled={submitted} className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer disabled:opacity-30" style={{ fontFamily: "'Geist', sans-serif" }}>
            跳过 »
          </button>
          <button onClick={handleSubmit} disabled={submitted} className={cn(
            "px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer disabled:opacity-30",
            "border border-border-default text-text-primary hover:bg-bg-hover active:scale-[0.97]"
          )} style={{ fontFamily: "'Geist', sans-serif" }}>
            继续 ({countdown})
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* 目标受众 */}
        <Section title="目标受众与场景" desc="常见默认：泛商务/同事分享">
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(a => (
              <Chip key={a.key} label={a.label} selected={audience === a.key} onClick={() => !submitted && setAudience(a.key)} disabled={submitted} />
            ))}
          </div>
        </Section>

        {/* PPT 页数 */}
        <Section title="PPT 页数" desc="默认12 页可覆盖主题且保持简洁，如需更精炼可选 8–10 页">
          <div className="relative w-[140px]">
            <select
              value={pageCount}
              onChange={e => setPageCount(e.target.value)}
              disabled={submitted}
              className="w-full h-9 pl-3 pr-8 rounded-[8px] border border-border-default bg-bg-bg text-text-primary text-[13px] appearance-none outline-none cursor-pointer hover:border-border-strong focus:border-border-strong transition-colors disabled:opacity-40"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <option value="1-12">1-12 页</option>
              <option value="8-10">8-10 页</option>
              <option value="5-8">5-8 页</option>
              <option value="15-20">15-20 页</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-[14px] text-icon-tertiary pointer-events-none" />
          </div>
        </Section>

        {/* 视觉风格 — color swatch cards */}
        <Section title="视觉风格" desc="主题为AI与科技，优先提供科技与商务场景适配方案">
          <div className="grid grid-cols-2 gap-2.5">
            {STYLES.map(s => (
              <button
                key={s.key}
                onClick={() => !submitted && setStyle(s.key)}
                disabled={submitted}
                className={cn(
                  "relative rounded-[10px] border overflow-hidden text-left transition-all cursor-pointer disabled:opacity-40",
                  style === s.key
                    ? "border-interactive-primary ring-2 ring-interactive-primary/20"
                    : "border-border-default hover:border-border-strong"
                )}
              >
                {/* Color bar preview */}
                <div className="flex h-[32px]">
                  {s.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {/* Label */}
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>{s.label}</span>
                    {style === s.key && (
                      <div className="w-[16px] h-[16px] rounded-full bg-interactive-primary flex items-center justify-center">
                        <Check className="size-[10px] text-text-inverted" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-text-tertiary mt-0.5 block" style={{ fontFamily: "'Geist', sans-serif" }}>{s.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* 备注 */}
        <Section title="备注" desc="补充你需要的生成内容，非必填">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={submitted}
            placeholder="描述"
            rows={2}
            className="w-full px-3 py-2.5 rounded-[8px] border border-border-default bg-bg-bg text-text-primary text-[13px] leading-[20px] resize-none outline-none placeholder:text-text-placeholder transition-colors hover:border-border-strong focus:border-border-strong disabled:opacity-40"
            style={{ fontFamily: "'Geist', sans-serif" }}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[14px] font-medium text-text-primary mb-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>{title}</h4>
      <p className="text-[12px] text-text-tertiary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>{desc}</p>
      {children}
    </div>
  );
}

function Chip({ label, selected, onClick, disabled }: { label: string; selected: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 py-1.5 rounded-[8px] text-[13px] border transition-all cursor-pointer disabled:opacity-40 active:scale-[0.97]",
        selected
          ? "bg-interactive-primary text-text-inverted border-transparent"
          : "border-border-default text-text-secondary hover:border-border-strong hover:bg-bg-hover"
      )}
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {label}
    </button>
  );
}

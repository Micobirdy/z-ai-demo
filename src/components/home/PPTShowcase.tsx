import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useSidebar } from '@/hooks/useSidebar';
import { TemplateDetailModal } from './TemplateDetailModal';

const CATEGORIES = [
  { key: 'my', label: 'My template' },
  { key: 'all', label: 'All templates' },
  { key: 'design', label: 'Design' },
  { key: 'education', label: 'Education' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Technology' },
];

interface Template {
  id: string;
  title: string;
  subtitle?: string;
  prompt: string;
  coverBg: string;
  coverAccent: string;
  coverTextColor: string;
  tag?: string;
  category: string[];
}

const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'マーケティング\n戦略 2025',
    subtitle: 'プレゼンテーション',
    prompt: '请基于"2025 市场营销战略"的内容，重新设计一份 10 页的高级演示文稿。风格：极简、冷峻、艺术画廊风格。',
    coverBg: '#f0f4f8',
    coverAccent: '#2563eb',
    coverTextColor: '#1e3a5f',
    tag: '蓝色清爽',
    category: ['all', 'marketing', 'business'],
  },
  {
    id: '2',
    title: 'Healthcare\nConsulting\nExcellence',
    subtitle: 'Comprehensive Market Analysis',
    prompt: 'Create a healthcare consulting presentation with market analysis, digital transformation insights, and strategic recommendations. 12 pages, professional tone.',
    coverBg: '#dc2626',
    coverAccent: '#fca5a5',
    coverTextColor: '#ffffff',
    tag: '红色商务',
    category: ['all', 'business'],
  },
  {
    id: '3',
    title: 'Transforming\nInsurance with\nDigital Strategy',
    subtitle: 'A data-driven approach',
    prompt: 'Design a presentation about digital transformation in the insurance industry. Include data-driven insights, strategic roadmap, and implementation timeline.',
    coverBg: '#1f2937',
    coverAccent: '#6b7280',
    coverTextColor: '#f3f4f6',
    tag: '深色科技',
    category: ['all', 'technology', 'business'],
  },
  {
    id: '4',
    title: 'AI 产品\n路线图',
    subtitle: '2024-2026 规划',
    prompt: '创建一份 AI 产品路线图演示文稿，包含产品愿景、技术架构、市场分析和里程碑规划。10页，科技风格。',
    coverBg: '#0f172a',
    coverAccent: '#22d3ee',
    coverTextColor: '#e2e8f0',
    tag: '暗色科技',
    category: ['all', 'technology'],
  },
  {
    id: '5',
    title: '教育培训\n课程设计',
    subtitle: '互动教学方案',
    prompt: '设计一份教育培训课程演示文稿，涵盖课程大纲、教学方法、学习目标和评估体系。简洁现代风格。',
    coverBg: '#f0fdf4',
    coverAccent: '#16a34a',
    coverTextColor: '#14532d',
    tag: '教育绿色',
    category: ['all', 'education'],
  },
  {
    id: '6',
    title: 'Brand\nIdentity\nGuidelines',
    subtitle: 'Design System 2025',
    prompt: 'Create a brand identity guidelines presentation including logo usage, color system, typography, and design principles. Minimal and elegant.',
    coverBg: '#faf5ff',
    coverAccent: '#9333ea',
    coverTextColor: '#581c87',
    tag: '设计紫色',
    category: ['all', 'design'],
  },
];

const MY_TEMPLATES: Template[] = [
  {
    id: 'my-1',
    title: '我的项目\n汇报模板',
    subtitle: '通用版本 v2',
    prompt: '基于我的项目汇报模板，生成一份项目进度汇报演示文稿，包含项目概述、进展、风险和下一步计划。',
    coverBg: '#f8fafc',
    coverAccent: '#3b82f6',
    coverTextColor: '#1e40af',
    category: ['my'],
  },
  {
    id: 'my-2',
    title: '周报模板',
    subtitle: '团队周报',
    prompt: '基于我的周报模板，生成本周工作总结和下周计划的演示文稿。',
    coverBg: '#fffbeb',
    coverAccent: '#d97706',
    coverTextColor: '#92400e',
    category: ['my'],
  },
];

const PROMPTS = [
  'Create a presentation on the impact of artificial intelligence on future work.',
  'Design a quarterly business review deck with data visualizations and key metrics.',
  'Build a product launch presentation with competitive analysis and go-to-market strategy.',
  'Create a technical architecture overview for a cloud migration project.',
];

interface PPTShowcaseProps {
  onSelectPrompt: (prompt: string) => void;
  onSelectTemplate?: (template: { title: string; coverBg: string; coverAccent: string; coverTextColor: string; prompt: string }) => void;
}

export function PPTShowcase({ onSelectPrompt, onSelectTemplate }: PPTShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [detailTemplate, setDetailTemplate] = useState<Template | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showTemplateTip, setShowTemplateTip } = useSidebar();

  // Auto-dismiss template tip
  useEffect(() => {
    if (!showTemplateTip) return;
    setActiveCategory('my');
    const t = setTimeout(() => setShowTemplateTip(false), 4000);
    return () => clearTimeout(t);
  }, [showTemplateTip, setShowTemplateTip]);

  // Auto-scroll to Prompt area when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = activeCategory === 'my'
    ? MY_TEMPLATES
    : TEMPLATES.filter(t => t.category.includes(activeCategory));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="w-[900px] max-w-full xl:w-[960px] 2xl:w-[1080px] min-[1920px]:w-[1240px] flex flex-col gap-8 mt-4"
      ref={containerRef}
    >
      {/* Prompt suggestions */}
      <div className="flex flex-col items-center gap-4">
        <SectionTitle text="Prompt" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(p)}
              className="text-left p-3 rounded-[12px] border border-border-default bg-bg-bg h-[110px] flex flex-col overflow-hidden transition-colors hover:bg-bg-surface active:opacity-80 cursor-pointer"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <div className="w-[20px] h-[20px] mb-2.5 text-icon-tertiary shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 14V6M10 6L6 10M10 6L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[13px] leading-[18px] text-text-secondary flex-1 min-h-0 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{p}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Example templates */}
      <div className="flex flex-col items-center gap-4">
        <SectionTitle text="Example" />

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.key} className="flex items-center gap-2">
              {i === 1 && <div className="w-px h-[20px] bg-border-default" />}
              <div className="relative">
                {/* Tooltip for My template */}
                {cat.key === 'my' && showTemplateTip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center z-50" style={{ animation: 'toolBlurIn 0.4s ease-out forwards' }}>
                    <div className="px-4 py-2 bg-[#1a1a1a] rounded-[8px] shadow-lg whitespace-nowrap" style={{ boxShadow: '0 4px 6px -2px rgba(16,24,40,0.03), 0 12px 16px -4px rgba(16,24,40,0.08)' }}>
                      <span className="text-[12px] text-white font-medium leading-4 tracking-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                        你保存的模版可在首页选择使用
                      </span>
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1a1a1a]" />
                  </div>
                )}
                <button
                  onClick={() => { setActiveCategory(cat.key); if (cat.key === 'my') setShowTemplateTip(false); }}
                className={cn(
                  "px-3 py-1.5 rounded-[8px] text-[13px] border transition-all cursor-pointer active:scale-[0.97]",
                  activeCategory === cat.key
                    ? "bg-interactive-primary text-text-inverted border-transparent"
                    : "border-border-default text-text-secondary hover:border-border-strong hover:bg-bg-surface",
                  cat.key === 'my' && activeCategory !== 'my' && "border-dashed"
                )}
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                {cat.label}
              </button>
              </div>
            </div>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onClick={() => setDetailTemplate(template)} />
          ))}
        </div>
      </div>

      {/* Template detail modal */}
      {detailTemplate && (
        <TemplateDetailModal
          template={detailTemplate}
          onClose={() => setDetailTemplate(null)}
          onUse={() => {
            setDetailTemplate(null);
            if (onSelectTemplate) {
              onSelectTemplate({ title: detailTemplate.title.replace(/\n/g, ' '), coverBg: detailTemplate.coverBg, coverAccent: detailTemplate.coverAccent, coverTextColor: detailTemplate.coverTextColor, prompt: detailTemplate.prompt });
            } else {
              onSelectPrompt(detailTemplate.prompt);
            }
          }}
        />
      )}
    </motion.div>
  );
}

function TemplateCard({ template, onClick }: { template: Template; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover — 16:9 */}
      <div
        className="relative aspect-[16/9] p-5 flex flex-col justify-end overflow-hidden"
        style={{ backgroundColor: template.coverBg }}
      >
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-10" style={{
          background: `linear-gradient(135deg, transparent 40%, ${template.coverAccent} 100%)`
        }} />
        <h3
          className="text-[15px] font-semibold leading-[20px] whitespace-pre-line relative z-10"
          style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}
        >
          {template.title}
        </h3>
        {template.subtitle && (
          <p
            className="text-[11px] mt-1.5 relative z-10 opacity-70"
            style={{ color: template.coverTextColor, fontFamily: "'Geist', sans-serif" }}
          >
            {template.subtitle}
          </p>
        )}

        {/* Hover overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-200 z-20",
          hovered ? "bg-black/60 opacity-100 backdrop-blur-[2px]" : "opacity-0 pointer-events-none"
        )}>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="px-5 py-2 rounded-[8px] bg-white text-[13px] font-medium text-[#0d0d0d] shadow-xl transition-all hover:bg-gray-100 active:scale-[0.96]"
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            Use template
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 w-full max-w-[360px]">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--border-default))' }} />
      <span className="text-[13px] font-medium text-text-tertiary tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--border-default))' }} />
    </div>
  );
}

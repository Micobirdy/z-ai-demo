import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

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
}

export function PPTShowcase({ onSelectPrompt }: PPTShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = activeCategory === 'my'
    ? MY_TEMPLATES
    : TEMPLATES.filter(t => t.category.includes(activeCategory));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="w-full max-w-[794px] flex flex-col gap-8 mt-4"
    >
      {/* Prompt suggestions */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-text-tertiary italic" style={{ fontFamily: "'Geist', sans-serif" }}>✦</span>
          <span className="text-[14px] font-medium text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>Prompt</span>
          <span className="text-[12px] text-text-tertiary italic" style={{ fontFamily: "'Geist', sans-serif" }}>✦</span>
        </div>
        <div className="grid grid-cols-4 gap-3 w-full">
          {PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(p)}
              className="text-left p-4 rounded-[12px] border border-border-default bg-bg-bg text-[13px] leading-[18px] text-text-secondary transition-all hover:border-border-strong hover:shadow-sm active:scale-[0.98] cursor-pointer"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <div className="w-[20px] h-[20px] mb-3 text-icon-tertiary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 3L13 10L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3L9 10L3 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/></svg>
              </div>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Example templates */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-text-tertiary italic" style={{ fontFamily: "'Geist', sans-serif" }}>✦</span>
          <span className="text-[14px] font-medium text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>Example</span>
          <span className="text-[12px] text-text-tertiary italic" style={{ fontFamily: "'Geist', sans-serif" }}>✦</span>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-3 py-1.5 rounded-[8px] text-[13px] border transition-all cursor-pointer active:scale-[0.97]",
                activeCategory === cat.key
                  ? "bg-interactive-primary text-text-inverted border-transparent"
                  : "border-border-default text-text-secondary hover:border-border-strong hover:bg-bg-hover",
                cat.key === 'my' && activeCategory !== 'my' && "border-dashed"
              )}
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onClick={() => onSelectPrompt(template.prompt)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TemplateCard({ template, onClick }: { template: Template; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-[12px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer bg-bg-bg"
    >
      {/* Cover */}
      <div
        className="relative h-[160px] p-5 flex flex-col justify-end overflow-hidden"
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
      </div>
    </button>
  );
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { PreviewPanel } from './PreviewPanel';
import { PPTActionButtons } from './messages/PPTPreview';
import { PPTEditorOverlay } from './PPTEditorOverlay';
import type { Message, PreviewFile, PPTPreferences } from '@/types/chat';
import type { PPTSlide } from './messages/PPTPreview';
import { ChevronDown, Share, Monitor } from 'lucide-react';
import { BackgroundTasksDropdown } from '@/components/ui/BackgroundTasksDropdown';

const MOCK_FILES: PreviewFile[] = [
  {
    name: 'presentation.html',
    path: '/presentation.html',
    language: 'html',
    content: `<!DOCTYPE html>\n<html lang="zh">\n<head>\n  <meta charset="UTF-8">\n  <title>AI 与科技 - 演示文稿</title>\n  <style>\n    body { font-family: system-ui; margin: 0; background: #f0f4f8; }\n    .slide { width: 960px; height: 540px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 60px; }\n    h1 { font-size: 36px; color: #1a1f3a; }\n    p { font-size: 18px; color: #555; line-height: 1.8; }\n  </style>\n</head>\n<body>\n  <div class="slide">\n    <h1>AI 与科技趋势报告</h1>\n    <p>本报告覆盖 2024-2025 年 AI 领域的核心发展趋势。</p>\n  </div>\n</body>\n</html>`,
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const PPT_THINKING_CONTENT = `分析用户输入的演示文稿需求...

正在提取关键信息，识别主题方向和行业领域，分析内容深度和专业程度，评估目标受众的期望。

正在检索相关模板库，匹配行业关键词与模板标签，评估模板使用频率和评分，筛选出最佳候选模板。

对比候选模板的视觉结构与信息密度，排除不适合当前主题的布局方案，锁定 3 套高匹配度模板进入下一轮评估。

规划最佳呈现策略，推荐页数范围和内容密度，匹配适合的视觉风格，确定配色方案和排版规则，计算内容与页面的最优分配比。

根据主题复杂度与演讲时长预估，确定每页信息承载量上限，避免单页内容过载导致观众注意力分散。

生成内容大纲，包括封面页的标题和演讲者信息，目录页的章节导航，核心内容页的数据图表与案例展示，以及总结页的核心结论与下一步行动。

为数据展示页匹配最佳图表类型，柱状图用于趋势对比，环形图用于占比分析，时间轴用于里程碑呈现。

评估配色方案的可访问性，确保文字与背景对比度符合 WCAG 标准，同时保持品牌视觉一致性。

检查字体兼容性，确认中英文混排场景下的行高与字间距表现，选择最优的字体组合方案。

需要与用户确认目标受众与使用场景、期望的幻灯片页数、视觉风格偏好等参数。

准备进入需求确认阶段...`;

interface ChatPageProps {
  initialMessage?: string;
  agentKey?: string | null;
}

export function ChatPage({ initialMessage, agentKey }: ChatPageProps) {
  const { theme, toggleTheme, setShowTemplateTip, clearChat, addChatHistory, addSavedTemplate } = useSidebar();
  const dk = theme === 'dark';
  const isPPT = agentKey === 'ai-ppt';
  const initRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pptPhase, setPptPhase] = useState<'thinking' | 'wizard' | 'generating' | 'done' | null>(isPPT ? 'thinking' : null);
  const [showActions, setShowActions] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [pptVersion, setPptVersion] = useState(0);

  const [showContent, setShowContent] = useState(false);

  // Sequence: top bar slides in (synced with sidebar collapse) → content area appears → query flies in → AI responds
  useEffect(() => {
    if (initRef.current || !initialMessage) return;
    initRef.current = true;
    addChatHistory(initialMessage);

    // After sidebar collapse + top bar animation settle, show content area and send query
    setTimeout(() => {
      setShowContent(true);

      setTimeout(() => {
        setMessages([{
          id: generateId(),
          role: 'user',
          content: initialMessage,
          timestamp: Date.now(),
        }]);

        setTimeout(() => {
          if (isPPT) {
            setMessages(prev => [...prev, {
              id: generateId(),
              role: 'assistant',
              content: PPT_THINKING_CONTENT,
              timestamp: Date.now(),
              type: 'thinking',
            }]);
          } else {
            genericReply(initialMessage);
          }
        }, 650);
      }, 150);
    }, 400);
  }, []);

  // When thinking auto-collapses, show wizard
  const handleThinkingDone = useCallback(() => {
    if (pptPhase !== 'thinking') return;
    setPptPhase('wizard');
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'assistant',
      content: '收集生成偏好（页数与配色）',
      timestamp: Date.now(),
      type: 'ppt-wizard',
    }]);
  }, [pptPhase]);

  const handlePPTSubmit = useCallback((prefs: PPTPreferences, skipUserMessage?: boolean) => {
    setPptPhase('generating');
    const labels: Record<string, Record<string, string>> = {
      audience: { business: '泛商务/同事分享', executive: '管理层/投资人', tech: '技术团队/工程师', education: '高校/学生科普' },
      style: { 'warm-bold': '浅灰背景/深蓝橙色', 'mint-modern': '白色背景/青绿灰文本', 'sand-gold': '暖沙背景/金色棕色', 'candy-pop': '浅灰背景/紫橙点缀' },
    };

    const totalPages = Number(prefs.pageCount.split('-').pop()) || 6;
    const slides = [
      {
        title: 'マーケティング戦略 2025',
        description: '2025年度の包括的なデジタルマーケティング戦略と実行ロードマップ',
        contentPreview: 'マーケティング\n戦略 2025',
        slideType: 'cover' as const,
      },
      {
        title: '市場分析',
        description: '2025年度の市場分析によると、デジタルマーケティング分野は年間15.8%の成長率で拡大しています。特にSNSマーケティングとコンテンツマーケティングの需要が高まっています。',
        contentPreview: '市場分析',
        slideType: 'chart' as const,
      },
      {
        title: 'アジェンダ',
        description: 'ブランド紹介、市場分析、競合分析、マーケティング戦略、デジタルマーケティング、KPI・測定指標、実行計画・ロードマップ',
        contentPreview: 'アジェンダ',
        slideType: 'agenda' as const,
      },
      {
        title: 'マーケティング戦略概要',
        description: 'ターゲット市場の特定とポジショニング戦略、チャネル別の予算配分と期待ROI',
        contentPreview: 'マーケティング戦略\n概要',
        slideType: 'strategy' as const,
      },
      {
        title: 'データ分析',
        description: '購買層の世代別分布、マーケティング手法別成長率、モバイルファーストの消費者行動が68%に上昇',
        contentPreview: 'データ分析',
        slideType: 'data' as const,
      },
      {
        title: '競合分析',
        description: '主要競合3社の機能比較、市場シェア推移、差別化ポイントとSWOT分析',
        contentPreview: '競合分析',
        slideType: 'comparison' as const,
      },
    ].slice(0, totalPages).map((s, i) => ({
      ...s,
      pageNumber: i + 1,
      totalPages,
      bgColor: '#ffffff',
      accentColor: '#2563eb',
    }));

    // Build the generation steps — each step is { delay, message }
    // Steps with streaming/tool-call wait for their animation to finish before advancing
    const toolCallCommands1 = [
      'Read("src/templates/index.ts")',
      'Read("src/templates/etching/config.json")',
      'Read("src/templates/etching/slides.tsx")',
      'Read("src/themes/colors.ts")',
      'Grep("slideLayout", "src/templates/**/*.tsx")',
      'ppt-maker.initialize(template: "etching")',
      'ppt-maker.configure(theme: "minimal", ratio: "16:9")',
      'ppt-maker.loadFonts(["Geist", "Noto Sans SC"])',
      'ppt-maker.insert(slides: 6, layout: "auto")',
      'ppt-maker.applyTheme(palette: "cool-blue")',
      'ppt-maker.update(format: "16:9", exportDPI: 144)',
    ];
    const toolCallCommands2 = [
      'Read("src/content/outline.md")',
      'Read("src/assets/charts/market-data.json")',
      'ppt-maker.generateContent(slide: 1, type: "cover")',
      'ppt-maker.generateContent(slide: 2, type: "analysis")',
      'ppt-maker.generateContent(slide: 3, type: "agenda")',
      'ppt-maker.renderCharts(slides: [2], engine: "d3")',
      'ppt-maker.validateLayout(slides: [1,2,3])',
    ];

    const toolCallCommands2b = [
      'ppt-maker.generateContent(slide: 4, type: "strategy")',
      'ppt-maker.generateContent(slide: 5, type: "analysis")',
      'ppt-maker.generateContent(slide: 6, type: "comparison")',
      'ppt-maker.renderCharts(slides: [5], engine: "d3")',
      'ppt-maker.validateLayout(slides: [4,5,6])',
    ];

    const toolCallCommands3 = [
      'ppt-maker.validateLayout(slide: 1, check: "overflow")',
      'ppt-maker.validateLayout(slide: 2, check: "overflow")',
      'ppt-maker.validateLayout(slide: 3, check: "overlap")',
      'ppt-maker.autoFix(slide: 3, issue: "text-overflow")',
      'ppt-maker.validateLayout(slide: 4, check: "whitespace")',
      'ppt-maker.autoFix(slide: 4, issue: "spacing")',
      'ppt-maker.validateLayout(slide: 5, check: "overflow")',
      'ppt-maker.validateLayout(slide: 6, check: "overlap")',
      'ppt-maker.autoFix(slide: 6, issue: "font-size")',
      'ppt-maker.optimizeAssets(compress: true, quality: 92)',
      'ppt-maker.exportFinal(format: "pptx", dpi: 144)',
    ];

    const actualSlideCount = slides.length;
    const halfPoint = Math.ceil(actualSlideCount / 2);
    const slidesFirstHalf = slides.slice(0, halfPoint);
    const slidesSecondHalf = slides.slice(halfPoint);

    type Step = { delay: number; message: Message; waitForAnimation?: boolean };
    const steps: Step[] = [
      // 0: User confirmation (skip if skipped)
      ...(skipUserMessage ? [] : [{ delay: 0, message: { id: generateId(), role: 'user' as const, content: `受众: ${labels.audience[prefs.audience] || prefs.audience}\n页数: ${prefs.pageCount}\n风格: ${prefs.style.split(',').map(s => labels.style[s] || s).join('、')}${prefs.notes ? `\n备注: ${prefs.notes}` : ''}`, timestamp: Date.now() } }]),
      // 1: Tool call 1 — initialize
      { delay: 1200, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: toolCallCommands1 } }, waitForAnimation: true },
      // 2: Context text
      { delay: 600, message: { id: generateId(), role: 'assistant', content: '模板已加载，主题配色和字体已配置完成。接下来开始生成各页内容和数据图表。', timestamp: Date.now(), streaming: true }, waitForAnimation: true },
      // 3: Tool call 2 — first batch
      { delay: 1000, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: toolCallCommands2, slideRange: `1-${halfPoint}` } }, waitForAnimation: true },
      // 4: First batch slides
      { delay: 1200, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'ppt-slides', meta: { slides: slidesFirstHalf } } },
      // 5: Tool call 2b — second batch
      { delay: 800, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: toolCallCommands2b, slideRange: `${halfPoint + 1}-${actualSlideCount}` } }, waitForAnimation: true },
      // 6: Second batch slides
      { delay: 1200, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'ppt-slides', meta: { slides: slidesSecondHalf } } },
      // 7: Post-slide text
      { delay: 1000, message: { id: generateId(), role: 'assistant', content: `${totalPages}页幻灯片草稿已生成，正在进行版面校验和自动修复...`, timestamp: Date.now(), streaming: true }, waitForAnimation: true },
      // 8: Tool call 3 — validation & export
      { delay: 800, message: { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: toolCallCommands3 } }, waitForAnimation: true },
      // 9: Final summary
      { delay: 600, message: { id: generateId(), role: 'assistant', content: `已完成全部${totalPages}页演示文稿的生成与校验。\n\n${totalPages}/${totalPages} 页通过 · 3 页经自动修复 · 0 页残留问题\n\n以下几项建议人工确认：\n1. **核心数字** — 52.4、8、13 等关键数据是否与最新版本一致\n2. **人名与单位** — 汇报人和组织名称是否准确\n3. **金句措辞** — 各页金句的语气是否符合汇报风格\n4. **演讲节奏** — 按每页备注试读，确认 5 分钟内能讲完\n\n需要修改任何一页，直接说页号 + 改什么，例如"P6 的数字改成 53.1"。`, timestamp: Date.now(), streaming: true }, waitForAnimation: true },
    ];

    stepIndexRef.current = 0;
    stepsRef.current = steps;
    advanceStep();
  }, []);

  const stepIndexRef = useRef(0);
  const stepsRef = useRef<{ delay: number; message: Message; waitForAnimation?: boolean }[]>([]);
  const waitingForAnimationRef = useRef<string | null>(null);

  const advanceStep = useCallback(() => {
    const steps = stepsRef.current;
    const idx = stepIndexRef.current;

    if (idx >= steps.length) {
      setPptPhase('done');
      setPptVersion(1);
      setScrollTrigger(v => v + 1);
      // Show action bar after 1.5s
      setTimeout(() => {
        setShowActions(true);
        setScrollTrigger(v => v + 1);
      }, 1500);
      // Show version panel after all PPT slides finish rendering (~15s)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
          type: 'ppt-versions', meta: { version: 1 },
        }]);
        setScrollTrigger(v => v + 1);
      }, 15000);
      return;
    }

    const step = steps[idx];
    stepIndexRef.current = idx + 1;

    setTimeout(() => {
      setMessages(prev => {
        const updated = prev.filter(m => m.type !== 'generating');
        return [...updated, step.message];
      });

      if (step.waitForAnimation) {
        waitingForAnimationRef.current = step.message.id;
      } else {
        advanceStep();
      }
    }, step.delay);
  }, []);

  const handleStreamingDone = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(m => m.id === messageId ? { ...m, streaming: false } : m);
      // Check if all streaming is done — show actions after last stream completes
      const hasAnyStreaming = updated.some(m => m.streaming);
      if (!hasAnyStreaming && pptPhase === 'done' && !showActions) {
        setTimeout(() => {
          setShowActions(true);
          setScrollTrigger(v => v + 1);
        }, 1500);
      }
      return updated;
    });
    setScrollTrigger(v => v + 1);
    if (waitingForAnimationRef.current === messageId) {
      waitingForAnimationRef.current = null;
      advanceStep();
    }
  }, [advanceStep, pptPhase, showActions]);

  const handleToolCallDone = useCallback((messageId: string) => {
    if (waitingForAnimationRef.current === messageId) {
      waitingForAnimationRef.current = null;
      advanceStep();
    }
  }, [advanceStep]);

  const handlePPTSkip = useCallback(() => {
    setMessages(prev => [...prev, {
      id: generateId(), role: 'user' as const, content: '跳过', timestamp: Date.now(),
    }]);
    handlePPTSubmit({ audience: 'business', pageCount: '1-12', style: 'mint-modern', notes: '' }, true);
  }, [handlePPTSubmit]);

  function genericReply(userMsg: string) {
    setIsTyping(true);
    setTimeout(() => {
      const hasFiles = /create|build|make|generate|写|创建|生成/i.test(userMsg);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: hasFiles
          ? `I've created the project files for you. You can preview them in the panel on the right.`
          : `That's a great question! Here's what I found based on your request.\n\nWould you like me to go deeper into any specific area?`,
        timestamp: Date.now(),
        files: hasFiles ? MOCK_FILES : undefined,
      }]);
      if (hasFiles) {
        setPreviewFiles(MOCK_FILES);
        setShowPreview(true);
      }
      setIsTyping(false);
      if (pptPhase === 'done') setShowActions(true);
    }, 1200);
  }

  const handleSend = useCallback((text: string) => {
    setShowActions(false);
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }]);

    if (pptPhase === 'done') {
      pptModifyReply(text);
    } else {
      genericReply(text);
    }
  }, [pptPhase]);

  function pptModifyReply(userMsg: string) {
    setIsTyping(true);
    const modifyCommands = [
      `Read("slides/current-state.json")`,
      `ppt-maker.parseIntent("${userMsg.slice(0, 30)}...")`,
      `ppt-maker.modifySlide(target: "auto", action: "update")`,
      `ppt-maker.validateLayout(all: true)`,
      `ppt-maker.exportDraft(format: "preview")`,
    ];

    // Get existing slides from messages
    const existingSlides = messages.find(m => m.type === 'ppt-slides')?.meta?.slides as PPTSlide[] || [];

    setTimeout(() => {
      setIsTyping(false);
      // Tool call
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
        type: 'tool-call', meta: { commands: modifyCommands },
      }]);
    }, 600);

    setTimeout(() => {
      // Context text
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant',
        content: '已根据你的要求修改了演示文稿，正在重新生成预览...',
        timestamp: Date.now(), streaming: true,
      }]);
      setScrollTrigger(v => v + 1);
    }, 4000);

    setTimeout(() => {
      // Re-emit updated slides
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
        type: 'ppt-slides', meta: { slides: existingSlides },
      }]);
      setScrollTrigger(v => v + 1);
    }, 6000);

    setTimeout(() => {
      // Final summary
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant',
        content: `修改完成。主要变更：\n\n• 已更新相关页面的内容和排版\n• 版面校验通过，无溢出问题\n\n如需继续调整，请直接描述修改内容。`,
        timestamp: Date.now(), streaming: true,
      }]);
      setScrollTrigger(v => v + 1);
    }, 8000);

    setTimeout(() => {
      setPptVersion(v => v + 1);
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
        type: 'ppt-versions', meta: { version: pptVersion + 1, isNew: true },
      }]);
      setShowActions(true);
      setScrollTrigger(v => v + 1);
    }, 10000);
  }

  return (
    <div className="flex flex-col h-full bg-bg-page">
      {/* Top bar — slides down in sync with sidebar collapse */}
      <motion.div
        className="flex items-center justify-between px-[16px] h-[52px] shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.4, 0, 0, 1] }}
      >
        {/* Left — model selector */}
        <button className="flex items-center gap-[4px] cursor-pointer transition-colors hover:opacity-80">
          <span className="text-[16px] font-normal leading-[24px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>
            GLM 5.1
          </span>
          <ChevronDown className="size-[12px] text-icon-tertiary" />
        </button>

        {/* Right — Background Tasks + Usage + Share */}
        <div className="flex items-center gap-[8px]">
          <BackgroundTasksDropdown />
          <div className="flex items-center gap-[4px] px-[8px] py-[6px] rounded-[6px]">
            <Monitor className="size-[14px] text-icon-secondary" />
            <span className="text-[14px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>50%</span>
          </div>
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-interactive-primary text-text-inverted text-[13px] font-medium transition-all hover:opacity-90 active:scale-[0.97]" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Share className="size-[14px]" />
            Share
          </button>
        </div>
      </motion.div>

      {/* Main area — appears after sidebar collapse + top bar settle */}
      <motion.div
        className="flex-1 flex min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={cn("flex flex-col min-h-0", showPreview ? "w-[60%]" : "w-full")}>
          <ChatMessages
            messages={messages}
            onPPTSubmit={handlePPTSubmit}
            onPPTSkip={handlePPTSkip}
            onThinkingDone={handleThinkingDone}
            onStreamingDone={handleStreamingDone}
            onToolCallDone={handleToolCallDone}
            onEditPPT={() => setIsEditing(true)}
            scrollTrigger={scrollTrigger}
            showAssistantActions={!isPPT}
          />
          {isTyping && (
            <div className="px-4 pb-3">
              <div className="max-w-[768px] 2xl:max-w-[860px] min-[1920px]:max-w-[960px] mx-auto flex items-center gap-1 py-2">
                <span className="w-[7px] h-[7px] rounded-full bg-text-primary" style={{ animation: 'dotBounce 1.4s ease-in-out infinite', animationDelay: '0ms' }} />
                <span className="w-[7px] h-[7px] rounded-full bg-text-primary" style={{ animation: 'dotBounce 1.4s ease-in-out infinite', animationDelay: '160ms' }} />
                <span className="w-[7px] h-[7px] rounded-full bg-text-primary" style={{ animation: 'dotBounce 1.4s ease-in-out infinite', animationDelay: '320ms' }} />
              </div>
            </div>
          )}
          <div className="relative z-30">
            {showActions ? (
              <div className="px-4 pb-2">
                <div className="max-w-[768px] 2xl:max-w-[860px] min-[1920px]:max-w-[960px] mx-auto bg-bg-page rounded-[13px] outline outline-1 outline-offset-[-1px] outline-border-default overflow-hidden">
                  {/* Action bar — slides up from behind the input */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 44, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="h-[44px] px-[12px] flex items-center">
                      <PPTActionButtons onSaveTemplate={(name) => { setShowTemplateTip(true); addSavedTemplate({ id: Math.random().toString(36).substring(2), title: name, prompt: initialMessage || '', coverBg: '#ffffff', coverAccent: '#2563eb', coverTextColor: '#ffffff', timestamp: Date.now() }); }} onEdit={() => setIsEditing(true)} onGoHome={clearChat} inline />
                    </div>
                  </motion.div>
                  {/* Chat input — stays in place */}
                  <div className="mx-[2px] mb-[2px]">
                    <ChatInput
                      onSend={handleSend}
                      disabled={isTyping || pptPhase === 'wizard' || pptPhase === 'thinking'}
                      placeholder="添加详细信息或澄清..."
                      agentLabel={isPPT ? 'AI PPT' : undefined}
                      embedded
                    />
                  </div>
                </div>
              </div>
            ) : (
              <ChatInput
                onSend={handleSend}
                disabled={isTyping || pptPhase === 'wizard' || pptPhase === 'thinking'}
                placeholder={showActions ? '添加详细信息或澄清...' : undefined}
                agentLabel={isPPT ? 'AI PPT' : undefined}
              />
            )}
          </div>
        </div>

        {showPreview && previewFiles.length > 0 && (
          <div className="w-[40%] min-w-[300px]">
            <PreviewPanel files={previewFiles} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </motion.div>

      {/* PPT Editor Overlay */}
      <AnimatePresence>
        {isEditing && (
          <PPTEditorOverlay
            slides={messages.find(m => m.type === 'ppt-slides')?.meta?.slides as PPTSlide[] || []}
            onClose={(didEdit) => {
              setIsEditing(false);
              if (didEdit) {
                setPptVersion(v => {
                  const newV = v + 1;
                  setMessages(prev => prev.map(m =>
                    m.type === 'ppt-versions'
                      ? { ...m, meta: { ...m.meta, version: newV, isNew: true } }
                      : m
                  ));
                  return newV;
                });
                setScrollTrigger(v => v + 1);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

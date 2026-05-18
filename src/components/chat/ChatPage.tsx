import { useState, useCallback, useEffect, useRef } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { PreviewPanel } from './PreviewPanel';
import type { Message, PreviewFile, PPTPreferences } from '@/types/chat';
import { ChevronDown, Share, Monitor } from 'lucide-react';

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

正在提取关键信息：
→ 识别主题方向和行业领域
→ 分析内容深度和专业程度
→ 评估目标受众的期望

规划最佳呈现策略：
→ 推荐页数范围和内容密度
→ 匹配适合的视觉风格
→ 确定配色方案和排版规则

需要与用户确认以下参数：
• 目标受众与使用场景
• 期望的幻灯片页数
• 视觉风格偏好
• 其他补充要求

准备进入需求确认阶段...`;

interface ChatPageProps {
  initialMessage?: string;
  agentKey?: string | null;
}

export function ChatPage({ initialMessage, agentKey }: ChatPageProps) {
  const { theme, toggleTheme, isCollapsed, toggleCollapse } = useSidebar();
  const dk = theme === 'dark';
  const isPPT = agentKey === 'ai-ppt';
  const initRef = useRef(false);

  // Auto-collapse sidebar when entering chat
  useEffect(() => {
    if (!isCollapsed) toggleCollapse();
  }, []);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessage) return [];
    return [{
      id: generateId(),
      role: 'user',
      content: initialMessage,
      timestamp: Date.now(),
    }];
  });
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pptPhase, setPptPhase] = useState<'thinking' | 'wizard' | 'generating' | 'done' | null>(isPPT ? 'thinking' : null);

  // Init: trigger first AI response once
  useEffect(() => {
    if (initRef.current || !initialMessage) return;
    initRef.current = true;

    if (isPPT) {
      // PPT mode: show thinking block immediately
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

  const handlePPTSubmit = useCallback((prefs: PPTPreferences) => {
    setPptPhase('generating');
    const labels: Record<string, Record<string, string>> = {
      audience: { business: '泛商务/同事分享', executive: '管理层/投资人', tech: '技术团队/工程师', education: '高校/学生科普' },
      style: { 'cool-blue': '商务清爽', 'mint-modern': '简洁现代', 'warm-gold': '稳重温暖', 'dark-tech': '科技感强' },
    };

    // User confirmation
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'user',
      content: `受众: ${labels.audience[prefs.audience] || prefs.audience}\n页数: ${prefs.pageCount}\n风格: ${labels.style[prefs.style] || prefs.style}${prefs.notes ? `\n备注: ${prefs.notes}` : ''}`,
      timestamp: Date.now(),
    }]);

    // Generating
    setTimeout(() => {
      // Tool call 1
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: ['ppt-maker.initialize(template: "etching")', 'ppt-maker.insert(slides: 6)', 'ppt-maker.update(format: "16:9")'] },
      }]);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: generateId(), role: 'assistant',
          content: '我已经用图像模式用简约风格列出的6张幻灯片。接下来，我将开始生成草稿和幻灯片。',
          timestamp: Date.now(),
        }]);

        // Tool call 2
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), type: 'tool-call', meta: { commands: ['ppt-maker.initialize(template: "etching")', 'ppt-maker.insert(slides: 6)', 'ppt-maker.update(format: "16:9")'] },
          }]);

          const totalPages = Number(prefs.pageCount.split('-').pop()) || 6;
          const slides = Array.from({ length: totalPages }, (_, i) => ({
            title: ['戦略 2025', '市場分析', '工作议程', '市场营销战略', '市場分析', '竞品调研'][i] || `第 ${i + 1} 页`,
            pageNumber: i + 1,
            totalPages,
            bgColor: ['#f0f4f8', '#ffffff', '#f8fafc', '#f0f4f8', '#ffffff', '#f8fafc'][i % 6],
            accentColor: ['#2563eb', '#1e3a5f', '#0d9488', '#2563eb', '#1e3a5f', '#0d9488'][i % 6],
            contentPreview: ['マーケティング\n戦略 2025', '市場分析', 'アジェンダ', 'マーケティング戦略\n概要', '市場分析', '競合分析'][i] || '内容',
          }));

          // Slide previews
          setTimeout(() => {
            setMessages(prev => {
              const updated = prev.filter(m => m.type !== 'generating');
              return [...updated, {
                id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
                type: 'ppt-slides', meta: { slides },
              }];
            });

            // Summary text
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: generateId(), role: 'assistant',
                content: `我已经用"Etching"图像生成风格完成了您的${totalPages}页团队状态报告演示文稿。`,
                timestamp: Date.now(),
              }]);

              // Summary carousel
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
                  type: 'ppt-summary', meta: { slides, title: '产品研究报告 2025' },
                }]);

                // Checklist
                setTimeout(() => {
                  setMessages(prev => [...prev, {
                    id: generateId(), role: 'assistant',
                    content: `我已完成建议检查清单，以下几项建议你人工过目确认：\n\n${totalPages}/${totalPages} 页通过 · 3 页经自动修复 · 0 页残留问题\n检测内容：内容溢出 / 文字重叠 / 版面留白\n\n1. **核心数字** — 52.4、8、13、0、185 等关键数据是否与您的最新版本一致\n2. **人名与单位** — 汇报人"马伟航"、"天荒坪电站"等是否准确\n3. **金句措辞** — 各页金句的语气和用词是否符合您的汇报风格\n4. **演讲稿节奏** — 试着按每页备注读一遍，确认 5 分钟内能讲完\n\n需要修改任何一页，直接说页号 + 改什么，例如"P6 的数字改成 53.1"。`,
                    timestamp: Date.now(),
                  }]);

                  // Action buttons
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: generateId(), role: 'assistant', content: '', timestamp: Date.now(),
                      type: 'ppt-actions',
                    }]);
                    setPptPhase('done');
                  }, 500);
                }, 800);
              }, 600);
            }, 400);
          }, 2000);
        }, 800);
      }, 600);
    }, 800);
  }, []);

  const handlePPTSkip = useCallback(() => {
    handlePPTSubmit({ audience: 'business', pageCount: '1-12', style: 'mint-modern', notes: '' });
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
    }, 1200);
  }

  const handleSend = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }]);
    genericReply(text);
  }, []);

  return (
    <div className="flex flex-col h-full bg-bg-page">
      {/* Top bar — matches design */}
      <div className="flex items-center justify-between px-[16px] py-[8px] shrink-0">
        {/* Left — model selector */}
        <button className="flex items-center gap-[4px] cursor-pointer transition-colors hover:opacity-80">
          <span className="text-[16px] font-normal leading-[24px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>
            GLM 5.1
          </span>
          <ChevronDown className="size-[12px] text-icon-tertiary" />
        </button>

        {/* Right — Background Tasks + Usage + Share */}
        <div className="flex items-center gap-[8px]">
          <button className="flex items-center gap-[4px] px-[8px] py-[6px] rounded-[6px] transition-colors hover:bg-bg-hover">
            <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
            <span className="text-[14px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>Background Tasks</span>
            <ChevronDown className="size-[12px] text-icon-tertiary" />
          </button>
          <div className="flex items-center gap-[4px] px-[8px] py-[6px] rounded-[6px]">
            <Monitor className="size-[14px] text-icon-secondary" />
            <span className="text-[14px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>50%</span>
          </div>
          <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-interactive-primary text-text-inverted text-[13px] font-medium transition-all hover:opacity-90 active:scale-[0.97]" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Share className="size-[14px]" />
            Share
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        <div className={cn("flex flex-col min-h-0", showPreview ? "w-[60%]" : "w-full")}>
          <ChatMessages
            messages={messages}
            onPPTSubmit={handlePPTSubmit}
            onPPTSkip={handlePPTSkip}
            onThinkingDone={handleThinkingDone}
          />
          {isTyping && (
            <div className="px-4 pb-2">
              <div className="max-w-[720px] mx-auto flex items-center gap-3">
                <div className="flex items-center gap-[3px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-text-secondary" style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          <ChatInput onSend={handleSend} disabled={isTyping || pptPhase === 'wizard' || pptPhase === 'thinking'} />
        </div>

        {showPreview && previewFiles.length > 0 && (
          <div className="w-[40%] min-w-[300px]">
            <PreviewPanel files={previewFiles} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

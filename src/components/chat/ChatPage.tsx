import { useState, useCallback, useEffect, useRef } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { PreviewPanel } from './PreviewPanel';
import type { Message, PreviewFile, PPTPreferences } from '@/types/chat';
import { ChevronDown, Sun, Moon } from 'lucide-react';

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

const PPT_THINKING_CONTENT = `分析用户输入的 PPT 需求...
提取关键信息：主题、行业领域、内容方向
评估最佳呈现方式：页数、配色方案、排版风格
准备需求确认项：受众场景、视觉偏好、页数范围
开始收集用户生成偏好。`;

interface ChatPageProps {
  initialMessage?: string;
  agentKey?: string | null;
}

export function ChatPage({ initialMessage, agentKey }: ChatPageProps) {
  const { theme, toggleTheme } = useSidebar();
  const dk = theme === 'dark';
  const isPPT = agentKey === 'ai-ppt';
  const initRef = useRef(false);

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
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: '正在生成幻灯片，预计需要 30 秒...',
        timestamp: Date.now(),
        type: 'generating',
      }]);

      // Done
      setTimeout(() => {
        setMessages(prev => {
          const updated = prev.filter(m => m.type !== 'generating');
          return [...updated, {
            id: generateId(),
            role: 'assistant',
            content: `幻灯片已生成完毕！共 ${prefs.pageCount.split('-').pop()} 页。\n\n你可以在右侧预览面板中查看和下载。`,
            timestamp: Date.now(),
            files: MOCK_FILES,
          }];
        });
        setPreviewFiles(MOCK_FILES);
        setShowPreview(true);
        setPptPhase('done');
      }, 3000);
    }, 500);
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-[12px] py-[8px] shrink-0">
        <button className="pl-[16px] pr-[12px] py-[4px] rounded-[6px] flex items-center gap-[4px] cursor-pointer transition-colors hover:bg-bg-hover">
          <span className="text-[16px] font-normal leading-[24px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>
            {isPPT ? 'GLM-5.1 · AI PPT' : 'GLM-5.1'}
          </span>
          <ChevronDown className="size-[12px] text-icon-tertiary" />
        </button>
        <div className="flex items-center gap-[8px]">
          <button onClick={toggleTheme} className="pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] cursor-pointer transition-colors hover:bg-bg-hover">
            <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
              {dk ? <Sun className="size-[16px] text-text-primary" /> : <Moon className="size-[16px] text-text-primary" />}
            </div>
            <span className="opacity-80 text-[14px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>
              {dk ? 'Light' : 'Dark'}
            </span>
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
                <div className="w-[28px] h-[28px] rounded-[8px] bg-[#2d2d2d] border border-white/10 flex items-center justify-center shrink-0">
                  <img src="/icons/zai-logo.png" alt="" className="w-[18px] h-[18px] object-cover" />
                </div>
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

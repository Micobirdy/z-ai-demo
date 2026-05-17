import { useState, useCallback } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { PreviewPanel } from './PreviewPanel';
import type { Message, PreviewFile, PPTPreferences } from '@/types/chat';
import { ChevronDown, Sun, Moon } from 'lucide-react';

const MOCK_FILES: PreviewFile[] = [
  {
    name: 'index.html',
    path: '/index.html',
    language: 'html',
    content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Portfolio</title>\n  <style>\n    body { font-family: system-ui; margin: 0; padding: 40px; background: #f8f8f8; }\n    h1 { font-size: 48px; font-weight: 300; }\n  </style>\n</head>\n<body>\n  <h1>Hello, World</h1>\n  <p>This is a preview of the generated file.</p>\n</body>\n</html>`,
  },
  {
    name: 'package.json',
    path: '/package.json',
    language: 'json',
    content: `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}`,
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

interface ChatPageProps {
  initialMessage?: string;
  agentKey?: string | null;
}

export function ChatPage({ initialMessage, agentKey }: ChatPageProps) {
  const { theme, toggleTheme } = useSidebar();
  const dk = theme === 'dark';
  const isPPT = agentKey === 'ai-ppt';

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessage) return [];
    const msgs: Message[] = [{
      id: generateId(),
      role: 'user',
      content: initialMessage,
      timestamp: Date.now(),
    }];
    return msgs;
  });
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pptPhase, setPptPhase] = useState<'init' | 'wizard' | 'generating' | 'done'>(isPPT ? 'init' : 'done');

  // PPT mode: auto-start wizard flow
  useState(() => {
    if (initialMessage && isPPT) {
      startPPTFlow(initialMessage);
    } else if (initialMessage) {
      mockReply(initialMessage);
    }
  });

  function startPPTFlow(userMsg: string) {
    setIsTyping(true);
    setTimeout(() => {
      // Thinking message
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: `正在分析你的需求...\n\n用户输入：「${userMsg}」\n\n需要确认：目标受众、页数规格、视觉风格等参数。\n开始收集生成偏好。`,
        timestamp: Date.now(),
        type: 'thinking',
      }]);
      setIsTyping(false);

      // Show wizard card after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: '收集生成偏好（页数与配色）',
          timestamp: Date.now(),
          type: 'ppt-wizard',
        }]);
        setPptPhase('wizard');
      }, 600);
    }, 1000);
  }

  const handlePPTSubmit = useCallback((prefs: PPTPreferences) => {
    setPptPhase('generating');
    const audienceMap: Record<string, string> = {
      business: '泛商务/同事分享',
      executive: '管理层/投资人',
      tech: '技术团队/工程师',
      education: '高校/学生科普',
    };
    const styleMap: Record<string, string> = {
      'cool-blue': '商务清爽（浅灰+深蓝）',
      'mint-modern': '简洁现代（白+青绿）',
      'warm-gold': '稳重温暖（暖沙+金色）',
      'dark-tech': '科技感强（深灰+青柠）',
    };

    // User confirmation message
    setMessages(prev => [...prev, {
      id: generateId(),
      role: 'user',
      content: `受众: ${audienceMap[prefs.audience] || prefs.audience}\n页数: ${prefs.pageCount}\n风格: ${styleMap[prefs.style] || prefs.style}${prefs.notes ? `\n备注: ${prefs.notes}` : ''}`,
      timestamp: Date.now(),
    }]);

    // Generating message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: '正在生成幻灯片，预计需要 30 秒...',
        timestamp: Date.now(),
        type: 'generating',
      }]);

      // Mock completion
      setTimeout(() => {
        setMessages(prev => {
          const updated = prev.filter(m => m.type !== 'generating');
          return [...updated, {
            id: generateId(),
            role: 'assistant',
            content: `幻灯片已生成完毕！共 ${prefs.pageCount.split('-')[1] || '12'} 页。\n\n你可以在右侧预览面板中查看和下载。`,
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
    handlePPTSubmit({
      audience: 'business',
      pageCount: '1-12',
      style: 'mint-modern',
      notes: '',
    });
  }, [handlePPTSubmit]);

  // Generic mock reply
  function mockReply(userMsg: string) {
    setIsTyping(true);
    setTimeout(() => {
      const hasFiles = /create|build|make|generate|写|创建|生成/i.test(userMsg);
      const reply: Message = {
        id: generateId(),
        role: 'assistant',
        content: hasFiles
          ? `I've created the project files for you. Here's what I set up:\n\n1. **index.html** — Main entry point with basic styling\n2. **package.json** — Project configuration\n\nYou can preview the files in the panel on the right.`
          : `That's a great question! Let me help you with that.\n\nHere's what I found based on your request. The information covers the key points you mentioned, and I've organized it for clarity.\n\nWould you like me to go deeper into any specific area?`,
        timestamp: Date.now(),
        files: hasFiles ? MOCK_FILES : undefined,
      };
      setMessages(prev => [...prev, reply]);
      if (hasFiles) {
        setPreviewFiles(MOCK_FILES);
        setShowPreview(true);
      }
      setIsTyping(false);
    }, 1200);
  }

  const handleSend = useCallback((text: string) => {
    const msg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
    mockReply(text);
  }, []);

  return (
    <div className={cn("flex flex-col h-full bg-bg-page")}>
      {/* Top bar */}
      <div className={cn(
        "flex items-center justify-between px-[12px] py-[8px] shrink-0 border-b",
        "border-transparent"
      )}>
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
          <ChatInput onSend={handleSend} disabled={isTyping || pptPhase === 'wizard'} />
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

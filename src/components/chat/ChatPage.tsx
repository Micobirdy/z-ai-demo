import { useState, useCallback } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { PreviewPanel } from './PreviewPanel';
import type { Message, PreviewFile } from '@/types/chat';
import { ChevronDown, Sun, Moon } from 'lucide-react';

const MOCK_FILES: PreviewFile[] = [
  {
    name: 'index.html',
    path: '/index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <style>
    body { font-family: system-ui; margin: 0; padding: 40px; background: #f8f8f8; }
    h1 { font-size: 48px; font-weight: 300; }
  </style>
</head>
<body>
  <h1>Hello, World</h1>
  <p>This is a preview of the generated file.</p>
</body>
</html>`,
  },
  {
    name: 'package.json',
    path: '/package.json',
    language: 'json',
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

interface ChatPageProps {
  initialMessage?: string;
}

export function ChatPage({ initialMessage }: ChatPageProps) {
  const { theme, toggleTheme } = useSidebar();
  const dk = theme === 'dark';
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
  const [isTyping, setIsTyping] = useState(!!initialMessage);

  // Mock AI response
  const mockReply = useCallback((userMsg: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const hasFiles = userMsg.toLowerCase().includes('create') ||
                       userMsg.toLowerCase().includes('build') ||
                       userMsg.toLowerCase().includes('make') ||
                       userMsg.toLowerCase().includes('generate') ||
                       userMsg.toLowerCase().includes('写') ||
                       userMsg.toLowerCase().includes('创建') ||
                       userMsg.toLowerCase().includes('生成');

      const reply: Message = {
        id: generateId(),
        role: 'assistant',
        content: hasFiles
          ? `I've created the project files for you. Here's what I set up:\n\n1. **index.html** — Main entry point with basic styling\n2. **package.json** — Project configuration\n\nYou can preview the files in the panel on the right.`
          : `That's a great question! Let me help you with that.\n\nHere's what I found based on your request. The information covers the key points you mentioned, and I've organized it for clarity.\n\nWould you like me to go deeper into any specific area?`,
        timestamp: Date.now(),
        files: hasFiles ? MOCK_FILES : undefined,
      };

      setMessages((prev) => [...prev, reply]);
      if (hasFiles) {
        setPreviewFiles(MOCK_FILES);
        setShowPreview(true);
      }
      setIsTyping(false);
    }, 1200);
  }, []);

  // Initial message auto-reply
  useState(() => {
    if (initialMessage) {
      mockReply(initialMessage);
    }
  });

  const handleSend = useCallback((text: string) => {
    const msg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    mockReply(text);
  }, [mockReply]);

  return (
    <div className={cn("flex flex-col h-full", dk ? "bg-[#161616]" : "bg-[#f8f8f8]")}>
      {/* Top bar */}
      <div className={cn(
        "flex items-center justify-between px-[12px] py-[8px] shrink-0 border-b",
        dk ? "border-white/[0.06] bg-[#161616]" : "border-transparent bg-[#f8f8f8]"
      )}>
        <button className={cn(
          "pl-[16px] pr-[12px] py-[4px] rounded-[6px] flex items-center gap-[4px] cursor-pointer transition-colors",
          dk ? "hover:bg-white/[0.06]" : "hover:bg-[#0d0d0d]/[0.02]"
        )}>
          <span className={cn("text-[16px] font-normal leading-[24px]", dk ? "text-white" : "text-[#0d0d0d]")} style={{ fontFamily: 'Geist, sans-serif' }}>
            GLM-5.1
          </span>
          <ChevronDown className={cn("size-[12px]", dk ? "text-white/50" : "text-[#0d0d0d]/50")} />
        </button>
        <div className="flex items-center gap-[8px]">
          <button onClick={toggleTheme} className={cn(
            "pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] cursor-pointer transition-colors",
            dk ? "hover:bg-white/[0.06]" : "hover:bg-[#0d0d0d]/[0.02]"
          )}>
            <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
              {dk ? <Sun className="size-[16px] text-white" /> : <Moon className="size-[16px] text-[#0d0d0d]" />}
            </div>
            <span className={cn("opacity-80 text-[14px]", dk ? "text-white" : "text-[#0d0d0d]")} style={{ fontFamily: 'Geist, sans-serif' }}>
              {dk ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        {/* Chat side */}
        <div className={cn("flex flex-col min-h-0", showPreview ? "w-[60%]" : "w-full")}>
          <ChatMessages messages={messages} />
          {isTyping && (
            <div className="px-4 pb-2">
              <div className="max-w-[720px] mx-auto flex items-center gap-3">
                <div className="w-[28px] h-[28px] rounded-[8px] bg-[#2d2d2d] border border-white/10 flex items-center justify-center shrink-0">
                  <img src="/icons/zai-logo.png" alt="" className="w-[18px] h-[18px] object-cover" />
                </div>
                <div className="flex items-center gap-[3px]">
                  <span className={cn("w-[6px] h-[6px] rounded-full animate-pulse", dk ? "bg-white/40" : "bg-[#0d0d0d]/30")} style={{ animationDelay: '0ms' }} />
                  <span className={cn("w-[6px] h-[6px] rounded-full animate-pulse", dk ? "bg-white/40" : "bg-[#0d0d0d]/30")} style={{ animationDelay: '200ms' }} />
                  <span className={cn("w-[6px] h-[6px] rounded-full animate-pulse", dk ? "bg-white/40" : "bg-[#0d0d0d]/30")} style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>

        {/* Preview side */}
        {showPreview && previewFiles.length > 0 && (
          <div className="w-[40%] min-w-[300px]">
            <PreviewPanel files={previewFiles} onClose={() => setShowPreview(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

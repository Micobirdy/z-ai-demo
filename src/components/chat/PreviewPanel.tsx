import { useState, useRef, useCallback } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import type { PreviewFile } from '@/types/chat';
import { X, Code, Eye, Download } from 'lucide-react';

interface PreviewPanelProps {
  files: PreviewFile[];
  onClose: () => void;
}

export function PreviewPanel({ files, onClose }: PreviewPanelProps) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  const activeFile = files[activeTab];

  return (
    <div className={cn(
      "flex flex-col h-full border-l",
      dk ? "bg-[#1a1a1a] border-white/[0.06]" : "bg-white border-[#e5e5e5]"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 h-[44px] shrink-0 border-b",
        dk ? "border-white/[0.06]" : "border-[#e5e5e5]"
      )}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('code')}
            className={cn(
              "px-2 py-1 rounded-[6px] text-[12px] font-medium transition-colors",
              viewMode === 'code'
                ? dk ? "bg-white/[0.08] text-white" : "bg-[#0d0d0d]/[0.05] text-[#0d0d0d]"
                : dk ? "text-white/40 hover:text-white/70" : "text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70"
            )}
          >
            <Code className="size-[14px] inline mr-1" />
            Code
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={cn(
              "px-2 py-1 rounded-[6px] text-[12px] font-medium transition-colors",
              viewMode === 'preview'
                ? dk ? "bg-white/[0.08] text-white" : "bg-[#0d0d0d]/[0.05] text-[#0d0d0d]"
                : dk ? "text-white/40 hover:text-white/70" : "text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70"
            )}
          >
            <Eye className="size-[14px] inline mr-1" />
            Preview
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className={cn(
            "w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors",
            dk ? "text-white/40 hover:text-white/70 hover:bg-white/[0.06]" : "text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]"
          )}>
            <Download className="size-[14px]" />
          </button>
          <button onClick={onClose} className={cn(
            "w-[28px] h-[28px] rounded-[6px] flex items-center justify-center transition-colors",
            dk ? "text-white/40 hover:text-white/70 hover:bg-white/[0.06]" : "text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]"
          )}>
            <X className="size-[14px]" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {files.length > 1 && (
        <div className={cn(
          "flex items-center gap-0 px-2 h-[36px] shrink-0 border-b overflow-x-auto",
          dk ? "border-white/[0.06]" : "border-[#e5e5e5]"
        )}>
          {files.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-3 py-1.5 text-[12px] font-medium rounded-t-[6px] transition-colors whitespace-nowrap",
                activeTab === i
                  ? dk ? "text-white bg-white/[0.06]" : "text-[#0d0d0d] bg-[#0d0d0d]/[0.04]"
                  : dk ? "text-white/40 hover:text-white/60" : "text-[#0d0d0d]/40 hover:text-[#0d0d0d]/60"
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeFile && (
          viewMode === 'code' ? (
            <pre className={cn(
              "p-4 text-[13px] leading-[20px] font-mono whitespace-pre-wrap break-words",
              dk ? "text-white/80" : "text-[#0d0d0d]/80"
            )}>
              <code>{activeFile.content}</code>
            </pre>
          ) : (
            <div className="p-4">
              {activeFile.language === 'html' ? (
                <iframe
                  srcDoc={activeFile.content}
                  className="w-full h-full min-h-[400px] rounded-[8px] border-0 bg-white"
                  sandbox="allow-scripts"
                  title={activeFile.name}
                />
              ) : activeFile.language === 'svg' ? (
                <div dangerouslySetInnerHTML={{ __html: activeFile.content }} className="flex items-center justify-center" />
              ) : (
                <pre className={cn(
                  "text-[13px] leading-[20px] whitespace-pre-wrap",
                  dk ? "text-white/60" : "text-[#0d0d0d]/60"
                )}>
                  {activeFile.content}
                </pre>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

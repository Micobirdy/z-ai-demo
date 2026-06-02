import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { X, Play, ChevronLeft, ChevronDown, Clock, Check, RotateCcw } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import type { PPTSlide } from './messages/PPTPreview';

interface SlideElement {
  id: string;
  type: 'text' | 'shape';
  label: string;
  font: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: string;
  lineHeight: number;
  letterSpacing: number;
  width: number;
  height: number;
  opacity: number;
  margin: number;
  padding: number;
  borderRadius: number;
}

interface PPTEditorOverlayProps {
  slides: PPTSlide[];
  onClose: (didEdit: boolean) => void;
}

const ease = [0.4, 0, 0, 1] as const;

const HISTORY_ITEMS = [
  { label: 'Brand Symphony Method – 4', time: 'Jan 27, 13:43:28', selected: false },
  { label: 'Brand Symphony Method – 3', time: 'Jan 27, 04:32:11', selected: true },
  { label: 'Brand Symphony Method – 2', time: 'Jan 27, 12:41:20', selected: false },
  { label: 'Brand Symphony Method – 1', time: 'Jan 27, 02:43:08', selected: false },
  { label: 'Brand Symphony – 初始版', time: 'Jan 27, 02:43:08', selected: false },
];

export function PPTEditorOverlay({ slides, onClose }: PPTEditorOverlayProps) {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFont, setSelectedFont] = useState('Geist');
  const [selectedScope, setSelectedScope] = useState('标题');
  const [fontSize, setFontSize] = useState('88');
  const [notes, setNotes] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [syncToTemplate, setSyncToTemplate] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentIndex, setPresentIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<SlideElement | null>(() => {
    const s = slides[0];
    if (!s) return null;
    return {
      id: 'title', type: 'text', label: '标题文本',
      font: 'Geist', fontSize: 88, fontWeight: 400, color: (s.accentColor || '#2563eb').replace('#', ''),
      align: '左对齐', lineHeight: 0.96, letterSpacing: 0, width: 950.82, height: 168.12,
      opacity: 0.96, margin: 0, padding: 950.82, borderRadius: 168.12,
    };
  });
  const [globalStyleMode, setGlobalStyleMode] = useState(false);
  const [undoStack, setUndoStack] = useState<{ index: number; element: SlideElement | null }[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  const historyBtnRef = useRef<HTMLButtonElement>(null);
  const [historyPos, setHistoryPos] = useState({ top: 0, left: 0 });

  const markChanged = useCallback(() => setHasChanges(true), []);

  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowSaveDialog(true);
    } else {
      onClose(false);
    }
  }, [hasChanges, onClose]);

  const handleReset = useCallback(() => {
    setUndoStack(prev => [...prev, { index: selectedIndex, element: selectedElement }]);
    setEditorTheme('light');
    setSelectedColor(0);
    setSelectedFont('Geist');
    setSelectedScope('标题');
    setFontSize('88');
    setNotes('');
    setHasChanges(false);
  }, [selectedIndex, selectedElement]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setSelectedIndex(last.index);
    setSelectedElement(last.element);
  }, [undoStack]);

  useEffect(() => {
    if (!showHistory) return;
    const handler = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) setShowHistory(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showHistory]);

  const selected = slides[selectedIndex];
  const themeColors = [
    { color: '#dc2626', label: '红' },
    { color: '#eab308', label: '黄' },
    { color: '#e5e7eb', label: '白' },
    { color: '#1f2937', label: '暗' },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col bg-bg-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top Bar */}
      <motion.div
        className={cn(
          "flex items-center justify-between px-[16px] py-[10px] shrink-0 border-b border-border-default",
          dk ? "bg-bg-page" : "bg-bg-page"
        )}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.42, ease }}
      >
        <div className="flex items-center gap-2.5">
          <FileIcon className="size-[16px] text-icon-tertiary" />
          <span className="text-[15px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
            Product Research Report
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[4px] px-[8px] py-[5px] rounded-[6px]">
            <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
            <span className="text-[13px] text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>后台任务</span>
            <ChevronDown className="size-[12px] text-icon-tertiary" />
          </div>
          {/* Global style toggle */}
          <button
            onClick={() => setGlobalStyleMode(v => !v)}
            className="flex items-center gap-1.5 px-[8px] py-[5px] rounded-[6px] hover:bg-bg-surface transition-colors cursor-pointer"
          >
            <div className={cn(
              "w-[32px] h-[18px] rounded-full transition-colors duration-200 flex items-center",
              globalStyleMode ? "bg-[#22c55e] justify-end" : "bg-transparent outline outline-[1.5px] outline-offset-[-1.5px] outline-border-default justify-start"
            )}>
              <div className={cn(
                "w-[14px] h-[14px] rounded-full transition-all duration-200 mx-[2px]",
                globalStyleMode ? "bg-white" : "bg-border-default"
              )} />
            </div>
            <span className="text-[13px] text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>全局调整</span>
          </button>
          <button
            onClick={() => { setPresentIndex(selectedIndex); setIsPresenting(true); }}
            className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer"
          >
            <Play className="size-[16px] text-text-secondary" fill="currentColor" />
          </button>
          <button
            onClick={handleClose}
            className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer"
          >
            <X className="size-[16px] text-text-secondary" />
          </button>
        </div>
      </motion.div>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel — collapsible slide thumbnails */}
        {!leftCollapsed ? (
          <motion.div
            className="hidden lg:flex w-[190px] shrink-0 border-r border-border-default flex-col bg-bg-page"
            initial={{ x: -190, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-default">
              <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>Preview</span>
              <div className="flex items-center gap-1">
                <div ref={historyRef} className="relative">
                <button
                  ref={historyBtnRef}
                  onClick={() => {
                    if (!showHistory && historyBtnRef.current) {
                      const r = historyBtnRef.current.getBoundingClientRect();
                      setHistoryPos({ top: r.bottom + 4, left: r.left - 8 });
                    }
                    setShowHistory(v => !v);
                  }}
                  className={cn(
                    "w-[24px] h-[24px] rounded-[4px] flex items-center justify-center transition-colors cursor-pointer",
                    showHistory ? "bg-bg-surface" : "hover:bg-bg-surface"
                  )}
                >
                  <Clock className="size-[14px] text-icon-tertiary" />
                </button>
                {showHistory && (
                  <div className="fixed w-[260px] z-[100] bg-bg-bg rounded-[12px] border border-border-default shadow-lg overflow-hidden" style={{ top: historyPos.top, left: historyPos.left, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    <div className="px-4 py-2.5">
                      <span className="text-[13px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>版本历史</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
                      {HISTORY_ITEMS.map((item, i) => (
                        <button
                          key={i}
                          className={cn(
                            "w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors cursor-pointer",
                            item.selected ? "bg-bg-surface" : "hover:bg-bg-surface/50"
                          )}
                          onClick={() => setShowHistory(false)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] text-text-primary leading-5 truncate" style={{ fontFamily: "'Geist', sans-serif" }}>
                              {item.label}
                            </div>
                            <div className="text-[12px] text-text-tertiary leading-4 mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>
                              {item.time}
                            </div>
                          </div>
                          {item.selected && <Check className="size-[16px] text-text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setLeftCollapsed(true)}
                className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-[14px] text-icon-tertiary" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
            {slides.map((slide, i) => {
              const isSelected = selectedIndex === i;
              return (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "w-full flex items-start gap-2 p-1.5 rounded-[8px] cursor-pointer transition-all text-left",
                  isSelected ? "bg-bg-subtle" : "hover:bg-bg-surface active:bg-bg-subtle"
                )}
              >
                <span className={cn(
                  "text-[11px] pt-1 w-[14px] text-right shrink-0 transition-colors",
                  isSelected ? "text-accent-blue font-medium" : "text-text-tertiary"
                )} style={{ fontFamily: "'Geist', sans-serif" }}>
                  {i + 1}
                </span>
                <div
                  className={cn(
                    "flex-1 aspect-[16/9] rounded-[4px] overflow-hidden relative transition-shadow",
                    isSelected
                      ? "ring-1 ring-border-strong"
                      : "ring-1 ring-border-default hover:ring-border-strong"
                  )}
                  style={{ backgroundColor: slide.bgColor }}
                >
                  <div className="absolute inset-0 p-2 flex flex-col justify-start">
                    <div className="text-[6px] font-bold leading-[8px] whitespace-pre-line" style={{ fontFamily: "'Geist', sans-serif", color: '#0D0D0D' }}>
                      {slide.contentPreview}
                    </div>
                  </div>
                </div>
              </button>
              );
            })}
            {hasChanges && (
              <button
                onClick={handleReset}
                className="w-full mt-1 py-1.5 rounded-[6px] flex items-center justify-center gap-1.5 text-[11px] text-text-tertiary hover:text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"
                style={{ fontFamily: "'Geist', sans-serif" }}
              >
                <RotateCcw className="size-[12px]" />
                初始化
              </button>
            )}
          </div>
        </motion.div>
        ) : (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="hidden lg:flex shrink-0 w-[24px] items-center justify-center border-r border-border-default hover:bg-bg-surface transition-colors cursor-pointer bg-bg-page"
          >
            <ChevronLeft className="size-[14px] text-icon-tertiary rotate-180" />
          </button>
        )}

        {/* Main Area — resizable slide + notes */}
        <MainEditorArea
          selected={selected}
          notes={notes}
          onNotesChange={(v) => { setNotes(v); markChanged(); }}
          selectedElement={selectedElement}
          onSelectElement={(el) => { setSelectedElement(el); if (el) markChanged(); }}
          currentPage={selectedIndex + 1}
          totalPages={slides.length}
          onPrevPage={() => { if (selectedIndex > 0) { setSelectedIndex(i => i - 1); setSelectedElement(null); } }}
          onNextPage={() => { if (selectedIndex < slides.length - 1) { setSelectedIndex(i => i + 1); setSelectedElement(null); } }}
          onReset={handleReset}
          canReset={hasChanges}
          onTextEdit={markChanged}
        />

        {/* Right Panel — always visible, switches between global and single-page style */}
        <motion.div
          className="hidden xl:flex w-72 shrink-0 border-l border-border-default flex-col bg-bg-bg overflow-y-auto"
          initial={{ x: 288, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 288, opacity: 0 }}
          transition={{ duration: 0.42, ease }}
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}
        >
          {globalStyleMode ? (
            <GlobalStylePanel
              editorTheme={editorTheme}
              setEditorTheme={(v) => { setEditorTheme(v); markChanged(); }}
              selectedColor={selectedColor}
              setSelectedColor={(v) => { setSelectedColor(v); markChanged(); }}
              themeColors={themeColors}
              selectedFont={selectedFont}
              setSelectedFont={(v) => { setSelectedFont(v); markChanged(); }}
              selectedScope={selectedScope}
              setSelectedScope={(v) => { setSelectedScope(v); markChanged(); }}
              fontSize={fontSize}
              setFontSize={(v) => { setFontSize(v); markChanged(); }}
              onClose={() => setGlobalStyleMode(false)}
            />
          ) : selectedElement ? (
            <ElementPropertiesPanel
              element={selectedElement}
              onChange={(updated) => { setSelectedElement(updated); markChanged(); }}
            />
          ) : (
            <SinglePageStylePanel />
          )}
        </motion.div>
      </div>

      {/* Fullscreen Presentation */}
      <AnimatePresence>
        {isPresenting && (
          <PresentationOverlay
            slides={slides}
            startIndex={presentIndex}
            onExit={() => setIsPresenting(false)}
          />
        )}
      </AnimatePresence>

      {/* Save confirmation dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              className="w-[500px] bg-bg-bg rounded-[12px] overflow-hidden flex flex-col"
              style={{ boxShadow: '0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)', outline: '1px var(--border-default) solid', outlineOffset: '-1px' }}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative pt-[20px] px-[20px]">
                <h3 className="text-[18px] font-medium text-text-primary leading-[26px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                  是否保存更改？
                </h3>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="absolute top-[20px] right-[20px] p-[4px] rounded-[6px] hover:bg-bg-surface transition-colors cursor-pointer"
                >
                  <X className="size-[16px] text-icon-secondary" />
                </button>
              </div>

              <div className="h-[20px]" />

              {/* Body */}
              <div className="px-[20px]">
                <p className="text-[14px] text-text-primary leading-[20px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                  退出前是否要保存当前更改？
                </p>
              </div>

              {/* Footer */}
              <div className="px-[20px] pt-[20px] pb-[20px] flex items-center justify-between">
                {/* Left — sync checkbox */}
                <div className="flex items-center gap-[6px]">
                  <button
                    onClick={() => setSyncToTemplate(v => !v)}
                    className="w-[14px] h-[14px] rounded-[3.5px] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    style={{ backgroundColor: syncToTemplate ? 'var(--interactive-primary)' : 'transparent', border: syncToTemplate ? 'none' : '1px solid var(--border-strong)' }}
                  >
                    {syncToTemplate && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8 3" stroke="rgba(255,255,255,0.9)" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span className="text-[11px] text-text-secondary leading-[13px]" style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}>
                    同步到我的模版
                  </span>
                </div>

                {/* Right — action buttons */}
                <div className="flex items-center gap-[12px]">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-[16px] py-[8px] rounded-[6px] bg-bg-bg border border-border-default text-[14px] text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
                    style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
                  >
                    取消
                  </button>
                  <button
                    onClick={() => { setHasChanges(false); setShowSaveDialog(false); onClose(true); }}
                    className="px-[16px] py-[8px] rounded-[6px] bg-interactive-primary text-[14px] text-text-inverted hover:opacity-90 transition-all cursor-pointer"
                    style={{ fontFamily: "'PingFang SC', 'Geist', sans-serif" }}
                  >
                    保存并退出
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main editor area with draggable divider between slide and notes
interface MainEditorAreaProps {
  selected: PPTSlide;
  notes: string;
  onNotesChange: (v: string) => void;
  selectedElement: SlideElement | null;
  onSelectElement: (el: SlideElement | null) => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onReset: () => void;
  canReset: boolean;
  onTextEdit: () => void;
}

function MainEditorArea({ selected, notes, onNotesChange, selectedElement, onSelectElement, currentPage, totalPages, onPrevPage, onNextPage, onReset, canReset, onTextEdit }: MainEditorAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notesHeight, setNotesHeight] = useState(120);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startH.current = notesHeight;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [notesHeight]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const delta = startY.current - e.clientY;
    const containerH = containerRef.current.clientHeight;
    const minNotes = 60;
    const maxNotes = containerH - 200;
    setNotesHeight(Math.max(minNotes, Math.min(maxNotes, startH.current + delta)));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.isContentEditable)) {
        onReset();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onReset]);

  return (
    <motion.div
      ref={containerRef}
      className="flex-1 flex flex-col min-w-0 bg-bg-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0, 1], delay: 0.15 }}
    >
      {/* Slide preview — fills remaining space with 16px min padding */}
      <div className="flex-1 flex items-center justify-center min-h-0" style={{ padding: '16px' }}>
        <div className="w-full h-full max-w-[960px] flex items-center justify-center">
          <div
            className={cn(
              "w-full aspect-[16/9] max-h-full rounded-[8px] overflow-hidden relative shadow-lg cursor-pointer transition-all",
              selectedElement === null && "hover:outline hover:outline-[3px] hover:outline-purple-500 hover:outline-offset-2",
              selectedElement !== null && "outline outline-2 outline-blue-500 outline-offset-2"
            )}
            style={{ backgroundColor: 'var(--bg-bg)' }}
            onClick={() => onSelectElement(null)}
          >
            <div className="absolute inset-0 p-10 flex flex-col justify-start gap-3">
              {/* Title element — clickable */}
              <div
                className={cn(
                  "relative cursor-pointer transition-all rounded-[2px]",
                  selectedElement?.id === 'title'
                    ? "outline outline-2 outline-blue-500 outline-offset-4"
                    : selectedElement !== null
                      ? "hover:outline hover:outline-[3px] hover:outline-purple-500 hover:outline-offset-4"
                      : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement({
                    id: 'title', type: 'text', label: '标题文本',
                    font: 'Geist', fontSize: 88, fontWeight: 400, color: selected.accentColor.replace('#', ''),
                    align: '左对齐', lineHeight: 0.96, letterSpacing: 0, width: 950.82, height: 168.12,
                    opacity: 0.96, margin: 0, padding: 950.82, borderRadius: 168.12,
                  });
                }}
              >
                <div
                  className="text-[32px] font-bold leading-[40px] whitespace-pre-line text-text-primary outline-none"
                  style={{ fontFamily: "'Geist', sans-serif" }}
                  contentEditable={selectedElement?.id === 'title'}
                  suppressContentEditableWarning
                  onInput={onTextEdit}
                >
                  {selected.contentPreview}
                </div>
              </div>
              {/* Description element — clickable */}
              {selected.description && (
                <div
                  className={cn(
                    "relative cursor-pointer max-w-[70%] transition-all rounded-[2px]",
                    selectedElement?.id === 'desc'
                      ? "outline outline-2 outline-blue-500 outline-offset-4"
                      : selectedElement !== null
                        ? "hover:outline hover:outline-[3px] hover:outline-purple-500 hover:outline-offset-4"
                        : ""
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectElement({
                      id: 'desc', type: 'text', label: '描述文本',
                      font: 'Geist', fontSize: 16, fontWeight: 400, color: selected.accentColor.replace('#', ''),
                      align: '左对齐', lineHeight: 1.5, letterSpacing: 0, width: 665.57, height: 48,
                      opacity: 0.6, margin: 0, padding: 665.57, borderRadius: 0,
                    });
                  }}
                >
                  <div
                    className="text-[16px] leading-[24px] text-text-tertiary outline-none"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                    contentEditable={selectedElement?.id === 'desc'}
                    suppressContentEditableWarning
                    onInput={onTextEdit}
                  >
                    {selected.description}
                  </div>
                </div>
              )}
              {/* Page number — clickable */}
              <div
                className={cn(
                  "absolute top-6 right-8 cursor-pointer transition-all rounded-[2px]",
                  selectedElement?.id === 'pagenum'
                    ? "outline outline-2 outline-blue-500 outline-offset-4"
                    : selectedElement !== null
                      ? "hover:outline hover:outline-[3px] hover:outline-purple-500 hover:outline-offset-4"
                      : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement({
                    id: 'pagenum', type: 'text', label: '页码',
                    font: 'Geist', fontSize: 14, fontWeight: 400, color: selected.accentColor.replace('#', ''),
                    align: '右对齐', lineHeight: 1, letterSpacing: 0, width: 24, height: 20,
                    opacity: 0.3, margin: 0, padding: 0, borderRadius: 0,
                  });
                }}
              >
                <div className="text-[14px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
                  {String(selected.pageNumber).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page nav + undo — floating pill toolbar */}
      <div className="flex justify-center py-[16px] shrink-0">
        <div className="flex items-center gap-0.5 px-[6px] py-[4px] rounded-full bg-bg-surface border border-border-default">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-[16px] text-text-secondary" />
          </button>
          <span className="px-1 text-[13px] font-medium text-text-secondary tabular-nums select-none" style={{ fontFamily: "'Geist', sans-serif" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-[16px] text-text-secondary rotate-180" />
          </button>
          <div className="w-[1px] h-[14px] bg-border-default mx-[2px]" />
          <button
            onClick={onReset}
            disabled={!canReset}
            className="h-[28px] px-[10px] rounded-full flex items-center gap-[6px] hover:bg-bg-surface transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            title="Reset"
          >
            <span className="text-[13px] text-text-secondary" style={{ fontFamily: "'Geist', sans-serif" }}>Reset</span>
            <span className="text-[11px] text-text-tertiary px-[5px] py-[1px] rounded-[4px] bg-bg-subtle border border-border-default leading-[16px]" style={{ fontFamily: "'Geist', sans-serif" }}>R</span>
          </button>
        </div>
      </div>

      {/* Draggable divider */}
      <div
        className="flex justify-center py-1 cursor-row-resize select-none shrink-0 group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="w-[40px] h-[4px] rounded-full bg-border-default group-hover:bg-text-tertiary group-active:bg-text-secondary transition-colors" />
      </div>

      {/* Speaker notes — height controlled by drag */}
      <div className="shrink-0 px-4 pb-4" style={{ height: `${notesHeight}px` }}>
        <div className="h-full rounded-[8px] border border-border-default bg-bg-bg p-4 overflow-hidden">
          <textarea
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
            placeholder="添加演讲者备注..."
            className="w-full h-full resize-none outline-none bg-transparent text-[14px] leading-[22px] text-text-primary placeholder:text-text-tertiary"
            style={{ fontFamily: "'Geist', sans-serif" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Single page style panel — default view when no element selected
function SinglePageStylePanel() {
  return (
    <>
      <div className="px-4 py-3 border-b border-border-default">
        <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>单页样式修改</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-bg-surface flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="2" width="14" height="16" rx="2" stroke="var(--icon-tertiary)" strokeWidth="1.2" />
            <path d="M7 6h6M7 9h6M7 12h4" stroke="var(--icon-tertiary)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[13px] text-text-tertiary text-center leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>
          点击 PPT 中的元素<br />即可编辑样式属性
        </p>
      </div>
    </>
  );
}

// Global style panel (original right panel content)
function GlobalStylePanel({ editorTheme, setEditorTheme, selectedColor, setSelectedColor, themeColors, selectedFont, setSelectedFont, selectedScope, setSelectedScope, fontSize, setFontSize, onClose }: {
  editorTheme: 'light' | 'dark'; setEditorTheme: (v: 'light' | 'dark') => void;
  selectedColor: number; setSelectedColor: (v: number) => void;
  themeColors: { color: string; label: string }[];
  selectedFont: string; setSelectedFont: (v: string) => void;
  selectedScope: string; setSelectedScope: (v: string) => void;
  fontSize: string; setFontSize: (v: string) => void;
  onClose?: () => void;
  selectedFont: string; setSelectedFont: (v: string) => void;
  selectedScope: string; setSelectedScope: (v: string) => void;
  fontSize: string; setFontSize: (v: string) => void;
}) {
  return (
    <>
      <div className="px-4 py-3 border-b border-border-default flex justify-between items-center">
        <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>全局样式修改</span>
        {onClose && (
          <button onClick={onClose} className="w-[24px] h-[24px] rounded-[4px] flex items-center justify-center hover:bg-bg-surface transition-colors cursor-pointer">
            <X className="size-[14px] text-icon-tertiary" />
          </button>
        )}
      </div>
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>模式</span>
        </div>
        <div className="px-3 py-1">
          <div className="p-1">
            <div className="p-0.5 bg-bg-surface rounded-md flex overflow-hidden">
              {(['light', 'dark'] as const).map(mode => (
                <button key={mode} onClick={() => setEditorTheme(mode)} className={cn("flex-1 py-1 rounded-md flex justify-center items-center gap-0.5 cursor-pointer transition-all", editorTheme === mode ? "bg-bg-bg outline outline-1 outline-offset-[-1px] outline-border-default" : "bg-transparent")}>
                  <span className={cn("text-[12px] font-medium leading-4 px-0.5", editorTheme === mode ? "text-text-primary" : "text-text-tertiary")} style={{ fontFamily: "'Geist', sans-serif" }}>{mode === 'light' ? '亮色' : '暗色'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>主题色</span>
        </div>
        <div className="px-3 py-1"><div className="p-1"><div className="p-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default flex gap-2">
          {themeColors.map((c, i) => (
            <button key={i} onClick={() => setSelectedColor(i)} className={cn("flex-1 h-8 rounded-[5px] overflow-hidden cursor-pointer transition-all", selectedColor === i ? "outline outline-2 outline-offset-[-2px] outline-accent-blue-border" : "outline outline-[1.33px] outline-offset-[-1.33px] outline-border-default")} style={{ backgroundColor: c.color }} />
          ))}
        </div></div></div>
      </div>
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>排版</span>
        </div>
        <div className="px-4 py-1">
          <EditorSelect label="字体" value={selectedFont} options={['Geist', 'Inter', 'Noto Sans SC', 'PingFang SC', 'SF Pro', 'Roboto']} maxVisible={6} onChange={setSelectedFont} renderValue={(v) => <span style={{ fontFamily: `'${v}', sans-serif` }}>{v}</span>} />
        </div>
        <div className="px-4 py-1 flex gap-2">
          <div className="flex-1"><EditorSelect label="范围" value={selectedScope} options={['标题', '正文']} onChange={setSelectedScope} /></div>
          <div className="flex-1 px-3 py-1.5 bg-bg-bg rounded-md outline outline-1 outline-offset-[-1px] outline-border-default flex justify-between items-center">
            <span className="text-[12px] font-medium text-text-tertiary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>尺寸</span>
            <div className="flex items-center gap-1">
              <input type="text" value={fontSize} onChange={e => setFontSize(e.target.value.replace(/\D/g, ''))} className="w-[24px] text-right text-[12px] font-normal text-text-primary leading-4 bg-transparent outline-none" style={{ fontFamily: "'Geist', sans-serif" }} />
              <span className="text-[12px] font-normal text-text-tertiary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>px</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Element properties panel — matches Figma spec (单页样式修改)
function ElementPropertiesPanel({ element, onChange }: { element: SlideElement; onChange: (el: SlideElement) => void }) {
  const update = (key: keyof SlideElement, value: string | number) => {
    onChange({ ...element, [key]: value });
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-border-default">
        <span className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>单页样式修改</span>
      </div>

      {/* 排版 */}
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-semibold text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>排版</span>
        </div>
        {/* 字体 */}
        <div className="px-4 py-1">
          <EditorSelect label="字体" value={element.font} options={['Geist', 'Inter', 'Noto Sans SC', 'PingFang SC', 'SF Pro', 'Roboto']} maxVisible={6} onChange={(v) => update('font', v)} renderValue={(v) => <span style={{ fontFamily: `'${v}', sans-serif` }}>{v}</span>} />
        </div>
        {/* 尺寸 + 字重 */}
        <div className="px-4 py-1 flex gap-2">
          <PropInput label="尺寸" value={String(element.fontSize)} unit="px" onChange={(v) => update('fontSize', Number(v) || 0)} />
          <PropInput label="字重" value={String(element.fontWeight)} onChange={(v) => update('fontWeight', Number(v) || 0)} />
        </div>
        {/* 颜色 + 对齐 */}
        <div className="px-4 py-1 flex gap-2">
          <div className="flex-1 px-3 py-1.5 bg-bg-bg rounded-md outline outline-1 outline-offset-[-1px] outline-border-default flex justify-between items-center">
            <span className="text-[12px] font-medium text-text-tertiary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>颜色</span>
            <div className="flex items-center gap-1.5">
              <div className="w-[14px] h-[14px] rounded-[3px] border border-border-default" style={{ backgroundColor: `#${element.color}` }} />
              <span className="text-[12px] font-normal text-text-primary leading-4 uppercase" style={{ fontFamily: "'Geist', sans-serif" }}>{element.color}</span>
            </div>
          </div>
          <div className="flex-1">
            <EditorSelect label="对齐" value={element.align} options={['左对齐', '居中', '右对齐']} onChange={(v) => update('align', v)} />
          </div>
        </div>
        {/* 行高 + 字间距 */}
        <div className="px-4 py-1 flex gap-2">
          <PropInput label="行高" value={String(element.lineHeight)} onChange={(v) => update('lineHeight', Number(v) || 0)} />
          <PropInput label="字间距" value={String(element.letterSpacing)} unit="px" onChange={(v) => update('letterSpacing', Number(v) || 0)} />
        </div>
      </div>

      {/* 尺寸 */}
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-semibold text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>尺寸</span>
        </div>
        <div className="px-4 py-1 flex gap-2">
          <PropInput label="宽度" value={String(element.width)} unit="px" onChange={(v) => update('width', Number(v) || 0)} />
          <PropInput label="高度" value={String(element.height)} unit="px" onChange={(v) => update('height', Number(v) || 0)} />
        </div>
      </div>

      {/* 框架 */}
      <div className="pb-3 border-b border-border-default flex flex-col">
        <div className="h-10 pl-4 pr-2 flex items-center">
          <span className="text-[14px] font-semibold text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>框架</span>
        </div>
        <div className="px-4 py-1">
          <PropInput label="透明度" value={String(element.opacity)} onChange={(v) => update('opacity', Number(v) || 0)} />
        </div>
        <div className="px-4 py-1">
          <PropInput label="外边距" value={String(element.margin)} unit="px" onChange={(v) => update('margin', Number(v) || 0)} hasMore />
        </div>
        <div className="px-4 py-1">
          <PropInput label="内边距" value={String(element.padding)} unit="px" onChange={(v) => update('padding', Number(v) || 0)} hasMore />
        </div>
        <div className="px-4 py-1">
          <PropInput label="圆角" value={String(element.borderRadius)} unit="px" onChange={(v) => update('borderRadius', Number(v) || 0)} hasMore />
        </div>
      </div>
    </>
  );
}

function PropInput({ label, value, unit, onChange, hasMore }: { label: string; value: string; unit?: string; onChange: (v: string) => void; hasMore?: boolean }) {
  return (
    <div className="flex-1 px-3 py-1.5 bg-bg-bg rounded-md outline outline-1 outline-offset-[-1px] outline-border-default flex justify-between items-center overflow-hidden">
      <span className="text-[12px] font-medium text-text-tertiary leading-4 shrink-0" style={{ fontFamily: "'Geist', sans-serif" }}>{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-[48px] text-right text-[12px] font-normal text-text-primary leading-4 bg-transparent outline-none"
          style={{ fontFamily: "'Geist', sans-serif" }}
        />
        {unit && <span className="text-[12px] font-normal text-text-tertiary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>{unit}</span>}
        {hasMore && (
          <button className="w-[16px] h-[16px] flex items-center justify-center text-text-tertiary hover:text-text-secondary cursor-pointer ml-0.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="2" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="10" cy="6" r="1" fill="currentColor"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1.5" width="12" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface EditorSelectProps {
  label: string;
  value: string;
  options: string[];
  maxVisible?: number;
  onChange: (value: string) => void;
  renderValue?: (value: string) => React.ReactNode;
}

function EditorSelect({ label, value, options, maxVisible, onChange, renderValue }: EditorSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const itemH = 32;
  const maxH = maxVisible ? maxVisible * itemH : undefined;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-3 py-1.5 bg-bg-bg rounded-md outline outline-1 outline-offset-[-1px] outline-border-default flex justify-between items-center overflow-hidden cursor-pointer hover:bg-bg-surface transition-colors"
      >
        <span className="text-[12px] font-medium text-text-tertiary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-normal text-text-primary leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>
            {renderValue ? renderValue(value) : value}
          </span>
          <ChevronDown className={cn("size-[16px] text-neutral-400 transition-transform duration-200", open && "rotate-180")} />
        </div>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 z-50 bg-bg-bg rounded-[8px] border border-border-default shadow-lg overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <div
            className="overflow-y-auto"
            style={{ maxHeight: maxH ? `${maxH}px` : undefined, scrollbarWidth: 'thin' }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  "w-full px-3 h-[32px] flex items-center justify-between text-left cursor-pointer transition-colors",
                  opt === value ? "bg-bg-surface text-text-primary" : "text-text-secondary hover:bg-bg-surface/50"
                )}
              >
                <span className="text-[12px] leading-4" style={{ fontFamily: renderValue ? `'${opt}', sans-serif` : "'Geist', sans-serif" }}>
                  {opt}
                </span>
                {opt === value && <Check className="size-[14px] text-interactive-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Fullscreen presentation mode
interface PresentationOverlayProps {
  slides: PPTSlide[];
  startIndex: number;
  onExit: () => void;
}

function PresentationOverlay({ slides, startIndex, onExit }: PresentationOverlayProps) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'ArrowRight' || e.key === ' ') setCurrent(i => Math.min(i + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setCurrent(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [slides.length, onExit]);

  const slide = slides[current];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col cursor-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setCurrent(i => Math.min(i + 1, slides.length - 1))}
    >
      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          key={current}
          className="w-full h-full max-w-[100vw] max-h-[100vh] aspect-[16/9] relative bg-bg-bg"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0 p-[5%] flex flex-col justify-start gap-[2%]">
            <div className="text-[4vw] font-bold leading-[1.2] whitespace-pre-line text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>
              {slide.contentPreview}
            </div>
            {slide.description && (
              <div className="text-[1.8vw] leading-[1.5] max-w-[70%] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
                {slide.description}
              </div>
            )}
            <div className="absolute top-[4%] right-[4%] text-[1.5vw] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
              {String(slide.pageNumber).padStart(2, '0')}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar — visible on mouse move */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrent(i => Math.max(i - 1, 0))}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-[16px] text-white" />
          </button>
          <span className="text-[13px] text-white/70 font-medium tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>
            {current + 1} / {slides.length}
          </span>
          <button
            onClick={() => setCurrent(i => Math.min(i + 1, slides.length - 1))}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer rotate-180"
          >
            <ChevronLeft className="size-[16px] text-white" />
          </button>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-[6px] bg-white/10 text-[13px] text-white/80 font-medium hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1.5"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          <X className="size-[14px]" />
          退出 (Esc)
        </button>
      </div>
    </motion.div>
  );
}

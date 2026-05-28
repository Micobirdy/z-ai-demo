import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Sun, Moon, MessageSquare, BarChart3, FileText, PenTool, Monitor, X, Plus } from 'lucide-react'
import { BorderBeam } from 'border-beam'
import Text3DFlip from '@/components/ui/text-3d-flip'
import ZHoverEffect from '@/components/home/ZHoverEffect'
import { PPTShowcase } from '@/components/home/PPTShowcase'
import { RippleDotPattern } from '@/components/ui/animated-dots'
import { BackgroundTasksDropdown } from '@/components/ui/BackgroundTasksDropdown'
import { useSidebar } from '@/hooks/useSidebar'
import { useFileUpload, formatFileSize } from '@/hooks/useFileUpload'
import { cn } from '@/lib/utils'

const easeOut = [0.4, 0, 0.2, 1] as const

type AgentKey = 'im' | 'ai-ppt' | 'full-stack' | 'data-analysis' | 'file-processing' | 'ai-writing'

const SpeechRecognition = typeof window !== 'undefined'
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null

function getFileTypeStyle(ext: string): { bg: string; icon: string; label: string } {
  switch (ext) {
    case 'pdf':
      return { bg: '#b91c1c', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4.5l2.5 2.5v8h-7v-10.5z" stroke="rgba(255,255,255,0.7)" stroke-width="1" stroke-linejoin="round" fill="none"/><path d="M8 1.5v2.5h2.5" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'doc': case 'docx':
      return { bg: '#1d4ed8', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4.5l2.5 2.5v8h-7v-10.5z" stroke="rgba(255,255,255,0.7)" stroke-width="1" stroke-linejoin="round" fill="none"/><path d="M5 7h4M5 9h3" stroke="rgba(255,255,255,0.5)" stroke-width="0.8" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'xls': case 'xlsx': case 'csv':
      return { bg: '#15803d', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><path d="M2.5 5.5h9M2.5 8.5h9M5.5 2.5v9M8.5 2.5v9" stroke="rgba(255,255,255,0.4)" stroke-width="0.6"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'ppt': case 'pptx':
      return { bg: '#c2410c', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="3.5" width="9" height="7" rx="1" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><circle cx="6" cy="7" r="1.5" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'zip': case 'rar': case '7z':
      return { bg: '#6d28d9', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3.5" y="1.5" width="7" height="11" rx="1.5" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><path d="M6 3.5h2M6 5.5h2M6 7.5h2" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'mp4': case 'mov': case 'avi': case 'mkv':
      return { bg: '#0e7490', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="3.5" width="9" height="7" rx="1" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><path d="M6 6l2.5 1.5L6 9V6z" fill="rgba(255,255,255,0.6)"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'mp3': case 'wav': case 'aac': case 'flac':
      return { bg: '#be123c', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5.5" cy="10" r="1.5" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><path d="M7 10V3.5l3.5-1v6" stroke="rgba(255,255,255,0.6)" stroke-width="1"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'json': case 'xml': case 'yaml': case 'yml':
      return { bg: '#0f766e', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 3.5L2.5 7l2 3.5M9.5 3.5l2 3.5-2 3.5" stroke="rgba(255,255,255,0.6)" stroke-width="1" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.55)' };
    case 'js': case 'ts': case 'py': case 'java': case 'cpp': case 'go': case 'rs':
      return { bg: '#1e293b', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 3.5L2.5 7l2 3.5M9.5 3.5l2 3.5-2 3.5M6 11l2-8" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.45)' };
    case 'md': case 'txt':
      return { bg: '#404040', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4.5l2.5 2.5v8h-7v-10.5z" stroke="rgba(255,255,255,0.6)" stroke-width="1" stroke-linejoin="round" fill="none"/><path d="M5 6.5h4M5 8.5h4M5 10.5h2" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.45)' };
    default:
      return { bg: '#525252', icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5h4.5l2.5 2.5v8h-7v-10.5z" stroke="rgba(255,255,255,0.6)" stroke-width="1" stroke-linejoin="round" fill="none"/><path d="M8 1.5v2.5h2.5" stroke="rgba(255,255,255,0.4)" stroke-width="1" stroke-linecap="round"/></svg>', label: 'rgba(255,255,255,0.45)' };
  }
}

export function HomePage() {
  const { theme, toggleTheme, startChat, activeNav } = useSidebar()
  const dk = theme === 'dark'
  const isAgent = activeNav === 'agent'
  const reduceMotion = useReducedMotion()
  const [inputValue, setInputValue] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>(
    activeNav === 'ai-ppt' ? 'ai-ppt' : activeNav === 'full-stack' ? 'full-stack' : 'im'
  )
  const [isListening, setIsListening] = useState(false)
  const [attachedTemplate, setAttachedTemplate] = useState<{ title: string; coverBg: string; prompt: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const { files, isDragging, removeFile, clearFiles, openFilePicker, dragHandlers, FileInput } = useFileUpload()
  const maxChars = 3000

  useEffect(() => {
    if (activeNav === 'ai-ppt') setSelectedAgent('ai-ppt');
    else if (activeNav === 'full-stack') setSelectedAgent('full-stack');
    else if (activeNav === 'chat' || activeNav === 'agent') {
      setSelectedAgent('im');
      setTimeout(() => textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [activeNav]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setInputValue(value)
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    }
  }, [inputValue])

  const toggleListening = useCallback(() => {
    if (!SpeechRecognition) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'
    recognitionRef.current = recognition

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setInputValue(prev => {
          const next = prev + finalTranscript
          return next.length <= maxChars ? next : prev
        })
      }
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
    setIsListening(true)
  }, [isListening, maxChars])

  useEffect(() => {
    return () => { recognitionRef.current?.stop() }
  }, [])

  const enterTrans = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.55, ease: easeOut }
  const enterTransShort = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.45, ease: easeOut }
  const scaleTrans = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.5, ease: easeOut, delay: 0.12 }

  const featureContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0.01 }
        : { staggerChildren: 0.04, delayChildren: 0.35 },
    },
  }
  const featureItem = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.01 } : { duration: 0.25, ease: easeOut },
    },
  }

  const triShadow = '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 1px 2px 0px rgba(0,0,0,0.08), inset 0px 0px 0px 1px rgba(255,255,255,1)'
  const triShadowDk = '0px 0px 0px 1px rgba(255,255,255,0.1), 0px 1px 2px 0px rgba(0,0,0,0.3), inset 0px 0px 0px 1px rgba(255,255,255,0.06)'

  const hasInput = inputValue.length > 0

  return (
    <div className="relative w-full h-full bg-bg-page">
      {/* Dot pattern — behind everything, with soft gradient fade in center */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 45%, transparent 20%, black 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 45%, transparent 20%, black 70%)',
        }}
      >
        <RippleDotPattern
          className="absolute inset-0"
          width={12}
          height={12}
          cr={1.2}
          baseOpacity={0}
          rippleRadius={180}
          peakOpacity={dk ? 0.25 : 0.4}
        />
      </div>

      <div className="relative z-[1] w-full h-full overflow-y-auto bg-transparent" {...dragHandlers}>
      <FileInput />

      {/* Drop zone overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-page/80 backdrop-blur-sm">
          <div className={cn(
            "w-[600px] h-[200px] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors",
            "border-border-strong bg-bg-surface/50"
          )}>
            <Plus className={cn("size-[24px]", "text-icon-tertiary")} />
            <span className={cn("text-[14px] font-medium", "text-text-tertiary")} style={{ fontFamily: "'Geist', sans-serif" }}>
              Drop files here to add as attachments
            </span>
          </div>
        </div>
      )}

      <ZHoverEffect />

      {/* Top bar */}
      <div className={`flex items-center justify-between px-[12px] h-[52px] sticky top-0 z-10 ${dk ? 'bg-[var(--gray-900)]' : 'bg-[var(--gray-50)]'}`}>
        {/* Left — Model selector */}
        <button className={`pl-[16px] pr-[12px] py-[4px] rounded-[6px] flex items-center gap-[4px] overflow-hidden cursor-pointer transition-colors ${
          "hover:bg-bg-surface"
        }`}>
          <span className="text-[16px] font-normal leading-[24px] text-text-primary" style={{ fontFamily: 'Geist, sans-serif' }}>{isAgent ? 'GLM-5.1 Agent' : 'GLM-5.1'}</span>
          <div className="w-[16px] h-[16px] relative overflow-hidden flex items-center justify-center">
            <ChevronDown className="size-[12px] text-icon-tertiary" />
          </div>
        </button>

        {/* Right — Controls */}
        <div className="flex items-center gap-[8px]">
          {/* Light/Dark toggle */}
          <button
            onClick={toggleTheme}
            className={`pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden cursor-pointer transition-colors ${
              "hover:bg-bg-surface"
            }`}
            title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
              {dk ? <Sun className="size-[16px] text-text-primary" /> : <Moon className="size-[16px] text-text-primary" />}
            </div>
            <span className={`opacity-80 text-[14px] font-normal leading-[20px] text-text-primary`} style={{ fontFamily: 'Geist, sans-serif' }}>
              {dk ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Background Tasks */}
          <BackgroundTasksDropdown />

          {/* Usage indicator */}
          <div className={`pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden ${
            "hover:bg-bg-surface"
          }`}>
            <div className="w-[20px] h-[20px] relative opacity-80 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="6.5" width="13" height="6" rx="1" stroke="currentColor" strokeWidth="1.33"/>
                <rect x="3.5" y="8.5" width="4" height="2" rx="0.5" fill="currentColor"/>
              </svg>
            </div>
            <span className={`opacity-80 text-[14px] font-normal leading-[20px] line-clamp-1 text-text-primary`} style={{ fontFamily: 'Geist, sans-serif' }}>
              50%
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex flex-col items-center justify-start pt-[200px] pb-[200px] px-[24px] relative w-full"
        style={{ zIndex: 1 }}
      >
        <div className="flex flex-col gap-[52px] items-center relative shrink-0">
          {/* Chatbot area */}
          <div className="flex flex-col gap-[52px] items-center justify-center relative shrink-0">
            {/* Title */}
            <div className={`flex flex-col gap-[16px] items-center relative shrink-0 text-center w-full text-text-primary`}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={enterTrans}
              >
                <Text3DFlip
                  className="leading-none not-italic relative shrink-0 text-[52px] text-balance tracking-[-2.08px] justify-center cursor-default"
                  textClassName="bg-bg-page text-text-primary"
                  flipTextClassName="bg-bg-page text-text-primary"
                  rotateDirection="top"
                  staggerDuration={0.015}
                  staggerFrom="first"
                  transition={{ type: "spring", damping: 35, stiffness: 400 }}
                  style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif', fontWeight: 'normal' } as React.CSSProperties}
                >
                  {isAgent ? 'What can I build for you?' : 'Create anything you can imagine'}
                </Text3DFlip>
              </motion.div>
              <motion.p
                className={`font-normal leading-[1.25] relative shrink-0 text-[16px] text-pretty ${'text-text-tertiary'}`}
                style={{ fontFamily: 'Geist, sans-serif' }}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...enterTransShort, delay: reduceMotion ? 0 : 0.08 }}
              >
                {isAgent
                  ? 'Agent mode — complex tasks, code generation, and multi-step workflows'
                  : 'Interact with z.ai and explore the boundless creative world'
                }
              </motion.p>
            </div>

            {/* Input area — simplified chatbot card */}
            <motion.div
              className="relative w-[794px] max-w-full 2xl:w-[920px] min-[1920px]:w-[1040px] origin-top"
              initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={scaleTrans}
              style={{
                borderRadius: 12,
                boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.05)',
              }}
            >
              <BorderBeam
                size="md"
                colorVariant={isAgent ? "ocean" : "sunset"}
                theme={dk ? 'dark' : 'light'}
                borderRadius={12}
                strength={dk ? 0.7 : 0.85}
                duration={1.96}
                active={hasInput}
              >
              <div className={cn(
                "rounded-[12px] inline-flex flex-col justify-start items-start w-full overflow-hidden",
                "bg-bg-bg",
              )}
              style={{
                border: `1px solid ${dk ? 'rgba(255,255,255,0.1)' : 'rgba(13,13,13,0.1)'}`,
              }}
              >
                {/* Textarea area */}
                <div className={cn(
                  "self-stretch p-3 relative rounded-t-[12px] flex flex-col justify-start items-start",
                  "bg-bg-bg max-h-[280px] min-h-[100px]"
                )}>
                  {/* Attached template preview */}
                  {attachedTemplate && (
                    <div className="flex flex-wrap gap-2 w-full relative z-20 mb-2 shrink-0">
                      <div className="group/file max-w-72 pl-1.5 pr-2.5 py-1.5 relative bg-bg-surface rounded-[8px] inline-flex justify-start items-center gap-2">
                        <div className="w-10 h-10 relative rounded-[5px] outline outline-1 outline-offset-[-1px] outline-border-default overflow-hidden shrink-0 bg-[#c2410c] flex flex-col items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="3.5" width="9" height="7" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/><circle cx="6" cy="7" r="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/></svg>
                          <span className="text-[7px] font-bold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>PPT</span>
                        </div>
                        <div className="inline-flex flex-col justify-center items-start">
                          <div className="text-text-secondary text-[14px] font-normal leading-5 line-clamp-1" style={{ fontFamily: "'Geist', sans-serif" }}>{attachedTemplate.title}</div>
                          <div className="text-text-tertiary text-[12px] font-normal leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>PPT 模板</div>
                        </div>
                        <div
                          onClick={() => { setAttachedTemplate(null); setInputValue(''); }}
                          className="w-4 h-4 absolute -top-1 -right-1 bg-bg-bg rounded-full outline outline-[0.58px] outline-offset-[-0.58px] outline-border-default flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="size-[6px] text-icon-tertiary" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uploaded files */}
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full relative z-20 mb-2 shrink-0">
                      {files.map((f, i) => {
                        const ext = f.name.split('.').pop()?.toLowerCase() || '';
                        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
                        const fileName = f.name.replace(/\.[^/.]+$/, '');
                        const ft = getFileTypeStyle(ext);
                        return (
                          <div key={i} className="group/file max-w-72 pl-1.5 pr-2.5 py-1.5 relative bg-bg-surface rounded-[8px] inline-flex justify-start items-center gap-2">
                            <div className="w-10 h-10 relative rounded-[5px] outline outline-1 outline-offset-[-1px] outline-border-default overflow-hidden shrink-0">
                              {isImage && f instanceof File ? (
                                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: ft.bg }}>
                                  <div dangerouslySetInnerHTML={{ __html: ft.icon }} />
                                  <span className="text-[7px] font-bold mt-0.5 uppercase tracking-wide" style={{ color: ft.label }}>{ext}</span>
                                </div>
                              )}
                            </div>
                            <div className="inline-flex flex-col justify-center items-start">
                              <div className="text-text-secondary text-[14px] font-normal leading-5 line-clamp-1" style={{ fontFamily: "'Geist', sans-serif" }}>{fileName}</div>
                              <div className="text-text-tertiary text-[12px] font-normal leading-4" style={{ fontFamily: "'Geist', sans-serif" }}>{ext.toUpperCase()} · {formatFileSize(f.size)}</div>
                            </div>
                            <div
                              onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                              className="w-4 h-4 absolute -top-1 -right-1 bg-bg-bg rounded-full outline outline-[0.58px] outline-offset-[-0.58px] outline-border-default flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="size-[6px] text-icon-tertiary" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (inputValue.trim() || files.length > 0) { startChat(inputValue.trim() || 'Attached files', selectedAgent); clearFiles(); } } }}
                    maxLength={maxChars}
                    rows={2}
                    className={cn(
                      "w-full resize-none outline-none bg-transparent z-10 text-base font-normal leading-6 placeholder:text-text-placeholder",
                      (attachedTemplate || files.length > 0)
                        ? "relative p-0 pt-1 min-h-[24px]"
                        : "relative p-0 min-h-[48px]",
                      "text-text-primary"
                    )}
                    placeholder={isAgent ? 'Describe a complex task for the agent...' : 'Chat with z.ai, or start creating.'}
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="self-stretch px-3 py-2.5 inline-flex justify-between items-center overflow-hidden">
                  <div className="flex-1 flex justify-between items-center">
                    {/* Left — attach + mode label */}
                    <div className="flex justify-start items-center gap-2">
                      <button onClick={openFilePicker} className={cn(
                        "w-[28px] h-[28px] rounded-[999px] flex justify-center items-center transition-opacity opacity-70 hover:opacity-100",
                        dk && "outline outline-1 outline-offset-[-1px] outline-white/[0.12]"
                      )} aria-label="Attach">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 10V12.66C14 13.4 13.4 14 12.66 14H3.34C2.6 14 2 13.4 2 12.66V10M8 2V10M8 2L4.67 5.33M8 2L11.33 5.33" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Right — mic + send */}
                    <div className="flex justify-start items-center gap-2">
                      {/* Listening indicator */}
                      {isListening && (
                        <div className="flex items-center gap-2 pr-0.5">
                          <span className="flex items-center gap-[4px]">
                            <span className={cn("w-[5px] h-[5px] rounded-full", "bg-text-secondary")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
                            <span className={cn("w-[5px] h-[5px] rounded-full", "bg-text-secondary")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
                            <span className={cn("w-[5px] h-[5px] rounded-full", "bg-text-secondary")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
                          </span>
                          <span className={cn(
                            "text-[12px] leading-4 font-medium",
                            "text-text-tertiary"
                          )} style={{ fontFamily: "'Geist', sans-serif" }}>
                            Listening...
                          </span>
                        </div>
                      )}

                      {/* Mic button */}
                      <button
                        onClick={toggleListening}
                        disabled={!SpeechRecognition}
                        className={cn(
                          "w-[28px] h-[28px] rounded-[8px] flex justify-center items-center transition-all",
                          !SpeechRecognition && "opacity-30 cursor-not-allowed",
                          isListening
                            ? "opacity-100 bg-bg-surface"
                            : "opacity-60 hover:opacity-100"
                        )}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5.5" y="1.5" width="5" height="7.5" rx="2.5" stroke="currentColor" strokeWidth="1.33"/>
                          <path d="M3.5 7.5C3.5 9.98 5.52 12 8 12C10.48 12 12.5 9.98 12.5 7.5" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                          <path d="M8 12V14.5M6 14.5H10" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/>
                        </svg>
                      </button>

                      {/* Send button */}
                      <button
                        onClick={() => { if (inputValue.trim() || files.length > 0) { startChat(inputValue.trim() || 'Attached files', selectedAgent); clearFiles(); } }}
                        className={cn(
                          "w-[28px] h-[28px] rounded-[8px] flex justify-center items-center overflow-hidden transition-all text-text-primary",
                          (inputValue.trim() || files.length > 0)
                            ? "bg-interactive-primary text-text-inverted"
                            : "bg-bg-subtle/60 opacity-50"
                        )}
                        aria-label="Send"
                      >
                        <div className="w-4 h-4 relative overflow-hidden">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12.6667V3.33333M8 3.33333L3.33333 8M8 3.33333L12.6667 8" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </BorderBeam>
            </motion.div>
          </div>

          {/* Feature buttons */}
          <motion.div
            variants={featureContainer}
            initial="hidden"
            animate="show"
            className="self-stretch inline-flex justify-center items-center gap-2 md:gap-3 flex-wrap"
          >
            {/* IM — pill shape */}
            <FeaturePill
              variants={featureItem}
              dk={dk}
              agentKey="im"
              selectedAgent={selectedAgent}
              onSelect={setSelectedAgent}
              triShadow={triShadow}
              triShadowDk={triShadowDk}
              icon={<MessageSquare className={cn("size-3", "text-text-primary")} strokeWidth={1.33} />}
              label="IM"
            />

            {/* Separator */}
            <div className="px-2 flex justify-start items-center gap-2.5">
              <div className="w-0 h-4 outline outline-1 outline-offset-[-0.5px] outline-border-default" />
            </div>

            {/* Data Analysis */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="data-analysis" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<BarChart3 className={cn("size-3", "text-text-primary")} strokeWidth={1.5} />}
              label="Data Analysis" />

            {/* File Processing */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="file-processing" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<FileText className={cn("size-3.5", "text-text-primary")} strokeWidth={1.33} />}
              label="File Processing" />

            {/* AI Writing */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="ai-writing" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<PenTool className={cn("size-3", "text-text-primary")} strokeWidth={1.33} />}
              label="AI Writing" />
          </motion.div>

          {/* PPT Showcase — visible when AI PPT selected */}
          {selectedAgent === 'ai-ppt' && (
            <PPTShowcase
              onSelectPrompt={(prompt) => { setInputValue(prompt); setAttachedTemplate(null); setTimeout(() => { const el = textareaRef.current; if (el) { el.focus(); el.selectionStart = el.selectionEnd = prompt.length; } el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }}
              onSelectTemplate={(t) => { setAttachedTemplate({ title: t.title, coverBg: t.coverBg, prompt: t.prompt }); setInputValue(t.prompt); setTimeout(() => { const el = textareaRef.current; if (el) { el.focus(); el.selectionStart = el.selectionEnd = t.prompt.length; } el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }}
            />
          )}

          {/* Full-stack Showcase */}
          {selectedAgent === 'full-stack' && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOut, delay: 0.15 }}
              className="w-[900px] max-w-full xl:w-[960px] 2xl:w-[1080px] min-[1920px]:w-[1240px] flex flex-col gap-5 mt-4"
            >
              <div className="flex justify-center gap-2.5 flex-wrap">
                {['Long-term task', 'Platform Website Construction', 'Tool Product Development'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => { setInputValue(chip); setTimeout(() => { const el = textareaRef.current; if (el) { el.focus(); el.selectionStart = el.selectionEnd = chip.length; } }, 50); }}
                    className="px-3 py-1.5 rounded-[8px] border border-border-default text-[13px] text-text-secondary hover:border-border-strong hover:bg-bg-surface transition-all cursor-pointer active:scale-[0.97]"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] p-5 flex flex-col justify-between overflow-hidden bg-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-[18px] h-[18px] rounded-[4px] bg-blue-600 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3h6M2 5h4M2 7h5" stroke="white" strokeWidth="0.8" strokeLinecap="round"/></svg>
                      </div>
                      <span className="text-[8px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[18px] font-bold leading-[22px]" style={{ color: '#2563eb', fontFamily: "'Geist', sans-serif" }}>マーケティング</div>
                      <div className="text-[18px] font-bold leading-[22px]" style={{ color: '#2563eb', fontFamily: "'Geist', sans-serif" }}>戦略  2025</div>
                      <div className="h-[14px] w-[70%] rounded-[2px] bg-blue-600 flex items-center px-2 mt-0.5">
                        <span className="text-[6px] text-white font-medium tracking-wide" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
                      </div>
                      <span className="text-[7px] text-text-tertiary mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>成功へのデジタルロードマップ</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[6px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>佐藤 健太</span>
                      <span className="text-[6px] text-text-placeholder" style={{ fontFamily: "'Geist', sans-serif" }}>www.digitalmarketing.co.jp</span>
                    </div>
                  </div>
                </div>
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] p-5 flex flex-col justify-center items-center text-center overflow-hidden" style={{ backgroundColor: '#1a365d' }}>
                    <div className="text-[15px] font-bold leading-[20px] text-white" style={{ fontFamily: "'Geist', sans-serif" }}>Healthcare Consulting Excellence</div>
                    <div className="text-[8px] leading-[13px] text-white/60 mt-2 max-w-[85%]" style={{ fontFamily: "'Geist', sans-serif" }}>Navigating <span className="text-orange-400">Digital Transformation</span> and Market Opportunities</div>
                    <div className="text-[7px] text-white/40 mt-3" style={{ fontFamily: "'Geist', sans-serif" }}>2023-2030 Market Outlook</div>
                  </div>
                </div>
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                    <div className="absolute inset-0 p-5 flex flex-col justify-center gap-1.5">
                      <div className="text-[13px] font-bold leading-[17px] max-w-[60%]" style={{ color: '#1e293b', fontFamily: "'Geist', sans-serif" }}>Transforming Insurance with Strategic Digital Consulting</div>
                      <div className="text-[7px] leading-[11px] text-slate-500 max-w-[55%] mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>A data-driven approach to navigating digital transformation</div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="w-[14px] h-[14px] rounded-full bg-orange-400" />
                        <div className="w-[14px] h-[14px] rounded-full bg-red-400" />
                        <div className="w-[14px] h-[14px] rounded-full bg-rose-400" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[42%] h-full" style={{ background: 'linear-gradient(135deg, transparent 10%, #334155 90%)' }} />
                  </div>
                </div>
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] flex items-center justify-center overflow-hidden bg-white">
                    <div className="w-[55%] aspect-square relative">
                      {Array.from({ length: 12 }).map((_, j) => { const a=(j/12)*360-90, r=a*Math.PI/180, x=50+40*Math.cos(r), y=50+40*Math.sin(r); return <div key={j} className="absolute w-[11%] h-[15%] rounded-[2px] shadow-sm" style={{ left:`${x-5.5}%`, top:`${y-7.5}%`, transform:`rotate(${a+90}deg)`, backgroundColor:`hsl(${[210,30,160,350,45,280,190,15,120,330,60,240][j]},25%,65%)` }} />; })}
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center px-4"><span className="text-[7px] text-text-tertiary italic" style={{ fontFamily: "Georgia, serif" }}>The luxury model of infinite intelligence...</span></div>
                  </div>
                </div>
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] flex flex-col items-center justify-center overflow-hidden bg-white px-5 py-4">
                    <div className="grid grid-cols-4 gap-[3px] w-[55%]">{Array.from({ length: 8 }).map((_, j) => <div key={j} className="aspect-square rounded-[2px]" style={{ backgroundColor:['#c4b5a4','#9ca3af','#d1c4b2','#a3a3a3','#b8b0a0','#8b8b8b','#bfb5a5','#7a7a7a'][j] }} />)}</div>
                    <div className="mt-3 text-center"><span className="text-[14px] font-medium" style={{ color: '#1a1a1a', fontFamily: "Georgia, serif" }}>Your work, <em>curated.</em></span></div>
                  </div>
                </div>
                <div className="group relative rounded-[10px] border border-border-default overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer bg-bg-bg">
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 40%, #f97316 100%)' }}>
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-[16px] h-[16px] rounded-full bg-white/20 flex items-center justify-center"><span className="text-[7px] text-white font-bold">A</span></div>
                        <span className="text-[7px] text-white/50 font-medium" style={{ fontFamily: "'Geist', sans-serif" }}>Aono</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-[17px] font-bold leading-[21px] text-white" style={{ fontFamily: "'Geist', sans-serif" }}>Creative<br/>experiences<br/>in fluid motion</div>
                        <div className="text-[7px] text-white/50 max-w-[75%] mt-0.5 leading-[11px]" style={{ fontFamily: "'Geist', sans-serif" }}>Transforming digital spaces with dynamic shader effects</div>
                        <div className="flex gap-1.5 mt-1.5">
                          <div className="px-2.5 py-1 rounded-full bg-white/15 text-[7px] text-white font-medium" style={{ fontFamily: "'Geist', sans-serif" }}>Explore all</div>
                          <div className="px-2.5 py-1 rounded-full border border-white/20 text-[7px] text-white/70 font-medium" style={{ fontFamily: "'Geist', sans-serif" }}>View Pricing</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* IM Showcase — visible for IM and other modes */}
          {(selectedAgent === 'im' || selectedAgent === 'data-analysis' || selectedAgent === 'file-processing' || selectedAgent === 'ai-writing') && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOut, delay: 0.15 }}
              className="w-[794px] max-w-full 2xl:w-[920px] min-[1920px]:w-[1040px] flex flex-col gap-6 mt-4"
            >
              {/* IM Connect cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Lark', desc: 'Just @ me in the chat.', icon: '💬', color: '#3370ff', status: 'connect' },
                  { name: 'WeChat', desc: 'Join the private chat, start working immediately.', icon: '💚', color: '#07c160', status: 'connect' },
                  { name: 'Discord', desc: 'Always on standby in your community.', icon: '🎮', color: '#5865f2', status: 'connect' },
                  { name: 'Telegram', desc: 'Quick reply wherever you are.', icon: '✈️', color: '#26a5e4', status: 'coming' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] border border-border-default hover:border-border-strong transition-colors">
                    <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center shrink-0 text-[18px]" style={{ backgroundColor: `${item.color}12` }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-text-primary leading-5" style={{ fontFamily: "'Geist', sans-serif" }}>{item.name}</div>
                      <div className="text-[12px] text-text-tertiary leading-4 mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>{item.desc}</div>
                    </div>
                    {item.status === 'connect' ? (
                      <button className="h-[28px] px-3 rounded-[6px] bg-interactive-primary text-[12px] font-medium text-text-inverted hover:opacity-90 transition-all cursor-pointer shrink-0" style={{ fontFamily: "'Geist', sans-serif" }}>
                        Connect
                      </button>
                    ) : (
                      <span className="h-[28px] px-3 rounded-[6px] border border-border-default text-[12px] font-medium text-text-tertiary flex items-center shrink-0" style={{ fontFamily: "'Geist', sans-serif" }}>
                        Coming soon
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Get started section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">💡</span>
                  <span className="text-[14px] font-medium text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>Get started with IM</span>
                </div>
                <div className="rounded-[10px] border border-border-default overflow-hidden flex">
                  <div className="flex-1 p-5 flex flex-col justify-center">
                    <div className="text-[15px] font-semibold text-text-primary leading-5 mb-1.5" style={{ fontFamily: "'Geist', sans-serif" }}>Best in class demos</div>
                    <div className="text-[13px] text-text-tertiary leading-5 mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>Explore top performing examples from our customer showcase</div>
                    <button className="self-start h-[28px] px-3 rounded-[6px] border border-border-default text-[12px] font-medium text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer" style={{ fontFamily: "'Geist', sans-serif" }}>
                      Dismiss
                    </button>
                  </div>
                  <div className="w-[320px] shrink-0 bg-gradient-to-br from-blue-100 via-purple-50 to-orange-100 rounded-r-[10px] flex items-center justify-center overflow-hidden">
                    <div className="w-[200px] h-[130px] rounded-[8px] bg-bg-bg shadow-lg transform rotate-[-3deg] translate-y-2 flex items-center justify-center">
                      <span className="text-[11px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

const TAG_SHADOW_LIGHT = '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 1px 2px 0px rgba(0,0,0,0.08), inset 0px 0px 0px 1px rgba(255,255,255,1)';
const TAG_SHADOW_DARK = '0px 0px 0px 1px rgba(255,255,255,0.08), 0px 1px 2px 0px rgba(0,0,0,0.2), inset 0px 0px 0px 1px rgba(255,255,255,0.04)';

function FeaturePill({ variants, dk, agentKey, selectedAgent, onSelect, triShadow, triShadowDk, icon, label }: {
  variants: Record<string, unknown>
  dk: boolean
  agentKey: AgentKey
  selectedAgent: AgentKey
  onSelect: (key: AgentKey) => void
  triShadow: string
  triShadowDk: string
  icon: React.ReactNode
  label: string
}) {
  const active = selectedAgent === agentKey
  return (
    <motion.button
      variants={variants}
      onClick={() => onSelect(agentKey)}
      className={cn(
        "px-3 py-1.5 rounded-[6px] flex justify-start items-center gap-1.5 overflow-hidden transition-colors cursor-pointer outline outline-1 outline-border-default bg-bg-page hover:bg-bg-surface",
        active && "bg-bg-surface"
      )}
      style={{ boxShadow: dk ? TAG_SHADOW_DARK : TAG_SHADOW_LIGHT }}
    >
      <div className={cn("w-4 h-4 relative overflow-hidden flex items-center justify-center", active ? "opacity-80" : "opacity-50")}>
        {icon}
      </div>
      <span className={cn("text-[12px] font-medium leading-4", active ? "opacity-80 text-text-primary" : "text-text-tertiary")} style={{ fontFamily: "'Geist', sans-serif" }}>
        {label}
      </span>
    </motion.button>
  )
}

function FeatureBtn({ variants, dk, triShadow, triShadowDk, icon, label, agentKey, selectedAgent, onSelect }: {
  variants: Record<string, unknown>
  dk: boolean
  triShadow: string
  triShadowDk: string
  icon: React.ReactNode
  label: string
  agentKey: AgentKey
  selectedAgent: AgentKey
  onSelect: (key: AgentKey) => void
}) {
  const active = selectedAgent === agentKey
  return (
    <motion.button
      variants={variants}
      onClick={() => onSelect(agentKey)}
      className={cn(
        "px-3 py-1.5 rounded-[6px] flex justify-start items-center gap-1.5 overflow-hidden transition-colors cursor-pointer outline outline-1 outline-border-default bg-bg-page hover:bg-bg-surface",
        active && "bg-bg-surface"
      )}
      style={{ boxShadow: dk ? TAG_SHADOW_DARK : TAG_SHADOW_LIGHT }}
    >
      <div className={cn("w-4 h-4 relative overflow-hidden flex items-center justify-center", active ? "opacity-80" : "opacity-50")}>
        {icon}
      </div>
      <span className={cn("text-[12px] font-medium leading-4", active ? "opacity-80 text-text-primary" : "text-text-tertiary")} style={{ fontFamily: "'Geist', sans-serif" }}>
        {label}
      </span>
    </motion.button>
  )
}

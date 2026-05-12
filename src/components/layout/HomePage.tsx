import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Sun, Moon, MessageSquare, BarChart3, FileText, PenTool, Monitor, X, Plus } from 'lucide-react'
import { BorderBeam } from 'border-beam'
import ZHoverEffect from '@/components/home/ZHoverEffect'
import { useSidebar } from '@/hooks/useSidebar'
import { useFileUpload, formatFileSize } from '@/hooks/useFileUpload'
import { cn } from '@/lib/utils'

const easeOut = [0.4, 0, 0.2, 1] as const

type AgentKey = 'im' | 'ai-ppt' | 'full-stack' | 'data-analysis' | 'file-processing' | 'ai-writing'

const SpeechRecognition = typeof window !== 'undefined'
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null

export function HomePage() {
  const { theme, toggleTheme, startChat } = useSidebar()
  const dk = theme === 'dark'
  const reduceMotion = useReducedMotion()
  const [inputValue, setInputValue] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>('im')
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const { files, isDragging, removeFile, clearFiles, openFilePicker, dragHandlers, FileInput } = useFileUpload()
  const maxChars = 3000

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 72)}px`
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
    <div className={`relative w-full h-full overflow-y-auto ${dk ? 'bg-[#161616]' : 'bg-[#f8f8f8]'}`} {...dragHandlers}>
      <FileInput />

      {/* Drop zone overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-page/80 backdrop-blur-sm">
          <div className={cn(
            "w-[600px] h-[200px] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors",
            dk ? "border-white/20 bg-white/[0.04]" : "border-[#0d0d0d]/15 bg-[#0d0d0d]/[0.02]"
          )}>
            <Plus className={cn("size-[24px]", dk ? "text-white/40" : "text-[#0d0d0d]/30")} />
            <span className={cn("text-[14px] font-medium", dk ? "text-white/50" : "text-[#0d0d0d]/40")} style={{ fontFamily: "'Geist', sans-serif" }}>
              Drop files here to add as attachments
            </span>
          </div>
        </div>
      )}

      <ZHoverEffect />

      {/* Top bar */}
      <div className={`flex items-center justify-between px-[12px] py-[8px] sticky top-0 z-10 backdrop-blur-sm ${dk ? 'bg-[#161616]/80' : 'bg-[#f8f8f8]/80'}`}>
        {/* Left — Model selector */}
        <button className={`pl-[16px] pr-[12px] py-[4px] rounded-[6px] flex items-center gap-[4px] overflow-hidden cursor-pointer transition-colors ${
          dk
            ? 'hover:bg-white/[0.06]'
            : 'hover:bg-[#0d0d0d]/[0.02]'
        }`}>
          <span className={`text-[16px] font-normal leading-[24px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} style={{ fontFamily: 'Geist, sans-serif' }}>GLM-5.1</span>
          <div className="w-[16px] h-[16px] relative overflow-hidden flex items-center justify-center">
            <ChevronDown className={`size-[12px] ${dk ? 'text-white/50' : 'text-[#0d0d0d]'}`} />
          </div>
        </button>

        {/* Right — Controls */}
        <div className="flex items-center gap-[8px]">
          {/* Light/Dark toggle */}
          <button
            onClick={toggleTheme}
            className={`pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden cursor-pointer transition-colors ${
              dk
                ? 'hover:bg-white/[0.06]'
                : 'hover:bg-[#0d0d0d]/[0.02]'
            }`}
            title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
              {dk ? <Sun className="size-[16px] text-white" /> : <Moon className="size-[16px] text-[#0d0d0d]" />}
            </div>
            <span className={`opacity-80 text-[14px] font-normal leading-[20px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} style={{ fontFamily: 'Geist, sans-serif' }}>
              {dk ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Background Tasks */}
          <div className={`pl-[6px] pr-[8px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden ${
            dk
              ? 'hover:bg-white/[0.06]'
              : 'hover:bg-[#0d0d0d]/[0.02]'
          }`}>
            <div className={`p-[4px] rounded-full flex items-center justify-center`}>
              <div className="w-[8px] h-[8px] relative">
                <div className="w-[6px] h-[6px] absolute left-[1px] top-[1px] bg-green-500 rounded-full outline outline-[3px] outline-green-500/20" />
              </div>
            </div>
            <span className={`opacity-80 text-[14px] font-normal leading-[20px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} style={{ fontFamily: 'Geist, sans-serif' }}>
              Background Tasks
            </span>
            <div className="w-[16px] h-[16px] relative opacity-40 flex items-center justify-center">
              <ChevronDown className={`size-[12px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} />
            </div>
          </div>

          {/* Usage indicator */}
          <div className={`pl-[8px] pr-[10px] py-[6px] rounded-[6px] flex items-center gap-[4px] overflow-hidden ${
            dk
              ? 'hover:bg-white/[0.06]'
              : 'hover:bg-[#0d0d0d]/[0.02]'
          }`}>
            <div className="w-[20px] h-[20px] relative opacity-80 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="6.5" width="13" height="6" rx="1" stroke={dk ? '#fff' : '#0d0d0d'} strokeWidth="1.33"/>
                <rect x="3.5" y="8.5" width="4" height="2" rx="0.5" fill={dk ? '#fff' : '#0d0d0d'}/>
              </svg>
            </div>
            <span className={`opacity-80 text-[14px] font-normal leading-[20px] line-clamp-1 ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} style={{ fontFamily: 'Geist, sans-serif' }}>
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
            <div className={`flex flex-col gap-[16px] items-center relative shrink-0 text-center w-full ${dk ? 'text-white' : 'text-[#1b1818]'}`}>
              <motion.p
                className="leading-none not-italic relative shrink-0 text-[52px] text-balance tracking-[-2.08px]"
                style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", serif', fontWeight: 'normal' }}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={enterTrans}
              >
                Create anything you can imagine
              </motion.p>
              <motion.p
                className={`font-normal leading-[1.25] relative shrink-0 text-[16px] text-pretty ${dk ? 'text-white/40' : 'text-[#737373]'}`}
                style={{ fontFamily: 'Geist, sans-serif' }}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...enterTransShort, delay: reduceMotion ? 0 : 0.08 }}
              >
                Interact with z.ai and explore the boundless creative world
              </motion.p>
            </div>

            {/* Input area — simplified chatbot card */}
            <motion.div
              className="relative w-[794px] max-w-full origin-top"
              initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={scaleTrans}
              style={{
                borderRadius: 12,
                outline: dk ? '1px solid rgba(64,64,64,0.8)' : '1px solid #d4d4d8',
                outlineOffset: '-1px',
                boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.05)',
              }}
            >
              <BorderBeam
                size="md"
                colorVariant="sunset"
                theme={dk ? 'dark' : 'light'}
                borderRadius={12}
                strength={dk ? 0.7 : 0.85}
                duration={1.96}
                active={hasInput}
              >
              <div className={cn(
                "rounded-[12px] inline-flex flex-col justify-start items-start w-full overflow-hidden",
                dk ? "bg-zinc-800" : "bg-white"
              )}>
                {/* Textarea area */}
                <div className={cn(
                  "self-stretch p-3 relative rounded-t-[12px] outline outline-1 flex flex-col justify-start items-start gap-2",
                  files.length > 0 ? "min-h-[96px]" : "h-24",
                  dk ? "bg-zinc-800 outline-white/[0.06]" : "bg-white outline-transparent"
                )}>
                  {/* Uploaded files */}
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full relative z-20 mb-1">
                      {files.map((f, i) => (
                        <div key={i} className={cn(
                          "flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-[8px] text-[12px] leading-[16px] max-w-[220px]",
                          dk ? "bg-white/[0.06] text-white/70" : "bg-[#0d0d0d]/[0.04] text-[#0d0d0d]/70"
                        )} style={{ fontFamily: "'Geist', sans-serif" }}>
                          <FileText className="size-[14px] shrink-0 opacity-50" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] opacity-40 shrink-0">{formatFileSize(f.size)}</span>
                          <button onClick={() => removeFile(i)} className="size-[16px] rounded-full flex items-center justify-center shrink-0 opacity-40 hover:opacity-100 transition-opacity">
                            <X className="size-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Placeholder */}
                  {!inputValue && files.length === 0 && (
                    <div className={cn(
                      "self-stretch flex-1 text-base font-normal leading-5 pointer-events-none",
                      dk ? "text-white/40" : "text-stone-950 opacity-30"
                    )} style={{ fontFamily: "'Geist', sans-serif" }}>
                      Chat with z.ai, or start creating.
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (inputValue.trim() || files.length > 0) { startChat(inputValue.trim() || 'Attached files'); clearFiles(); } } }}
                    maxLength={maxChars}
                    className={cn(
                      "absolute inset-0 p-3 text-base font-normal leading-6 w-full resize-none outline-none bg-transparent z-10",
                      dk ? "text-white" : "text-stone-950"
                    )}
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="self-stretch px-3 py-2.5 inline-flex justify-between items-center overflow-hidden">
                  <div className="flex-1 flex justify-between items-center">
                    {/* Left — attach */}
                    <div className="flex justify-start items-center gap-1.5">
                      <button onClick={openFilePicker} className={cn(
                        "w-[28px] h-[28px] rounded-[999px] flex justify-center items-center transition-opacity opacity-70 hover:opacity-100",
                        dk && "outline outline-1 outline-offset-[-1px] outline-white/[0.12]"
                      )} aria-label="Attach">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 10V12.66C14 13.4 13.4 14 12.66 14H3.34C2.6 14 2 13.4 2 12.66V10M8 2V10M8 2L4.67 5.33M8 2L11.33 5.33" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Right — mic + send */}
                    <div className="flex justify-start items-center gap-2">
                      {/* Listening indicator */}
                      {isListening && (
                        <div className="flex items-center gap-2 pr-0.5">
                          <span className="flex items-center gap-[4px]">
                            <span className={cn("w-[5px] h-[5px] rounded-full", dk ? "bg-white/70" : "bg-stone-950/60")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
                            <span className={cn("w-[5px] h-[5px] rounded-full", dk ? "bg-white/70" : "bg-stone-950/60")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
                            <span className={cn("w-[5px] h-[5px] rounded-full", dk ? "bg-white/70" : "bg-stone-950/60")} style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
                          </span>
                          <span className={cn(
                            "text-[12px] leading-4 font-medium",
                            dk ? "text-white/60" : "text-stone-950/50"
                          )} style={{ fontFamily: "'Geist', sans-serif" }}>
                            Listening...
                          </span>
                        </div>
                      )}

                      {/* Mic button — round, dark bg */}
                      <button
                        onClick={toggleListening}
                        disabled={!SpeechRecognition}
                        className={cn(
                          "w-[32px] h-[32px] rounded-full flex justify-center items-center transition-all",
                          !SpeechRecognition && "opacity-30 cursor-not-allowed",
                          isListening
                            ? dk ? "bg-white ring-2 ring-white/20" : "bg-[#0d0d0d] ring-2 ring-[#0d0d0d]/20"
                            : dk ? "bg-white" : "bg-[#0d0d0d]"
                        )}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5.5" y="1.5" width="5" height="7.5" rx="2.5" stroke={dk ? '#0c0a09' : '#fff'} strokeWidth="1.33"/>
                          <path d="M3.5 7.5C3.5 9.98 5.52 12 8 12C10.48 12 12.5 9.98 12.5 7.5" stroke={dk ? '#0c0a09' : '#fff'} strokeWidth="1.33" strokeLinecap="round"/>
                          <path d="M8 12V14.5M6 14.5H10" stroke={dk ? '#0c0a09' : '#fff'} strokeWidth="1.33" strokeLinecap="round"/>
                        </svg>
                      </button>

                      {/* Send button */}
                      <button
                        onClick={() => { if (inputValue.trim() || files.length > 0) { startChat(inputValue.trim() || 'Attached files'); clearFiles(); } }}
                        className={cn(
                          "w-[28px] h-[28px] rounded-[8px] flex justify-center items-center overflow-hidden transition-all",
                          (inputValue.trim() || files.length > 0)
                            ? dk ? "bg-white text-black" : "bg-[#0d0d0d] text-white"
                            : dk
                              ? "opacity-25 bg-white outline outline-1 outline-offset-[-1px] outline-stone-950/10"
                              : "bg-neutral-200"
                        )}
                        aria-label="Send"
                      >
                        <div className={cn("w-4 h-4 relative overflow-hidden", (inputValue.trim() || files.length > 0) ? "" : dk ? "" : "opacity-20")}>
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
            className="self-stretch inline-flex justify-center items-center gap-3"
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
              icon={<MessageSquare className={cn("size-3", dk ? "text-white" : "text-stone-950")} strokeWidth={1.33} />}
              label="IM"
            />

            {/* Separator — no stagger animation */}
            <div className="px-2 flex justify-start items-center">
              <div className={cn("w-px h-4 opacity-20", dk ? "bg-white" : "bg-stone-950")} />
            </div>

            {/* AI PPT */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="ai-ppt" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="12" height="4" rx="1" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round"/>
                <rect x="2" y="9" width="5" height="4" rx="1" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round"/>
                <rect x="9" y="9" width="5" height="4" rx="1" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round"/>
              </svg>}
              label="AI PPT" />

            {/* Full-stack */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="full-stack" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<Monitor className={cn("size-3.5", dk ? "text-white" : "text-stone-950")} strokeWidth={1.33} />}
              label="Full-stack" />

            {/* Data Analysis */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="data-analysis" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<BarChart3 className={cn("size-3", dk ? "text-white" : "text-stone-950")} strokeWidth={1.5} />}
              label="Data Analysis" />

            {/* File Processing */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="file-processing" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<FileText className={cn("size-3.5", dk ? "text-white" : "text-stone-950")} strokeWidth={1.33} />}
              label="File Processing" />

            {/* AI Writing */}
            <FeatureBtn variants={featureItem} dk={dk} triShadow={triShadow} triShadowDk={triShadowDk}
              agentKey="ai-writing" selectedAgent={selectedAgent} onSelect={setSelectedAgent}
              icon={<PenTool className={cn("size-3", dk ? "text-white" : "text-stone-950")} strokeWidth={1.33} />}
              label="AI Writing" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

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
        "px-3 py-2 rounded-[99px] flex justify-start items-center gap-1.5 overflow-hidden transition-all cursor-pointer",
        active
          ? dk ? "bg-white/[0.12]" : "bg-stone-950/5"
          : dk ? "bg-white/[0.04]" : "bg-transparent"
      )}
      style={{ boxShadow: active ? (dk ? triShadowDk : triShadow) : 'none' }}
    >
      <div className={cn("w-4 h-4 relative overflow-hidden flex items-center justify-center transition-opacity", active ? "opacity-80" : "opacity-50")}>
        {icon}
      </div>
      <span className={cn("text-xs font-medium leading-4 transition-opacity", dk ? "text-white" : "text-stone-950", active ? "opacity-80" : "opacity-50")} style={{ fontFamily: "'Geist', sans-serif" }}>
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
        "px-3 py-2 rounded-[8px] flex justify-center items-center gap-2 overflow-hidden transition-all cursor-pointer",
        active
          ? dk ? "bg-white/[0.1]" : "bg-white"
          : dk ? "bg-white/[0.04]" : "bg-neutral-50/90"
      )}
      style={{ boxShadow: dk ? triShadowDk : triShadow }}
    >
      <div className={cn("w-4 h-4 relative overflow-hidden flex items-center justify-center transition-opacity", active ? "opacity-90" : "opacity-60")}>
        {icon}
      </div>
      <span className={cn("text-xs font-medium leading-4 transition-opacity", dk ? "text-white" : "text-stone-950", active ? "opacity-90" : "opacity-60")} style={{ fontFamily: "'Geist', sans-serif" }}>
        {label}
      </span>
    </motion.button>
  )
}

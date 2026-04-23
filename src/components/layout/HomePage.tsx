import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Sun, Moon, MessageSquare, BarChart3, FileText, PenTool, Monitor } from 'lucide-react'
import { BorderBeam } from 'border-beam'
import ZHoverEffect from '@/components/home/ZHoverEffect'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

const easeOut = [0.4, 0, 0.2, 1] as const

type AgentKey = 'im' | 'ai-ppt' | 'full-stack' | 'data-analysis' | 'file-processing' | 'ai-writing'

export function HomePage() {
  const { theme, toggleTheme } = useSidebar()
  const dk = theme === 'dark'
  const reduceMotion = useReducedMotion()
  const [inputValue, setInputValue] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>('im')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
        : { staggerChildren: 0.07, delayChildren: 0.52 },
    },
  }
  const featureItem = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.01 } : { duration: 0.4, ease: easeOut },
    },
  }

  const triShadow = '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 1px 2px 0px rgba(0,0,0,0.08), inset 0px 0px 0px 1px rgba(255,255,255,1)'
  const triShadowDk = '0px 0px 0px 1px rgba(255,255,255,0.1), 0px 1px 2px 0px rgba(0,0,0,0.3), inset 0px 0px 0px 1px rgba(255,255,255,0.06)'

  const hasInput = inputValue.length > 0

  return (
    <div className={`relative w-full h-full overflow-y-auto ${dk ? 'bg-[#161616]' : 'bg-[#f8f8f8]'}`}>
      <ZHoverEffect />

      {/* Top bar */}
      <div className={`flex items-center justify-between px-[12px] py-[8px] sticky top-0 z-10 backdrop-blur-sm ${dk ? 'bg-[#161616]/80' : 'bg-[#f8f8f8]/80'}`}>
        {/* Left — Model selector */}
        <button className={`pl-[16px] pr-[12px] py-[4px] rounded-[6px] flex items-center gap-[4px] overflow-hidden cursor-pointer transition-colors ${
          dk
            ? 'shadow-[0px_0px_0px_1px_rgba(255,255,255,0.12)] hover:bg-white/[0.06]'
            : 'shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11)] hover:bg-[#0d0d0d]/[0.02]'
        }`}>
          <span className={`text-[18px] font-normal leading-[28px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`} style={{ fontFamily: 'Geist, sans-serif' }}>GLM-5.1</span>
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
                ? 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.12)] hover:bg-white/[0.06]'
                : 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11)] hover:bg-[#0d0d0d]/[0.02]'
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
              ? 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.12)]'
              : 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11)]'
          }`}>
            <div className={`p-[4px] rounded-full flex items-center justify-center ${
              dk
                ? 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.12)]'
                : 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11)]'
            }`}>
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
              ? 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] shadow-[0px_0px_0px_1px_rgba(255,255,255,0.12)]'
              : 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11)]'
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
            >
              <BorderBeam
                size="md"
                colorVariant="sunset"
                theme={dk ? 'dark' : 'light'}
                borderRadius={12}
                strength={dk ? 0.7 : 0.5}
                duration={1.96}
                active={hasInput}
              >
              <div className={cn(
                "rounded-xl inline-flex flex-col justify-start items-start w-full overflow-hidden",
                dk ? "bg-[#1e1e1e]" : "bg-white"
              )} style={{
                boxShadow: dk
                  ? '0px 4px 16px 0px rgba(0,0,0,0.3)'
                  : '0px 4px 16px 0px rgba(0,0,0,0.05)',
                outline: dk ? '1px solid rgba(255,255,255,0.1)' : '1px solid #a1a1aa',
                outlineOffset: '-1px'
              }}>
                {/* Textarea area */}
                <div className={cn(
                  "self-stretch h-24 p-3 relative rounded-t-xl flex flex-col justify-start items-start gap-2",
                  dk ? "bg-[#1e1e1e]" : "bg-white"
                )}>
                  {/* Placeholder */}
                  {!inputValue && (
                    <div className={cn(
                      "self-stretch flex-1 opacity-30 text-base font-normal leading-6 pointer-events-none",
                      dk ? "text-white" : "text-stone-950"
                    )} style={{ fontFamily: "'Geist', sans-serif" }}>
                      Chat with z.ai, or start creating.
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    maxLength={maxChars}
                    className={cn(
                      "absolute inset-0 p-3 text-base font-normal leading-6 w-full resize-none outline-none bg-transparent z-10",
                      dk ? "text-white" : "text-stone-950"
                    )}
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="self-stretch p-3 inline-flex justify-between items-center flex-wrap content-center overflow-hidden">
                  <div className="flex-1 flex justify-between items-center">
                    {/* Left — upload & thinking icons */}
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-start items-center gap-1">
                        {/* Upload / attach icon */}
                        <button className="w-7 h-7 relative opacity-70 rounded-[999px] flex items-center justify-center transition-opacity hover:opacity-100" aria-label="Upload">
                          <div className="w-5 h-5 overflow-hidden flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.5 7.5V9.5C10.5 10.0523 10.0523 10.5 9.5 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V7.5M6 1.5V7.5M6 1.5L3.5 4M6 1.5L8.5 4" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </button>
                        {/* Thinking icon */}
                        <button className="w-7 h-7 p-1 opacity-70 rounded-[999px] flex justify-center items-center transition-opacity hover:opacity-100" aria-label="Thinking">
                          <div className="w-4 h-4 relative overflow-hidden">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="8" cy="8" r="5.5" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33"/>
                              <circle cx="5.5" cy="8" r="1" fill={dk ? '#fff' : '#0c0a09'}/>
                              <circle cx="8" cy="8" r="1" fill={dk ? '#fff' : '#0c0a09'}/>
                              <circle cx="10.5" cy="8" r="1" fill={dk ? '#fff' : '#0c0a09'}/>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Right — send button */}
                    <div className="flex justify-start items-center gap-3">
                      <button
                        className={cn(
                          "p-1.5 rounded-lg flex justify-center items-center gap-2",
                          dk ? "bg-white/[0.15]" : "bg-neutral-200"
                        )}
                        aria-label="Send"
                      >
                        <div className={cn("w-4 h-4 relative overflow-hidden", dk ? "opacity-40" : "opacity-20")}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12.6667V3.33333M8 3.33333L3.33333 8M8 3.33333L12.6667 8" stroke={dk ? '#fff' : '#0c0a09'} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* Separator */}
            <div className="px-2 flex justify-start items-center gap-2.5">
              <div className={cn("w-0 h-4 opacity-20 outline outline-1 outline-offset-[-0.5px]", dk ? "outline-white" : "outline-stone-950")} />
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
        "px-3 py-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden transition-all cursor-pointer",
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

import { useState } from 'react';
import {
  ChevronDown,
  Plus,
  Image,
  ArrowUp,
  MessageCircle,
  Presentation,
  Code2,
  BarChart3,
  FileText,
  PenLine,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { BorderBeam } from 'border-beam';
import { useSidebar } from '@/hooks/useSidebar';

const featureTags = [
  { icon: MessageCircle, label: 'IM', active: true },
  { icon: Presentation, label: 'AI PPT' },
  { icon: Code2, label: 'Full-stack' },
  { icon: BarChart3, label: 'Data Analysis' },
  { icon: FileText, label: 'File Processing' },
  { icon: PenLine, label: 'AI Writing' },
];

const imCards = [
  { name: 'Lark', desc: 'Just @ me in the chat.', color: '#3b82f6', status: 'connect' as const },
  { name: 'WeChat', desc: 'Join the private chat, start working immediately.', color: '#22c55e', status: 'connect' as const },
  { name: 'Discord', desc: 'Always on standby in your community.', color: '#7c3aed', status: 'connect' as const },
  { name: 'Telegram', desc: 'Quick reply wherever you are.', color: '#0ea5e9', status: 'soon' as const },
];

export function HomePage() {
  const { theme, toggleTheme } = useSidebar();
  const dk = theme === 'dark';
  const [chatText, setChatText] = useState('');

  return (
    <div className={`flex-1 h-full overflow-y-auto ${dk ? 'bg-[#161616]' : 'bg-white'}`}>
      {/* Top bar */}
      <div className={`flex items-center justify-between px-[24px] py-[12px] sticky top-0 z-10 backdrop-blur-sm ${dk ? 'bg-[#161616]/80' : 'bg-white/80'}`}>
        <button className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[8px] transition-colors cursor-pointer ${dk ? 'hover:bg-white/[0.06]' : 'hover:bg-[#0d0d0d]/[0.04]'}`}>
          <span className={`text-[14px] font-medium tracking-[-0.18px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>GLM-5.1</span>
          <ChevronDown className={`size-[14px] ${dk ? 'text-white/50' : 'text-[#0d0d0d]/50'}`} />
        </button>
        <div className="flex items-center gap-[8px]">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`size-[32px] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer ${
              dk ? 'text-white/50 hover:text-white hover:bg-white/[0.06]' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d] hover:bg-[#0d0d0d]/[0.04]'
            }`}
            title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dk ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <button className={`px-[16px] py-[6px] rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
            dk ? 'bg-white text-[#161616] hover:bg-white/90' : 'bg-[#0d0d0d] text-white hover:bg-[#333]'
          }`}>
            Log in
          </button>
          <button className={`text-[13px] transition-colors cursor-pointer ${dk ? 'text-white/50 hover:text-white/80' : 'text-[#0d0d0d]/60 hover:text-[#0d0d0d]'}`}>
            Sign up for free
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[680px] mx-auto px-[24px] pt-[48px] pb-[60px] flex flex-col items-center">
        {/* Hero */}
        <h1 className={`text-[36px] font-medium leading-[44px] tracking-[-0.5px] text-center mb-[12px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>
          Create anything you can imagine
        </h1>
        <p className={`text-[15px] leading-[22px] tracking-[-0.18px] text-center mb-[32px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>
          Interact with z.ai and explore the boundless creative world
        </p>

        {/* Chat input — BorderBeam sunset only when text is entered */}
        <div className="w-full mb-[16px]">
          <BorderBeam colorVariant="sunset" size="md" theme={dk ? 'dark' : 'light'} active={chatText.length > 0}>
            <div className={`rounded-[16px] border p-[16px] ${
              dk ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-[#e5e5e5] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            }`}>
              <textarea
                placeholder="Chat with z.ai or start creating."
                rows={3}
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className={`w-full resize-none text-[15px] leading-[22px] tracking-[-0.18px] bg-transparent focus:outline-none ${
                  dk ? 'text-white placeholder:text-white/25' : 'text-[#0d0d0d] placeholder:text-[#0d0d0d]/30'
                }`}
              />
              <div className="flex items-center justify-between mt-[8px]">
                <div className="flex items-center gap-[4px]">
                  <button className={`size-[32px] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer ${
                    dk ? 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]'
                  }`}>
                    <Plus className="size-[18px]" />
                  </button>
                  <button className={`size-[32px] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer ${
                    dk ? 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/70 hover:bg-[#0d0d0d]/[0.04]'
                  }`}>
                    <Image className="size-[18px]" />
                  </button>
                </div>
                <button className={`size-[32px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  dk ? 'bg-white text-[#161616] hover:bg-white/90' : 'bg-[#0d0d0d] text-white hover:bg-[#333]'
                }`}>
                  <ArrowUp className="size-[16px]" />
                </button>
              </div>
            </div>
          </BorderBeam>
        </div>

        {/* Feature tags */}
        <div className="flex items-center gap-[8px] mb-[32px] flex-wrap justify-center">
          {featureTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <button
                key={tag.label}
                className={`flex items-center gap-[6px] px-[14px] py-[7px] rounded-full border text-[13px] leading-[18px] tracking-[-0.18px] transition-colors cursor-pointer ${
                  tag.active
                    ? dk ? 'border-white/20 bg-white/[0.08] text-white' : 'border-[#0d0d0d]/20 bg-[#0d0d0d]/[0.04] text-[#0d0d0d]'
                    : dk ? 'border-white/[0.08] text-white/50 hover:border-white/15 hover:bg-white/[0.04]' : 'border-[#e5e5e5] text-[#0d0d0d]/60 hover:border-[#d0d0d0] hover:bg-[#0d0d0d]/[0.02]'
                }`}
              >
                <Icon className="size-[14px]" />
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* IM Cards — no BorderBeam */}
        <div className="w-full grid grid-cols-2 gap-[12px] mb-[32px]">
          {imCards.map((card) => (
            <div
              key={card.name}
              className={`flex items-center gap-[12px] p-[16px] rounded-[12px] border transition-all cursor-pointer ${
                dk
                  ? 'bg-[#1a1a1a] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1e1e1e]'
                  : 'bg-white border-[#e5e5e5] hover:border-[#d0d0d0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="size-[40px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: card.color + '18' }}>
                <div className="size-[20px] rounded-full" style={{ backgroundColor: card.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-medium leading-[20px] tracking-[-0.18px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>{card.name}</p>
                <p className={`text-[12px] leading-[18px] tracking-[-0.18px] truncate ${dk ? 'text-white/35' : 'text-[#0d0d0d]/40'}`}>{card.desc}</p>
              </div>
              {card.status === 'connect' ? (
                <button className={`px-[14px] py-[5px] rounded-[8px] border text-[13px] font-medium transition-colors cursor-pointer shrink-0 ${
                  dk ? 'border-white/[0.12] text-white hover:bg-white/[0.06]' : 'border-[#e5e5e5] text-[#0d0d0d] hover:bg-[#0d0d0d]/[0.04]'
                }`}>
                  Connect
                </button>
              ) : (
                <span className={`text-[13px] tracking-[-0.18px] shrink-0 ${dk ? 'text-white/25' : 'text-[#0d0d0d]/30'}`}>Coming soon</span>
              )}
            </div>
          ))}
        </div>

        {/* Recommendation — no BorderBeam */}
        <div className="w-full">
          <div className="flex items-center gap-[6px] mb-[12px]">
            <Sparkles className={`size-[16px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`} />
            <span className={`text-[14px] font-medium tracking-[-0.18px] ${dk ? 'text-white/40' : 'text-[#0d0d0d]/50'}`}>Get started with IM</span>
          </div>
          <div className={`rounded-[16px] border overflow-hidden transition-all ${
            dk ? 'bg-[#1a1a1a] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-[#e5e5e5] hover:border-[#d0d0d0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          }`}>
            <div className="flex gap-[20px] p-[20px]">
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className={`text-[16px] font-medium leading-[24px] tracking-[-0.18px] mb-[4px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>
                  Best in class demos
                </h3>
                <p className={`text-[13px] leading-[20px] tracking-[-0.18px] mb-[12px] ${dk ? 'text-white/35' : 'text-[#0d0d0d]/40'}`}>
                  Explore top performing examples from our customer showcase
                </p>
                <button className={`text-[13px] transition-colors cursor-pointer self-start underline underline-offset-2 ${
                  dk ? 'text-white/30 hover:text-white/50' : 'text-[#0d0d0d]/40 hover:text-[#0d0d0d]/60'
                }`}>
                  Dismiss
                </button>
              </div>
              <div className={`w-[200px] h-[120px] rounded-[12px] shrink-0 flex items-center justify-center overflow-hidden ${
                dk ? 'bg-gradient-to-br from-[#1e1e2e] to-[#2a1a1a]' : 'bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe]'
              }`}>
                <div className={`w-[160px] h-[100px] rounded-[8px] flex items-center justify-center ${
                  dk ? 'bg-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.3)]' : 'bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                }`}>
                  <div className={`size-[32px] rounded-full flex items-center justify-center ${dk ? 'bg-white/10' : 'bg-[#0d0d0d]/10'}`}>
                    <ArrowUp className={`size-[16px] rotate-45 ${dk ? 'text-white/30' : 'text-[#0d0d0d]/30'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom login */}
        <div className="mt-[32px]">
          <button className={`px-[24px] py-[8px] rounded-[10px] border text-[14px] transition-colors cursor-pointer ${
            dk ? 'border-white/[0.1] text-white/50 hover:bg-white/[0.04]' : 'border-[#e5e5e5] text-[#0d0d0d]/60 hover:bg-[#0d0d0d]/[0.04]'
          }`}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

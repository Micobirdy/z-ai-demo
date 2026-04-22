import { Monitor } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

export function AboutSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';
  const iconMuted = dk ? 'text-white/30' : 'text-[#0d0d0d]/30';

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>About</h1>
      <div className={`h-px mt-[16px] mb-[24px] ${border}`} />

      {/* Logo + social */}
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[28px] h-[28px] rounded-[6px] bg-[#2d2d2d] border-[0.8px] border-white/10 overflow-hidden flex items-center justify-center">
            <img src="/icons/zai-logo.png" alt="Z" className="w-[22px] h-[22px] object-cover" />
          </div>
          <span className={`text-[18px] font-medium leading-[24px] tracking-[-0.18px] ${fg}`}>Z.ai</span>
        </div>
        <div className="flex items-center gap-[12px]">
          <a href="#" className={`${iconMuted} hover:${dk ? 'text-white/60' : 'text-[#0d0d0d]/60'} transition-colors`}>
            <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="#" className={`${iconMuted} hover:${dk ? 'text-white/60' : 'text-[#0d0d0d]/60'} transition-colors`}>
            <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.484 0-.236-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="#" className={`${iconMuted} hover:${dk ? 'text-white/60' : 'text-[#0d0d0d]/60'} transition-colors`}>
            <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" className={`${iconMuted} hover:${dk ? 'text-white/60' : 'text-[#0d0d0d]/60'} transition-colors`}>
            <Monitor className="size-[18px]" />
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="flex gap-[40px]">
        <div className="flex-1">
          <p className={`text-[14px] leading-[22px] tracking-[-0.18px] mb-[16px] ${fgMuted}`}>
            Z.ai is a frontier AI company focused on developing next-generation cognitive large models, with the vision of enabling machines to think like humans. Since 2020, Zai has released multiple families of models–including GLM, ChatGLM, and CogVideox–spanning key domains such as language, vision, multimodality, speech, and AI agents.
          </p>
          <p className={`text-[14px] leading-[22px] tracking-[-0.18px] mb-[24px] ${fgMuted}`}>
            We have open-sourced several flagship models, including GLM-130B (bilingual with 130B parameters), ChatGLM-6B (locally deployable), and GLM-4V-9B (multimodal). These models have been downloaded over 30 million times worldwide. Since 2024, Zai has entered the GLM-4 era, achieving new breakthroughs in reasoning model, multimodal generation, and autonomous AI agents.
          </p>

          <div>
            <p className={`text-[14px] leading-[20px] tracking-[-0.18px] font-medium mb-[4px] ${fg}`}>Feedback Channel</p>
            <p className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fgMuted}`}>user_feedback@z.ai</p>
          </div>
        </div>

        {/* Seal */}
        <div className="shrink-0 flex items-start">
          <div className={`size-[64px] rounded-full flex items-center justify-center ${dk ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <div className={`size-[48px] rounded-full flex items-center justify-center ${dk ? 'bg-red-800/50' : 'bg-red-200'}`}>
              <span className={`text-[16px] font-bold ${dk ? 'text-red-400' : 'text-red-600'}`}>Z</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

const connections = [
  { name: 'Github', icon: '/icons/github.svg', connected: true },
  { name: 'Figma', icon: '/icons/figma.svg', connected: false },
];

export function ConnectorsSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'connections' | 'enabled'>('connections');

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>Connectors</h1>
      <div className={`h-px mt-[16px] ${border}`} />

      {/* Tabs */}
      <div className="flex items-center gap-[24px] mt-[4px]">
        <button
          onClick={() => setActiveTab('connections')}
          className={`py-[12px] text-[14px] leading-[20px] tracking-[-0.18px] transition-colors cursor-pointer border-b-2 ${
            activeTab === 'connections'
              ? `${fg} ${dk ? 'border-white' : 'border-[#0d0d0d]'}`
              : `${fgMuted} border-transparent hover:${dk ? 'text-white/60' : 'text-[#0d0d0d]/70'}`
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setActiveTab('enabled')}
          className={`py-[12px] text-[14px] leading-[20px] tracking-[-0.18px] transition-colors cursor-pointer border-b-2 ${
            activeTab === 'enabled'
              ? `${fg} ${dk ? 'border-white' : 'border-[#0d0d0d]'}`
              : `${fgMuted} border-transparent`
          }`}
        >
          Enabled apps
        </button>
      </div>

      <div className={`h-px ${border}`} />

      {/* Connections list */}
      {activeTab === 'connections' && (
        <div className="flex flex-col">
          {connections.map((conn) => (
            <div key={conn.name} className="flex items-center justify-between py-[20px]">
              <div className="flex items-center gap-[12px]">
                <div className={`size-[32px] rounded-[8px] flex items-center justify-center overflow-hidden ${dk ? 'bg-white/[0.06]' : 'bg-[#f5f5f5]'}`}>
                  {conn.name === 'Github' ? (
                    <svg className="size-[20px]" viewBox="0 0 24 24" fill={dk ? 'white' : '#0d0d0d'}>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  ) : (
                    <svg className="size-[20px]" viewBox="0 0 24 24">
                      <path d="M15.332 8.668a3.333 3.333 0 0 0 0-6.663H12.39v6.663h2.943Z" fill="#A259FF"/>
                      <path d="M8.668 8.668a3.333 3.333 0 0 1 0-6.663h2.943v6.663H8.668Z" fill="#F24E1E"/>
                      <path d="M8.668 15a3.333 3.333 0 0 1 0-6.663h2.943V15H8.668Z" fill="#FF7262"/>
                      <path d="M8.668 21.331a3.333 3.333 0 0 0 3.333-3.332v-3.332H8.668a3.333 3.333 0 0 0 0 6.664Z" fill="#0ACF83"/>
                      <path d="M15.332 15a3.333 3.333 0 1 0 0-6.663 3.333 3.333 0 0 0 0 6.663Z" fill="#1ABCFE"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>{conn.name}</span>
              </div>
              {conn.connected ? (
                <span className={`inline-flex items-center gap-[6px] px-[14px] py-[6px] rounded-[8px] text-[13px] leading-[20px] tracking-[-0.18px] ${dk ? 'bg-[#16a34a]/10 text-[#4ade80]' : 'bg-[#dcfce7] text-[#16a34a]'}`}>
                  <Link2 className="size-[14px]" />
                  Connected
                </span>
              ) : (
                <button className={`px-[14px] py-[6px] rounded-[8px] border text-[13px] leading-[20px] tracking-[-0.18px] transition-colors cursor-pointer ${border} ${fg} ${dk ? 'hover:bg-white/[0.04]' : 'hover:bg-[#0d0d0d]/[0.02]'}`}>
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'enabled' && (
        <div className="flex items-center justify-center py-[60px]">
          <span className={`text-[14px] ${fgMuted}`}>No enabled apps yet</span>
        </div>
      )}
    </div>
  );
}

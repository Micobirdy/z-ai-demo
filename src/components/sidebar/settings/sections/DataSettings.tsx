import { useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export function DataSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [improveModel, setImproveModel] = useState(true);

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>Data & Privacy</h1>
      <div className={`h-px mt-[16px] mb-[24px] ${border}`} />

      {/* Improve Model */}
      <div className="flex items-start justify-between py-[16px] gap-[40px]">
        <div className="flex-1">
          <span className={`text-[14px] leading-[20px] tracking-[-0.18px] font-medium block mb-[8px] ${fg}`}>Improve Model</span>
          <p className={`text-[13px] leading-[20px] tracking-[-0.18px] ${fgMuted}`}>
            By sharing your data to train our model, you can help improve your own experience and the quality of all users' models. We take measures to ensure your privacy is protected throughout the process.
          </p>
        </div>
        <Switch
          checked={improveModel}
          onCheckedChange={setImproveModel}
        />
      </div>

      {/* Import data */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Import data</span>
        <Button variant="outline" className={`text-[14px] ${dk ? 'border-white/[0.08] text-white hover:bg-white/[0.04]' : ''}`}>
          Import data
        </Button>
      </div>

      {/* Export data */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Export data</span>
        <Button variant="outline" className={`text-[14px] ${dk ? 'border-white/[0.08] text-white hover:bg-white/[0.04]' : ''}`}>
          Export data
        </Button>
      </div>
    </div>
  );
}

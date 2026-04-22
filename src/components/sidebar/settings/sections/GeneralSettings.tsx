import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

export function GeneralSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [appearance, setAppearance] = useState('system');
  const [language, setLanguage] = useState('en-us');
  const [timezone, setTimezone] = useState('gmt+3');

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';
  const selectBg = dk ? 'bg-white/[0.04]' : 'bg-white';

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>General</h1>
      <div className={`h-px mt-[16px] mb-[24px] ${border}`} />

      <SettingRow label="Appearance" dk={dk}>
        <SelectBox value={appearance} onChange={setAppearance} dk={dk} selectBg={selectBg} border={border} fg={fg}>
          <option value="system">System Mode</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </SelectBox>
      </SettingRow>

      <SettingRow label="Language" dk={dk}>
        <SelectBox value={language} onChange={setLanguage} dk={dk} selectBg={selectBg} border={border} fg={fg}>
          <option value="en-us">English (US)</option>
          <option value="zh-cn">Chinese (Simplified)</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
        </SelectBox>
      </SettingRow>

      <SettingRow label="Time zone" dk={dk}>
        <SelectBox value={timezone} onChange={setTimezone} dk={dk} selectBg={selectBg} border={border} fg={fg}>
          <option value="gmt+8">{"(GMT+8:00) Beijing"}</option>
          <option value="gmt+3">{"(GMT+3:00) Istanbul"}</option>
          <option value="gmt+0">{"(GMT+0:00) London"}</option>
          <option value="gmt-5">{"(GMT-5:00) New York"}</option>
          <option value="gmt-8">{"(GMT-8:00) Los Angeles"}</option>
        </SelectBox>
      </SettingRow>
    </div>
  );
}

function SettingRow({ label, dk, children }: { label: string; dk: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-[16px]">
      <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${dk ? 'text-white' : 'text-[#0d0d0d]'}`}>{label}</span>
      {children}
    </div>
  );
}

function SelectBox({ value, onChange, dk, selectBg, border, fg, children }: {
  value: string; onChange: (v: string) => void; dk: boolean; selectBg: string; border: string; fg: string; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-[240px] pl-[14px] pr-[36px] py-[8px] rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] cursor-pointer focus:outline-none transition-colors ${selectBg} ${border} ${fg} ${dk ? 'hover:bg-white/[0.06]' : 'hover:bg-[#0d0d0d]/[0.02]'}`}
      >
        {children}
      </select>
      <ChevronDown className={`absolute right-[12px] top-1/2 -translate-y-1/2 size-[14px] pointer-events-none ${dk ? 'text-white/30' : 'text-[#0d0d0d]/30'}`} />
    </div>
  );
}

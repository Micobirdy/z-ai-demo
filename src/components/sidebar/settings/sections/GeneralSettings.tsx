import { useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GeneralSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [appearance, setAppearance] = useState('system');
  const [language, setLanguage] = useState('en-us');
  const [timezone, setTimezone] = useState('gmt+3');

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';

  const triggerClass = `w-[320px] h-9 px-3 rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] cursor-pointer transition-colors ${
    dk
      ? 'border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/[0.06]'
      : 'border-[#e5e5e5] bg-white text-[#0d0d0d] hover:bg-[#0d0d0d]/[0.02]'
  }`;

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>General</h1>
      <div className={`h-px mt-[16px] mb-[24px] ${border}`} />

      <SettingRow label="Appearance" dk={dk}>
        <Select value={appearance} onValueChange={setAppearance}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="system">System Mode</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Language" dk={dk}>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="en-us">English (US)</SelectItem>
            <SelectItem value="zh-cn">Chinese (Simplified)</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Time zone" dk={dk}>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="gmt+3">{"(GMT+3:00)  Istanbul"}</SelectItem>
            <SelectItem value="gmt-8">{"(UTC-8)  Pacific Time"}</SelectItem>
            <SelectItem value="gmt-5">{"(UTC-5)  Eastern Time"}</SelectItem>
            <SelectItem value="gmt+0">{"(GMT+0:00)  London"}</SelectItem>
            <SelectItem value="gmt+8">{"(GMT+8:00)  Beijing"}</SelectItem>
            <SelectItem value="auto">{"Time zone - Autodetect"}</SelectItem>
          </SelectContent>
        </Select>
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

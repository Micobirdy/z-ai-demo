import { useState } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DashboardSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';
  const [defaultView, setDefaultView] = useState('grid');

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgSub = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';

  const triggerClass = `w-[200px] h-9 px-3 rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] cursor-pointer transition-colors ${
    dk
      ? 'border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/[0.06]'
      : 'border-[#e5e5e5] bg-white text-[#0d0d0d] hover:bg-[#0d0d0d]/[0.02]'
  }`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[13px] font-medium ${fg}`}>Show recent activity</p>
          <p className={`text-[12px] ${fgSub}`}>Display recent items on the dashboard</p>
        </div>
        <ToggleSwitch defaultChecked dk={dk} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[13px] font-medium ${fg}`}>Compact view</p>
          <p className={`text-[12px] ${fgSub}`}>Use a denser layout for lists</p>
        </div>
        <ToggleSwitch dk={dk} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Default view</span>
        <Select value={defaultView} onValueChange={setDefaultView}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false, dk = false }: { defaultChecked?: boolean; dk?: boolean }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className={`h-5 w-9 rounded-full transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4 ${
        dk
          ? 'bg-white/[0.15] peer-checked:bg-blue-500'
          : 'bg-stone-300 peer-checked:bg-[#0d0d0d]'
      }`} />
    </label>
  );
}

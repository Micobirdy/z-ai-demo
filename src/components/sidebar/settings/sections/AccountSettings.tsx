import { useSidebar } from '@/hooks/useSidebar';

export function AccountSettings() {
  const { theme } = useSidebar();
  const dk = theme === 'dark';

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';
  const inputBg = dk ? 'bg-white/[0.04]' : 'bg-white';

  return (
    <div className="flex flex-col">
      <h1 className={`text-[24px] font-bold leading-[32px] tracking-[-0.18px] mb-[4px] ${fg}`} style={{ fontFamily: "'Iowan Old Style BT', 'Georgia', serif" }}>Account</h1>
      <div className={`h-px mt-[16px] mb-[24px] ${border}`} />

      {/* Name */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Name</span>
        <div className="flex items-center gap-[12px]">
          <div className="size-[32px] rounded-full overflow-hidden bg-[#ccc] shrink-0">
            <img src="/icons/avatar.png" alt="" className="size-full object-cover" />
          </div>
          <input
            type="text"
            defaultValue="Mico Yun"
            className={`px-[14px] py-[8px] rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] focus:outline-none transition-colors ${inputBg} ${border} ${fg} ${dk ? 'focus:border-white/20' : 'focus:border-[#bbb]'}`}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Email</span>
        <input
          type="email"
          defaultValue="mke553852@gmail.com"
          className={`px-[14px] py-[8px] rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] focus:outline-none transition-colors ${inputBg} ${border} ${fgMuted} ${dk ? 'focus:border-white/20' : 'focus:border-[#bbb]'}`}
          readOnly
        />
      </div>

      {/* Delete account */}
      <div className="flex items-center justify-between py-[16px]">
        <div>
          <span className={`text-[14px] leading-[20px] tracking-[-0.18px] block ${fg}`}>Delete your account</span>
          <span className={`text-[13px] leading-[20px] tracking-[-0.18px] ${fgMuted}`}>This will delete your account and all data.</span>
        </div>
        <button className="px-[14px] py-[8px] rounded-[8px] border border-red-300 text-[14px] leading-[20px] tracking-[-0.18px] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer">
          Delete account
        </button>
      </div>
    </div>
  );
}

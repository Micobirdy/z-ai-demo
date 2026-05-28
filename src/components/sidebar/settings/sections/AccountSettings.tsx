import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function AccountSettings() {
  const { theme } = useSidebar();
  const { user, logout } = useAuth();
  const dk = theme === 'dark';

  const fg = dk ? 'text-white' : 'text-[#0d0d0d]';
  const fgMuted = dk ? 'text-white/40' : 'text-[#0d0d0d]/50';
  const border = dk ? 'border-white/[0.08]' : 'border-[#e5e5e5]';
  const inputClass = `px-[14px] py-[8px] rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] transition-all outline-none ${
    dk
      ? 'bg-white/[0.04] border-white/[0.08] text-white focus:border-white/20 focus:ring-2 focus:ring-white/10'
      : 'bg-white border-[#e5e5e5] text-[#0d0d0d] focus:border-[#bbb] focus:ring-2 focus:ring-[#0d0d0d]/5'
  }`;

  return (
    <div className="flex flex-col">
      {/* Name */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Name</span>
        <div className="flex items-center gap-[12px]">
          <div className="size-[32px] rounded-full overflow-hidden bg-[#ccc] shrink-0 flex items-center justify-center text-[14px] font-medium text-white"
            style={{ backgroundColor: user?.avatar ? undefined : '#6366f1' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" className="size-full object-cover" />
              : user?.name?.charAt(0).toUpperCase() || 'U'
            }
          </div>
          <input type="text" defaultValue={user?.name || ''} className={inputClass} />
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Email</span>
        <input type="email" defaultValue={user?.email || ''} readOnly
          className={`px-[14px] py-[8px] rounded-[8px] border text-[14px] leading-[20px] tracking-[-0.18px] outline-none ${
            dk ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-white border-[#e5e5e5]'
          } ${fgMuted} cursor-not-allowed`}
        />
      </div>

      {/* Plan */}
      <div className="flex items-center justify-between py-[16px]">
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fg}`}>Plan</span>
        <span className={`text-[14px] leading-[20px] tracking-[-0.18px] ${fgMuted} capitalize`}>{user?.plan || 'free'}</span>
      </div>

      <div className={`h-px my-[8px] ${border}`} />

      {/* Logout */}
      <div className="flex items-center justify-between py-[16px]">
        <div>
          <span className={`text-[14px] leading-[20px] tracking-[-0.18px] block ${fg}`}>Log out</span>
          <span className={`text-[13px] leading-[20px] tracking-[-0.18px] ${fgMuted}`}>Sign out of your account on this device.</span>
        </div>
        <Button variant="outline" className="text-[14px] gap-2" onClick={logout}>
          <LogOut className="size-[14px]" />
          Log out
        </Button>
      </div>

      <div className={`h-px my-[8px] ${border}`} />

      {/* Delete account */}
      <div className="flex items-center justify-between py-[16px]">
        <div>
          <span className={`text-[14px] leading-[20px] tracking-[-0.18px] block ${fg}`}>Delete your account</span>
          <span className={`text-[13px] leading-[20px] tracking-[-0.18px] ${fgMuted}`}>This will delete your account and all data.</span>
        </div>
        <Button variant="destructive" className="text-[14px]">
          Delete account
        </Button>
      </div>
    </div>
  );
}

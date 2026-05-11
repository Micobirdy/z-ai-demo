import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <div className="w-[48px] h-[48px] rounded-[12px] bg-[#2d2d2d] border border-white/10 overflow-hidden flex items-center justify-center mb-8">
          <img src="/icons/zai-logo.png" alt="Z" className="w-[32px] h-[32px] object-cover" />
        </div>

        {/* Title */}
        <h1 className="text-[28px] leading-[36px] tracking-[-0.5px] text-text-primary mb-2 text-center"
          style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", Georgia, serif' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-[14px] leading-[20px] text-text-tertiary mb-8 text-center"
          style={{ fontFamily: "'Geist', sans-serif" }}>
          {mode === 'login'
            ? 'Log in to your Z.ai account to continue'
            : 'Sign up to start creating with Z.ai'
          }
        </p>

        {/* Third-party buttons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <SocialButton icon="google" label="Continue with Google" />
          <SocialButton icon="apple" label="Continue with Apple" />
          <SocialButton icon="github" label="Continue with GitHub" />
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-[12px] text-text-tertiary uppercase tracking-wider" style={{ fontFamily: "'Geist', sans-serif" }}>or</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full h-11 px-3.5 rounded-[10px] border text-[14px] leading-[20px] outline-none transition-all",
                "bg-bg-bg border-border-default text-text-primary placeholder:text-text-placeholder",
                "focus:border-border-strong focus:ring-2 focus:ring-border-default"
              )}
              style={{ fontFamily: "'Geist', sans-serif" }}
              autoComplete="name"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full h-11 px-3.5 rounded-[10px] border text-[14px] leading-[20px] outline-none transition-all",
              "bg-bg-bg border-border-default text-text-primary placeholder:text-text-placeholder",
              "focus:border-border-strong focus:ring-2 focus:ring-border-default"
            )}
            style={{ fontFamily: "'Geist', sans-serif" }}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={cn(
              "w-full h-11 px-3.5 rounded-[10px] border text-[14px] leading-[20px] outline-none transition-all",
              "bg-bg-bg border-border-default text-text-primary placeholder:text-text-placeholder",
              "focus:border-border-strong focus:ring-2 focus:ring-border-default"
            )}
            style={{ fontFamily: "'Geist', sans-serif" }}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />

          {error && (
            <p className="text-[13px] leading-[18px] text-accent-red px-1" style={{ fontFamily: "'Geist', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-11 rounded-[10px] text-[14px] font-medium leading-[20px] transition-all duration-160 cursor-pointer",
              "bg-interactive-primary text-text-inverted",
              "hover:opacity-90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="mt-6 text-[13px] leading-[20px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={switchMode}
            className="text-text-accent font-medium hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        {/* Terms */}
        <p className="mt-4 text-[11px] leading-[16px] text-text-tertiary text-center max-w-[320px]" style={{ fontFamily: "'Geist', sans-serif" }}>
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, JSX.Element> = {
    google: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
    ),
    apple: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="text-text-primary">
        <path d="M14.94 9.63c-.023-2.174 1.773-3.22 1.853-3.27-1.008-1.477-2.58-1.68-3.14-1.703-1.336-.135-2.608.787-3.287.787-.678 0-1.726-.767-2.836-.747-1.46.022-2.805.849-3.557 2.157-1.516 2.632-.388 6.53 1.09 8.666.722 1.044 1.583 2.218 2.714 2.176 1.088-.044 1.5-.705 2.816-.705 1.315 0 1.684.705 2.832.683 1.172-.022 1.91-1.064 2.627-2.112.829-1.212 1.17-2.385 1.19-2.446-.026-.012-2.283-.876-2.306-3.476z"/>
        <path d="M12.744 3.15c.6-.728.005-1.72.843-2.58-.862.035-1.906.574-2.524 1.298-.554.641-1.04 1.665-.909 2.648.964.075 1.949-.489 2.59-1.366z"/>
      </svg>
    ),
    github: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="text-text-primary">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.027 0 0 4.03 0 9.003c0 3.978 2.579 7.352 6.155 8.545.45.082.615-.195.615-.434 0-.214-.008-.78-.012-1.531-2.504.544-3.032-1.207-3.032-1.207-.41-1.04-1-1.317-1-1.317-.816-.558.062-.547.062-.547.903.063 1.378.927 1.378.927.803 1.375 2.106.978 2.62.748.081-.582.314-.978.571-1.203-1.999-.227-4.1-1-4.1-4.449 0-.983.351-1.786.927-2.416-.093-.228-.402-1.143.088-2.383 0 0 .756-.242 2.475.923A8.63 8.63 0 019 4.352c.765.004 1.535.103 2.254.303 1.718-1.165 2.472-.923 2.472-.923.492 1.24.183 2.155.09 2.383.577.63.926 1.433.926 2.416 0 3.458-2.104 4.219-4.11 4.441.323.278.61.828.61 1.668 0 1.203-.011 2.175-.011 2.472 0 .241.162.521.619.433C15.425 16.352 18 12.978 18 9.003 18 4.03 13.97 0 9 0z"/>
      </svg>
    ),
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full h-11 rounded-[10px] border flex items-center justify-center gap-3 text-[14px] font-medium leading-[20px] transition-all duration-160 cursor-pointer",
        "border-border-default text-text-primary bg-bg-bg",
        "hover:bg-bg-hover active:scale-[0.98]"
      )}
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {icons[icon]}
      {label}
    </button>
  );
}

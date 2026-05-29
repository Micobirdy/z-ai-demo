import { PixelCanvas } from '@/components/ui/pixel-canvas';

const LOGOS = [
  { name: 'Slack', colors: ['#2FBDEE', '#29AD72', '#E9A929', '#DC1C50'] },
  { name: 'Stripe', colors: ['#635BFF', '#635BFF', '#635BFF'] },
  { name: 'Medium', colors: ['#000000', '#333333', '#666666'] },
  { name: 'Mailchimp', colors: ['#FFE01B', '#241C15', '#FFE01B'] },
  { name: 'Netflix', colors: ['#E50914', '#B20710', '#E50914'] },
  { name: 'Google', colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'] },
  { name: 'LinkedIn', colors: ['#0A66C2', '#0A66C2', '#0A66C2'] },
  { name: 'Microsoft', colors: ['#F25022', '#7FBA00', '#00A4EF', '#FFB900'] },
  { name: 'Airbnb', colors: ['#FF5A5F', '#FF5A5F', '#FF385C'] },
  { name: 'Spotify', colors: ['#1DB954', '#1ED760', '#1DB954'] },
  { name: 'Facebook', colors: ['#1877F2', '#1877F2', '#1877F2'] },
  { name: 'PayPal', colors: ['#003087', '#009CDE', '#003087'] },
  { name: 'Reddit', colors: ['#FF4500', '#FF4500', '#FF5700'] },
  { name: 'Lemon Squeezy', colors: ['#FFC233', '#FF6B00', '#FFC233'] },
];

export function ClientLogos() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 mt-12">
        {/* Logo grid */}
        <div className="grid grid-cols-5 border border-border-default rounded-[12px] overflow-hidden">
          {LOGOS.slice(0, 5).map(logo => (
            <LogoCard key={logo.name} name={logo.name} colors={logo.colors} />
          ))}
          <LogoCard name="Google" colors={LOGOS[5].colors} />
          <div className="col-span-3 border-t border-l border-border-default flex flex-col items-center justify-center py-10 gap-3 relative">
            <span className="px-4 py-1.5 rounded-full border border-border-default text-[13px] text-text-tertiary bg-bg-bg z-10" style={{ fontFamily: "'Geist', sans-serif" }}>
              Our clients
            </span>
            <h2 className="text-[28px] font-bold leading-[36px] text-text-primary text-center z-10" style={{ fontFamily: "'Geist', sans-serif" }}>
              Trusted by top brands across<br />different sectors
            </h2>
          </div>
          <LogoCard name="Microsoft" colors={LOGOS[7].colors} borderTop />
          <LogoCard name="LinkedIn" colors={LOGOS[6].colors} />
          <div className="col-span-3 border-t border-l border-border-default" />
          <LogoCard name="Airbnb" colors={LOGOS[8].colors} borderTop />
          {['Spotify', 'Facebook', 'PayPal', 'Reddit', 'Lemon Squeezy'].map((name, i) => {
            const logo = LOGOS.find(l => l.name === name)!;
            return <LogoCard key={name} name={name} colors={logo.colors} borderTop />;
          })}
        </div>
    </div>
  );
}

function LogoCard({ name, colors, borderTop }: { name: string; colors: string[]; borderTop?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center py-8 border-l border-border-default first:border-l-0 ${borderTop ? 'border-t' : ''} cursor-pointer group`}>
      <PixelCanvas colors={colors} gap={6} speed={35} />
      <span className="text-[14px] font-medium text-text-tertiary z-10 transition-opacity group-hover:opacity-60" style={{ fontFamily: "'Geist', sans-serif" }}>
        {name === 'Lemon Squeezy' ? '🍋 lemon squeezy' : name === 'Spotify' ? '🎵 Spotify' : name === 'Facebook' ? 'facebook' : name === 'PayPal' ? '💳 PayPal' : name === 'Reddit' ? '🤖 reddit' : name === 'LinkedIn' ? `LinkedIn` : name === 'Microsoft' ? '⊞ Microsoft' : name === 'Airbnb' ? '🏠 airbnb' : name}
      </span>
    </div>
  );
}

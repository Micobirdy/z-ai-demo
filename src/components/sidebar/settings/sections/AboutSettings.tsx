export function AboutSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-1">
          Version
        </p>
        <p className="text-[13px] text-stone-700">1.0.0</p>
      </div>
      <div>
        <p className="text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-1">
          Build
        </p>
        <p className="text-[13px] text-stone-700">2026.04.19</p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <a
          href="#"
          className="text-[13px] text-amber-600 hover:text-amber-700 hover:underline"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="text-[13px] text-amber-600 hover:text-amber-700 hover:underline"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-[13px] text-amber-600 hover:text-amber-700 hover:underline"
        >
          Documentation
        </a>
      </div>
    </div>
  );
}

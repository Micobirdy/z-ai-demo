export function AccountSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Name
        </label>
        <input
          type="text"
          defaultValue="Mico Yun"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          defaultValue="mico@example.com"
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Plan
        </label>
        <div className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2">
          <span className="text-[13px] text-stone-700">Free</span>
          <button
            type="button"
            className="text-[12px] font-medium text-amber-600 hover:text-amber-700"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

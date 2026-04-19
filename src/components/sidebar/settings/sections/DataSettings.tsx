export function DataSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Usage Analytics</p>
          <p className="text-[12px] text-stone-400">Allow anonymous usage data</p>
        </div>
        <ToggleSwitch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Training Data</p>
          <p className="text-[12px] text-stone-400">Allow conversations for model training</p>
        </div>
        <ToggleSwitch />
      </div>

      <div className="border-t border-stone-100 pt-4">
        <p className="text-[12px] font-medium text-stone-500 uppercase tracking-wider mb-3">
          Data Management
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg border border-stone-200 px-3 py-2 text-left text-[13px] text-stone-600 transition-colors hover:bg-stone-50"
          >
            Export conversations
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 px-3 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-50"
          >
            Delete all data
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="h-5 w-9 rounded-full bg-stone-300 peer-checked:bg-amber-600 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}

export function DashboardSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Show recent activity</p>
          <p className="text-[12px] text-stone-400">Display recent items on the dashboard</p>
        </div>
        <ToggleSwitch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Compact view</p>
          <p className="text-[12px] text-stone-400">Use a denser layout for lists</p>
        </div>
        <ToggleSwitch />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Default view
        </label>
        <select className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none">
          <option>Grid</option>
          <option>List</option>
        </select>
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

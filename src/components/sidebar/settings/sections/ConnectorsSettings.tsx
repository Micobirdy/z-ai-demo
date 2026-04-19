import { Plus } from 'lucide-react';

const connectors = [
  { name: 'Slack', status: 'Connected', connected: true },
  { name: 'GitHub', status: 'Connected', connected: true },
  { name: 'Notion', status: 'Not connected', connected: false },
];

export function ConnectorsSettings() {
  return (
    <div className="flex flex-col gap-4">
      {connectors.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2.5"
        >
          <div>
            <p className="text-[13px] font-medium text-stone-700">{c.name}</p>
            <p className="text-[12px] text-stone-400">{c.status}</p>
          </div>
          <button
            type="button"
            className={`text-[12px] font-medium ${
              c.connected
                ? 'text-red-500 hover:text-red-600'
                : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            {c.connected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-2.5 text-[13px] text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-600"
      >
        <Plus className="h-3.5 w-3.5" />
        Add connector
      </button>
    </div>
  );
}

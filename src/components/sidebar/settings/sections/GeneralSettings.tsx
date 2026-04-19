import { useState } from 'react';

export function GeneralSettings() {
  const [model, setModel] = useState('claude-4-sonnet');
  const [language, setLanguage] = useState('en');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Default Model
        </label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none"
        >
          <option value="claude-4-opus">Claude 4 Opus</option>
          <option value="claude-4-sonnet">Claude 4 Sonnet</option>
          <option value="claude-4-haiku">Claude 4 Haiku</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-medium text-stone-500 uppercase tracking-wider">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-[13px] text-stone-900 focus:border-stone-400 focus:outline-none"
        >
          <option value="en">English</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Auto-save chats</p>
          <p className="text-[12px] text-stone-400">Automatically save conversations</p>
        </div>
        <ToggleSwitch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-stone-700">Show suggestions</p>
          <p className="text-[12px] text-stone-400">Display quick action suggestions</p>
        </div>
        <ToggleSwitch defaultChecked />
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

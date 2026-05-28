import { useState } from 'react';
import { MoreHorizontal, FolderOpen, ExternalLink } from 'lucide-react';

const STORAGE = { used: 0.8, total: 2, percent: 15 };

const SECTIONS = [
  {
    title: 'Design systems and scalability',
    files: [
      { name: 'Number of Instructions.zip', time: '1 hour', size: '6.85MB', preview: 'ppt-1' },
      { name: 'Number of Instruction.zip', time: '4 hour', size: '5.23MB', preview: 'paper' },
      { name: 'Number of Instructions.zip', time: '10 hour', size: '5.23MB', preview: null },
    ],
  },
  {
    title: '高级摄影作品集设计指南',
    files: [
      { name: 'Number of Instructions.png', time: '4 hour', size: '5.23MB', preview: 'workflow' },
    ],
  },
  {
    title: 'Onboarding teams to design',
    files: [
      { name: 'Number of Instructions.png', time: '4 hour', size: '5.23MB', preview: null },
    ],
  },
];

function FilePreview({ type }: { type: string | null }) {
  if (type === 'ppt-1') {
    return (
      <div className="w-full h-full bg-white flex flex-col p-3 gap-1">
        <div className="flex items-center gap-1">
          <div className="w-[12px] h-[12px] rounded-[2px] bg-blue-600 flex items-center justify-center">
            <span className="text-[4px] text-white font-bold">IC</span>
          </div>
          <span className="text-[5px] text-gray-400" style={{ fontFamily: "'Geist', sans-serif" }}>デジタルマーケティング研究所</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          <div className="text-[11px] font-bold leading-[14px]" style={{ color: '#2563eb', fontFamily: "'Geist', sans-serif" }}>マーケティング</div>
          <div className="text-[11px] font-bold leading-[14px]" style={{ color: '#2563eb', fontFamily: "'Geist', sans-serif" }}>戦略  2025</div>
          <div className="h-[10px] w-[70%] rounded-[1px] bg-blue-600 flex items-center px-1 mt-0.5">
            <span className="text-[4px] text-white font-medium" style={{ fontFamily: "'Geist', sans-serif" }}>プレゼンテーション</span>
          </div>
          <span className="text-[5px] text-gray-400 mt-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>成功へのデジタルロードマップ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[4px] text-gray-300" style={{ fontFamily: "'Geist', sans-serif" }}>佐藤 健太</span>
          <div className="flex items-center gap-0.5">
            <div className="w-[6px] h-[6px] rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-[3px] h-[3px] rounded-full bg-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'paper') {
    return (
      <div className="w-full h-full bg-white flex flex-col p-3 gap-1.5">
        <div className="text-[6px] font-bold text-gray-800 leading-[8px] text-center uppercase" style={{ fontFamily: "'Geist', sans-serif" }}>
          DeepThinkVLA: Enhancing Reasoning Capability of Vision-Language-Action Models
        </div>
        <div className="flex flex-col gap-0.5 items-center">
          <div className="text-[4px] text-gray-500 text-center" style={{ fontFamily: "'Geist', sans-serif" }}>
            Cheng Fei¹ · Yuntai Liu¹ · Wang Xu² · Xiaoyu Tian³ · Yingyud Feng²
          </div>
          <div className="text-[3.5px] text-gray-400 text-center" style={{ fontFamily: "'Geist', sans-serif" }}>
            ¹The School of Information Science and Engineering, Shandong University of Science and Technology
          </div>
        </div>
        <div className="mt-1">
          <div className="text-[5px] font-bold text-gray-700 mb-0.5" style={{ fontFamily: "'Geist', sans-serif" }}>ABSTRACT</div>
          <div className="flex flex-col gap-[2px]">
            {[85, 92, 78, 88, 70, 82, 75].map((w, i) => (
              <div key={i} className="h-[2px] rounded-[1px] bg-gray-200" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'workflow') {
    return (
      <div className="w-full h-full bg-[#f5f0eb] flex flex-col p-3 justify-between">
        <div className="flex items-center gap-1">
          <div className="w-[8px] h-[8px] rounded-full bg-gray-800" />
          <span className="text-[5px] text-gray-500" style={{ fontFamily: "'Geist', sans-serif" }}>Productivity</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[12px] font-bold text-gray-900 leading-[15px]" style={{ fontFamily: "'Geist', sans-serif" }}>Workflow Automation</div>
          <div className="text-[12px] font-bold text-gray-900 leading-[15px]" style={{ fontFamily: "'Geist', sans-serif" }}>for Modern Teams</div>
        </div>
        <div className="flex items-end gap-[3px]">
          {[
            { label: '20 Mon', h: 25 },
            { label: '98%', h: 55 },
            { label: '300%', h: 40 },
            { label: '5+', h: 20 },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-[2px] flex-1">
              <span className="text-[4px] text-gray-500" style={{ fontFamily: "'Geist', sans-serif" }}>{bar.label}</span>
              <div className="w-full rounded-t-[2px]" style={{ height: `${bar.h}%`, backgroundColor: i === 1 ? '#1a1a1a' : '#d1ccc6' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-bg-surface flex items-center justify-center">
      <FolderOpen className="size-[24px] text-icon-tertiary opacity-40" />
    </div>
  );
}

export function FolderPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-bg-page" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,0.2) transparent' }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12 py-8">
        {/* Title */}
        <h1
          className="text-[24px] font-bold leading-[32px] text-text-primary mb-6"
          style={{ fontFamily: '"Iowan Old Style BT", "Iowan Old Style", Georgia, serif' }}
        >
          Folder
        </h1>

        {/* Storage bar */}
        <div className="rounded-[12px] border border-border-default bg-bg-bg p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold text-text-primary" style={{ fontFamily: "'Geist', sans-serif" }}>Free</span>
              <span className="text-[14px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>/ {STORAGE.total}GB</span>
            </div>
            <button className="h-[32px] px-3 rounded-[6px] bg-interactive-primary text-[13px] font-medium text-text-inverted hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5" style={{ fontFamily: "'Geist', sans-serif" }}>
              Upgrade
              <ExternalLink className="size-[12px]" />
            </button>
          </div>
          <div className="relative h-[6px] rounded-full bg-bg-surface overflow-hidden mb-2">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-text-primary transition-all duration-500"
              style={{ width: `${STORAGE.percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>
              Storage used: {STORAGE.used} GB / {STORAGE.total} GB ({STORAGE.percent}%)
            </span>
            <span className="text-[12px] text-text-tertiary tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>
              {STORAGE.percent}%
            </span>
          </div>
        </div>

        {/* File sections */}
        <div className="flex flex-col gap-8">
          {SECTIONS.map((section, si) => (
            <div key={si}>
              <h2 className="text-[15px] font-semibold text-text-primary mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.files.map((file, fi) => (
                  <FileCard key={fi} file={file} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file }: { file: { name: string; time: string; size: string; preview: string | null } }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-[10px] border border-border-default bg-bg-bg overflow-hidden transition-all hover:shadow-md hover:border-border-strong cursor-pointer group">
      {/* Preview */}
      <div className="aspect-[4/3] overflow-hidden border-b border-border-default">
        <FilePreview type={file.preview} />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-text-primary leading-5 truncate" style={{ fontFamily: "'Geist', sans-serif" }}>
            {file.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] text-text-tertiary" style={{ fontFamily: "'Geist', sans-serif" }}>{file.time}</span>
            <span className="text-[12px] text-text-tertiary tabular-nums" style={{ fontFamily: "'Geist', sans-serif" }}>{file.size}</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-bg-surface transition-all cursor-pointer"
          >
            <MoreHorizontal className="size-[16px] text-icon-tertiary" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-[140px] z-50 bg-bg-bg rounded-[8px] border border-border-default shadow-lg overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                {['Download', 'Rename', 'Move', 'Delete'].map(action => (
                  <button
                    key={action}
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-3 py-2 text-left text-[13px] text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

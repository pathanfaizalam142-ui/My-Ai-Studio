import React from 'react';
import { STYLE_PRESETS } from '../data/presets';
import { StyleId, StylePreset } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { playCassetteClick, playSynthChime } from '../utils/audio';

interface PresetSelectorProps {
  selectedPresetId: StyleId;
  onSelectPreset: (preset: StylePreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
}) => {
  const handleSelect = (preset: StylePreset) => {
    onSelectPreset(preset);
    playSynthChime();
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Select 80s Archetype</span>
        </label>
        <span className="text-[11px] font-mono text-slate-500">
          5 ICONIC STYLES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              onClick={() => handleSelect(preset)}
              className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all group overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 to-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top Accent Pill */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  '{preset.year.slice(2)}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                )}
              </div>

              {/* Thumbnail representation */}
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-slate-950 border border-slate-800 relative">
                <img
                  src={preset.sampleTransformed}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1 text-[9px] font-bold tracking-tight text-white font-mono px-1 py-0.5 rounded bg-slate-950/70">
                  {preset.badge}
                </span>
              </div>

              {/* Title & Tagline */}
              <h4 className="text-xs font-bold text-slate-200 line-clamp-1 font-retro tracking-wide">
                {preset.name}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1 font-mono mt-0.5">
                {preset.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

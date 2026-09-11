import React from 'react';
import { STYLE_PRESETS } from '../data/presets';
import { StylePreset } from '../types';
import { Sparkles, ArrowRight, Camera, Tv } from 'lucide-react';
import { playCassetteClick, playSynthChime } from '../utils/audio';

interface ArchetypeGalleryProps {
  onSelectPreset: (preset: StylePreset) => void;
  onGoToStudio: () => void;
}

export const ArchetypeGallery: React.FC<ArchetypeGalleryProps> = ({
  onSelectPreset,
  onGoToStudio,
}) => {
  const handleApply = (preset: StylePreset) => {
    onSelectPreset(preset);
    playSynthChime();
    onGoToStudio();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col gap-6">
      {/* Intro Hero banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          THE 1980S STYLE ARCHIVES
        </span>
        <h2 className="text-2xl sm:text-3xl font-retro text-slate-100 mt-2 tracking-wide">
          Iconic 80s Visual Movements
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore the authentic cinematography, fashion silhouettes, and lighting setups that defined the greatest decade in pop culture.
        </p>
      </div>

      {/* Grid of Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STYLE_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-rose-500/50 transition-all group shadow-xl hover:shadow-rose-950/30"
          >
            {/* Image Preview with 80s Badge */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
              <img
                src={preset.sampleTransformed}
                alt={preset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-700 text-xs font-mono font-bold text-yellow-300">
                {preset.year}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                  {preset.badge}
                </span>
              </div>
            </div>

            {/* Description & Details */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-retro text-slate-100 tracking-wide">
                  {preset.name}
                </h3>
                <p className="text-xs text-rose-400 font-mono mt-0.5">
                  {preset.tagline}
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleApply(preset)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold font-retro tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
              >
                <span>APPLY THIS 80s LOOK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

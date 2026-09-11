import React, { useState } from 'react';
import { FilterSettings, FrameType } from '../types';
import { RETRO_STICKERS } from '../data/presets';
import { Sliders, Tv, Film, Image as ImageIcon, RotateCcw, Sparkles } from 'lucide-react';
import { playCassetteClick } from '../utils/audio';

interface FXControlsProps {
  filters: FilterSettings;
  onChange: (updated: FilterSettings) => void;
  onReset: () => void;
}

export const FXControls: React.FC<FXControlsProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const [activeCategory, setActiveCategory] = useState<'tone' | 'analog' | 'frame'>('tone');

  const update = <K extends keyof FilterSettings>(key: K, value: FilterSettings[K]) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const frames: { id: FrameType; label: string }[] = [
    { id: 'none', label: 'No Frame' },
    { id: 'polaroid', label: 'Polaroid Instant' },
    { id: 'laser_grid', label: 'Laser Grid' },
    { id: 'vhs_screen', label: 'CRT Screen' },
    { id: 'neon_border', label: 'Neon Cyber' },
  ];

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
      {/* Console Topbar & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveCategory('tone'); playCassetteClick(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'tone'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Film Tone</span>
          </button>

          <button
            onClick={() => { setActiveCategory('analog'); playCassetteClick(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'analog'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Analog & Glitch</span>
          </button>

          <button
            onClick={() => { setActiveCategory('frame'); playCassetteClick(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'frame'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Frame & VCR</span>
          </button>
        </div>

        <button
          onClick={() => { onReset(); playCassetteClick(); }}
          title="Reset sliders"
          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-rose-400 px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category 1: Film Tone */}
      {activeCategory === 'tone' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Warmth (Kodachrome) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Kodachrome Warmth</span>
              <span className="font-mono text-rose-400 font-bold">
                {filters.warmth > 0 ? `+${filters.warmth}` : filters.warmth}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="50"
              value={filters.warmth}
              onChange={(e) => update('warmth', Number(e.target.value))}
              className="accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Cool Synth</span>
              <span>Golden Sunset</span>
            </div>
          </div>

          {/* 35mm Film Grain */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">35mm Film Grain</span>
              <span className="font-mono text-rose-400 font-bold">{filters.filmGrain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={filters.filmGrain}
              onChange={(e) => update('filmGrain', Number(e.target.value))}
              className="accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Clean</span>
              <span>Heavy Analog</span>
            </div>
          </div>

          {/* Contrast */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Vintage Contrast</span>
              <span className="font-mono text-rose-400 font-bold">{filters.contrast}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="150"
              value={filters.contrast}
              onChange={(e) => update('contrast', Number(e.target.value))}
              className="accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Soft Faded</span>
              <span>Punchy 80s</span>
            </div>
          </div>

          {/* Saturation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Color Saturation</span>
              <span className="font-mono text-rose-400 font-bold">{filters.saturation}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="175"
              value={filters.saturation}
              onChange={(e) => update('saturation', Number(e.target.value))}
              className="accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Natural</span>
              <span>Neon Vivid</span>
            </div>
          </div>
        </div>
      )}

      {/* Category 2: Analog & Glitch */}
      {activeCategory === 'analog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scanlines Toggle & Slider */}
          <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.scanlines}
                  onChange={(e) => update('scanlines', e.target.checked)}
                  className="rounded accent-rose-500"
                />
                <span>CRT Scanlines</span>
              </label>
              <span className="font-mono text-[11px] text-rose-400">{filters.scanlineIntensity}%</span>
            </div>
            {filters.scanlines && (
              <input
                type="range"
                min="10"
                max="90"
                value={filters.scanlineIntensity}
                onChange={(e) => update('scanlineIntensity', Number(e.target.value))}
                className="accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            )}
          </div>

          {/* Chromatic Aberration (RGB shift) */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Chromatic RGB Split</span>
              <span className="font-mono text-cyan-400 font-bold">{filters.chromaticAberration}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={filters.chromaticAberration}
              onChange={(e) => update('chromaticAberration', Number(e.target.value))}
              className="accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">Analog lens color fringe</span>
          </div>

          {/* Soft Focus / Glamour Bloom */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Glamour Bloom Glow</span>
              <span className="font-mono text-purple-400 font-bold">{filters.bloomGlow}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={filters.bloomGlow}
              onChange={(e) => update('bloomGlow', Number(e.target.value))}
              className="accent-purple-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">Dreamy soft studio diffuser</span>
          </div>

          {/* VHS Tracking Glitch */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <h5 className="text-xs text-slate-300 font-medium">VHS Tape Tracking</h5>
              <p className="text-[10px] text-slate-500 font-mono">Magnetic tape jitter band</p>
            </div>
            <button
              onClick={() => { update('vhsDistortion', !filters.vhsDistortion); playCassetteClick(); }}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                filters.vhsDistortion
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-900/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filters.vhsDistortion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Category 3: Frame & VCR OSD */}
      {activeCategory === 'frame' && (
        <div className="flex flex-col gap-4">
          {/* Frame Style Select */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-2">Border / Frame Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {frames.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { update('frame', f.id); playCassetteClick(); }}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    filters.frame === f.id
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* VCR Timestamp Controls */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.vcrTimestamp}
                  onChange={(e) => update('vcrTimestamp', e.target.checked)}
                  className="rounded accent-yellow-400"
                />
                <span className="font-vcr text-amber-400 text-sm tracking-wider font-bold">
                  ORANGE VCR TIMESTAMP OSD
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">LED OSD</span>
            </div>

            {filters.vcrTimestamp && (
              <input
                type="text"
                value={filters.timestampText}
                onChange={(e) => update('timestampText', e.target.value)}
                placeholder="AUG 14 1985  PM 06:42"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-vcr text-sm tracking-widest focus:outline-none focus:border-amber-400"
              />
            )}
          </div>

          {/* 80s Sticker Badge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-300 font-medium">80s Graphic Badge / Sticker</label>
              {filters.sticker && (
                <button
                  onClick={() => update('sticker', null)}
                  className="text-[10px] text-rose-400 hover:underline font-mono"
                >
                  Remove Sticker
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RETRO_STICKERS.map((stk) => (
                <button
                  key={stk}
                  onClick={() => { update('sticker', filters.sticker === stk ? null : stk); playCassetteClick(); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-retro tracking-wide border transition-all ${
                    filters.sticker === stk
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-900/40'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

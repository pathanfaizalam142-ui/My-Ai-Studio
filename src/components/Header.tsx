import React from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Image as ImageIcon, Disc } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playCassetteClick } from '../utils/audio';

interface HeaderProps {
  activeTab: 'studio' | 'ai' | 'gallery';
  setActiveTab: (tab: 'studio' | 'ai' | 'gallery') => void;
  soundOn: boolean;
  setSoundOn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundOn,
  setSoundOn,
}) => {
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCassetteClick();
  };

  const handleTabChange = (tab: 'studio' | 'ai' | 'gallery') => {
    setActiveTab(tab);
    playCassetteClick();
  };

  return (
    <header className="border-b border-rose-950/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-cyan-500 shadow-lg shadow-rose-900/40 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Disc className="w-6 h-6 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-black tracking-widest bg-yellow-400 text-slate-950 rounded-sm font-vcr">
              '85
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-retro tracking-wider bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                /80s RETRO STUDIO
              </h1>
              <span className="hidden md:inline-flex text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PRO VCR FX
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight hidden sm:block">
              AUTHENTIC 1980s FILM GRAIN • VHS TRACKING • YEARBOOK GLAMOUR
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Sound */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              id="tab-studio"
              onClick={() => handleTabChange('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-900/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>FX Studio</span>
            </button>

            <button
              id="tab-ai"
              onClick={() => handleTabChange('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-900/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI Maker</span>
            </button>

            <button
              id="tab-gallery"
              onClick={() => handleTabChange('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-900/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Archetypes</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            title={soundOn ? 'Mute 80s Synth FX' : 'Enable 80s Synth FX'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};

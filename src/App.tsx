import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { PresetSelector } from './components/PresetSelector';
import { FXControls } from './components/FXControls';
import { PhotoUploader } from './components/PhotoUploader';
import { AIStoryCard } from './components/AIStoryCard';
import { AIMakerView } from './components/AIMakerView';
import { ArchetypeGallery } from './components/ArchetypeGallery';
import { STYLE_PRESETS, SAMPLE_PHOTOS } from './data/presets';
import { StylePreset, FilterSettings, PersonaProfile } from './types';
import { render80sPhoto } from './utils/canvasRenderer';
import { playCassetteClick, playShutterSound, playSynthChime } from './utils/audio';
import { Download, Sparkles, Wand2, Share2, Dices, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'ai' | 'gallery'>('studio');
  const [soundOn, setSoundOn] = useState(true);

  // Photo & Preset state
  const [currentPhoto, setCurrentPhoto] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [filters, setFilters] = useState<FilterSettings>(STYLE_PRESETS[0].defaultFilters);

  // AI Persona state
  const [persona, setPersona] = useState<PersonaProfile | null>(null);
  const [personaLoading, setPersonaLoading] = useState(false);

  // Canvas processing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Apply a new preset
  const handleSelectPreset = (preset: StylePreset) => {
    setSelectedPreset(preset);
    setFilters({ ...preset.defaultFilters });
    // Reset persona for new archetype
    setPersona(null);
  };

  // Re-render canvas whenever filters or photo changes
  const triggerRender = useCallback(() => {
    if (!canvasRef.current || !currentPhoto) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentPhoto;

    img.onload = () => {
      if (canvasRef.current) {
        render80sPhoto({
          sourceImage: img,
          targetCanvas: canvasRef.current,
          filters,
        });
      }
    };
  }, [currentPhoto, filters]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Generate 80s Persona via Gemini API
  const handleGeneratePersona = async () => {
    setPersonaLoading(true);
    playCassetteClick();

    try {
      const res = await fetch('/api/transform-80s', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: selectedPreset.id,
          customNotes: `Generate an iconic 1980s character persona matching the style ${selectedPreset.name}.`,
        }),
      });

      const data = await res.json();
      if (data.persona) {
        setPersona(data.persona);
        playSynthChime();
      } else {
        // Fallback persona
        setPersona({
          characterName: selectedPreset.id === 'miami_vice' ? 'Sonny "Viper" Vance' : 'Tiffany "Laser" Brooks',
          yearbookQuote: 'Stay cool, keep your collar popped, and don\'t stop believin\'.',
          favoriteSong: selectedPreset.id === 'miami_vice' ? 'In the Air Tonight - Phil Collins' : 'Take On Me - a-ha',
          outfitBreakdown: selectedPreset.tagline,
          retroVibeRating: '10/10 RADICAL',
        });
        playSynthChime();
      }
    } catch (err) {
      console.warn('Persona generation fallback:', err);
      setPersona({
        characterName: 'Sonny "Viper" Vance',
        yearbookQuote: 'Life moves pretty fast. If you don\'t stop and look around, you could miss it.',
        favoriteSong: 'Careless Whisper - George Michael',
        outfitBreakdown: selectedPreset.tagline,
        retroVibeRating: '10/10 TUBULAR',
      });
      playSynthChime();
    } finally {
      setPersonaLoading(false);
    }
  };

  // High-Res Image Download
  const handleDownload = () => {
    if (!canvasRef.current) return;
    setExportLoading(true);
    playShutterSound();

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 0.95);
      const link = document.createElement('a');
      link.download = `80s-retro-${selectedPreset.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setExportLoading(false);
    }
  };

  // Surprise Me / Random 80s Look
  const handleRandomizeLook = () => {
    playCassetteClick();
    const randomPreset = STYLE_PRESETS[Math.floor(Math.random() * STYLE_PRESETS.length)];
    setSelectedPreset(randomPreset);

    // Randomize slight variations
    const randomizedFilters: FilterSettings = {
      ...randomPreset.defaultFilters,
      warmth: Math.floor(Math.random() * 60) - 20,
      filmGrain: Math.floor(Math.random() * 50) + 20,
      scanlineIntensity: Math.floor(Math.random() * 50) + 20,
      chromaticAberration: Math.floor(Math.random() * 8) + 2,
    };
    setFilters(randomizedFilters);
    playSynthChime();
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Background Synthwave Grid Texture */}
      <div className="fixed inset-0 retro-grid opacity-30 pointer-events-none" />

      {/* Retro Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Content Areas based on Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 z-10">
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Before/After Visualizer & Quick Actions */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Photo Uploader / Selector Bar */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-lg">
                <PhotoUploader
                  currentPhoto={currentPhoto}
                  onSelectPhoto={(photoUrl) => {
                    setCurrentPhoto(photoUrl);
                  }}
                />
              </div>

              {/* Main Before / After Comparison Canvas */}
              <BeforeAfterSlider
                originalImage={currentPhoto}
                processedCanvasRef={canvasRef}
                vhsActive={filters.vhsDistortion}
              />

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRandomizeLook}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all"
                  >
                    <Dices className="w-3.5 h-3.5 text-rose-400" />
                    <span>Surprise 80s Look</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ai')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
                    <span>AI Wardrobe Engine</span>
                  </button>
                </div>

                <button
                  id="download-composite-btn"
                  onClick={handleDownload}
                  disabled={exportLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-500 hover:opacity-90 text-white font-retro font-bold text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD 80s MASTER</span>
                </button>
              </div>

              {/* 80s Persona Card */}
              <AIStoryCard
                persona={persona}
                loading={personaLoading}
                onGeneratePersona={handleGeneratePersona}
                styleName={selectedPreset.name}
              />
            </div>

            {/* Right Column: Style Presets & Analog FX Deck */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Preset Selector */}
              <PresetSelector
                selectedPresetId={selectedPreset.id}
                onSelectPreset={handleSelectPreset}
              />

              {/* Hardware FX Controls Deck */}
              <FXControls
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ ...selectedPreset.defaultFilters })}
              />

              {/* Archetype Quick Breakdown Card */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3.5 text-xs text-slate-400">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-rose-400 font-bold uppercase">
                    Current Archetype Specs
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    KODAK FILM 1985
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedPreset.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI 80s Transformer */}
        {activeTab === 'ai' && (
          <AIMakerView
            currentPhoto={currentPhoto}
            selectedPreset={selectedPreset}
            onSelectPhoto={setCurrentPhoto}
            onApplyResultToStudio={(newImage) => {
              setCurrentPhoto(newImage);
              setActiveTab('studio');
            }}
          />
        )}

        {/* Tab 3: Archetypes Gallery */}
        {activeTab === 'gallery' && (
          <ArchetypeGallery
            onSelectPreset={handleSelectPreset}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Retro VHS Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-4 text-center text-xs font-mono text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-slate-400 font-bold">80s RETRO STUDIO</span>
            <span>• HI-FI STEREO SOUND</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            INSPIRED BY 1980s MIAMI VICE, YEARBOOK LASER GRIDS & SYNTHWAVE CULTURE
          </p>
        </div>
      </footer>
    </div>
  );
}

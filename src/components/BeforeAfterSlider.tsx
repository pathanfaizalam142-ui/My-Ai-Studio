import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, History, Eye, Maximize2 } from 'lucide-react';
import { playCassetteClick } from '../utils/audio';

interface BeforeAfterSliderProps {
  originalImage: string;
  processedCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  aspectRatio?: string;
  vhsActive?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  processedCanvasRef,
  vhsActive = true,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
    playCassetteClick();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Slider Viewer Container */}
      <div
        ref={containerRef}
        id="before-after-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[3/4] max-h-[580px] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-950 border-2 border-slate-800 shadow-2xl shadow-rose-950/20 group"
      >
        {/* 1. Transformed 80s Canvas (Bottom Layer) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
          <canvas
            ref={processedCanvasRef}
            className="max-w-full max-h-full object-contain pointer-events-none"
          />
        </div>

        {/* 2. Original Photo (Top Layer, clipped by sliderPosition) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none border-r-2 border-rose-500/80 shadow-2xl"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            <img
              src={originalImage}
              alt="Original portrait"
              referrerPolicy="no-referrer"
              className="max-w-none h-full object-contain absolute left-0"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              }}
            />
          </div>

          {/* Before Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
            <History className="w-3 h-3 text-slate-400" />
            <span className="font-bold">ORIGINAL</span>
          </div>
        </div>

        {/* After Badge (On the right side) */}
        <div className="absolute top-4 right-4 bg-rose-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-rose-500/50 text-[11px] font-mono text-rose-200 flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          <span className="font-bold font-retro tracking-wider">1980s RETRO</span>
        </div>

        {/* Draggable Divider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 via-fuchsia-400 to-cyan-400 cursor-ew-resize transition-opacity"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/40 text-rose-300">
            <span className="text-[10px] font-bold font-mono select-none">◄►</span>
          </div>
        </div>

        {/* Optional VHS tracking scanline line */}
        {vhsActive && (
          <div className="absolute inset-x-0 h-4 bg-white/10 pointer-events-none vhs-tracking-bar mix-blend-overlay" />
        )}
      </div>

      {/* Quick View Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSliderPosition(100); playCassetteClick(); }}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
              sliderPosition === 100
                ? 'bg-slate-800 text-white border-slate-600 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Show Original
          </button>
          <button
            onClick={() => { setSliderPosition(50); playCassetteClick(); }}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
              sliderPosition === 50
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            50/50 Split
          </button>
          <button
            onClick={() => { setSliderPosition(0); playCassetteClick(); }}
            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
              sliderPosition === 0
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Full 80s
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          DRAG TO COMPARE
        </span>
      </div>
    </div>
  );
};

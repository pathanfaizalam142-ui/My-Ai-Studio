import React from 'react';
import { PersonaProfile } from '../types';
import { Sparkles, Music, Shirt, Quote, Award } from 'lucide-react';

interface AIStoryCardProps {
  persona: PersonaProfile | null;
  loading: boolean;
  onGeneratePersona: () => void;
  styleName: string;
}

export const AIStoryCard: React.FC<AIStoryCardProps> = ({
  persona,
  loading,
  onGeneratePersona,
  styleName,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-purple-900/40 p-4 shadow-xl relative overflow-hidden">
      {/* 80s Accent Grid & Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-retro">
            1980s Persona & Yearbook Bio
          </h3>
        </div>

        <button
          onClick={onGeneratePersona}
          disabled={loading}
          className="text-[11px] font-mono font-bold text-yellow-300 hover:text-yellow-200 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <span className="animate-spin text-xs">⏳</span>
              <span>Thinking '85...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Generate Persona</span>
            </>
          )}
        </button>
      </div>

      {persona ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold font-retro text-rose-400 tracking-wide">
              {persona.characterName}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Award className="w-3 h-3 text-yellow-400" />
              <span>{persona.retroVibeRating || "10/10 TUBULAR"}</span>
            </span>
          </div>

          {/* Yearbook Quote */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2">
            <Quote className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs italic text-slate-300 font-serif leading-relaxed">
              "{persona.yearbookQuote}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Mixtape Track */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <Music className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-500 block font-mono">WALKMAN CASSETTE</span>
                <span className="text-slate-200 font-medium truncate block">
                  {persona.favoriteSong}
                </span>
              </div>
            </div>

            {/* Outfit */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <Shirt className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-500 block font-mono">WARDROBE</span>
                <span className="text-slate-200 font-medium truncate block">
                  {persona.outfitBreakdown}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs text-slate-400 mb-2">
            Click "Generate Persona" to discover your 1980s alter-ego, high school yearbook quote, and signature cassette track matching <span className="text-rose-400 font-medium">{styleName}</span>!
          </p>
        </div>
      )}
    </div>
  );
};

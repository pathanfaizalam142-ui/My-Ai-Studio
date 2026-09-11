export type StyleId = 'miami_vice' | 'yearbook' | 'synthwave' | 'glamour' | 'vhs_camcorder';

export type FrameType = 'none' | 'polaroid' | 'laser_grid' | 'vhs_screen' | 'cassette_tape' | 'neon_border';

export interface StylePreset {
  id: StyleId;
  name: string;
  year: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  sampleTransformed: string;
  defaultFilters: FilterSettings;
  suggestedPrompt: string;
}

export interface FilterSettings {
  warmth: number; // -50 to 50
  contrast: number; // 80 to 150
  saturation: number; // 80 to 180
  filmGrain: number; // 0 to 100
  scanlines: boolean;
  scanlineIntensity: number; // 0 to 100
  chromaticAberration: number; // 0 to 15
  vhsDistortion: boolean;
  vcrTimestamp: boolean;
  timestampText: string;
  bloomGlow: number; // 0 to 100
  frame: FrameType;
  sticker: string | null;
}

export interface PersonaProfile {
  characterName: string;
  yearbookQuote: string;
  favoriteSong: string;
  outfitBreakdown: string;
  retroVibeRating: string;
}

export interface SamplePhoto {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

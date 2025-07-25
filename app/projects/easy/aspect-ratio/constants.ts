export type RatioPreset = { 
  label: string; 
  w: number; 
  h: number; 
  description?: string;
};

export const ASPECT_RATIOS: RatioPreset[] = [
  { label: '16:9', w: 16, h: 9, description: 'Wide-screen' },
  { label: '4:3', w: 4, h: 3, description: 'Classic' },
  { label: '8:5', w: 8, h: 5, description: 'WXGA' },
  { label: '1:1', w: 1, h: 1, description: 'Square' },
  { label: '3:2', w: 3, h: 2, description: 'Photo' },
  { label: '21:9', w: 21, h: 9, description: 'Ultra-wide' },
];

export const SCALE_CONFIG = {
  MIN: 25,
  MAX: 500,
  STEP: 25,
  DEFAULT: 50,
} as const;

export const INPUT_LIMITS = {
  MIN: 1,
  MAX: 100000,
} as const;

export const DEFAULT_VALUES = {
  WIDTH: 1920,
  HEIGHT: 1080,
  NEW_WIDTH: 960,
  NEW_HEIGHT: 540,
  RATIO_INDEX: 0,
  SCALE: 50,
} as const;

export type LeadType = 'c' | 'x';

// Utility function to generate scale options
export const generateScaleOptions = () => {
  const count = (SCALE_CONFIG.MAX - SCALE_CONFIG.MIN) / SCALE_CONFIG.STEP + 1;
  return Array.from({ length: count }, (_, i) => {
    const value = SCALE_CONFIG.MIN + i * SCALE_CONFIG.STEP;
    return { value: value.toString(), label: `${value}%` };
  });
}; 
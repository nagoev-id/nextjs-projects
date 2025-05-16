import { PROJECTS_LIST, PROJECTS_METADATA } from '@/shared';
import { toast } from 'sonner';

export const HELPERS = {
  addLeadingZero: (number: number | string): string => number.toString().padStart(2, '0'),
  getRandomNumber: (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min,
  copyToClipboard: async (textToCopy: string): Promise<void> => {
    if (!textToCopy || textToCopy.trim().length === 0) {
      toast.error('Nothing to copy', {
        richColors: true,
        description: 'Please provide a valid text to copy',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Successfully copied to clipboard', {
        richColors: true,
      });
    } catch (error) {
      console.error('Error when copying to clipboard:', error);
      toast.error('Nothing to copy', {
        richColors: true,
        description: 'Error when copying to clipboard',
      });
    }
  },
  generateRandomHexColor: (): string => {
    const HEX_CHARS: string = '0123456789ABCDEF';
    return '#' + Array(6)
      .fill(0)
      .map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)])
      .join('');
  },
  convertHexToRgb: (hex: string): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  },
  /**
   * Validates a numeric input against specified constraints
   * @param value - The numeric value to validate
   * @param options - Validation options
   * @param options.min - Minimum allowed value (inclusive)
   * @param options.max - Maximum allowed value (inclusive)
   * @param options.integer - Whether the value must be an integer
   * @param options.customMessages - Custom error messages
   * @returns Error message string or null if valid
   */
  isValidateNumber: (
    value: number,
    options: {
      min?: number;
      max?: number;
      integer?: boolean;
      customMessages?: {
        notNumber?: string;
        notInteger?: string;
        outOfRange?: string;
      };
    } = {},
  ): string | null => {
    const {
      min = 1,
      max = Number.MAX_SAFE_INTEGER,
      integer = true,
      customMessages = {},
    } = options;

    if (isNaN(value)) {
      return customMessages.notNumber || 'Please enter a valid number';
    }

    if (integer && !Number.isInteger(value)) {
      return customMessages.notInteger || 'Please enter a valid whole number';
    }

    if (value < min || value > max) {
      return customMessages.outOfRange || `Please enter a number from ${min} to ${max}`;
    }

    return null;
  },
  capitalizeFirstLetter: (str: string | undefined): string => {
    if (str === undefined) {
      return '';
    }
    return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
  },
  projectMetadata: (projectKey: keyof typeof PROJECTS_LIST) => ({
    title: PROJECTS_LIST[projectKey]?.title || 'Project',
    description: PROJECTS_LIST[projectKey]?.description || '',
    keywords: PROJECTS_METADATA.keywords,
    authors: PROJECTS_METADATA.authors,
  }),
};

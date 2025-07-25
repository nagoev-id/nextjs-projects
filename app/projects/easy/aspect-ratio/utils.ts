import { RatioPreset, LeadType, INPUT_LIMITS } from './constants';

/**
 * Validates if a number is within acceptable range
 * @param value - The value to validate
 * @returns boolean indicating if value is valid
 */
export const isValidDimension = (value: number): boolean => {
  return Number.isFinite(value) && value >= INPUT_LIMITS.MIN && value <= INPUT_LIMITS.MAX;
};

/**
 * Safely parses string to integer with fallback
 * @param value - String value to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed integer or fallback
 */
export const safeParseInt = (value: string, fallback: number = 0): number => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

/**
 * Calculates the coefficient for aspect ratio conversion
 * @param lead - Leading dimension type
 * @param ratio - Aspect ratio preset
 * @param scale - Scale percentage
 * @returns Calculated coefficient
 */
export const calculateCoefficient = (
  lead: LeadType,
  ratio: RatioPreset,
  scale: number
): number => {
  const ratioFactor = lead === 'c' ? ratio.h / ratio.w : ratio.w / ratio.h;
  return ratioFactor * (scale / 100);
};

/**
 * Calculates dependent dimension based on leading dimension
 * @param leadingValue - Value of the leading dimension
 * @param coefficient - Pre-calculated coefficient
 * @returns Calculated dependent dimension value
 */
export const calculateDependentDimension = (
  leadingValue: number,
  coefficient: number
): number => {
  if (!isValidDimension(leadingValue)) return 0;
  return Math.round(leadingValue * coefficient);
};

/**
 * Formats aspect ratio as a decimal string
 * @param width - Width value
 * @param height - Height value
 * @returns Formatted ratio string
 */
export const formatRatio = (width: number, height: number): string => {
  if (height === 0) return '0.00';
  return (width / height).toFixed(2);
};

/**
 * Generates formula text for display
 * @param lead - Leading dimension type
 * @param ratio - Aspect ratio preset
 * @param leadingValue - Value of leading dimension
 * @param dependentValue - Value of dependent dimension
 * @param scale - Scale percentage
 * @returns Formula string
 */
export const generateFormulaText = (
  lead: LeadType,
  ratio: RatioPreset,
  leadingValue: number,
  dependentValue: number,
  scale: number
): string => {
  if (lead === 'c') {
    return `(${ratio.h} ÷ ${ratio.w}) × ${leadingValue} × ${scale}% = ${dependentValue}`;
  }
  return `(${ratio.w} ÷ ${ratio.h}) × ${leadingValue} × ${scale}% = ${dependentValue}`;
};

/**
 * Validates and processes input change
 * @param inputValue - Raw input value
 * @param currentValue - Current state value
 * @returns Processed value or current value if invalid
 */
export const processInputChange = (inputValue: string, currentValue: number): number => {
  const parsed = safeParseInt(inputValue, currentValue);
  return isValidDimension(parsed) ? parsed : currentValue;
}; 
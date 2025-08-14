/**
 * Массивы слов для преобразования чисел в текст
 */
const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

const SCALES = [
  '', 'thousand', 'million', 'billion', 'trillion',
];

/**
 * Преобразует число от 0 до 999 в текст
 * @param num - Число от 0 до 999
 * @returns Текстовое представление числа
 */
const convertHundreds = (num: number): string => {
  let result = '';

  if (num >= 100) {
    result += ONES[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }

  if (num >= 20) {
    result += TENS[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += ' ';
  }

  if (num > 0) {
    result += ONES[num];
  }

  return result;
};

/**
 * Преобразует число в текстовое представление
 * @param number - Число для преобразования (от 0 до 999,999,999)
 * @returns Текстовое представление числа
 */
export const convertNumberToWords = (number: number): string => {
  if (number === 0) return 'zero';

  if (number < 0) {
    return 'negative ' + convertNumberToWords(-number);
  }

  let result = '';
  let scaleIndex = 0;

  while (number > 0) {
    const chunk = number % 1000;

    if (chunk !== 0) {
      const chunkText = convertHundreds(chunk);
      const scale = SCALES[scaleIndex];

      if (scale) {
        result = chunkText + ' ' + scale + (result ? ' ' + result : '');
      } else {
        result = chunkText + (result ? ' ' + result : '');
      }
    }

    number = Math.floor(number / 1000);
    scaleIndex++;
  }

  return result.trim();
};
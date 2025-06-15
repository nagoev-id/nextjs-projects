import { PROJECTS_LIST, PROJECTS_METADATA } from '@/shared';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const HELPERS = {
  /**
   * Добавляет ведущий ноль к числу, если оно меньше 10
   * @param {number|string} number - Число для форматирования
   * @returns {string} Отформатированная строка с ведущим нулем
   */
  addLeadingZero: (number: number | string): string => number.toString().padStart(2, '0'),

  /**
   * Генерирует случайное целое число в заданном диапазоне
   * @param {number} min - Минимальное значение (включительно)
   * @param {number} max - Максимальное значение (включительно)
   * @returns {number} Случайное целое число
   */
  getRandomNumber: (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Копирует текст в буфер обмена с уведомлением о результате
   * @param {string} textToCopy - Текст для копирования
   * @returns {Promise<void>}
   */
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

  /**
   * Генерирует случайный HEX-цвет
   * @returns {string} Строка с HEX-цветом (например, "#A1B2C3")
   */
  generateRandomHexColor: (): string => {
    const HEX_CHARS: string = '0123456789ABCDEF';
    return '#' + Array(6)
      .fill(0)
      .map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)])
      .join('');
  },

  /**
   * Конвертирует HEX-цвет в формат RGB или RGBA
   * @param {string} hex - HEX-цвет (например, "#A1B2C3")
   * @param {number} [alpha] - Значение прозрачности от 0 до 1 (опционально)
   * @returns {string} Строка с RGB или RGBA цветом (например, "rgb(161, 178, 195)" или "rgba(161, 178, 195, 0.5)")
   */
  convertHexToRgb: (hex: string, alpha?: number): string => {
    // Проверяем и очищаем входной HEX-цвет
    const cleanHex = hex.replace(/^#/, '');

    // Проверяем валидность HEX-цвета
    if (!/^([A-Fa-f0-9]{3}){1,2}$/.test(cleanHex)) {
      console.warn('Invalid HEX color provided:', hex);
      return 'rgb(0, 0, 0)'; // Возвращаем черный цвет по умолчанию
    }

    // Преобразуем сокращенный HEX (например, #ABC) в полный формат (#AABBCC)
    const normalizedHex = cleanHex.length === 3
      ? cleanHex.split('').map(char => char + char).join('')
      : cleanHex;

    // Извлекаем RGB компоненты
    const r = parseInt(normalizedHex.substring(0, 2), 16);
    const g = parseInt(normalizedHex.substring(2, 4), 16);
    const b = parseInt(normalizedHex.substring(4, 6), 16);

    // Возвращаем RGB или RGBA в зависимости от наличия параметра alpha
    return typeof alpha === 'number'
      ? `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`
      : `rgb(${r}, ${g}, ${b})`;
  },

  /**
   * Валидирует числовое значение по заданным ограничениям
   * @param {number} value - Числовое значение для проверки
   * @param {object} options - Параметры валидации
   * @param {number} [options.min=1] - Минимальное допустимое значение (включительно)
   * @param {number} [options.max=Number.MAX_SAFE_INTEGER] - Максимальное допустимое значение (включительно)
   * @param {boolean} [options.integer=true] - Должно ли значение быть целым числом
   * @param {object} [options.customMessages] - Пользовательские сообщения об ошибках
   * @returns {string|null} Сообщение об ошибке или null, если значение валидно
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

  /**
   * Делает первую букву строки заглавной
   * @param {string|undefined} str - Исходная строка
   * @returns {string} Строка с заглавной первой буквой
   */
  capitalizeFirstLetter: (str: string | undefined): string => {
    if (str === undefined) {
      return '';
    }
    return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Получает метаданные проекта по его ключу
   * @param {keyof typeof PROJECTS_LIST | string} projectKey - Ключ проекта
   * @returns {object} Объект с метаданными проекта
   */
  projectMetadata: (projectKey: keyof typeof PROJECTS_LIST | string) => ({
    title: PROJECTS_LIST[projectKey]?.title || projectKey || 'Project',
    description: PROJECTS_LIST[projectKey]?.description || '',
    keywords: PROJECTS_METADATA.keywords,
    authors: PROJECTS_METADATA.authors,
  }),

  /**
   * Показывает анимацию конфетти на экране
   * @description Использует библиотеку canvas-confetti для создания эффекта конфетти
   * @see https://www.npmjs.com/package/canvas-confetti
   * @returns {void}
   * @example
   * HELPERS.showConfetti();
   */
  showConfetti: function(): void {
    // Используем функцию вместо стрелочной функции, чтобы иметь доступ к this
    const confettiOptions = {
      angle: HELPERS.getRandomNumber(55, 125),
      spread: HELPERS.getRandomNumber(50, 70),
      particleCount: HELPERS.getRandomNumber(50, 100),
      origin: { y: 0.6 },
    };

    confetti(confettiOptions);
  },

  /**
   * Возвращает текущую дату в отформатированном виде
   * @returns {string} Строка с датой в формате "день, месяц (сокращенно), год"
   * @example
   * const currentDate = HELPERS.formattedDate();
   * console.log(currentDate); // Выведет, например: "15, Apr, 2023"
   */
  formattedDate: () => {
    const now = new Date();
    return `${now.getDate()}, ${now.toLocaleString('en-EN', { month: 'short' })}, ${now.getFullYear()}`;
  },

  /**
   * Форматирует число в денежный формат USD
   * @param {number} number - Число для форматирования
   * @returns {string} Отформатированная строка с ценой в формате USD
   * @example
   * const price = HELPERS.formatPrice(1234.56);
   * console.log(price); // Выведет "$1,234.56"
   */
  formatPrice: (number: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  },
};
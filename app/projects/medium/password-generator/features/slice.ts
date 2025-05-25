import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Тип начального состояния для генератора паролей
 * @typedef {Object} InitialState
 * @property {string} password - Сгенерированный пароль
 * @property {'none' | 'weak' | 'medium' | 'strong'} strength - Оценка силы пароля
 * @property {Array<{id: string, label: string, checked: boolean}>} options - Опции для генерации пароля
 */
export type InitialState = {
  password: string;
  strength: 'none' | 'weak' | 'medium' | 'strong';
  options: {
    id: string;
    label: string;
    checked: boolean;
  }[];
}

/**
 * Тип для набора символов, используемых при генерации пароля
 * @typedef {Object} Characters
 * @property {function(): string} generate - Функция для генерации случайного символа определенного типа
 */
export type Characters = {
  [key: string]: { generate: () => string };
}

/**
 * Набор функций для генерации различных типов символов
 * @constant {Characters}
 */
const characters: Characters = {
  /** Генерирует случайную строчную букву (a-z) */
  lowercase: { generate: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97) },
  /** Генерирует случайную заглавную букву (A-Z) */
  uppercase: { generate: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65) },
  /** Генерирует случайную цифру (0-9) */
  numbers: { generate: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48) },
  /** Генерирует случайный специальный символ */
  symbols: { generate: () => '!@#$%^&*(),.?":{}|<>'[Math.floor(Math.random() * 21)] },
};

/**
 * Начальное состояние для генератора паролей
 * @constant {InitialState}
 */
const initialState: InitialState = {
  password: '',
  strength: 'none',
  options: [
    { id: 'lowercase', label: 'Lowercase (a-z)', checked: true },
    { id: 'uppercase', label: 'Uppercase (A-Z)', checked: false },
    { id: 'numbers', label: 'Numbers (0-9)', checked: false },
    { id: 'symbols', label: 'Symbols (!-$^+)', checked: false },
  ],
};

/**
 * Redux slice для генератора паролей
 * @constant {Slice}
 */
export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    /**
     * Переключает состояние опции генерации пароля
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с ID опции
     */
    optionToggle: (state, action: PayloadAction<string>) => {
      state.options = state.options.map(option =>
        option.id === action.payload ? { ...option, checked: !option.checked } : option,
      );
    },
    
    /**
     * Генерирует новый пароль с заданной длиной и выбранными опциями
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<number>} action - Действие с длиной пароля
     */
    generatePassword: (state, action: PayloadAction<number>) => {
      const options = state.options.filter((o) => o.checked);
      if (options.length === 0) {
        state.password = '';
        return;
      }
      state.password = Array.from({ length: action.payload }, () => {
        return characters[options[Math.floor(Math.random() * options.length)].id].generate();
      }).join('');
    },
    
    /**
     * Оценивает силу пароля на основе его длины и разнообразия символов
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<string>} action - Действие с паролем для оценки
     */
    passwordStrength: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.strength = 'none';
        return;
      }

      const checks = {
        length: action.payload.length,
        hasLowercase: /[a-z]/.test(action.payload),
        hasUppercase: /[A-Z]/.test(action.payload),
        hasDigits: /\d/.test(action.payload),
        hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(action.payload),
      };

      const varietyScore = Object.values(checks).filter(Boolean).length - 1;

      let strength: 'weak' | 'medium' | 'strong';
      if (checks.length < 8) {
        strength = 'weak';
      } else if (checks.length < 12) {
        strength = varietyScore >= 3 ? 'medium' : 'weak';
      } else {
        strength = varietyScore >= 3 ? 'strong' : 'medium';
      }
      state.strength = strength;
    },
  },
});

/**
 * Базовый селектор для получения состояния генератора паролей
 * @param {Object} state - Состояние Redux
 * @returns {InitialState} Состояние генератора паролей
 */
export const selectPasswordState = (state: { password: InitialState }): InitialState => state.password;

/**
 * Мемоизированный селектор для получения данных о пароле, его силе и опциях
 * Предотвращает ненужные повторные рендеры при неизменном состоянии
 * @function
 * @returns {Object} Объект с паролем, силой и опциями
 */
export const selectPasswordData = createSelector(
  selectPasswordState,
  (state) => ({
    password: state.password,
    strength: state.strength,
    options: state.options,
  })
);

export const { optionToggle, generatePassword, passwordStrength } = passwordSlice.actions;

export default passwordSlice.reducer;
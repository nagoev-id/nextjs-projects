import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * @typedef {'any' | 'easy' | 'medium' | 'hard'} QuizDifficulty
 * Уровень сложности квиза
 */
type QuizDifficulty = 'any' | 'easy' | 'medium' | 'hard'

/**
 * @typedef {'any' | 'multiple' | 'boolean'} QuizType
 * Тип вопросов в квизе
 */
type QuizType = 'any' | 'multiple' | 'boolean';

/**
 * @typedef {Object} QuizSettings
 * Настройки квиза
 * @property {number} amount - Количество вопросов
 * @property {'any' | string} category - Категория вопросов
 * @property {QuizDifficulty} difficulty - Уровень сложности
 * @property {QuizType} type - Тип вопросов
 */
export type QuizSettings = {
  amount: number;
  category: 'any' | string;
  difficulty: QuizDifficulty;
  type: QuizType;
}

/**
 * @typedef {Object} Question
 * Структура вопроса
 * @property {string} question - Текст вопроса
 * @property {string} correct_answer - Правильный ответ
 * @property {string[]} incorrect_answers - Массив неправильных ответов
 * @property {string} category - Категория вопроса
 * @property {QuizDifficulty} difficulty - Сложность вопроса
 * @property {QuizType} type - Тип вопроса
 */
export type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: QuizDifficulty;
  type: QuizType;
};

/**
 * @typedef {Object} PayloadActionType
 * Тип полезной нагрузки для действия установки вопросов
 * @property {Question[]} questions - Массив вопросов
 * @property {QuizSettings} settings - Настройки квиза
 */
type PayloadActionType = {
  questions: Question[];
  settings: QuizSettings;
}

/**
 * @typedef {Object} InitialState
 * Начальное состояние слайса квиза
 * @property {Question[]} questions - Массив вопросов
 * @property {number} currentQuestionIndex - Индекс текущего вопроса
 * @property {number} score - Текущий счет
 * @property {boolean} quizCompleted - Флаг завершения квиза
 * @property {QuizSettings} settings - Настройки квиза
 */
type InitialState = {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  quizCompleted: boolean;
  settings: QuizSettings;
};

/**
 * Начальное состояние слайса квиза
 * @type {InitialState}
 */
const initialState: InitialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  quizCompleted: false,
  settings: {
    amount: 10,
    category: 'any',
    difficulty: 'any',
    type: 'any',
  },
};

/**
 * Слайс Redux для управления состоянием квиза
 */
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    /**
     * Устанавливает вопросы и настройки квиза
     * @param {InitialState} state - Текущее состояние
     * @param {PayloadAction<PayloadActionType>} action - Действие с вопросами и настройками
     */
    setQuestions(state, action: PayloadAction<PayloadActionType>) {
      state.questions = action.payload.questions;
      state.settings = action.payload.settings;
    },
    /**
     * Увеличивает счет на 1
     * @param {InitialState} state - Текущее состояние
     */
    incrementScore(state) {
      state.score += 1;
    },
    /**
     * Переходит к следующему вопросу или завершает квиз
     * @param {InitialState} state - Текущее состояние
     */
    nextQuestion(state) {
      if (state.currentQuestionIndex + 1 < state.questions.length) {
        state.currentQuestionIndex += 1;
      } else {
        state.quizCompleted = true;
      }
    },
    /**
     * Сбрасывает состояние квиза
     * @param {InitialState} state - Текущее состояние
     */
    resetQuiz(state) {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.quizCompleted = false;
    },
  },
});

/**
 * Селектор для получения состояния квиза
 * @param {{ quiz: InitialState }} state - Глобальное состояние Redux
 * @returns {InitialState} Состояние квиза
 */
export const selectQuizState = (state: { quiz: InitialState }): InitialState => {
  return state.quiz;
};

/**
 * Мемоизированный селектор для получения данных квиза
 */
export const selectQuizData = createSelector(
  selectQuizState,
  (state) => ({
    questions: state.questions,
    currentQuestionIndex: state.currentQuestionIndex,
    score: state.score,
    quizCompleted: state.quizCompleted,
    settings: state.settings,
  }),
);

export const { nextQuestion, setQuestions, resetQuiz, incrementScore } = quizSlice.actions;

export const quizReducer = quizSlice.reducer;
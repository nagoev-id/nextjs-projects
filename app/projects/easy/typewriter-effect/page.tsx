'use client';

/**
 * # Эффект печатающейся машинки (Typewriter Effect)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение использует React с хуками состояния для управления текстом и анимацией
 *    - Начальное состояние включает массив текстов для отображения, скорости печати и удаления, задержки между текстами
 *    - Состояние также отслеживает текущий отображаемый текст, индекс текущего текста и режим (печать или удаление)
 *
 * 2. **Цикл анимации**:
 *    - Анимация работает в двух режимах: печать (isTyping = true) и удаление (isTyping = false)
 *    - В режиме печати текст постепенно появляется по одному символу с заданной скоростью (typingSpeed)
 *    - Когда текст полностью напечатан, происходит пауза (delayBetweenTexts) перед переключением в режим удаления
 *    - В режиме удаления текст постепенно исчезает по одному символу с заданной скоростью (eraseSpeed)
 *    - Когда текст полностью удален, выбирается следующий текст из массива и цикл повторяется
 *
 * 3. **Управление таймерами**:
 *    - Для анимации используются таймеры setTimeout, которые обновляют состояние через заданные интервалы
 *    - При каждом обновлении состояния useEffect срабатывает заново, создавая новый таймер
 *    - При размонтировании компонента или изменении зависимостей все активные таймеры очищаются
 *
 * 4. **Циклическое отображение текстов**:
 *    - После удаления последнего символа текущего текста, индекс увеличивается для перехода к следующему тексту
 *    - Используется операция остатка от деления (%) для циклического перебора текстов в массиве
 *    - Это создает бесконечный цикл анимации, который последовательно отображает все тексты
 *
 * 5. **Визуальное представление**:
 *    - Текст отображается внутри компонента Card с фиксированной шириной
 *    - Анимируемая часть текста выделяется жирным шрифтом для привлечения внимания
 *    - Компонент адаптивен и центрируется на странице
 */

import { Card } from '@/components/ui/card';
import { JSX, useEffect, useRef, useState } from 'react';

/**
 * Интерфейс состояния эффекта печатающейся машинки
 * @interface TypewriterState
 * @property {number} typingSpeed - Скорость печати символов в миллисекундах
 * @property {number} eraseSpeed - Скорость удаления символов в миллисекундах
 * @property {number} delayBetweenTexts - Задержка между текстами в миллисекундах
 * @property {string[]} texts - Массив текстов для последовательного отображения
 * @property {string} currentText - Текущий отображаемый текст (полный или частичный)
 * @property {number} currentIndex - Индекс текущего текста в массиве texts
 * @property {boolean} isTyping - Флаг режима работы (true - печать, false - удаление)
 */
type TypewriterState = {
  typingSpeed: number;
  eraseSpeed: number;
  delayBetweenTexts: number;
  texts: string[];
  currentText: string;
  currentIndex: number;
  isTyping: boolean;
}

/**
 * Начальное состояние эффекта печатающейся машинки
 * @constant {TypewriterState} INITIAL_STATE
 */
const INITIAL_STATE: TypewriterState = {
  typingSpeed: 100,
  eraseSpeed: 50,
  delayBetweenTexts: 2000,
  texts: ['Developer', 'Designer', 'Creator'],
  currentText: '',
  currentIndex: 0,
  isTyping: true,
};

/**
 * Компонент страницы с эффектом печатающейся машинки
 * 
 * @component
 * @description
 * Создает анимированный текст, который последовательно печатает и удаляет
 * слова из заданного массива, создавая эффект печатающейся машинки.
 * 
 * @returns {JSX.Element} Компонент страницы с эффектом печатающейся машинки
 */
const TypewriterEffectPage = (): JSX.Element => {
  const [state, setState] = useState<TypewriterState>(INITIAL_STATE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const targetText: string = state.texts[state.currentIndex];
    
    // Очистка предыдущего таймера перед установкой нового
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (state.isTyping) {
      if (state.currentText.length < targetText.length) {
        // Режим печати: добавляем по одному символу
        timeoutRef.current = setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            currentText: targetText.slice(0, prevState.currentText.length + 1),
          }));
        }, state.typingSpeed);
      } else {
        // Текст полностью напечатан: ждем перед началом удаления
        timeoutRef.current = setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            isTyping: false,
          }));
        }, state.delayBetweenTexts);
      }
    } else {
      if (state.currentText.length > 0) {
        // Режим удаления: удаляем по одному символу
        timeoutRef.current = setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            currentText: prevState.currentText.slice(0, -1),
          }));
        }, state.eraseSpeed);
      } else {
        // Текст полностью удален: переходим к следующему тексту
        setState(prevState => ({
          ...prevState,
          currentIndex: (prevState.currentIndex + 1) % prevState.texts.length,
          isTyping: true,
        }));
      }
    }

    // Очистка таймера при размонтировании компонента
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <p className="text-center text-lg" aria-live="polite">
        John Doe The <span className="font-bold">{state.currentText}</span>
      </p>
    </Card>
  );
};

export default TypewriterEffectPage;
'use client';

/**
 * # Приложение для тестирования скорости печати
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация:**
 *    - При загрузке компонента, приложение асинхронно загружает текст для теста.
 *    - Если API недоступен, используется резервный текст из локальных данных.
 *
 * 2. **Подготовка теста:**
 *    - Текст отображается на экране, каждый символ обернут в отдельный span для стилизации.
 *    - Инициализируется таймер на 60 секунд и статистика (ошибки, CPM, WPM).
 *
 * 3. **Процесс тестирования:**
 *    - Пользователь начинает вводить текст в скрытое поле ввода.
 *    - При первом вводе запускается таймер.
 *    - Каждый введенный символ сравнивается с соответствующим символом в тексте:
 *      - Правильные символы подсвечиваются зеленым.
 *      - Неправильные - красным.
 *      - Текущий символ подсвечивается оранжевым.
 *
 * 4. **Обработка ввода:**
 *    - Используется простой debounce для предотвращения слишком частых обновлений.
 *    - При каждом вводе обновляется статистика: количество ошибок, CPM, WPM.
 *
 * 5. **Завершение теста:**
 *    - Тест завершается, когда истекает время или пользователь набирает весь текст.
 *    - Таймер останавливается, и пользователь видит финальную статистику.
 *
 * 6. **Повторный запуск:**
 *    - Пользователь может начать тест заново, нажав кнопку "Try Again".
 *    - Это сбрасывает все состояния и загружает новый текст.
 *
 * 7. **Отображение статистики:**
 *    - В реальном времени отображается оставшееся время, количество ошибок, WPM и CPM.
 *
 * 8. **Оптимизация производительности:**
 *    - Используются useCallback и useMemo для оптимизации повторных рендеров.
 *    - Применяется простой механизм debounce для обработки ввода.
 */

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { textData } from '@/app/projects/easy/typing-speed-test/mock';
import { Badge } from '@/components/ui';

/**
 * Интерфейс для статистики теста скорости печати
 * @typedef Stats
 * @property {number} timeLeft - Оставшееся время в секундах
 * @property {number} charIndex - Текущий индекс символа
 * @property {number} mistakes - Количество ошибок
 * @property {number} wpm - Слов в минуту
 * @property {number} cpm - Символов в минуту
 */
type Stats = {
  timeLeft: number;
  charIndex: number;
  mistakes: number;
  wpm: number;
  cpm: number;
}

/**
 * Компонент страницы теста скорости печати
 * @returns {JSX.Element} Элемент страницы теста скорости печати
 */
const TypingSpeedTestPage = (): JSX.Element => {
  // Начальное состояние статистики
  const initialStats: Stats = {
    timeLeft: 60,
    charIndex: 0,
    mistakes: 0,
    wpm: 0,
    cpm: 0,
  };

  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<Stats>(initialStats);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInputTime = useRef<number>(0);

  /**
   * Инициализирует тест скорости печати
   * @async
   * @returns {Promise<void>}
   */
  const initializeTypingTest = useCallback(async (): Promise<void> => {
    try {
      const typingText = await fetchTypingText();
      setText(typingText);
      setStats(initialStats);
      setIsTyping(false);
      setUserInput('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to fetch typing text', { richColors: true });
    }
  }, []);

  /**
   * Получает текст для теста скорости печати
   * @async
   * @returns {Promise<string>} Текст для теста
   */
  const fetchTypingText = async (): Promise<string> => {
    const randomMockText = textData[Math.floor(Math.random() * textData.length)];
    try {
      const { data: { status, text } } = await axios.get<{
        status: string;
        text: string
      }>('https://fish-text.ru/get?format=json&type=sentence&number=4&self=true');
      return status === 'success' ? text : randomMockText;
    } catch {
      return randomMockText;
    }
  };

  useEffect(() => {
    initializeTypingTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initializeTypingTest]);

  useEffect(() => {
    if (stats.charIndex >= text.length && text.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTyping(false);
    }
  }, [stats.charIndex, text.length]);

  /**
   * Обрабатывает изменение ввода пользователя
   * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения ввода
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const now = Date.now();
    if (now - lastInputTime.current < 10) return; // Simple debounce
    lastInputTime.current = now;

    const value = event.target.value;
    setUserInput(value);

    if (!isTyping && stats.timeLeft > 0) {
      setIsTyping(true);
      timerRef.current = setInterval(initTimer, 1000);
    }

    if (stats.charIndex < text.length && stats.timeLeft > 0) {
      const typedChar = value[stats.charIndex];
      processTypedCharacter(typedChar);
      updateStatistics();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [stats.charIndex, isTyping, text.length, stats.timeLeft]);

  /**
   * Инициализирует таймер
   */
  const initTimer = useCallback((): void => {
    setStats(prev => {
      if (prev.timeLeft <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        return { ...prev, timeLeft: 0 };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1 };
    });
  }, []);

  /**
   * Обрабатывает введенный символ
   * @param {string} typedChar - Введенный символ
   */
  const processTypedCharacter = useCallback((typedChar: string): void => {
    const isCorrect = text[stats.charIndex] === typedChar;
    setStats(prev => ({
      ...prev,
      mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1,
      charIndex: prev.charIndex + 1,
    }));
  }, [stats.charIndex, text]);

  /**
   * Обновляет статистику теста
   */
  const updateStatistics = useCallback((): void => {
    setStats(prev => {
      const cpm = prev.charIndex - prev.mistakes;
      const minutes = (60 - prev.timeLeft) / 60;
      let wpm = prev.wpm;

      if (minutes > 0) {
        const wordsTyped = cpm / 5;
        wpm = Math.round(wordsTyped / minutes);
      }

      return { ...prev, cpm, wpm };
    });
  }, []);

  /**
   * Обрабатывает нажатие кнопки сброса
   */
  const handleResetClick = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    initializeTypingTest();
  }, [initializeTypingTest]);

  /**
   * Мемоизированный массив символов текста с применением стилей
   */
  const textCharacters = useMemo(() => {
    return text.split('').map((char, idx) => {
      const status =
        idx === stats.charIndex ? 'active border-b-2 border-orange-500 text-orange-500' :
          idx < stats.charIndex ? (
            idx < userInput.length && char === userInput[idx] ? 'text-green-500' : 'text-red-500'
          ) : '';

      return (<span key={idx} className={status}>{char}</span>);
    });
  }, [text, stats.charIndex, userInput]);

  return (
    <Card className="max-w-2xl gap-0 w-full mx-auto p-4 rounded">
      <input
        ref={inputRef}
        className="sr-only"
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onFocus={() => setIsTyping(true)}
        autoFocus
      />
      {text.length === 0 && (<Spinner />)}
      <p className="rounded border p-1 tracking-widest">
        {textCharacters}
      </p>
      <ul className="grid grid-cols-4 gap-2 mt-4">
        {[
          { label: 'Time Left', value: `${stats.timeLeft}s` },
          { label: 'Mistakes', value: stats.mistakes },
          { label: 'WPM', value: stats.wpm },
          { label: 'CPM', value: stats.cpm },
        ].map(({ label, value }) => (
          <li key={label} className="flex gap-1.5">
            <p>{label}:</p>
            <Badge>{value}</Badge>
          </li>
        ))}
      </ul>
      <Button onClick={handleResetClick} className="mt-4">Try Again</Button>
    </Card>
  );
};

export default TypingSpeedTestPage;
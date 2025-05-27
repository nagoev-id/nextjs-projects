'use client';

/**
 * # Игра Word Scramble
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация игры**:
 *    - При загрузке компонента выбирается случайное слово из предопределенного списка
 *    - Буквы выбранного слова перемешиваются для отображения игроку
 *    - Устанавливается таймер обратного отсчета (30 секунд)
 *    - Игра ожидает ввода пользователя
 *
 * 2. **Игровой процесс**:
 *    - Пользователь видит перемешанное слово и подсказку к нему
 *    - Пользователь должен ввести правильное слово в поле ввода
 *    - Таймер постоянно отсчитывает оставшееся время
 *    - Пользователь может проверить свой ответ кнопкой "Check Word" или нажатием Enter
 *
 * 3. **Проверка ответа**:
 *    - При проверке ответа система сравнивает введенное слово с правильным
 *    - Если ответ верный, игра завершается успешно с поздравительным сообщением
 *    - Если ответ неверный, показывается сообщение об ошибке, и игра продолжается
 *    - Если поле пустое, показывается предупреждение о необходимости ввода слова
 *
 * 4. **Завершение игры**:
 *    - Игра завершается в двух случаях:
 *      1. Пользователь правильно угадал слово
 *      2. Истекло время таймера (30 секунд)
 *    - При истечении времени показывается сообщение с правильным ответом
 *    - После завершения игры поле ввода блокируется
 *
 * 5. **Обновление игры**:
 *    - Пользователь может начать новую игру в любой момент, нажав "Refresh Word"
 *    - При обновлении выбирается новое случайное слово, сбрасывается таймер и поле ввода
 *
 * 6. **Управление состоянием**:
 *    - Все игровые состояния (время, выбранное слово, статус игры, текст ввода)
 *      объединены в единый объект для упрощения управления
 *    - Используются мемоизированные функции для предотвращения лишних перерендеров
 *    - Таймер реализован через setInterval с корректной очисткой при размонтировании компонента
 *
 * 7. **Адаптивность и доступность**:
 *    - Интерфейс адаптирован для разных размеров экрана
 *    - Используются ARIA-атрибуты для улучшения доступности
 *    - Реализована поддержка управления с клавиатуры (Enter для проверки слова)
 */


import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { wordScrambleItems } from '@/app/projects/easy/word-scramble/mock';
import { toast } from 'sonner';
import { Badge, Input } from '@/components/ui';

/**
 * Типы для игры Word Scramble
 */
type SelectedWord = {
  shuffleWord: string;
  hint: string;
  word: string;
  maxLength: number;
};

/**
 * Состояние игры
 */
type GameState = {
  timeLeft: number;
  selectedWord: SelectedWord;
  isFinished: boolean;
  inputText: string;
  isTimerRunning: boolean;
};

/**
 * Константы для игры
 */
const CONSTANTS = {
  MAX_TIME_LEFT: 30,
  /**
   * Выбирает случайное слово из списка и перемешивает его буквы
   */
  getSelectedWord: (): SelectedWord => {
    const { hint, word } = wordScrambleItems[Math.floor(Math.random() * wordScrambleItems.length)];
    return {
      shuffleWord: word.split('').sort(() => Math.random() - 0.5).join(''),
      hint,
      word: word.toLowerCase(),
      maxLength: word.length,
    };
  },
};

/**
 * Компонент игры Word Scramble
 * Игра, в которой нужно угадать слово по перемешанным буквам
 */
const WordScramblePage = (): JSX.Element => {
  // Объединенное состояние игры
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: CONSTANTS.MAX_TIME_LEFT,
    selectedWord: CONSTANTS.getSelectedWord(),
    isFinished: false,
    inputText: '',
    isTimerRunning: true,
  });

  // Состояние для клиентского рендеринга
  const [isClient, setIsClient] = useState<boolean>(false);

  // Рефы для доступа к DOM и таймерам
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Деструктурируем состояние для удобства
  const { timeLeft, selectedWord, isFinished, inputText, isTimerRunning } = gameState;

  /**
   * Устанавливает флаг клиентского рендеринга после монтирования компонента
   */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Обновляет определенные поля состояния игры
   */
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Обрабатывает истечение времени
   */
  const handleTimeExpired = useCallback((): void => {
    toast.error(`Time off! ${selectedWord.word.toUpperCase()} was the correct word`, { richColors: true });
    updateGameState({ isFinished: true, isTimerRunning: false });
  }, [selectedWord.word, updateGameState]);

  /**
   * Проверяет истечение времени
   */
  useEffect(() => {
    if (timeLeft === 0 && isTimerRunning) handleTimeExpired();
  }, [timeLeft, isTimerRunning, handleTimeExpired]);

  /**
   * Управляет таймером игры
   */
  useEffect(() => {
    // Очищаем предыдущий интервал
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Запускаем таймер только если игра активна
    if (isTimerRunning && !isFinished) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
        }));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning, isFinished]);

  /**
   * Обновляет слово и сбрасывает игру
   */
  const handleRefreshClick = useCallback((): void => {
    updateGameState({
      selectedWord: CONSTANTS.getSelectedWord(),
      inputText: '',
      timeLeft: CONSTANTS.MAX_TIME_LEFT,
      isFinished: false,
      isTimerRunning: true,
    });

    // Фокусируемся на поле ввода после обновления
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [updateGameState]);

  /**
   * Проверяет введенное слово
   */
  const handleCheckWordClick = useCallback((): void => {
    const term = inputText.trim().toLowerCase();
    if (!term) {
      toast.error('Please enter a word', { richColors: true });
      return;
    }
    if (term !== selectedWord.word) {
      toast.error(`Oops! ${term.toUpperCase()} is not a correct word`, { richColors: true });
      return;
    }
    toast.success(`Congrats! The correct word is: ${selectedWord.word.toUpperCase()}`, { richColors: true });
    updateGameState({ isTimerRunning: false, isFinished: true });
  }, [inputText, selectedWord.word, updateGameState]);

  /**
   * Обработчик нажатия Enter в поле ввода
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isFinished) {
      handleCheckWordClick();
    }
  }, [handleCheckWordClick, isFinished]);

  /**
   * Обработчик изменения текста в поле ввода
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    updateGameState({ inputText: e.target.value.toLowerCase() });
  }, [updateGameState]);

  /**
   * Мемоизированный контент компонента
   */
  const memoizedContent = useMemo(() => (
    <Card className="gap-4 max-w-md w-full mx-auto p-3">
      <div className="grid gap-3">
        <p>Word: <Badge className="text-sm font-mono tracking-wider">{selectedWord.shuffleWord}</Badge></p>
        <p>Hint: <Badge className="text-sm">{selectedWord.hint}</Badge></p>
        <p>Time Left: <Badge className="text-sm">{timeLeft}s</Badge></p>
      </div>
      <Input
        spellCheck="false"
        placeholder="Enter a valid word"
        maxLength={selectedWord.maxLength}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        disabled={isFinished}
        aria-label="Word input"
      />
      <div className="grid sm:grid-cols-2 gap-2">
        <Button variant="destructive" onClick={handleRefreshClick}>Refresh Word</Button>
        <Button onClick={handleCheckWordClick} disabled={isFinished}>Check Word</Button>
      </div>
    </Card>
  ), [
    timeLeft,
    selectedWord,
    inputText,
    isFinished,
    handleRefreshClick,
    handleCheckWordClick,
    handleKeyDown,
    handleInputChange,
  ]);

  // Показываем спиннер до загрузки на клиенте
  return !isClient ? <Spinner /> : memoizedContent;
};

export default WordScramblePage;
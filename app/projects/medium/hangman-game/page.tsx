'use client';

/**
 * # Игра "Виселица" (Hangman)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация игры**:
 *    - При загрузке компонента выполняется запрос к API для получения случайного слова
 *    - Устанавливается начальное состояние: пустые массивы правильных и неправильных букв, игра активна
 *    - Добавляется обработчик событий клавиатуры для ввода букв
 *
 * 2. **Игровой процесс**:
 *    - Пользователь вводит буквы с клавиатуры (поддерживаются только буквы A-Z)
 *    - Система проверяет, содержится ли введенная буква в загаданном слове:
 *      - Если буква есть в слове и еще не была угадана, она добавляется в массив правильных букв
 *      - Если буквы нет в слове и она еще не была использована, она добавляется в массив неправильных букв
 *      - Если буква уже была введена ранее, показывается уведомление об ошибке
 *    - С каждой неправильной буквой рисуется новая часть "виселицы" (всего 6 частей)
 *    - Правильно угаданные буквы отображаются на своих позициях в слове
 *
 * 3. **Завершение игры**:
 *    - Игра завершается в двух случаях:
 *      1. Пользователь угадал все буквы в слове (победа):
 *         - Показывается поздравительное сообщение и эффект конфетти
 *         - Игра блокируется для дальнейшего ввода
 *      2. Пользователь совершил 6 ошибок (поражение):
 *         - Показывается сообщение о проигрыше и раскрывается загаданное слово
 *         - Игра блокируется для дальнейшего ввода
 *    - В обоих случаях пользователь может начать новую игру, нажав кнопку "Play Again"
 *
 * 4. **Обработка ошибок и состояний загрузки**:
 *    - Во время загрузки слова отображается индикатор загрузки (спиннер)
 *    - При ошибке загрузки слова показывается сообщение об ошибке
 *    - Игровой контент отображается только после успешной загрузки слова
 *
 * 5. **Управление состоянием**:
 *    - Для управления состоянием используется Redux (Redux Toolkit)
 *    - Состояние включает: загаданное слово, правильные буквы, неправильные буквы, статус игры, статус загрузки
 *    - Все изменения состояния происходят через диспетчеризацию действий Redux
 *
 * 6. **Визуальное представление**:
 *    - Компонент Figure отображает текущее состояние "виселицы" в зависимости от количества ошибок
 *    - Компонент Word показывает загаданное слово с открытыми угаданными буквами
 *    - Компонент WrongLetters отображает список неправильно угаданных букв
 *    - Адаптивный дизайн с использованием Tailwind CSS
 */

import { Card } from '@/components/ui/card';
import { Figure, Word, WrongLetters } from '@/app/projects/medium/hangman-game/components';
import { Spinner } from '@/components/ui/spinner';
import {
  fetchWord,
  handleCorrectLetter,
  handlePlayable,
  handleRestart,
  handleWrongLetter,
  selectHangmanData,
} from '@/app/projects/medium/hangman-game/features';
import { JSX, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/hangman-game/app';
import { toast } from 'sonner';
import { HELPERS } from '@/shared';

/**
 * Основной компонент игры "Виселица" (Hangman)
 *
 * Управляет игровым процессом, обрабатывает ввод пользователя и отображает
 * текущее состояние игры, включая загаданное слово, неправильные буквы и визуальное
 * представление "виселицы".
 *
 * @returns {JSX.Element} Компонент игры Hangman
 */
const HangmanPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, word, correctLetters, wrongLetters, playable, isError } = useAppSelector(selectHangmanData);

  /**
   * Загружает случайное слово при монтировании компонента
   */
  useEffect(() => {
    dispatch(fetchWord());
  }, [dispatch]);

  /**
   * Обрабатывает нажатия клавиш для ввода букв
   *
   * Проверяет, является ли нажатая клавиша буквой (A-Z),
   * и обрабатывает её в зависимости от того, содержится ли она в загаданном слове.
   *
   * @param {KeyboardEvent} event - Событие нажатия клавиши
   */
  const handleKeydown = useCallback((event: KeyboardEvent) => {
    const { key, keyCode } = event;
    if (playable && keyCode >= 65 && keyCode <= 90) {
      const letter = key.toLowerCase();
      if (word && word.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          dispatch(handleCorrectLetter(letter));
        } else {
          toast.error('You have already entered this letter', { richColors: true });
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          dispatch(handleWrongLetter(letter));
        } else {
          toast.error('You have already entered this letter', { richColors: true });
        }
      }
    }
  }, [playable, word, correctLetters, wrongLetters, dispatch]);

  /**
   * Добавляет и удаляет обработчик событий клавиатуры
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  /**
   * Отслеживает состояние игры для определения победы или поражения
   *
   * Проверяет два условия завершения игры:
   * 1. Если количество неправильных букв достигло 6 (поражение)
   * 2. Если все буквы в слове угаданы (победа)
   */
  useEffect(() => {
    if (wrongLetters.length === 6) {
      dispatch(handlePlayable(false));
      toast.error(`Game Over.`, { richColors: true, description: `The word was: ${word?.toUpperCase()}` });
    } else if (word && word.split('').every(letter => correctLetters.includes(letter))) {
      dispatch(handlePlayable(false));
      toast.success('Congratulations! You guessed the word!', { richColors: true });
      HELPERS.showConfetti();
    }
  }, [wrongLetters, correctLetters, word, dispatch]);

  /**
   * Перезапускает игру, сбрасывая состояние и загружая новое слово
   */
  const handleRestartGame = useCallback(() => {
    dispatch(handleRestart());
    dispatch(fetchWord());
  }, [dispatch]);

  return (
    <Card className="max-w-max w-full p-0 mx-auto rounded">
      <div className="grid gap-2 p-4 bg-white dark:bg-accent rounded-md shadow-md">
        {/* Loading */}
        {isLoading && <Spinner />}

        {/* Error */}
        {isError && (
          <p className="text-center text-red-500">An error occurred. Please try again later.</p>
        )}

        {/* Game Content */}
        {!isLoading && !isError && (
          <>
            <WrongLetters />
            <Figure />
            <Word />
            <Button onClick={handleRestartGame}>Play Again</Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default HangmanPage;
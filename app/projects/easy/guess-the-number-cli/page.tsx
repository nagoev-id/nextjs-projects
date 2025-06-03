'use client';

/**
 * # Приложение "Угадай число" (Guess The Number CLI)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация игры**:
 *    - При загрузке компонента генерируется случайное число от 1 до 100.
 *    - Устанавливаются начальные состояния для имени пользователя, списка попыток и статуса игры.
 *
 * 2. **Ввод имени пользователя**:
 *    - Сначала пользователю предлагается ввести свое имя.
 *    - После ввода имени, поле ввода меняется для угадывания числа.
 *
 * 3. **Процесс угадывания**:
 *    - Пользователь вводит число в диапазоне от 0 до 100.
 *    - При каждой попытке проверяется соответствие введенного числа загаданному.
 *    - Пользователю даются подсказки: "слишком высоко" или "слишком низко".
 *    - Каждая попытка сохраняется в истории попыток.
 *
 * 4. **Завершение игры**:
 *    - Игра заканчивается, когда пользователь угадывает число.
 *    - Отображается поздравление и количество попыток.
 *    - Запускается анимация конфетти для визуального эффекта.
 *
 * 5. **Валидация ввода**:
 *    - Проверяется корректность ввода имени и числа.
 *    - При некорректном вводе показываются уведомления с подсказками.
 *
 * 6. **Интерфейс**:
 *    - Адаптивный дизайн с использованием Tailwind CSS.
 *    - Динамическое отображение истории попыток и текущего состояния игры.
 *
 * Приложение предоставляет интерактивный и увлекательный способ игры в "Угадай число",
 * сочетая простой интерфейс с логикой игры и обратной связью пользователю.
 */

import { JSX, useCallback, useRef, useState } from 'react';
import { HELPERS } from '@/shared';
import { toast } from 'sonner';

/**
 * Тип для представления одной попытки угадывания.
 */
type Guess = {
  number: number;
  message: string;
  isGuessed: boolean;
}

/**
 * Компонент страницы игры "Угадай число".
 * @returns {JSX.Element} Рендер компонента игры.
 */
const GuessTheNumberCLIPage = (): JSX.Element => {
  const [userGuess, setUserGuess] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [secretNumber] = useState<number>(() => HELPERS.getRandomNumber(1, 100));
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Обработчик отправки формы.
   * Управляет логикой ввода имени и угадывания числа.
   * @param {React.FormEvent<HTMLFormElement>} e - Событие отправки формы.
   */
  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputType = inputRef.current?.type;
    const inputValue = inputRef.current?.value.trim() ?? '';

    if (inputValue.length === 0 && inputType === 'text' && !userGuess) {
      toast('Please enter a valid input', { richColors: true });
      return;
    }

    if (inputType === 'text' && userGuess === null) {
      setUserGuess(inputValue);
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      return;
    }

    const value = Number(inputValue);

    if (userGuess && (!Number.isFinite(value) || value < 0 || value > 100)) {
      toast('Please enter a valid number between 0 and 100', { richColors: true });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    if (inputType === 'number' && userGuess) {
      setGuesses(prevState => {
        const message = value > secretNumber
          ? 'Too high. Try again 😸'
          : value < secretNumber
            ? 'Too low. Try again 😸'
            : `🎊 Right. The number you've guessed: ${value}`;
        const isGuessed = value === secretNumber;
        if (isGuessed) {
          setIsFinished(true);
          HELPERS.showConfetti();
        }
        return [...prevState, { number: value, message, isGuessed }];
      });
    }

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [secretNumber, userGuess]);
  
  return (
    <div className="grid gap-3 p-4 text-yellow-400 xl:text-2xl bg-neutral-700 rounded-md dark:bg-black">
      <h1 className="text-2xl font-bold md:text-3xl">🎲 Guess number</h1>
      {userGuess !== null && (
        <p>😄 <span className="font-bold uppercase">{userGuess}</span>, there is a number between <span
          className="font-bold">0</span> and <span className="font-bold">100</span>. Try to
          guess it in the
          fewest number of tries. After each attempt, there will be a message with the text - <span
            className="font-bold uppercase">low</span> or <span className="font-bold uppercase">high</span>
        </p>
      )}

      {guesses.length !== 0 && (
        <ul className="grid gap-3">
          {guesses.map(({ number, message, isGuessed }, idx) => (
            <li className="grid gap-2" key={idx}>
              <p className="text-2xl font-medium">➡️ {number}</p>
              <p>{message}</p>
              {isGuessed && <p>🎉 Number of attempts: <span className="font-bold">{guesses.length}</span></p>}
            </li>
          ))}
        </ul>
      )}
      {!isFinished && (
        <form onSubmit={handleFormSubmit}>
          <label>
            <input
              className="border-b-2 border-yellow-400 bg-transparent px-3 py-2.5 outline-none"
              type={!userGuess ? 'text' : 'number'}
              name={!userGuess ? 'name' : 'guess'}
              placeholder={!userGuess ? '👋 Enter your name' : 'Enter number'}
              ref={inputRef}
              autoFocus
            />
          </label>
        </form>
      )}
    </div>
  );
};

export default GuessTheNumberCLIPage;
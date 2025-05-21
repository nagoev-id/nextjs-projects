'use client';

/**
 * # Игра "Угадай число"
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - При загрузке компонента генерируется случайное число от 1 до 10
 *    - Создается состояние игры с начальными значениями (попытки: 0, завершено: false)
 *    - Инициализируется форма с валидацией через Zod (только числа от 1 до 10)
 * 
 * 2. **Игровой процесс**:
 *    - Пользователь вводит предполагаемое число в форму
 *    - При отправке формы введенное число сравнивается с загаданным
 *    - Счетчик попыток увеличивается на 1 с каждой попыткой
 *    - Пользователь получает подсказку: "слишком мало" или "слишком много"
 * 
 * 3. **Завершение игры**:
 *    - Когда пользователь угадывает число, игра помечается как завершенная
 *    - Отображается поздравительное сообщение с количеством использованных попыток
 *    - Форма ввода заменяется кнопкой "Сыграть снова"
 * 
 * 4. **Перезапуск игры**:
 *    - При нажатии на кнопку "Сыграть снова" генерируется новое случайное число
 *    - Все счетчики и состояния сбрасываются до начальных значений
 *    - Форма очищается и снова становится доступной для ввода
 * 
 * 5. **Валидация ввода**:
 *    - Форма принимает только числа от 1 до 10
 *    - Кнопка отправки отключена, пока введенное значение не проходит валидацию
 *    - Используется схема валидации Zod для проверки ввода
 * 
 * 6. **Доступность**:
 *    - Все элементы управления имеют соответствующие ARIA-атрибуты
 *    - Динамические сообщения объявляются для скринридеров
 *    - Цветовая схема обеспечивает достаточный контраст
 */

import { Card } from '@/components/ui/card';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { guessNumberSchema, GuessNumberValues } from '@/app/projects/easy/guess-the-number/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';

/**
 * Интерфейс для состояния игры
 * @interface GameSetup
 * @property {number} randomNumber - Загаданное случайное число от 1 до 10
 * @property {number} attempts - Количество попыток, сделанных пользователем
 * @property {boolean} isFinished - Флаг, указывающий завершена ли игра (число угадано)
 * @property {string} message - Сообщение для пользователя о результате последней попытки
 */
type GameSetup = {
  randomNumber: number;
  attempts: number;
  isFinished: boolean;
  message: string;
}

/**
 * Компонент игры "Угадай число"
 * Реализует интерактивную игру, где пользователь должен угадать случайное число от 1 до 10
 * с минимальным количеством попыток. Предоставляет подсказки после каждой попытки.
 * 
 * @returns {JSX.Element} Компонент страницы игры с формой ввода и обратной связью
 */
const GuessTheNumberPage = () => {
  /**
   * Состояние игры, содержащее загаданное число, количество попыток,
   * статус завершения и текущее сообщение для пользователя
   */
  const [gameSetup, setGameSetup] = useState<GameSetup>({
    randomNumber: Math.floor(Math.random() * 10) + 1,
    attempts: 0,
    isFinished: false,
    message: ''
  });
  
  /**
   * Инициализация формы с валидацией через Zod
   * Настроена на проверку ввода числа от 1 до 10
   */
  const form = useForm<GuessNumberValues>({
    resolver: zodResolver(guessNumberSchema),
    mode: 'onChange',
    defaultValues: {
      number: ''
    }
  });

  /**
   * Обработчик для перезапуска игры
   * Генерирует новое случайное число, сбрасывает счетчик попыток,
   * очищает сообщения и возвращает игру в начальное состояние
   * 
   * @returns {void}
   */
  const handleButtonClick = useCallback(() => {
    setGameSetup({
      randomNumber: Math.floor(Math.random() * 10) + 1,
      attempts: 0,
      isFinished: false,
      message: ''
    });
    form.reset();
  }, [form]);

  /**
   * Обработчик отправки формы с предполагаемым числом
   * Сравнивает введенное число с загаданным, обновляет счетчик попыток,
   * генерирует соответствующее сообщение и обновляет состояние игры
   * 
   * @param {GuessNumberValues} data - Данные формы с введенным числом
   * @returns {void}
   */
  const onSubmit = useCallback((data: GuessNumberValues) => {
    const userGuess = Number(data.number);
    
    setGameSetup(prev => {
      const newAttempts = prev.attempts + 1;
      
      // Определяем результат попытки
      if (userGuess === prev.randomNumber) {
        return {
          ...prev,
          attempts: newAttempts,
          message: `Congratulations! You guessed the number ${prev.randomNumber} in ${newAttempts} attempts!`,
          isFinished: true,
        };
      } else if (userGuess < prev.randomNumber) {
        return {
          ...prev,
          attempts: newAttempts,
          message: 'Too low! Try a higher number.'
        };
      } else {
        return {
          ...prev,
          attempts: newAttempts,
          message: 'Too high! Try a lower number.'
        };
      }
    });
    
    // Сбрасываем форму только если число не угадано
    if (userGuess !== gameSetup.randomNumber) {
      form.reset();
    }
  }, [form, gameSetup.randomNumber]);

  /**
   * Определяем класс для стилизации сообщения в зависимости от состояния игры
   * Зеленый для успешного завершения, красный для подсказок
   */
  const messageClass = gameSetup.isFinished 
    ? 'text-green-600 bg-green-50 border-green-200' 
    : 'text-red-500 bg-red-50 border-red-200';

  return (
    <Card className="max-w-md grid gap-3 w-full mx-auto p-4 rounded">
      <h1 className="text-xl font-bold text-center">Guess the Number</h1>
      
      <p>
        Guess the Number is a game in which you have to guess a number given by the computer from <span
        className="font-bold">1</span> to <span className="font-bold">10</span>. Use as few
        tries as possible. Good luck!
      </p>
      
      {/* Отображение сообщения о результате попытки или успешном завершении */}
      {gameSetup.message && (
        <p 
          className={`border text-center font-medium rounded-sm p-2 ${messageClass}`}
          role="status"
          aria-live="polite"
        >
          {gameSetup.message}
        </p>
      )}
      
      {/* Отображение формы ввода или кнопки перезапуска в зависимости от состояния игры */}
      {!gameSetup.isFinished ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormInput 
              form={form} 
              name="number" 
              placeholder="Enter a number (from 1 to 10)" 
              autoComplete="off"
              aria-label="Your guess"
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={!form.formState.isValid}
            >
              Submit Guess
            </Button>
          </form>
        </Form>
      ) : (
        <Button 
          onClick={handleButtonClick} 
          className="w-full"
          aria-label="Start a new game"
        >
          Play it again?
        </Button>
      )}
      
      {/* Отображение счетчика попыток, если игра не завершена и была хотя бы одна попытка */}
      {gameSetup.attempts > 0 && !gameSetup.isFinished && (
        <p className="text-center text-sm" aria-live="polite">
          Attempts so far: <span className="font-bold">{gameSetup.attempts}</span>
        </p>
      )}
      
      {/* Для отладки: раскомментируйте, чтобы видеть загаданное число */}
      {/* <p className="text-xs text-gray-400 text-center">Debug: {gameSetup.randomNumber}</p> */}
    </Card>
  );
};

export default GuessTheNumberPage;
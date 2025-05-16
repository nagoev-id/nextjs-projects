'use client';

/**
 * # Секундомер
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - Создаются состояния для отслеживания времени и статуса работы секундомера
 *    - Используются рефы для хранения интервала, начального времени и накопленного времени
 *
 * 2. **Управление временем**:
 *    - Запуск: начинает отсчет времени от текущего момента, добавляя к накопленному времени
 *    - Пауза: останавливает отсчет и сохраняет текущее значение времени
 *    - Сброс: обнуляет все значения и останавливает секундомер
 *
 * 3. **Отображение**:
 *    - Время отображается в формате MM:SS с ведущими нулями
 *    - Кнопки управления меняют свою доступность в зависимости от состояния секундомера
 */
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HELPERS } from '@/shared';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Компонент секундомера с функциями запуска, паузы и сброса
 * @returns {JSX.Element} Компонент секундомера
 */
const StopWatchPage = (): JSX.Element => {
  // Состояния и рефы для управления секундомером
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Вычисление минут и секунд из общего времени
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  /**
   * Очищает интервал секундомера
   */
  const clearStopwatchInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Запускает секундомер
   */
  const start = useCallback(() => {
    if (isRunning) return;

    clearStopwatchInterval();
    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTime(accumulatedTimeRef.current + elapsedTime);
    }, 100);
  }, [isRunning, clearStopwatchInterval]);

  /**
   * Приостанавливает секундомер
   */
  const pause = useCallback(() => {
    if (!isRunning) return;

    clearStopwatchInterval();
    accumulatedTimeRef.current = time;
    setIsRunning(false);
  }, [isRunning, time, clearStopwatchInterval]);

  /**
   * Сбрасывает секундомер
   */
  const reset = useCallback(() => {
    clearStopwatchInterval();
    setIsRunning(false);
    setTime(0);
    accumulatedTimeRef.current = 0;
  }, [clearStopwatchInterval]);

  // Определение кнопок управления и их состояний
  const buttons = [
    {
      type: 'start',
      variant: 'default' as const,
      disabled: isRunning,
      onClick: start
    },
    {
      type: 'pause',
      variant: 'secondary' as const,
      disabled: !isRunning,
      onClick: pause
    },
    {
      type: 'reset',
      variant: 'destructive' as const,
      disabled: time === 0 && !isRunning,
      onClick: reset
    },
  ];

  // Очистка интервала при размонтировании компонента
  useEffect(() => {
    return clearStopwatchInterval;
  }, [clearStopwatchInterval]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <div className="text-center font-bold text-2xl md:text-7xl leading-none" role="timer" aria-live="polite">
        {HELPERS.addLeadingZero(minutes)}:{HELPERS.addLeadingZero(seconds)}
      </div>
      <div className="grid gap-2 sm:grid-cols-3 mt-4">
        {buttons.map(({ type, variant, disabled, onClick }) => (
          <Button
            key={type}
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            aria-label={`${HELPERS.capitalizeFirstLetter(type)} stopwatch`}
          >
            {HELPERS.capitalizeFirstLetter(type)}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default StopWatchPage;
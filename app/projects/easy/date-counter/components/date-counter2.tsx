import React, { ChangeEvent, JSX, useCallback, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, RotateCcw } from 'lucide-react';

/**
 * Компонент расширенного счетчика дат
 * Позволяет изменять дату с помощью кнопок, ползунка и прямого ввода значения
 * 
 * @returns {JSX.Element} Компонент расширенного счетчика дат
 */
export default function DateCounter2(): JSX.Element {
  /**
   * Состояние для хранения смещения дней от базовой даты
   * Может быть числом или строкой (для поддержки пустого ввода)
   */
  const [count, setCount] = useState<number | string>(0);

  /**
   * Состояние для хранения шага изменения счетчика
   */
  const [step, setStep] = useState<number>(1);

  /**
   * Базовая дата (сегодня), от которой рассчитывается смещение
   * Используется useRef для сохранения начальной даты между рендерами
   */
  const baseDate = useRef<Date>(new Date()).current;

  /**
   * Преобразует текущее значение count в числовое значение
   * Обрабатывает случаи, когда count может быть строкой или пустым значением
   */
  const numericCount = useMemo<number>(() => {
    if (typeof count === 'number') return count;
    return count === '' ? 0 : Number(count);
  }, [count]);

  /**
   * Вычисляет новую дату на основе базовой даты и числового смещения
   */
  const currentDate = useMemo<Date>(() => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + numericCount);
    return date;
  }, [baseDate, numericCount]);

  /**
   * Обработчик изменения счетчика дней
   * Увеличивает или уменьшает значение на указанный шаг
   * 
   * @param {boolean} increment - Флаг увеличения/уменьшения счетчика
   */
  const handleCountChange = useCallback((increment: boolean): void => {
    setCount((prevCount) => {
      // Если значение пустое и нужно уменьшить, возвращаем 0
      if (prevCount === '' && !increment) return 0;
      
      // Преобразуем предыдущее значение в число
      const prevNumeric = typeof prevCount === 'number' 
        ? prevCount 
        : (prevCount === '' ? 0 : Number(prevCount));
      
      // Вычисляем новое значение
      const newCount = prevNumeric + (increment ? step : -step);
      
      // Проверяем на NaN и возвращаем соответствующее значение
      return isNaN(newCount) ? prevCount : newCount;
    });
  }, [step]);

  /**
   * Формирует сообщение о текущей дате относительно базовой
   * 
   * @returns {string} Текстовое описание даты
   */
  const getDateMessage = useCallback((): string => {
    if (count === 0 || count === '') return 'Today is ';
    
    const absCount = Math.abs(numericCount);
    return numericCount > 0
      ? `${absCount} day${absCount !== 1 ? 's' : ''} from today is `
      : `${absCount} day${absCount !== 1 ? 's' : ''} ago was `;
  }, [count, numericCount]);

  /**
   * Сбрасывает счетчик и шаг к начальным значениям
   */
  const handleResetClick = useCallback((): void => {
    setCount(0);
    setStep(1);
  }, []);

  /**
   * Обработчик изменения ползунка шага
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - Событие изменения ползунка
   */
  const handleRangeChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10);
    setStep(isNaN(value) ? 1 : value);
  }, []);

  /**
   * Обработчик изменения поля ввода счетчика
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - Событие изменения поля ввода
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    
    // Если поле пустое, устанавливаем пустую строку
    if (newValue === '') {
      setCount('');
      return;
    }

    // Преобразуем введенное значение в число
    const parsed = parseInt(newValue, 10);
    setCount(isNaN(parsed) ? 0 : parsed);
  }, []);

  /**
   * Определяет, нужно ли показывать кнопку сброса
   * Кнопка отображается, если значения отличаются от начальных
   */
  const showResetButton: boolean = count !== 0 || step !== 1;

  return (
    <Card className="p-4 grid gap-4 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-center font-semibold text-2xl">Date Counter</h2>
        {showResetButton && (
          <Button
            onClick={handleResetClick}
            variant="ghost"
            size="sm"
            aria-label="Reset counter and step"
            title="Reset to initial values"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Ползунок для выбора шага */}
      <div className="grid gap-2">
        <label htmlFor="step-slider" className="text-sm text-gray-500">
          Adjustment Step
        </label>
        <input
          id="step-slider"
          className="w-full accent-primary"
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={handleRangeChange}
          aria-label="Step adjustment slider"
        />
        <p className="text-center text-sm">
          Step: <span className="font-bold">{step}</span> day{step !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Элементы управления счетчиком */}
      <div className="grid gap-2 grid-cols-[auto_1fr_auto]">
        <Button
          onClick={() => handleCountChange(false)}
          aria-label="Decrease date"
          variant="outline"
          size="icon"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={count}
          step={step}
          onChange={handleInputChange}
          aria-label="Date offset input"
          className="text-center"
        />
        <Button
          onClick={() => handleCountChange(true)}
          aria-label="Increase date"
          variant="default"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Отображение результата */}
      <div 
        className="p-3 bg-muted rounded-md text-center"
        aria-live="polite"
        role="status"
      >
        <p className="flex flex-wrap gap-1 justify-center text-lg">
          <span>{getDateMessage()}</span>
          <time 
            dateTime={currentDate.toISOString()} 
            className="font-bold"
          >
            {count === '' ? 'Select a date' : currentDate.toDateString()}
          </time>
        </p>
      </div>

      {/* Кнопка сброса (альтернативная, полноразмерная) */}
      {showResetButton && (
        <Button
          className="w-full mt-2"
          onClick={handleResetClick}
          variant="secondary"
          aria-label="Reset counter and step"
        >
          Reset All Values
        </Button>
      )}
    </Card>
  );
}
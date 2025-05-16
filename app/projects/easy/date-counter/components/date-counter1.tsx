import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, RotateCcw } from 'lucide-react';

/**
 * Компонент счетчика дат
 * Позволяет изменять дату, добавляя или вычитая определенное количество дней
 * с настраиваемым шагом изменения
 * 
 * @returns {JSX.Element} Компонент счетчика дат
 */
export default function DateCounter1(): JSX.Element {
  /**
   * Состояние для хранения текущего смещения дней от базовой даты
   */
  const [count, setCount] = useState<number>(0);
  
  /**
   * Состояние для хранения шага изменения дней
   */
  const [step, setStep] = useState<number>(1);
  
  /**
   * Референс для хранения базовой даты (сегодня)
   * Используется реф вместо состояния, так как базовая дата не должна меняться
   * при перерендерах компонента
   */
  const baseDate = useRef<Date>(new Date());

  /**
   * Вычисляет текущую дату на основе базовой даты и смещения (count)
   * Мемоизируется для предотвращения лишних вычислений при перерендерах
   */
  const currentDate = useMemo<Date>(() => {
    const date = new Date(baseDate.current);
    date.setDate(date.getDate() + count);
    return date;
  }, [count]);

  /**
   * Обработчик изменения счетчика дней
   * 
   * @param {boolean} increment - Флаг увеличения/уменьшения счетчика
   */
  const handleCountChange = useCallback((increment: boolean): void => {
    setCount((prevCount: number) => prevCount + (increment ? step : -step));
  }, [step]);

  /**
   * Обработчик изменения шага счетчика
   * Минимальное значение шага - 1
   * 
   * @param {boolean} increment - Флаг увеличения/уменьшения шага
   */
  const handleStepChange = useCallback((increment: boolean): void => {
    setStep((prevStep: number) => Math.max(1, prevStep + (increment ? 1 : -1)));
  }, []);

  /**
   * Обработчик сброса счетчика и шага к начальным значениям
   */
  const handleReset = useCallback((): void => {
    setCount(0);
    setStep(1);
  }, []);

  /**
   * Формирует текстовое сообщение о текущей дате относительно сегодняшней
   * Мемоизируется для предотвращения лишних вычислений при перерендерах
   */
  const dateMessage = useMemo((): string => {
    if (count === 0) return 'Today is ';
    if (count > 0) return `${count} days from today is `;
    return `${Math.abs(count)} days ago was `;
  }, [count]);

  /**
   * Рендерит элемент управления (счетчик или шаг)
   * 
   * @param {string} label - Название элемента управления
   * @param {number} value - Текущее значение
   * @param {function} handler - Обработчик изменения значения
   * @returns {JSX.Element} Элемент управления
   */
  const renderControl = useCallback((
    label: string,
    value: number,
    handler: (increment: boolean) => void,
  ): JSX.Element => (
    <div className="grid gap-2 grid-cols-[1fr_200px_1fr]" role="group" aria-labelledby={`${label.toLowerCase()}-label`}>
      <Button 
        onClick={() => handler(false)} 
        aria-label={`Decrease ${label}`}
        variant="outline"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <p className="text-lg text-center" id={`${label.toLowerCase()}-label`}>
        {label}: <span className="font-bold">{value}</span>
      </p>
      <Button 
        onClick={() => handler(true)} 
        aria-label={`Increase ${label}`}
        variant="default"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ), []);

  return (
    <Card className="p-4 grid gap-3 items-start">
      <div className="flex justify-between items-center">
        <h2 className="text-center font-semibold text-2xl">Date Counter</h2>
        <Button 
          onClick={handleReset} 
          variant="ghost" 
          size="sm"
          aria-label="Reset counter"
          title="Reset to initial values"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {renderControl('Count Days', count, handleCountChange)}
      {renderControl('Step Days', step, handleStepChange)}
      
      <p className="flex gap-1 justify-center" aria-live="polite">
        <span>{dateMessage}</span>
        <time dateTime={currentDate.toISOString()} className="font-bold text-lg">
          {currentDate.toDateString()}
        </time>
      </p>
    </Card>
  );
}
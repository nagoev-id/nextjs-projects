'use client';

/**
 * # Простой счетчик
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке компонента создается состояние счетчика с начальным значением 0
 *    - Устанавливаются минимальное (-100) и максимальное (100) значения счетчика
 *
 * 2. **Управление счетчиком**:
 *    - Пользователь может увеличить значение счетчика на 1 (кнопка "Increment")
 *    - Пользователь может уменьшить значение счетчика на 1 (кнопка "Decrement")
 *    - Пользователь может сбросить значение счетчика до 0 (кнопка "Reset")
 *
 * 3. **Ограничения**:
 *    - Значение счетчика не может быть меньше минимального значения (-100)
 *    - Значение счетчика не может быть больше максимального значения (100)
 *    - При достижении предельных значений счетчик останавливается на этих значениях
 *
 * 4. **Доступность**:
 *    - Интерфейс полностью доступен для скринридеров
 *    - Каждая кнопка имеет соответствующий aria-label для описания действия
 *    - Текущее значение счетчика объявляется как живой регион для скринридеров
 */

import { JSX, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Тип для состояния счетчика
 * @typedef {Object} CounterNumber
 * @property {number} min - Минимальное допустимое значение счетчика
 * @property {number} max - Максимальное допустимое значение счетчика
 * @property {number} initialCount - Текущее значение счетчика
 */
type CounterNumber = {
  min: number;
  max: number;
  initialCount: number;
}

/**
 * Тип для действий счетчика
 * 1: увеличение на единицу
 * 0: сброс до нуля
 * -1: уменьшение на единицу
 * @typedef {(1|0|-1)} CounterAction
 */
type CounterAction = 1 | 0 | -1;

/**
 * Тип для вариантов стилей кнопок
 * @typedef {('default'|'destructive'|'outline'|'secondary'|'ghost'|'link'|undefined)} ButtonVariant
 */
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | undefined;

/**
 * Массив действий счетчика с их описанием и стилями
 * @constant {Array<{label: string, action: CounterAction, ariaLabel: string, variant: ButtonVariant}>}
 */
const COUNTER_ACTIONS = [
  {
    label: 'Decrement',
    action: -1 as CounterAction,
    ariaLabel: 'Reduce value',
    variant: 'destructive' as ButtonVariant,
  },
  {
    label: 'Reset',
    action: 0 as CounterAction,
    ariaLabel: 'Reset the meaning',
    variant: 'secondary' as ButtonVariant,
  },
  {
    label: 'Increment',
    action: 1 as CounterAction,
    ariaLabel: 'Increase value',
    variant: 'default' as ButtonVariant,
  },
];

/**
 * Компонент счетчика
 * Позволяет увеличивать, уменьшать и сбрасывать значение в пределах заданного диапазона
 *
 * @returns {JSX.Element} Компонент счетчика
 */
const CounterPage = (): JSX.Element => {
  /**
   * Состояние счетчика
   * Содержит текущее значение и ограничения
   */
  const [number, setNumber] = useState<CounterNumber>({
    min: -100,
    max: 100,
    initialCount: 0,
  });

  /**
   * Обрабатывает действия с счетчиком (увеличение, уменьшение, сброс)
   * Обеспечивает соблюдение ограничений минимального и максимального значений
   *
   * @param {CounterAction} action - Действие для выполнения (1, 0, -1)
   */
  const handleCounterAction = (action: CounterAction) => {
    setNumber((prevNumber: CounterNumber) => {
      // Если действие - сброс (0), возвращаем начальное значение 0
      if (action === 0) {
        return { ...prevNumber, initialCount: 0 };
      }

      // Вычисляем новое значение счетчика
      const newCount = prevNumber.initialCount + action;

      // Проверяем, не вышло ли новое значение за нижнюю границу
      if (newCount < prevNumber.min) {
        return { ...prevNumber, initialCount: prevNumber.min };
      }

      // Проверяем, не вышло ли новое значение за верхнюю границу
      if (newCount > prevNumber.max) {
        return { ...prevNumber, initialCount: prevNumber.max };
      }

      // Если все проверки пройдены, обновляем значение счетчика
      return { ...prevNumber, initialCount: newCount };
    });
  };

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded shadow-md">
      {/* Отображение текущего значения счетчика */}
      <div
        className="text-6xl md:text-8xl font-bold text-center mb-4"
        role="status"
        aria-live="polite"
        aria-label="The current value of the counter"
      >
        {number.initialCount}
      </div>

      {/* Кнопки управления счетчиком */}
      <div className="grid gap-2 sm:grid-cols-3">
        {COUNTER_ACTIONS.map(({ label, action, ariaLabel, variant }) => (
          <Button
            className="cursor-pointer transition-all duration-200 hover:scale-102 border"
            variant={variant}
            key={label}
            onClick={() => handleCounterAction(action)}
            aria-label={ariaLabel}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default CounterPage;
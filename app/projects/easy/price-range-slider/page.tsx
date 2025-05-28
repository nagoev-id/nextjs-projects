'use client';

/**
 * # Приложение ценового диапазона (Price Range Slider)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение использует React с хуками состояния для управления ценовым диапазоном
 *    - Начальное состояние включает минимальную и максимальную цены, шаг изменения, общий диапазон и минимальный разрыв между ценами
 *    - Все параметры хранятся в едином объекте состояния для удобства управления
 *
 * 2. **Взаимодействие с пользователем**:
 *    - Пользователь может изменять минимальную и максимальную цены двумя способами:
 *      - Через числовые поля ввода (для точного указания значений)
 *      - Через ползунки диапазона (для интуитивного визуального выбора)
 *    - Оба метода ввода синхронизированы и обновляют одно и то же состояние
 *
 * 3. **Логика ограничений**:
 *    - Реализована система ограничений для предотвращения некорректных значений:
 *      - Минимальная цена не может быть меньше общего минимума (0)
 *      - Максимальная цена не может быть больше общего максимума (10000)
 *      - Между минимальной и максимальной ценами всегда сохраняется минимальный разрыв (gap = 1000)
 *      - Значения автоматически корректируются при попытке нарушить эти ограничения
 *
 * 4. **Визуальное представление**:
 *    - Текущий выбранный диапазон отображается визуально с помощью заполненной области между ползунками
 *    - Положение и размер заполненной области вычисляются динамически на основе текущих значений
 *    - Для расчета используются проценты от общего диапазона для корректного отображения при любых значениях
 *
 * 5. **Оптимизация производительности**:
 *    - Функции обработчики событий мемоизированы с помощью useCallback для предотвращения лишних перерендеров
 *    - Стили прогресс-бара вычисляются с помощью useMemo для оптимизации вычислений
 *    - Зависимости хуков тщательно подобраны для обновления только при необходимых изменениях состояния
 *
 * 6. **Доступность**:
 *    - Все элементы управления имеют соответствующие атрибуты aria для обеспечения доступности
 *    - Используются семантически правильные HTML-элементы
 *    - Добавлены aria-label для элементов без видимых текстовых меток
 *
 * 7. **Адаптивный дизайн**:
 *    - Интерфейс адаптируется к различным размерам экрана с помощью медиа-запросов
 *    - На мобильных устройствах элементы перестраиваются для лучшего пользовательского опыта
 *    - Используются относительные единицы измерения для обеспечения масштабируемости
 *
 * 8. **Обработка ввода**:
 *    - Реализована валидация и нормализация вводимых значений
 *    - Значения автоматически приводятся к допустимому диапазону
 *    - Шаг изменения (100) обеспечивает удобное и предсказуемое изменение значений
 */

import { Card } from '@/components/ui/card';
import { ChangeEvent, Fragment, JSX, useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui';

/**
 * Тип для состояния ценового диапазона
 * @typedef {Object} InitialState
 * @property {number} gap - Минимальный разрыв между минимальной и максимальной ценами
 * @property {number} min - Абсолютный минимум диапазона цен
 * @property {number} max - Абсолютный максимум диапазона цен
 * @property {number} step - Шаг изменения цены
 * @property {number} minPrice - Текущая минимальная цена
 * @property {number} maxPrice - Текущая максимальная цена
 */
type InitialState = {
  gap: number;
  min: number;
  max: number;
  step: number;
  minPrice: number;
  maxPrice: number;
}

/**
 * Начальные значения для состояния ценового диапазона
 * @constant
 * @type {InitialState}
 */
const INITIAL_STATE: InitialState = {
  gap: 1000,
  min: 0,
  max: 10000,
  step: 100,
  minPrice: 1800,
  maxPrice: 7800,
};

/**
 * Компонент ценового диапазона с двойным ползунком
 * Позволяет пользователю выбрать минимальную и максимальную цены в заданном диапазоне
 * с соблюдением минимального разрыва между значениями
 *
 * @returns {JSX.Element} Компонент ценового диапазона
 */
const PriceRangeSliderPage = (): JSX.Element => {
  const [initialState, setInitialState] = useState<InitialState>(INITIAL_STATE);

  /**
   * Обрабатывает изменение цены (минимальной или максимальной)
   * Обеспечивает соблюдение ограничений диапазона и минимального разрыва между ценами
   *
   * @param {number} newValue - Новое значение цены
   * @param {boolean} isMin - Флаг, указывающий изменяется ли минимальная цена (true) или максимальная (false)
   */
  const handlePriceChange = useCallback((newValue: number, isMin: boolean) => {
    const limitedValue = Math.max(initialState.min, Math.min(initialState.max, newValue));
    setInitialState(prevState => {
      return {
        ...prevState,
        minPrice: isMin ? Math.min(limitedValue, initialState.maxPrice - initialState.gap) : prevState.minPrice,
        maxPrice: isMin ? prevState.maxPrice : Math.max(limitedValue, initialState.minPrice + initialState.gap),
      };
    });
  }, [initialState.maxPrice, initialState.minPrice, initialState.min, initialState.max, initialState.gap]);

  /**
   * Обрабатывает изменение значения в полях ввода
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения поля ввода
   * @param {boolean} isMin - Флаг, указывающий изменяется ли минимальная цена (true) или максимальная (false)
   */
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    handlePriceChange(Number(event.target.value), isMin);
  }, [handlePriceChange]);

  /**
   * Вычисляет стили для визуального отображения выбранного диапазона цен
   *
   * @returns {{left: string, right: string}} Объект со стилями для позиционирования индикатора прогресса
   */
  const getProgressStyle = useMemo((): { left: string; right: string } => {
    return {
      left: `${((initialState.minPrice - initialState.min) / (initialState.max - initialState.min)) * 100}%`,
      right: `${100 - ((initialState.maxPrice - initialState.min) / (initialState.max - initialState.min)) * 100}%`,
    };
  }, [initialState.maxPrice, initialState.minPrice, initialState.min, initialState.max]);

  return (
    <Card className="max-w-md price-slider gap-0 w-full mx-auto p-4 rounded">
      <div className="grid sm:grid-cols-[1fr_30px_1fr] sm:gap-1 sm:place-items-center">
        {['Min', 'Max'].map((label, index) => (
          <Fragment key={label}>
            {index === 1 &&
              <span className="block sm:h-0.5 sm:w-4 sm:bg-black dark:sm:bg-white sm:mt-5" aria-hidden="true" />}
            <Label className="grid w-full" htmlFor={label}>
              <span className="block">{label}</span>
              <Input
                type="number"
                value={index === 0 ? initialState.minPrice : initialState.maxPrice}
                onChange={(e) => handleInputChange(e, index === 0)}
                min={index === 0 ? initialState.min : initialState.minPrice + initialState.gap}
                max={index === 0 ? initialState.maxPrice - initialState.gap : initialState.max}
                step={initialState.step}
                id={label}
                className="w-full"
              />
            </Label>
          </Fragment>
        ))}
      </div>

      <div className="slider mt-6" role="presentation">
        <div className="slider__progress" style={getProgressStyle} aria-hidden="true"></div>
      </div>

      <div className="ranges">
        <Input
          className="ranges__input"
          type="range"
          min={initialState.min}
          max={initialState.max}
          value={initialState.minPrice}
          step={initialState.step}
          onChange={(e) => handleInputChange(e, true)}
          aria-label="Minimum price"
        />
        <Input
          className="ranges__input"
          type="range"
          min={initialState.min}
          max={initialState.max}
          value={initialState.maxPrice}
          step={initialState.step}
          onChange={(e) => handleInputChange(e, false)}
          aria-label="Maximum price"
        />
      </div>

      <div className="flex justify-between text-sm mt-2">
        <span>${initialState.min}</span>
        <span>${initialState.max}</span>
      </div>
    </Card>
  );
};

export default PriceRangeSliderPage;
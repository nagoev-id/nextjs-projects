'use client';

/**
 * # Трекер потребления воды
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и хранение данных**:
 *    - Приложение использует localStorage для сохранения настроек и прогресса между сессиями
 *    - Данные хранятся с помощью кастомного хука useStorage, который синхронизирует состояние с localStorage
 *    - При первом запуске пользователь устанавливает дневную цель потребления воды и размер стакана
 *
 * 2. **Расчет и отображение прогресса**:
 *    - На основе целевого объема и размера стакана рассчитывается необходимое количество стаканов
 *    - Визуальный индикатор показывает процент выполнения дневной нормы
 *    - Отображается оставшийся объем воды для достижения цели
 *    - Прогресс обновляется в реальном времени при отметке выпитых стаканов
 *
 * 3. **Взаимодействие с пользователем**:
 *    - Пользователь отмечает выпитые стаканы воды нажатием на соответствующие элементы
 *    - При нажатии на стакан, он и все предыдущие отмечаются как выпитые
 *    - Возможность сбросить все настройки и начать отслеживание заново
 *
 * 4. **Оптимизация производительности**:
 *    - Использование мемоизации для предотвращения лишних перерендеров компонентов
 *    - Вынесение компонентов формы и стаканов в отдельные мемоизированные компоненты
 *    - Эффективное обновление состояния с минимальным количеством перерисовок
 *
 * 5. **Валидация данных**:
 *    - Проверка корректности введенных пользователем данных
 *    - Обработка ошибок при работе с localStorage
 *    - Защита от некорректных значений при расчетах
 *
 * Приложение предоставляет простой и наглядный способ отслеживания ежедневного потребления воды,
 * помогая пользователям поддерживать водный баланс и формировать полезную привычку.
 */

import { JSX, memo, useCallback, useEffect, useMemo } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, formSchema } from '@/app/projects/easy/drink-water-tracker/utils';
import { FormInput, FormSelect } from '@/components/layout';
import { useStorage } from '@/shared/hooks';

/**
 * Константы по умолчанию для приложения
 * @constant {Object} DEFAULT_VALUES - Объект с константными значениями
 * @property {number[]} sizes - Массив доступных размеров стаканов в мл
 */
const DEFAULT_VALUES = {
  sizes: [100, 200, 300, 400, 500, 1000],
};

/**
 * Тип для состояния трекера воды
 * @typedef {Object} WaterTrackerState - Состояние трекера потребления воды
 * @property {number} goal - Целевое потребление воды в литрах
 * @property {number} size - Размер одного стакана в мл
 * @property {number} count - Общее количество стаканов для достижения цели
 * @property {number} fulledCups - Количество выпитых стаканов
 * @property {number} totalCups - Общее количество стаканов (дублирует count для удобства)
 * @property {number} percentage - Процент выполнения дневной нормы
 * @property {number} remained - Оставшийся объем воды в литрах
 */
type WaterTrackerState = {
  goal: number;
  size: number;
  count: number;
  fulledCups: number;
  totalCups: number;
  percentage: number;
  remained: number;
};

/**
 * Тип для пропсов компонента стакана
 * @typedef {Object} CupProps - Пропсы для компонента стакана
 * @property {number} size - Размер стакана в мл
 * @property {boolean} isFilled - Флаг, указывающий, выпит ли стакан
 * @property {Function} onClick - Обработчик клика по стакану
 */
type CupProps = {
  size: number;
  isFilled: boolean;
  onClick: () => void;
};

/**
 * Компонент стакана воды
 * Отображает отдельный стакан с указанием объема и состоянием (выпит/не выпит)
 *
 * @param {CupProps} props - Пропсы компонента
 * @returns {JSX.Element} Компонент стакана
 */
const Cup = memo(({ size, isFilled, onClick }: CupProps) => (
  <div
    className={`h-20 w-full font-bold border-4 border-black rounded-b-xl cursor-pointer grid place-items-center hover:bg-blue-200 transition-colors ${
      isFilled ? 'bg-blue-500 text-white dark:text-accent hover:bg-blue-500' : 'bg-white dark:bg-accent'
    }`}
    onClick={onClick}
  >
    {size} ml
  </div>
));

Cup.displayName = 'Cup';

/**
 * Компонент формы настройки трекера воды
 * Позволяет пользователю установить целевое потребление воды и размер стакана
 *
 * @param {Object} props - Пропсы компонента
 * @param {Function} props.onSubmit - Функция обработки отправки формы
 * @returns {JSX.Element} Компонент формы
 */
const WaterForm = memo(({ onSubmit }: { onSubmit: (values: FormSchema) => void }) => {
  const form = useForm<FormSchema>({
    defaultValues: {
      goal: 0,
      size: '100',
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  // Мемоизация опций для предотвращения повторного создания при перерендере
  const sizeOptions = useMemo(() => (
    DEFAULT_VALUES.sizes.map((size) => ({
      value: size.toString(),
      label: `${size} ml`,
    }))
  ), []);

  // Получаем текущее значение размера стакана для предотвращения лишних перерендеров
  const currentSize = form.watch('size');

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput form={form} name="goal" label="Цель (л)" type="number" />
        <FormSelect
          form={form}
          name="size"
          label="Cup size (ml)"
          options={sizeOptions}
          selectProps={{
            className: 'w-full',
            value: currentSize || DEFAULT_VALUES.sizes[0].toString(),
          }}
        />
        <Button type="submit">Start tracking</Button>
      </form>
    </Form>
  );
});

WaterForm.displayName = 'WaterForm';

/**
 * Основной компонент трекера потребления воды
 * Управляет состоянием приложения и отображает интерфейс для отслеживания потребления воды
 *
 * @returns {JSX.Element} Компонент трекера воды
 */
const WaterTracker = (): JSX.Element => {
  // Состояние для отслеживания потребления воды с сохранением в localStorage
  const [storedValue, setValue, removeItem] = useStorage<WaterTrackerState | null>('waterConfig', {
    goal: 0,
    size: 100,
    count: 0,
    fulledCups: 0,
    totalCups: 0,
    percentage: 0,
    remained: 0,
  });

  // Загрузка сохраненного состояния из localStorage при монтировании компонента
  useEffect(() => {
    if (storedValue) {
      try {
        const { goal, size, count, fulledCups = 0 } = storedValue;

        if (goal && size) {
          const percentage = Math.min(Math.floor((fulledCups / count) * 100), 100);
          const remained = Number(((goal * (100 - percentage)) / 100).toFixed(1));

          setValue({
            goal,
            size,
            count,
            fulledCups,
            totalCups: count,
            percentage,
            remained,
          });
        }
      } catch (error) {
        console.error('It was not possible to download the saved settings of the water tracker', error);
      }
    }
  }, []);

  /**
   * Обработчик отправки формы с оптимизированными вычислениями
   * Рассчитывает необходимое количество стаканов на основе цели и размера стакана
   *
   * @param {FormSchema} values - Значения формы
   */
  const onSubmit = useCallback((values: FormSchema) => {
    const { goal, size } = values;
    const sizeNum = parseInt(size, 10);

    if (!goal || isNaN(goal) || !sizeNum || isNaN(sizeNum)) {
      // Обработка ошибки валидации
      return;
    }

    // Эффективный расчет данных трекера
    const count = Math.round((goal / sizeNum) * 1000);

    const newState = {
      goal,
      size: sizeNum,
      count,
      fulledCups: 0,
      totalCups: count,
      percentage: 0,
      remained: goal,
    };

    setValue(newState);
  }, [setValue]);

  /**
   * Обработчик клика по стакану для обновления количества выпитых стаканов
   * Обновляет состояние трекера и пересчитывает процент выполнения и оставшийся объем
   *
   * @param {number} index - Индекс стакана, по которому произошел клик
   */
  const handleCupClick = useCallback((index: number) => {
    if (!storedValue) return;

    const newFilledCups = index + 1;
    const percentage = Math.min(Math.floor((newFilledCups / storedValue.count) * 100), 100);
    const remained = Number(((storedValue.goal * (100 - percentage)) / 100).toFixed(1));

    setValue({
      ...storedValue,
      fulledCups: newFilledCups,
      percentage,
      remained,
    });

  }, [storedValue, setValue]);

  /**
   * Сброс состояния трекера
   * Удаляет данные из localStorage и сбрасывает состояние приложения
   */
  const resetTracker = useCallback(() => {
    removeItem();
    setValue(null);
  }, [removeItem, setValue]);

  /**
   * Рендеринг стаканов на основе их количества
   * Мемоизирован для предотвращения лишних перерендеров
   */
  const cups = useMemo(() => {
    if (!storedValue) return null;

    return Array.from({ length: storedValue.count }).map((_, index) => (
      <Cup
        key={index}
        size={storedValue.size}
        isFilled={index < storedValue.fulledCups}
        onClick={() => handleCupClick(index)}
      />
    ));
  }, [storedValue, handleCupClick]);

  return (
    <Card className="p-4 gap-2 max-w-2xl w-full mx-auto">
      {!storedValue ? (
        <WaterForm onSubmit={onSubmit} />
      ) : (
        <div className="grid gap-2">
          <p className="text-lg text-center">Goal: <span className="font-bold">{storedValue.goal}</span> Liters</p>
          <div className="relative h-60 w-full bg-blue-100 dark:bg-accent rounded-b-2xl border-4 border-blue-500 overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 grid place-items-center"
              style={{ height: `${storedValue.percentage}%` }}
            >
              <div className="text-white dark:text-accent font-bold text-center">
                {storedValue.percentage}%
              </div>
            </div>
            <div
              className="absolute w-full text-center"
              style={{
                display: storedValue.percentage === 100 ? 'none' : 'block',
                top: '30%',
              }}
            >
              <span className="text-xl font-bold">{storedValue.remained}L</span>
              <p>Remained</p>
            </div>
          </div>

          <p className="text-center">Select how many glasses of water that you have drank</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
            {cups}
          </div>

          <Button onClick={resetTracker} variant="destructive">Reset</Button>
        </div>
      )}
    </Card>
  );
};

export default memo(WaterTracker);
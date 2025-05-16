'use client';

/**
 * # Анимированная статистика компании
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке компонента создается массив статистических данных с целевыми значениями
 *    - Каждый элемент статистики содержит целевое число, метку и скорость анимации
 *    - Для каждого элемента создается отдельный компонент StatItem
 *
 * 2. **Анимация счетчиков**:
 *    - Каждый счетчик начинается с нуля и постепенно увеличивается до целевого значения
 *    - Скорость анимации контролируется параметром speed (выше значение = быстрее анимация)
 *    - Используется setTimeout для создания эффекта анимации с определенным интервалом
 *    - Интервал обновления рассчитывается как 1000 / speed миллисекунд
 *
 * 3. **Управление состоянием**:
 *    - Каждый счетчик имеет собственное состояние count, которое увеличивается с течением времени
 *    - Когда count достигает целевого значения target, анимация останавливается
 *    - При каждом обновлении count проверяется, не превысило ли оно целевое значение
 *
 * 4. **Оптимизация производительности**:
 *    - Таймеры очищаются при размонтировании компонента для предотвращения утечек памяти
 *    - Минимальный интервал обновления ограничен 10 миллисекундами для стабильной работы
 *    - Используется функциональное обновление состояния для предотвращения проблем с асинхронностью
 *
 * 5. **Отображение**:
 *    - Статистика отображается в виде сетки из трех колонок на больших экранах
 *    - Каждый элемент содержит анимированное число и описательную метку
 *    - Для улучшения доступности используются соответствующие ARIA-атрибуты
 */

import { Card } from '@/components/ui/card';
import { JSX, useEffect, useState } from 'react';

/**
 * Тип для элементов статистики
 * @typedef {Object} StatItems
 * @property {number} target - Целевое значение счетчика
 * @property {string} label - Текстовая метка для статистического элемента
 * @property {number} speed - Скорость анимации (выше значение = быстрее анимация)
 */
type StatItems = {
  target: number;
  label: string;
  speed: number;
}

/**
 * Главный компонент страницы статистики компании
 * Отображает карточку с заголовком и списком анимированных статистических элементов
 *
 * @returns {JSX.Element} Компонент страницы статистики
 */
const CompanyStatisticsPage = (): JSX.Element => {
  /**
   * Массив статистических данных компании
   * @type {StatItems[]}
   */
  const MOCK: StatItems[] = [
    { target: 120, label: 'Succeeded projects', speed: 20 },
    { target: 140, label: 'Working hours spent', speed: 30 },
    { target: 150, label: 'Happy clients', speed: 50 },
  ];

  return (
    <Card className="max-w-xl w-full mx-auto p-4 rounded">
      <section aria-labelledby="stats-heading">
        <h1 id="stats-heading" className="text-center text-2xl font-bold md:text-4xl">
          Our stats
        </h1>
        <ul className="grid gap-3 place-items-center text-center lg:grid-cols-3 mt-6" role="list"
            aria-label="Company statistics">
          {MOCK.map((statItem: StatItems) => (
            <StatItem key={statItem.label} {...statItem} />
          ))}
        </ul>
      </section>
    </Card>
  );
};

/**
 * Компонент отдельного статистического элемента с анимированным счетчиком
 * Отображает число, которое анимированно увеличивается от 0 до целевого значения
 *
 * @param {Object} props - Свойства компонента
 * @param {number} props.target - Целевое значение счетчика
 * @param {string} props.label - Текстовая метка элемента
 * @param {number} props.speed - Скорость анимации (выше значение = быстрее анимация)
 * @returns {JSX.Element} Компонент статистического элемента
 */
const StatItem = ({ target, label, speed }: StatItems): JSX.Element => {
  /**
   * Состояние текущего значения счетчика
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [count, setCount] = useState(0);

  /**
   * Эффект для анимации счетчика
   * Увеличивает значение счетчика на 1 через определенные интервалы времени
   * до достижения целевого значения
   */
  useEffect(() => {
    // Если счетчик достиг или превысил целевое значение, останавливаем анимацию
    if (count >= target) return;

    // Рассчитываем интервал обновления на основе скорости, но не менее 10мс
    const interval = Math.max(10, 1000 / speed);

    // Создаем таймер для инкремента счетчика
    const timer = setTimeout(() =>
        // Используем функциональное обновление для безопасной работы с предыдущим состоянием
        setCount(prev => Math.min(prev + 1, target)),
      interval,
    );

    // Очищаем таймер при размонтировании компонента или изменении зависимостей
    return () => clearTimeout(timer);
  }, [count, speed, target]);

  return (
    <li>
      <span
        className="text-4xl font-bold sm:text-6xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {count}+
      </span>
      <p className="font-medium">{label}</p>
    </li>
  );
};

export default CompanyStatisticsPage;
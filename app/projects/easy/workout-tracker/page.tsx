'use client';

/**
 * # Приложение для отслеживания тренировок
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и хранение данных**:
 *    - Приложение использует кастомный хук useStorage для сохранения данных в localStorage.
 *    - При первом запуске загружаются сохраненные тренировки или устанавливается пустой массив.
 *
 * 2. **Отображение тренировок**:
 *    - Тренировки отображаются в виде таблицы с колонками: Дата, Тип тренировки, Продолжительность.
 *    - Каждая запись представлена компонентом WorkoutRow, который позволяет редактировать и удалять тренировку.
 *
 * 3. **Добавление новой тренировки**:
 *    - При нажатии на кнопку "Add Entry" создается новая запись с текущей датой, типом "walking" и продолжительностью 30 минут.
 *    - Новая запись добавляется в начало списка тренировок.
 *
 * 4. **Редактирование тренировки**:
 *    - Пользователь может изменить дату, тип и продолжительность тренировки непосредственно в таблице.
 *    - При изменении данных вызывается функция updateWorkout, которая обновляет соответствующую запись в состоянии.
 *
 * 5. **Удаление тренировки**:
 *    - Каждая запись имеет кнопку удаления, при нажатии на которую вызывается функция deleteWorkout.
 *    - Функция удаляет соответствующую запись из массива тренировок.
 *
 * 6. **Очистка всех записей**:
 *    - Кнопка "Clear All" появляется, только если есть хотя бы одна запись о тренировке.
 *    - При нажатии на эту кнопку вызывается функция resetWorkouts, которая очищает все записи.
 *
 * 7. **Сохранение данных**:
 *    - Все изменения (добавление, редактирование, удаление) автоматически сохраняются в localStorage благодаря хуку useStorage.
 *
 * 8. **Доступность**:
 *    - Все интерактивные элементы имеют соответствующие ARIA-атрибуты для улучшения доступности.
 *
 * Это приложение предоставляет простой и интуитивно понятный интерфейс для отслеживания тренировок,
 * позволяя пользователям легко управлять своими записями о физической активности.
 */

import { Card } from '@/components/ui/card';
import { JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { WorkoutRow } from '@/app/projects/easy/workout-tracker/components';
import { useStorage } from '@/shared/hooks';

/**
 * Тип данных для тренировки
 * @typedef {Object} Workout
 * @property {string} id - Уникальный идентификатор тренировки
 * @property {string} date - Дата тренировки в формате ISO (YYYY-MM-DD)
 * @property {string} workout - Тип тренировки (например, "walking")
 * @property {number} duration - Продолжительность тренировки в минутах
 */
export type Workout = {
  id: string;
  date: string;
  workout: string;
  duration: number;
}

/**
 * Компонент страницы трекера тренировок
 *
 * Позволяет пользователям добавлять, редактировать и удалять записи о тренировках.
 * Данные сохраняются в localStorage с использованием хука useStorage.
 *
 * @returns {JSX.Element} Компонент страницы трекера тренировок
 */
const WorkoutPage = (): JSX.Element => {
  // Используем хук useStorage для хранения данных в localStorage
  const [workouts, setWorkouts, resetWorkouts] = useStorage<Workout[]>('workout', []);

  /**
   * Добавляет новую тренировку в список
   */
  const addWorkout = (): void => {
    const newWorkout: Workout = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      workout: 'walking',
      duration: 30,
    };
    setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
  };

  /**
   * Обновляет данные существующей тренировки
   *
   * @param {string} id - Идентификатор тренировки
   * @param {keyof Workout} field - Поле для обновления
   * @param {string | number} value - Новое значение
   */
  const updateWorkout = (id: string, field: keyof Workout, value: string | number): void => {
    setWorkouts(prevWorkouts => prevWorkouts.map(workout =>
      workout.id === id ? { ...workout, [field]: value } : workout,
    ));
  };

  /**
   * Удаляет тренировку из списка
   *
   * @param {string} id - Идентификатор тренировки для удаления
   */
  const deleteWorkout = (id: string): void => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== id));
  };

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded gap-0">
      <div className="grid grid-cols-3">
        <div className="border bg-neutral-900 p-3 text-center font-medium text-white">Date</div>
        <div className="border bg-neutral-900 p-3 text-center font-medium text-white">Workout</div>
        <div className="border bg-neutral-900 p-3 text-center font-medium text-white">Duration</div>
      </div>
      <div className="mb-3">
        {workouts.map(workout => (
          <WorkoutRow
            key={workout.id}
            workout={workout}
            updateWorkout={updateWorkout}
            deleteWorkout={deleteWorkout}
          />
        ))}
      </div>
      <div className="grid gap-2">
        <Button className="w-full" onClick={addWorkout} aria-label="Add new workout entry">
          Add Entry
        </Button>
        {workouts.length > 0 && (
          <Button
            className="w-full"
            variant="destructive"
            onClick={resetWorkouts}
            aria-label="Clear all workout entries"
          >
            Clear All
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WorkoutPage;
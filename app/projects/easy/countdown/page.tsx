'use client';

/**
 * # Обратный отсчет (Countdown)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение проверяет наличие сохраненного обратного отсчета в localStorage
 *    - Если отсчет найден, приложение отображает таймер с оставшимся временем
 *    - Если отсчет не найден или завершен, отображается форма для создания нового отсчета
 *
 * 2. **Создание отсчета**:
 *    - Пользователь вводит название отсчета и выбирает дату завершения
 *    - Форма валидируется с помощью Zod схемы (обязательные поля, дата не в прошлом)
 *    - После отправки формы данные сохраняются в localStorage и запускается таймер
 *
 * 3. **Отображение таймера**:
 *    - Таймер показывает оставшееся время в днях, часах, минутах и секундах
 *    - Обновление происходит каждую секунду с помощью setInterval
 *    - Для улучшения читаемости к однозначным числам добавляется ведущий ноль
 *
 * 4. **Завершение отсчета**:
 *    - Когда таймер достигает нуля, отображается сообщение о завершении
 *    - Состояние завершения сохраняется в localStorage (countdownEnd)
 *    - Пользователю предлагается создать новый отсчет
 *
 * 5. **Управление состоянием**:
 *    - Для хранения данных используется кастомный хук useStorage
 *    - Для оптимизации производительности используются useCallback и useMemo
 *    - При размонтировании компонента интервал очищается для предотвращения утечек памяти
 */

import { useStorage } from '@/shared/hooks';
import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CountdownFormValues, countdownSchema } from '@/app/projects/easy/countdown/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { HELPERS } from '@/shared';

/**
 * Тип для хранения информации о обратном отсчете
 * @typedef {Object} CountdownProps
 * @property {string} title - Название обратного отсчета
 * @property {string} date - Целевая дата в формате строки
 */
type CountdownProps = {
  title: string;
  date: string;
}

/**
 * Тип для хранения временных значений обратного отсчета
 * @typedef {Object} CountdownTimeProps
 * @property {number} days - Количество оставшихся дней
 * @property {number} hours - Количество оставшихся часов
 * @property {number} minutes - Количество оставшихся минут
 * @property {number} seconds - Количество оставшихся секунд
 */
type CountdownTimeProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Компонент страницы обратного отсчета
 * Позволяет пользователю создать таймер обратного отсчета до определенной даты
 * и отслеживать оставшееся время в реальном времени
 * 
 * @returns {JSX.Element} Компонент страницы обратного отсчета
 */
const CountdownPage = (): JSX.Element => {
  // Состояние для хранения информации о текущем обратном отсчете
  const [countdown, setCountdown, resetCountdown] = useStorage<CountdownProps | null>('countdown', null);
  // Флаг, указывающий, завершился ли обратный отсчет
  const [countdownEnd, setCountdownEnd] = useStorage<boolean>('countdownEnd', false);
  // Определяем, нужно ли показывать форму создания обратного отсчета
  const showForm = useMemo(() => !countdown || countdownEnd, [countdown, countdownEnd]);
  // Состояние для хранения оставшегося времени
  const [timeLeft, setTimeLeft] = useState<CountdownTimeProps>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Инициализация формы с валидацией через zod
  const form = useForm<CountdownFormValues>({
    resolver: zodResolver(countdownSchema),
    defaultValues: { title: '', date: '' },
    mode: 'onChange',
  });

  /**
   * Обновляет информацию о текущем обратном отсчете
   * 
   * @param {string | null} title - Название обратного отсчета
   * @param {string | null} date - Целевая дата
   */
  const handleCountdownUpdate = useCallback((title: string | null, date: string | null) => {
    if (!title || !date) {
      resetCountdown();
      return;
    }

    setCountdown({
      ...countdown,
      title: title ?? 'New Countdown',
      date: date ?? '',
    });

  }, [countdown, resetCountdown, setCountdown]);

  /**
   * Переключает отображение формы создания обратного отсчета
   * 
   * @param {boolean} show - Флаг, указывающий, нужно ли показывать форму
   */
  const toggleShowForm = useCallback((show: boolean) => {
    if (show) {
      resetCountdown();
      setCountdownEnd(false);
    }
  }, [resetCountdown, setCountdownEnd]);

  /**
   * Обработчик отправки формы создания обратного отсчета
   * 
   * @param {CountdownFormValues} data - Данные формы
   */
  const onSubmit = useCallback((data: CountdownFormValues) => {
    handleCountdownUpdate(data.title, data.date);
    toggleShowForm(false);
  }, [handleCountdownUpdate, toggleShowForm]);

  /**
   * Сбрасывает текущий обратный отсчет и показывает форму создания нового
   */
  const handleCountdownReset = useCallback(() => {
    toggleShowForm(true);
    handleCountdownUpdate(null, null);
    setCountdownEnd(false);
    form.reset();
  }, [toggleShowForm, handleCountdownUpdate, setCountdownEnd, form]);

  /**
   * Вычисляет оставшееся время до указанной даты
   * 
   * @param {string} targetDate - Целевая дата в формате строки
   * @returns {CountdownTimeProps} Объект с оставшимся временем
   */
  const calculateTimeLeft = useCallback((targetDate: string): CountdownTimeProps => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, []);

  /**
   * Подготавливает данные для отображения значений обратного отсчета
   */
  const renderCountdownValues = useMemo(() => ([
    { label: 'Days', value: HELPERS.addLeadingZero(timeLeft.days) },
    { label: 'Hours', value: HELPERS.addLeadingZero(timeLeft.hours) },
    { label: 'Minutes', value: HELPERS.addLeadingZero(timeLeft.minutes) },
    { label: 'Seconds', value: HELPERS.addLeadingZero(timeLeft.seconds) },
  ]), [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  /**
   * Эффект для обновления таймера каждую секунду и проверки завершения обратного отсчета
   */
  useEffect(() => {
    if (!countdown?.date) return;

    /**
     * Обновляет таймер и проверяет его завершение
     */
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft(countdown?.date);
      setTimeLeft(newTimeLeft);

      // Проверяем, закончился ли таймер (все значения равны 0)
      const isTimerEnded = Object.values(newTimeLeft).every(value => value === 0);

      // Если таймер закончился и флаг окончания еще не установлен, устанавливаем его
      if (isTimerEnded && !countdownEnd) {
        setCountdownEnd(true);
      }
    };

    // Проверяем, не находится ли дата уже в прошлом при первой загрузке
    const initialTimeLeft = calculateTimeLeft(countdown.date);
    const isInitiallyEnded = Object.values(initialTimeLeft).every(value => value === 0);

    if (isInitiallyEnded && !countdownEnd) {
      setCountdownEnd(true);
      setTimeLeft(initialTimeLeft);
      return; // Если дата уже в прошлом, не нужно устанавливать интервал
    }

    // Обновляем таймер сразу при монтировании компонента
    updateTimer();

    // Устанавливаем интервал для обновления таймера каждую секунду
    const timerId = setInterval(updateTimer, 1000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(timerId);
  }, [calculateTimeLeft, countdown?.date, countdownEnd, setCountdownEnd]);

  /**
   * Рендер компонента
   */
  return (
    <Card className="max-w-md w-full mx-auto p-4 rounded gap-2">
      <h1 className="text-2xl font-bold text-center">
        {countdownEnd ? 'Countdown has ended!' : (countdown?.title || 'Countdown')}
      </h1>

      {countdownEnd && (
        <div className="my-4 p-3 bg-green-100 dark:bg-green-900 rounded-md text-center">
          <p className="text-green-700 dark:text-green-300 mb-2">
            Your countdown &#34;{countdown?.title}&#34; has completed!
          </p>
          <Button
            onClick={handleCountdownReset}
            className="w-full"
            variant="outline"
          >
            Create New Countdown
          </Button>
        </div>
      )}

      {showForm && !countdownEnd && !countdown &&
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormInput form={form} name="title" placeholder="Enter countdown title" />
            <FormInput form={form} type="date" name="date" min={new Date().toISOString().split('T')[0]} placeholder="Date is required" />
            <Button type="submit" className="w-full">Start Countdown</Button>
          </form>
        </Form>
      }

      {!showForm &&
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {renderCountdownValues.map(({ label, value }) => (
              <div className="p-2 bg-muted rounded" key={label}>
                <span className="block text-2xl font-bold">{value}</span>
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
          <Button variant="destructive" onClick={handleCountdownReset}>
            Reset Countdown
          </Button>
        </div>
      }
    </Card>
  );
};

export default CountdownPage;


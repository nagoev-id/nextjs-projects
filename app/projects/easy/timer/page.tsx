'use client';

/**
 * # Таймер обратного отсчета
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - При загрузке приложение проверяет наличие сохраненного состояния таймера в localStorage
 *    - Если данные найдены, они используются для восстановления предыдущего состояния таймера
 *    - Если данных нет, создается состояние по умолчанию (таймер не запущен, не отображается)
 * 
 * 2. **Ввод времени**:
 *    - Пользователь вводит количество минут в форму
 *    - Форма валидируется с помощью Zod схемы
 *    - После отправки формы запускается таймер с указанным временем
 * 
 * 3. **Работа таймера**:
 *    - Таймер отображает оставшееся время в формате MM:SS
 *    - Каждую секунду происходит обновление оставшегося времени
 *    - Состояние таймера сохраняется в localStorage при каждом изменении
 * 
 * 4. **Управление таймером**:
 *    - Пользователь может приостановить/возобновить таймер
 *    - Пользователь может сбросить таймер в любой момент
 *    - При достижении нуля таймер автоматически останавливается
 *    - Показывается уведомление о завершении таймера
 *    - Через 3 секунды после завершения таймер автоматически сбрасывается
 * 
 * 5. **Состояния таймера**:
 *    - isRunning: запущен ли таймер в данный момент
 *    - isCompleted: завершился ли таймер (достиг нуля)
 *    - showTimer: отображается ли таймер или форма ввода времени
 *    - secondsRemaining: оставшееся время в секундах
 */

import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { HELPERS } from '@/shared';
import { Button } from '@/components/ui/button';
import { MdOutlinePause, MdPlayArrow } from 'react-icons/md';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { FormSchema, formSchema } from '@/app/projects/easy/timer/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

/**
 * Тип состояния таймера
 * @typedef {Object} TimerState
 * @property {number} secondsRemaining - Оставшееся время в секундах
 * @property {boolean} isRunning - Запущен ли таймер в данный момент
 * @property {boolean} isCompleted - Завершился ли таймер (достиг нуля)
 * @property {boolean} showTimer - Отображается ли таймер или форма ввода времени
 */
type TimerState = {
  secondsRemaining: number;
  isRunning: boolean;
  isCompleted: boolean;
  showTimer: boolean;
}

/**
 * Компонент таймера обратного отсчета
 * Позволяет пользователю установить таймер на определенное количество минут,
 * запустить, приостановить и сбросить его. Состояние таймера сохраняется в localStorage.
 * 
 * @returns {JSX.Element} Компонент таймера
 */
const TimerPage = (): JSX.Element => {
  /**
   * Состояние таймера
   * Инициализируется из localStorage или значениями по умолчанию
   */
  const [timer, setTimer] = useState<TimerState>(() => {
    // Проверяем, выполняется ли код на стороне клиента
    if (typeof window !== 'undefined') {
      const timeFromStorage = localStorage.getItem('timer');
      if (timeFromStorage) {
        try {
          return JSON.parse(timeFromStorage);
        } catch (e) {
          console.error('Localstorage data parsing error:', e);
        }
      }
    }
    // Возвращаем значения по умолчанию, если нет сохраненных данных
    return {
      secondsRemaining: 0,
      isRunning: false,
      isCompleted: false,
      showTimer: false,
    };
  });

  // Деструктуризация состояния таймера для удобства использования
  const { secondsRemaining, isRunning, isCompleted, showTimer } = timer;

  /**
   * Инициализация формы с валидацией через Zod
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  /**
   * Вычисление минут и секунд из общего количества оставшихся секунд
   * Мемоизируется для оптимизации производительности
   */
  const { minutes, seconds } = useMemo(() => ({
    minutes: Math.floor(Math.max(0, secondsRemaining) / 60),
    seconds: Math.max(0, secondsRemaining) % 60,
  }), [secondsRemaining]);

  /**
   * Запускает таймер с указанным временем в минутах
   * @param {number} newTime - Время в минутах
   */
  const startTimer = useCallback((newTime: number) => {
    const validTime = Math.max(0, newTime);
    if (validTime === 0) return;

    setTimer((prev: TimerState) => ({
      ...prev,
      secondsRemaining: validTime * 60,
      showTimer: true,
      isRunning: true,
      isCompleted: false,
    }));
  }, []);

  /**
   * Переключает состояние таймера между запущенным и приостановленным
   */
  const toggleRunning = useCallback(() => {
    setTimer((prev: TimerState) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  /**
   * Сбрасывает таймер в исходное состояние
   * Очищает данные в localStorage и сбрасывает форму
   */
  const resetTimer = useCallback(() => {
    const defaultState: TimerState = {
      secondsRemaining: 0,
      isRunning: false,
      isCompleted: false,
      showTimer: false,
    };
    
    setTimer(defaultState);
    localStorage.setItem('timer', JSON.stringify(defaultState));
    form.reset();
  }, [form]);

  /**
   * Обработчик отправки формы
   * @param {FormSchema} data - Данные формы с временем в минутах
   */
  const onSubmit = useCallback((data: FormSchema) => {
    startTimer(data.number);
  }, [startTimer]);

  /**
   * Эффект для обновления таймера каждую секунду
   * Запускается только когда таймер активен (isRunning === true)
   */
  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      setTimer((prev: TimerState) => {
        const newSecondsRemaining = Math.max(0, prev.secondsRemaining - 1);

        // Если таймер достиг нуля, показываем уведомление и сбрасываем через 3 секунды
        if (newSecondsRemaining === 0 && prev.secondsRemaining > 0) {
          toast.success('Timer completed!', {
            description: 'Your timer has finished.',
            richColors: true,
          });

          setTimeout(resetTimer, 3000);

          return {
            ...prev,
            secondsRemaining: newSecondsRemaining,
            isRunning: false,
            isCompleted: true,
          };
        }

        return {
          ...prev,
          secondsRemaining: newSecondsRemaining,
        };
      });
    };

    // Запускаем интервал для обновления таймера каждую секунду
    const timerId = setInterval(updateTimer, 1000);

    // Очищаем интервал при размонтировании компонента или изменении зависимостей
    return () => {
      clearInterval(timerId);
    };
  }, [isRunning, resetTimer]);

  /**
   * Эффект для сохранения состояния таймера в localStorage при каждом изменении
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer', JSON.stringify(timer));
    }
  }, [timer]);

  return (
    <Card
      className="max-w-sm w-full mx-auto p-4 grid gap-3">
      {!showTimer ? (
        // Форма ввода времени
        <>
          <h1 className="text-center font-bold text-2xl">Timer</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
              <FormInput form={form} name="number" placeholder="Enter number of minutes" />
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Start Timer
              </Button>
            </form>
          </Form>
        </>
      ) : (
        // Отображение таймера и кнопок управления
        <div className="grid gap-3 place-items-center">
          <div className="font-bold text-3xl md:text-6xl flex" role="timer">
            {HELPERS.addLeadingZero(minutes)}:{HELPERS.addLeadingZero(seconds)}
          </div>
          {/* Кнопка паузы/запуска отображается только если таймер не завершен */}
          {!isCompleted && (
            <Button onClick={toggleRunning}>
              {isRunning ?
                <MdOutlinePause aria-hidden="true" size={20} /> :
                <MdPlayArrow aria-hidden="true" size={20} />
              }
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          )}
          <Button variant="destructive" onClick={resetTimer}>Reset Timer</Button>
        </div>
      )}
    </Card>
  );
};

export default TimerPage;
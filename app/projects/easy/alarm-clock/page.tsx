'use client';

/**
 * # Будильник (Alarm Clock)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение отображает текущее время, обновляемое каждую секунду
 *    - Пользователю предоставляется интерфейс для установки будильника с выбором часа, минуты и периода (AM/PM)
 *    - Состояние будильника сохраняется в localStorage для персистентности между сессиями
 *
 * 2. **Установка будильника**:
 *    - Пользователь выбирает время (час, минуту и AM/PM) через выпадающие списки
 *    - При нажатии кнопки "Set Alarm" проверяется корректность выбранного времени
 *    - Если время выбрано корректно, будильник устанавливается и селекторы блокируются
 *    - Если время выбрано некорректно, отображается уведомление с просьбой выбрать правильное время
 *
 * 3. **Отслеживание времени**:
 *    - Приложение постоянно сравнивает текущее время с установленным временем будильника
 *    - Когда текущее время совпадает с установленным, активируется сигнал будильника
 *    - Иконка будильника начинает анимироваться, визуально сигнализируя о срабатывании
 *
 * 4. **Управление будильником**:
 *    - После установки будильника кнопка меняется на "Clear Alarm", позволяя отключить будильник
 *    - При отключении будильника все настройки сбрасываются, и пользователь может установить новый будильник
 *    - Если будильник сработал, он автоматически отключается через 60 секунд
 *
 * 5. **Персистентность данных**:
 *    - Состояние будильника сохраняется в localStorage с помощью хука useStorage
 *    - При перезагрузке страницы установленный будильник продолжает работать
 *    - Это обеспечивает непрерывность работы будильника между сессиями пользователя
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChangeEvent, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { PiBellSimpleRingingDuotone } from 'react-icons/pi';
import { toast } from 'sonner';
import { HELPERS } from '@/shared';
import { formatTime, generateNumbers } from './utils';
import { useStorage } from '@/shared/hooks';

/**
 * Интерфейс для состояния будильника
 * @interface AlarmState
 * @property {boolean} isSet - Флаг, указывающий установлен ли будильник
 * @property {string} time - Строка с временем будильника в формате "HH:MM AM/PM"
 * @property {boolean} isRinging - Флаг, указывающий звонит ли будильник в данный момент
 */
type AlarmState = {
  isSet: boolean;
  time: string;
  isRinging: boolean;
};

/**
 * Интерфейс для состояния выбора времени
 * @interface TimeSelectionState
 * @property {string} hour - Выбранный час
 * @property {string} minute - Выбранная минута
 * @property {string} period - Выбранный период (AM/PM)
 */
type TimeSelectionState = {
  hour: string;
  minute: string;
  period: string;
};

/**
 * Начальное состояние будильника
 */
const alarmStateValues: AlarmState = {
  isSet: false,
  time: '',
  isRinging: false,
};

/**
 * Начальное состояние выбора времени
 */
const timeSelectionValues: TimeSelectionState = {
  hour: 'Hour',
  minute: 'Minute',
  period: 'AM/PM',
};

/**
 * Компонент страницы будильника
 * Позволяет пользователю установить будильник на определенное время
 * и отслеживает срабатывание будильника
 *
 * @returns {JSX.Element} Компонент страницы будильника
 */
const AlarmClockPage = (): JSX.Element => {
  // Используем хук useStorage для сохранения состояния будильника в localStorage
  const [alarm, setAlarm, resetAlarm] = useStorage<AlarmState>('alarm-clock', alarmStateValues);

  // Состояние для отображения текущего времени
  const [timeString, setTimeString] = useState<string>('00:00:00 PM');

  // Используем хук useStorage для сохранения выбранного времени в localStorage
  const [timeSelection, setTimeSelection, resetTimeSelection] = useStorage<TimeSelectionState>(
    'alarm-clock-selection',
    timeSelectionValues,
  );

  /**
   * Обработчик нажатия на кнопку установки/сброса будильника
   * Устанавливает новый будильник или сбрасывает текущий
   */
  const handleSetAlarmClick = useCallback(() => {
    if (alarm.isSet) {
      resetAlarm();
      resetTimeSelection();
      return;
    }

    const { hour, minute, period } = timeSelection;

    if (!(hour !== 'Hour' && minute !== 'Minute' && period !== 'AM/PM')) {
      toast('Please, select a valid time to set alarm!');
      return;
    }

    setAlarm({
      ...alarm,
      isSet: true,
      time: `${HELPERS.addLeadingZero(hour)}:${HELPERS.addLeadingZero(minute)} ${period}`,
    });
  }, [alarm, timeSelection, setAlarm, resetAlarm, resetTimeSelection]);

  /**
   * Обработчик изменения значения в селекторе времени
   *
   * @param {keyof TimeSelectionState} field - Поле, которое изменяется (hour, minute или period)
   * @param {ChangeEvent<HTMLSelectElement>} event - Событие изменения значения
   */
  const handleSelectChange = useCallback((
    field: keyof TimeSelectionState,
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const value = event.target.value;
    setTimeSelection(prev => ({ ...prev, [field]: value }));
  }, [setTimeSelection]);

  /**
   * Обновляет текущее время и проверяет, не пора ли активировать будильник
   */
  const updateTime = useCallback((): void => {
    const [h, m, s, ampm] = formatTime(new Date());
    setTimeString(`${h}:${m}:${s} ${ampm}`);

    if (alarm.isSet && !alarm.isRinging && alarm.time === `${h}:${m} ${ampm}`) {
      setAlarm(prev => ({ ...prev, isRinging: true }));
    }
  }, [alarm, setAlarm]);

  /**
   * Эффект для обновления времени каждую секунду
   */
  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  /**
   * Эффект для автоматического отключения будильника через 60 секунд после срабатывания
   */
  useEffect(() => {
    if (alarm.isRinging) {
      const timeout = setTimeout(() => {
        setAlarm(prev => ({ ...prev, isRinging: false }));
      }, 60000);
      return () => clearTimeout(timeout);
    }
  }, [alarm.isRinging, setAlarm]);

  /**
   * Мемоизированный текст кнопки в зависимости от состояния будильника
   */
  const buttonText = useMemo(() => `${alarm.isSet ? 'Clear' : 'Set'} Alarm`, [alarm.isSet]);

  /**
   * Мемоизированная конфигурация элементов управления для выбора времени
   */
  const renderControls = useMemo(() => [
    {
      value: timeSelection.hour,
      field: 'hour',
      options: generateNumbers(12),
      defaultOption: 'Hour',
    },
    {
      value: timeSelection.minute,
      field: 'minute',
      options: generateNumbers(60),
      defaultOption: 'Minute',
    },
    {
      value: timeSelection.period,
      field: 'period',
      options: ['AM', 'PM'],
      defaultOption: 'AM/PM',
    },
  ], [timeSelection]);

  return (
    <Card className="max-w-md w-full mx-auto p-4 rounded gap-2">
      <h1 className="text-center font-bold text-2xl">Alarm Clock</h1>
      <div className="grid place-items-center gap-3">
        {/* Иконка будильника с анимацией */}
        <div className={`mx-auto max-w-[50px] w-full pt-3 ${alarm.isRinging ? 'animate-bounce' : ''}`}>
          <PiBellSimpleRingingDuotone size={50} />
        </div>

        {/* Отображение текущего времени */}
        <p className="font-bold text-2xl text-center md:text-4xl">{timeString}</p>

        {/* Селекторы для установки будильника */}
        <div className="grid gap-3 w-full sm:grid-cols-3">
          {renderControls.map(({ value, field, options, defaultOption }) => (
            <select
              key={field}
              className="border-2 px-4 py-2.5 rounded block w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              value={value}
              onChange={(e) => handleSelectChange(field as keyof TimeSelectionState, e)}
              disabled={alarm.isSet}
            >
              <option value={defaultOption}>{defaultOption}</option>
              {options.map((option: string, index: number) => (
                <option value={option} key={`option-${index}`}>{option}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Кнопка установки/сброса будильника */}
        <Button onClick={handleSetAlarmClick}>{buttonText}</Button>
      </div>
    </Card>
  );
};

export default AlarmClockPage;
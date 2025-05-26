'use client';

/**
 * # Приложение для дыхательной релаксации
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка таймеров**:
 *    - Приложение использует React с хуками состояния для управления анимацией дыхания
 *    - Настраиваются временные интервалы для полного цикла дыхания (7.5 секунд):
 *      - Вдох: 3 секунды (2/5 от общего времени)
 *      - Задержка: 1.5 секунды (1/5 от общего времени)
 *      - Выдох: 3 секунды (оставшееся время)
 *    - Используется useRef для хранения ссылки на интервал для корректной очистки
 *
 * 2. **Цикл дыхательной анимации**:
 *    - Анимация запускается автоматически при загрузке компонента
 *    - Каждый цикл состоит из трех последовательных фаз:
 *      1. Фаза вдоха: круг увеличивается, текст "Breathe In! 😤"
 *      2. Фаза задержки: размер сохраняется, текст меняется на "Hold 🤐"
 *      3. Фаза выдоха: круг уменьшается, текст меняется на "Breathe Out! 😮‍💨"
 *    - После завершения цикла анимация автоматически повторяется
 *
 * 3. **Визуальное представление**:
 *    - Центральный круг меняет размер в соответствии с фазой дыхания
 *    - Текстовые подсказки в центре круга направляют пользователя
 *    - Анимация плавная благодаря CSS-переходам (классы 'grow' и 'shrink')
 *    - Дизайн адаптивный и минималистичный для лучшей концентрации
 *
 * 4. **Управление ресурсами**:
 *    - При размонтировании компонента все таймеры очищаются для предотвращения утечек памяти
 *    - Используется useEffect с пустым массивом зависимостей для запуска анимации только при первом рендере
 *
 * 5. **Пользовательский опыт**:
 *    - Интуитивно понятный интерфейс не требует взаимодействия с пользователем
 *    - Визуальные и текстовые подсказки синхронизированы для создания целостного опыта
 *    - Эмодзи добавляют эмоциональный контекст к каждой фазе дыхания
 *    - Цветовая схема и анимации способствуют расслаблению
 */

import { Card } from '@/components/ui/card';
import { JSX, useEffect, useRef, useState } from 'react';

/**
 * Тип для значений временных интервалов дыхательного цикла
 * @typedef {Object} DefaultValues
 * @property {number} total - Общая продолжительность цикла дыхания в миллисекундах
 * @property {number} breathe - Продолжительность фазы вдоха в миллисекундах
 * @property {number} hold - Продолжительность фазы задержки дыхания в миллисекундах
 */
type DefaultValues = {
  total: number;
  breathe: number;
  hold: number;
}

/**
 * Константа с настройками временных интервалов для дыхательного цикла
 * Использует геттеры для автоматического расчета длительности фаз на основе общего времени
 *
 * @constant {DefaultValues}
 */
const DEFAULT_VALUES: DefaultValues = {
  /** Общая продолжительность цикла дыхания (7.5 секунд) */
  total: 7500,

  /**
   * Продолжительность фазы вдоха (2/5 от общего времени)
   * @returns {number} Длительность в миллисекундах
   */
  get breathe() {
    return (this.total / 5) * 2;
  },

  /**
   * Продолжительность фазы задержки дыхания (1/5 от общего времени)
   * @returns {number} Длительность в миллисекундах
   */
  get hold() {
    return this.total / 5;
  },
};

/**
 * Компонент дыхательной релаксации
 * Отображает анимированный круг и текстовые подсказки для управления дыханием пользователя
 *
 * @returns {JSX.Element} Компонент дыхательной релаксации
 */
const BreathingRelaxationPage = (): JSX.Element => {
  /**
   * Состояние для текстовой подсказки текущей фазы дыхания
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [text, setText] = useState<string>('');

  /**
   * Состояние для CSS-класса контейнера, управляющего анимацией
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [containerClass, setContainerClass] = useState<string>('');

  /**
   * Ссылка на интервал для корректной очистки при размонтировании
   * @type {React.MutableRefObject<NodeJS.Timeout | null>}
   */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Запускает один цикл дыхательной анимации
   * Последовательно проходит через фазы вдоха, задержки и выдоха
   */
  const startBreathingAnimation = (): void => {
    // Фаза вдоха
    setText('Breathe In! 😤');
    setContainerClass('grow');

    // Фаза задержки дыхания (после задержки на время вдоха)
    setTimeout(() => {
      setText('Hold 🤐');

      // Фаза выдоха (после задержки на время удержания)
      setTimeout(() => {
        setText('Breathe Out! 😮‍💨');
        setContainerClass('shrink');
      }, DEFAULT_VALUES.hold);
    }, DEFAULT_VALUES.breathe);
  };

  /**
   * Эффект для запуска и управления циклом дыхательной анимации
   * Запускается один раз при монтировании компонента
   */
  useEffect(() => {
    // Запускаем первый цикл анимации немедленно
    startBreathingAnimation();

    // Настраиваем повторение цикла с заданным интервалом
    intervalRef.current = setInterval(startBreathingAnimation, DEFAULT_VALUES.total);

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="max-w-4xl bg-transparent shadow-none w-full mx-auto p-4 pt-15 rounded border-none">
      <div className="grid font-semibold">
        <div className="grid place-items-center">
          {/* Контейнер с анимацией дыхания, класс меняется в зависимости от фазы */}
          <div className={`${containerClass} flex items-center justify-center h-[300px] w-[300px] relative scale-100`}>
            {/* Фоновый круг */}
            <div className="bg-white dark:bg-accent h-full w-full rounded-full absolute top-0 left-0 -z-[1]" />
            {/* Текстовая подсказка текущей фазы дыхания */}
            <p>{text}</p>
            {/* Указатель для визуального акцента */}
            <div className="pointer">
              <span className="bg-[#F78D3F] border-4 border-solid h-5 w-5 block rounded-full" />
            </div>
            {/* Дополнительный круг для визуального эффекта */}
            <div className="circle" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BreathingRelaxationPage;
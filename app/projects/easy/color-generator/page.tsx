'use client';

/**
 * # Генератор случайных цветов
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение устанавливает начальный цвет (#333333)
 *    - По умолчанию используется HEX формат отображения цвета
 *    - Состояние копирования устанавливается в false
 *
 * 2. **Генерация цвета**:
 *    - Пользователь может сгенерировать новый случайный цвет нажатием на кнопку "Generate"
 *    - Генерация происходит с помощью вспомогательной функции generateRandomHexColor
 *
 * 3. **Отображение цвета**:
 *    - Цвет отображается визуально в виде цветного квадрата
 *    - Под квадратом показывается текстовое представление цвета в выбранном формате
 *    - Пользователь может переключаться между форматами HEX и RGB
 *
 * 4. **Копирование цвета**:
 *    - Пользователь может скопировать текущий цвет в буфер обмена нажатием на кнопку "Copy to clipboard"
 *    - Также копирование доступно по нажатию клавиши "Пробел" (если фокус не находится на элементах ввода)
 *    - После копирования появляется индикатор "Copied!" на 3 секунды
 *    - Во время отображения индикатора копирования кнопка генерации цвета блокируется
 *
 * 5. **Доступность**:
 *    - Приложение корректно обрабатывает события клавиатуры
 *    - Предусмотрены проверки для предотвращения конфликтов с элементами ввода
 *    - Интерфейс адаптирован для светлой и темной темы
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HELPERS } from '@/shared';

/**
 * Тип для формата отображения цвета
 * @typedef {'hex'|'rgb'} ColorFormat
 */
type ColorFormat = 'hex' | 'rgb';

/**
 * Компонент генератора случайных цветов
 * Позволяет генерировать случайные цвета, переключать формат отображения и копировать значение цвета
 *
 * @returns {JSX.Element} Компонент генератора цветов
 */
const ColorGeneratorPage = () => {
  /**
   * Состояние для хранения текущего цвета в HEX формате
   */
  const [initialColor, setInitialColor] = useState('#333333');

  /**
   * Состояние для хранения текущего формата отображения (hex или rgb)
   */
  const [format, setFormat] = useState<ColorFormat>('hex');

  /**
   * Состояние для отслеживания статуса копирования
   */
  const [isCopied, setIsCopied] = useState(false);

  /**
   * Генерирует новый случайный цвет в HEX формате
   * Мемоизируется для оптимизации производительности
   */
  const handleColorGenerator = useCallback(() =>
      setInitialColor(HELPERS.generateRandomHexColor()),
    []);

  /**
   * Создает объект стиля с текущим цветом фона
   * Мемоизируется для предотвращения ненужных перерисовок
   */
  const colorStyle = useMemo(() =>
      ({ backgroundColor: initialColor }),
    [initialColor]);

  /**
   * Вычисляет отображаемое значение цвета в зависимости от выбранного формата
   * Мемоизируется для оптимизации производительности
   */
  const displayColor = useMemo(() => {
    return format === 'hex' ? initialColor : HELPERS.convertHexToRgb(initialColor);
  }, [initialColor, format]);

  /**
   * Переключает формат отображения цвета между HEX и RGB
   * Мемоизируется для оптимизации производительности
   */
  const toggleFormat = useCallback(() => {
    setFormat((prev: ColorFormat) => prev === 'hex' ? 'rgb' : 'hex');
  }, []);

  /**
   * Копирует текущий цвет в буфер обмена и показывает индикатор копирования
   * Мемоизируется для оптимизации производительности
   */
  const handleCopy = useCallback(() => {
    HELPERS.copyToClipboard(displayColor);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  }, [displayColor]);

  /**
   * Эффект для обработки нажатия клавиши пробел для копирования цвета
   * Срабатывает только если фокус не находится на элементах ввода
   */
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleCopy]);

  return (
    <Card className="grid gap-3 max-w-2xl w-full mx-auto p-4 rounded-none border-none shadow-none dark:bg-transparent">
      {/* Блок отображения цвета */}
      <div
        className="mx-auto grid max-w-max place-content-center gap-2 rounded border bg-white dark:bg-accent p-2 text-center shadow">
        {/* Цветной квадрат */}
        <div className="h-[170px] w-[170px] border transition-all" style={colorStyle} />
        {/* Текстовое представление цвета */}
        <p className="font-bold uppercase">{displayColor}</p>
      </div>

      {/* Блок управления */}
      <div className="grid place-items-center gap-3">
        {/* Кнопки генерации и переключения формата */}
        <div className="flex gap-2">
          <Button
            onClick={handleColorGenerator}
            disabled={isCopied}
            aria-label="Generate new random color"
          >
            Generate
          </Button>
          <Button
            onClick={toggleFormat}
            variant="outline"
            aria-label={`Switch to ${format === 'hex' ? 'RGB' : 'HEX'} format`}
          >
            {format === 'hex' ? 'Switch to RGB' : 'Switch to HEX'}
          </Button>
        </div>

        {/* Кнопка копирования */}
        <Button
          onClick={handleCopy}
          aria-label="Copy color value to clipboard"
        >
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </Button>

        {/* Подсказка о горячей клавише */}
        <p className="text-center">
          Or press <span className="font-bold">&#34;SPACE&#34;</span> to copy the color to your clipboard.
        </p>
      </div>
    </Card>
  );
};

export default ColorGeneratorPage;
'use client';

/**
 * # Поиск информации о цвете
 *
 * ## Принцип работы:
 *
 * 1. **Выбор цвета**:
 *    - Пользователь выбирает цвет с помощью интерактивного цветового пикера
 *    - Выбранный цвет отображается в виде HEX-кода в текстовом поле
 *    - При изменении цвета предыдущие результаты поиска сбрасываются
 *
 * 2. **Получение данных о цвете**:
 *    - При нажатии кнопки "Submit" отправляется запрос к API Color.pizza
 *    - API возвращает подробную информацию о выбранном цвете
 *    - Во время загрузки отображается индикатор
 *
 * 3. **Отображение результатов**:
 *    - После успешного получения данных отображается:
 *      - Название цвета
 *      - Визуальный образец цвета (квадрат 200x200px)
 *      - Таблица с техническими характеристиками:
 *        - RGB значения (красный, зеленый, синий)
 *        - HSL значения (оттенок, насыщенность, яркость)
 *        - LAB значения (светлота, положение между красным/зеленым, положение между синим/желтым)
 *        - Значения яркости (обычное и по стандарту WCAG)
 *
 * 4. **Обработка ошибок**:
 *    - При возникновении ошибки во время запроса показывается уведомление
 *    - Результаты сбрасываются, позволяя пользователю повторить попытку
 *
 * 5. **Адаптивный дизайн**:
 *    - На мобильных устройствах информация отображается в одну колонку
 *    - На планшетах и десктопах используется двухколоночный макет
 *    - Интерфейс поддерживает светлую и темную темы
 */

import { Button, Card, Input, Spinner } from '@/components/ui';
import axios from 'axios';
import { JSX, useCallback, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import Image from 'next/image';

/**
 * Интерфейс для данных о цвете, получаемых от API
 *
 * @typedef {Object} ColorData
 * @property {string} name - Название цвета
 * @property {Object} rgb - RGB значения цвета
 * @property {number} rgb.r - Значение красного (0-255)
 * @property {number} rgb.g - Значение зеленого (0-255)
 * @property {number} rgb.b - Значение синего (0-255)
 * @property {Object} hsl - HSL значения цвета
 * @property {number} hsl.h - Оттенок (0-360)
 * @property {number} hsl.s - Насыщенность (0-100)
 * @property {number} hsl.l - Яркость (0-100)
 * @property {Object} lab - LAB значения цвета
 * @property {number} lab.l - Светлота
 * @property {number} lab.a - Положение между красным и зеленым
 * @property {number} lab.b - Положение между синим и желтым
 * @property {number} luminance - Значение яркости
 * @property {number} luminanceWCAG - Значение яркости по стандарту WCAG
 */
type ColorData = {
  name: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  lab: { l: number; a: number; b: number };
  luminance: number;
  luminanceWCAG: number;
}

/**
 * Интерфейс для ответа API
 *
 * @typedef {Object} ApiResponse
 * @property {ColorData[]} colors - Массив данных о цветах
 */
type ApiResponse = {
  colors: ColorData[];
}

/**
 * Интерфейс для элемента информации о цвете
 *
 * @typedef {Object} ColorInfoItem
 * @property {string} label - Название характеристики
 * @property {string} value - Значение характеристики
 */
type ColorInfoItem = {
  label: string;
  value: string;
}

/**
 * Интерфейс для состояния данных о цвете
 *
 * @typedef {Object} ColorDataState
 * @property {string} hex - HEX-код выбранного цвета
 * @property {ColorData | null} result - Результат запроса к API с данными о цвете
 */
type ColorDataState = {
  hex: string;
  result: ColorData | null;
}

/**
 * Интерфейс для состояния статуса запроса
 *
 * @typedef {Object} RequestStatus
 * @property {boolean} isLoading - Флаг загрузки данных
 * @property {boolean} isSuccess - Флаг успешного получения данных
 * @property {boolean} isError - Флаг ошибки при получении данных
 */
type RequestStatus = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Компонент для поиска и отображения информации о цвете
 *
 * @returns {JSX.Element} Компонент страницы поиска цвета
 */
const ColorFinderPage = (): JSX.Element => {
  /**
   * Состояние для хранения текущего выбранного цвета и результатов
   */
  const [colorData, setColorData] = useState<ColorDataState>({
    hex: '#1e88e5',
    result: null,
  });

  /**
   * Состояние для отслеживания статуса запроса
   */
  const [status, setStatus] = useState<RequestStatus>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  /**
   * Обработчик нажатия на кнопку получения информации о цвете
   * Отправляет запрос к API и обновляет состояние результата
   *
   * @async
   * @function
   */
  const handleGetColorClick = useCallback(async (): Promise<void> => {
    setStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    try {
      // Отправляем запрос к API, передавая HEX-код цвета без символа #
      const { data } = await axios.get<ApiResponse>(
        `https://api.color.pizza/v1/?values=${colorData.hex.slice(1)}`,
      );

      setColorData(prev => ({
        ...prev,
        result: data.colors[0],
      }));

      setStatus({
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Error fetching color data', { richColors: true });

      setStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [colorData.hex]);

  /**
   * Обработчик изменения выбранного цвета
   * Обновляет состояние цвета и сбрасывает результаты
   *
   * @function
   * @param {string} newColor - Новый выбранный цвет в HEX-формате
   */
  const handleColorChange = useCallback((newColor: string): void => {
    setColorData({
      hex: newColor,
      result: null,
    });

    setStatus({
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  /**
   * Мемоизированный массив информации о цвете для отображения в таблице
   * Преобразует данные из API в удобный для отображения формат
   */
  const colorInfo: ColorInfoItem[] = useMemo((): ColorInfoItem[] => {
    if (!colorData.result) return [];

    const { name, rgb, hsl, lab, luminance, luminanceWCAG } = colorData.result;

    return [
      { label: 'Color Name', value: name },
      { label: 'RGB Values', value: `(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      {
        label: 'HSL Values',
        value: `(${hsl.h.toFixed(0)}, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)`,
      },
      { label: 'LAB Values', value: `(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})` },
      { label: 'Luminance', value: luminance.toFixed(4) },
      { label: 'Luminance WCAG', value: luminanceWCAG.toFixed(4) },
    ];
  }, [colorData.result]);

  /**
   * URL для получения изображения выбранного цвета
   */
  const colorImageUrl = useMemo((): string => {
    return `https://singlecolorimage.com/get/${colorData.hex.slice(1)}/200x200`;
  }, [colorData.hex]);

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded">
      <div className="grid gap-3">
        {/* Цветовой пикер */}
        <HexColorPicker
          className="!w-full"
          color={colorData.hex}
          onChange={handleColorChange}
          aria-label="Color picker"
        />

        {/* Отображение HEX-кода выбранного цвета */}
        <Input
          className="w-full rounded border bg-slate-50 dark:bg-slate-800 px-3 py-2 text-center font-bold text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none dark:focus:border-blue-500 dark:border-slate-700"
          type="text"
          disabled
          value={colorData.hex}
          aria-label="Selected color hex code"
        />

        {/* Кнопка для отправки запроса */}
        <Button
          onClick={handleGetColorClick}
          disabled={status.isLoading}
          aria-busy={status.isLoading}
        >
          {status.isLoading ? 'Loading...' : 'Submit'}
        </Button>

        {/* Индикатор загрузки */}
        {status.isLoading && <Spinner>Loading color information...</Spinner>}

        {/* Результаты поиска */}
        {status.isSuccess && colorData.result && (
          <div className="grid gap-2" role="region" aria-label="Color information">
            <h3 className="text-center font-bold text-lg">
              About: <span className="uppercase">{colorData.hex}</span>
            </h3>

            <div className="grid gap-2 md:gap-3 md:grid-cols-[200px_1fr]">
              {/* Изображение цвета */}
              <Image
                width={200}
                height={200}
                className="border-2 max-w-[200px] mx-auto"
                src={colorImageUrl}
                alt={`Color swatch for ${colorData.result.name}`}
                priority
              />

              {/* Таблица с информацией о цвете */}
              <div className="table w-full">
                {colorInfo.map(({ label, value }) => (
                  <p className="grid grid-cols-2" key={label}>
                    <span
                      className="p-3 border border-neutral-200 dark:border-neutral-700 font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {label}
                    </span>
                    <span
                      className="p-3 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                      {value}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Сообщение об ошибке */}
        {status.isError && (
          <p className="text-red-500 text-center font-medium" role="alert">
            Failed to fetch color data. Please try again.
          </p>
        )}
      </div>
    </Card>
  );
};

export default ColorFinderPage;
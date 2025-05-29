/**
 * Хук useImageResize для управления изменением размеров изображения
 *
 * Принцип работы:
 * 1. Инициализация состояния:
 *    - Создается состояние для хранения размеров изображения (ширина и высота).
 *    - Создается состояние для хранения опций (блокировка соотношения сторон и уменьшение качества).
 *
 * 2. Обработка загрузки изображения:
 *    - При получении нового изображения, его размеры считываются и сохраняются в состоянии.
 *
 * 3. Обработка изменений размеров и опций:
 *    - При изменении размеров проверяется опция блокировки соотношения сторон.
 *    - Если соотношение заблокировано, второй размер пересчитывается автоматически.
 *    - Изменения опций (чекбоксы) обрабатываются отдельно.
 *
 * 4. Возврат данных:
 *    - Хук возвращает объект с текущими размерами, опциями и функцией для обработки изменений.
 *
 * Использование:
 * Этот хук позволяет легко интегрировать функционал изменения размеров изображения в React компоненты,
 * обеспечивая удобный интерфейс для управления размерами и дополнительными опциями.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Тип для размеров изображения
 */
type Dimensions = {
  width: number;
  height: number;
}

/**
 * Тип для опций изменения размера
 */
type Options = {
  lock: boolean;
  reduce: boolean;
}

/**
 * Хук для управления изменением размеров изображения
 * @param {string | null} image - URL или Data URL изображения
 * @returns {Object} Объект с размерами, опциями и функцией обработки изменений
 */
const useImageResize = (image: string | null) => {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const initialOptions = useMemo(() => ({ lock: true, reduce: false }), []);
  const [options, setOptions] = useState<Options>(initialOptions);

  /**
   * Эффект для обновления размеров при загрузке нового изображения
   */
  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
  }, [image]);

  /**
   * Обработчик изменений размеров и опций
   * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения input элемента
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setOptions(prev => ({ ...prev, [name]: checked }));
    } else {
      setDimensions(prev => {
        const newDimensions = { ...prev, [name]: Number(value) };
        if (options.lock) {
          const ratio = prev.width / prev.height;
          if (name === 'width') {
            newDimensions.height = Math.round(newDimensions.width / ratio);
          } else {
            newDimensions.width = Math.round(newDimensions.height * ratio);
          }
        }
        return newDimensions;
      });
    }
  }, [options.lock]);

  return { dimensions, options, handleInputChange };
};

export default useImageResize;
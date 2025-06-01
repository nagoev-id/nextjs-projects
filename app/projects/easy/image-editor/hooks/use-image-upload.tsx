/**
 * Хук useImageUpload для управления загрузкой изображений
 *
 * Принцип работы:
 * 1. Инициализация состояния:
 *    - Создается состояние для хранения загруженного изображения (в формате Data URL).
 *    - Создается ref для доступа к скрытому input элементу типа file.
 *
 * 2. Обработка клика для загрузки:
 *    - При клике на область загрузки программно активируется скрытый input элемент.
 *
 * 3. Обработка выбора файла:
 *    - При выборе файла через input элемент запускается процесс чтения файла.
 *    - Используется FileReader для асинхронного чтения файла и преобразования его в Data URL.
 *    - После успешного чтения, Data URL сохраняется в состоянии.
 *
 * 4. Возврат данных:
 *    - Хук возвращает объект с текущим изображением, ref для input элемента,
 *      и функции для обработки клика и изменения файла.
 *
 * Использование:
 * Этот хук позволяет легко интегрировать функционал загрузки изображений в React компоненты,
 * обеспечивая удобный интерфейс для выбора файлов и предварительного просмотра.
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Тип возвращаемого значения хука useImageUpload
 */
type UseImageUploadReturn = {
  /** Загруженное изображение в формате Data URL или null */
  image: string | null;
  /** Ref для доступа к скрытому input элементу */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Функция для обработки клика на область загрузки */
  handleImageClick: () => void;
  /** Функция для обработки выбора файла */
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Хук для управления загрузкой изображений
 * @returns {UseImageUploadReturn} Объект с данными и функциями для управления загрузкой изображений
 */
const useImageUpload = (): UseImageUploadReturn => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Обработчик клика на область загрузки
   * Активирует скрытый input элемент для выбора файла
   */
  const handleImageClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  /**
   * Обработчик изменения файла
   * Читает выбранный файл и сохраняет его как Data URL
   * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения input элемента
   */
  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return { image, inputRef, handleImageClick, handleImageChange };
};

export default useImageUpload;
'use client';

/**
 * # Отслеживание нажатий клавиш
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - При загрузке приложение отображает сообщение "Press any key"
 *    - Устанавливается начальное состояние для информации о клавише (пустые значения)
 *    - Приложение определяет тип устройства (мобильное или десктопное)
 * 
 * 2. **Обработка событий клавиатуры**:
 *    - На десктопных устройствах устанавливается слушатель события 'keydown'
 *    - При нажатии любой клавиши вызывается функция handleKeydown
 *    - Функция обновляет состояние с информацией о нажатой клавише (key, code)
 * 
 * 3. **Поддержка мобильных устройств**:
 *    - На мобильных устройствах, где события клавиатуры недоступны, показывается специальное сообщение
 *    - Определение мобильного устройства происходит через проверку User-Agent
 *    - Вместо ожидания нажатия клавиши сразу отображается информационное сообщение
 * 
 * 4. **Отображение информации**:
 *    - После нажатия клавиши интерфейс обновляется и показывает:
 *      - Символ нажатой клавиши (с особой обработкой для пробела)
 *      - Код клавиши (например, "KeyA" для клавиши A)
 *    - Информация отображается в визуально выделенных блоках
 * 
 * 5. **Очистка ресурсов**:
 *    - При размонтировании компонента удаляется слушатель события
 *    - Это предотвращает утечки памяти и ошибки после закрытия страницы
 */

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';

/**
 * Интерфейс для информации о нажатой клавише
 * @interface KeyInfo
 * @property {string} key - Символ или название нажатой клавиши
 * @property {string} code - Код нажатой клавиши (например, "KeyA")
 * @property {boolean} isPressed - Флаг, указывающий было ли нажатие клавиши
 */
type KeyInfo = {
  key: string;
  code: string;
  isPressed: boolean;
}

/**
 * Компонент для отслеживания и отображения информации о нажатых клавишах
 * Показывает символ и код нажатой клавиши в реальном времени
 * 
 * @returns {JSX.Element} Компонент отслеживания нажатий клавиш
 */
const KeyEventListenerPage = (): JSX.Element => {
  /**
   * Состояние для хранения информации о нажатой клавише
   */
  const [keyInfo, setKeyInfo] = useState<KeyInfo>({ key: '', code: '', isPressed: false });

  /**
   * Обработчик события нажатия клавиши
   * Обновляет состояние с информацией о нажатой клавише
   * 
   * @param {KeyboardEvent} event - Событие нажатия клавиши
   */
  const handleKeydown = useCallback((event: KeyboardEvent): void => {
    setKeyInfo({
      key: event.key,
      code: event.code,
      isPressed: true,
    });
  }, []);

  /**
   * Эффект для установки и удаления слушателя события
   * Определяет тип устройства и настраивает соответствующее поведение
   */
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      setKeyInfo({
        key: 'Mobile device detected',
        code: 'N/A',
        isPressed: true,
      });
    } else {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  }, [handleKeydown]);

  /**
   * Мемоизированное значение для отображения символа клавиши
   * Заменяет пробел на слово "Space" для лучшей читаемости
   */
  const displayKey = useMemo(() => keyInfo.key === ' ' ? 'Space' : keyInfo.key, [keyInfo.key]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded" aria-label="Key event information">
      {!keyInfo.isPressed ? (
        <p className="font-bold text-center text-2xl md:text-3xl">Press any key</p>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-2 place-items-center">
            <span
              className="inline-flex justify-center items-center text-red-400 uppercase font-bold text-4xl border-4 border-red-400 rounded p-5">
              {displayKey}
            </span>
            <span className="uppercase font-bold text-2xl text-red-400 md:text-4xl">{keyInfo.code}</span>
          </div>
          <div className="grid grid-cols-2 place-items-center">
            <p className="font-bold text-2xl text-center w-full">
              Key: <span className="font-normal">{displayKey}</span>
            </p>
            <p className="font-bold text-2xl text-center border-l-2 border-slate-900 w-full">
              Code: <span className="font-normal">{keyInfo.code}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeyEventListenerPage;
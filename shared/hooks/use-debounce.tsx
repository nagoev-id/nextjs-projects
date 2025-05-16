import { useEffect, useState } from 'react';

/**
 * Хук useDebounce создает дебаунсированное значение, которое обновляется только после
 * указанной задержки с момента последнего изменения исходного значения.
 *
 * Это полезно для оптимизации производительности в случаях, когда значение может
 * меняться часто (например, при вводе в поисковое поле), но обработка этих изменений
 * является ресурсоемкой операцией (например, API-запросы или фильтрация больших списков).
 *
 * @template T Тип дебаунсированного значения
 * @param {T} value - Исходное значение, которое нужно дебаунсировать
 * @param {number} delay - Задержка в миллисекундах перед обновлением дебаунсированного значения
 * @returns {T} Дебаунсированное значение, которое обновляется после указанной задержки
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

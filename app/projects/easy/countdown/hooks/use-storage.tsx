'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Проверяет, доступно ли localStorage в текущем окружении
 * @returns {boolean} true, если localStorage доступен, иначе false
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('Local storage is not available:', e);
    return false;
  }
};

/**
 * Пользовательский хук для использования localStorage с типовой безопасностью
 * @template T Тип хранимого значения
 * @param {string} key Ключ, по которому значение будет храниться в localStorage
 * @param {T} initialValue Начальное значение, используемое если в хранилище ничего нет
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} Кортеж, содержащий: хранимое значение, функцию установки значения и функцию удаления
 */
const useStorage = <T, >(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Состояние для хранения нашего значения
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      // Получаем из localStorage по ключу
      const item = window.localStorage.getItem(key);
      // Разбираем сохраненный JSON или возвращаем initialValue, если ничего нет
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // В случае ошибки также возвращаем initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Возвращаем обёрнутую версию функции-сеттера useState, которая сохраняет новое значение в localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Позволяем значению быть функцией, чтобы сохранить тот же API, что и у useState
      const valueToStore = typeof value === 'function'
        ? (value as (val: T) => T)(storedValue)
        : value;

      // Сохраняем состояние
      setStoredValue(valueToStore);

      // Сохраняем в localStorage
      if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Функция для удаления элемента из localStorage
  const removeItem = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Слушаем изменения этого ключа localStorage в других вкладках/окнах
  useEffect(() => {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) {
        return;
      }

      if (e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      } else {
        // Элемент был удален
        setStoredValue(initialValue);
      }
    };

    // Слушаем события хранилища
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initialValue, key]);

  return [storedValue, setValue, removeItem];
};

export default useStorage;
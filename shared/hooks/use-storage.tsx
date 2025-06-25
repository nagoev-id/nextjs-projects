'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Проверяет доступность localStorage
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
 * Хук для работы с localStorage с типовой безопасностью
 * @returns [хранимое значение, функция установки, функция удаления]
 */
export const useStorage = <T, >(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Инициализация состояния из localStorage или initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для обновления значения в state и localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = typeof value === 'function'
        ? (value as (val: T) => T)(storedValue)
        : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Функция для удаления значения из localStorage
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

  // Синхронизация с другими вкладками
  useEffect(() => {
    if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) return;

      if (e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      } else {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialValue, key]);

  return [storedValue, setValue, removeItem];
};
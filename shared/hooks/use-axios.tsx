import { useState, useCallback } from 'react';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * Тип данных, возвращаемых хуком useAxios
 * 
 * @template T - Тип данных, ожидаемых от API
 * @property {T | null} data - Полученные данные или null, если запрос не выполнен
 * @property {boolean} loading - Флаг загрузки данных
 * @property {Error | null} error - Объект ошибки или null, если ошибок нет
 * @property {Function} fetchData - Функция для выполнения HTTP-запроса
 */
type UseAxiosResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (url: string, options?: AxiosRequestConfig) => Promise<T>;
}

/**
 * Кастомный хук для выполнения HTTP-запросов с использованием axios
 * 
 * @template T - Тип данных, ожидаемых от API (по умолчанию unknown)
 * @returns {UseAxiosResult<T>} Объект с данными, состоянием загрузки, ошибкой и функцией запроса
 */
export default function useAxios<T = unknown>(): UseAxiosResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (url: string, options: AxiosRequestConfig = {}): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<T> = await axios(url, options);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
import { useCallback, useMemo, useState } from 'react';

/**
 * @interface PaginationResult
 * @template T - Тип данных элементов для пагинации
 * @description Интерфейс, описывающий результат работы хука пагинации
 */
interface PaginationResult<T> {
  /** Текущая активная страница (начиная с 0) */
  currentPage: number;
  /** Массив страниц с данными, где каждая страница - это массив элементов типа T */
  paginatedData: T[][];
  /** Функция для перехода к следующей или предыдущей странице */
  handlePaginationClick: (direction: 'next' | 'prev') => void;
  /** Функция для перехода на конкретную страницу по её номеру */
  handlePaginationNumberClick: (pageNumber: number) => void;
}

/**
 * Хук для реализации пагинации данных
 *
 * @template T - Тип данных элементов для пагинации
 * @param {T[]} data - Массив данных, которые нужно разбить на страницы
 * @param {number} itemsPerPage - Количество элементов на одной странице
 * @returns {PaginationResult<T>} Объект с данными и функциями для управления пагинацией
 *
 * @example
 * // Пример использования хука
 * const users = [...]; // массив пользователей
 * const {
 *   currentPage,
 *   paginatedData,
 *   handlePaginationClick,
 *   handlePaginationNumberClick
 * } = usePagination(users, 10);
 *
 * // Отображение текущей страницы пользователей
 * const currentUsers = paginatedData[currentPage] || [];
 */
const usePagination = <T, >(data: T[], itemsPerPage: number): PaginationResult<T> => {

  /** Состояние для хранения текущей страницы (начиная с 0) */
  const [currentPage, setCurrentPage] = useState<number>(0);

  /**
   * Разбивает исходный массив данных на страницы
   * @type {T[][]} Двумерный массив, где каждый вложенный массив - это страница с элементами
   */
  const paginatedData = useMemo<T[][]>(() => {
    return data.reduce((acc: T[][], item: T, index: number) => {
      const pageIndex = Math.floor(index / itemsPerPage);
      if (!acc[pageIndex]) {
        acc[pageIndex] = [];
      }
      acc[pageIndex].push(item);
      return acc;
    }, []);
  }, [data, itemsPerPage]);

  /**
   * Обработчик для перехода к следующей или предыдущей странице
   * @param {('next'|'prev')} direction - Направление перехода: 'next' - вперед, 'prev' - назад
   */
  const handlePaginationClick = useCallback((direction: 'next' | 'prev') => {
    setCurrentPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  /**
   * Обработчик для перехода на конкретную страницу по её номеру
   * @param {number} pageNumber - Номер страницы для перехода
   */
  const handlePaginationNumberClick = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  return {
    currentPage,
    paginatedData,
    handlePaginationClick,
    handlePaginationNumberClick,
  };
};

export default usePagination;
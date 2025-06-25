'use client';
import { useCallback, useMemo, useState } from 'react';

/**
 * Интерфейс результата работы хука пагинации
 */
interface PaginationResult<T> {
  /** Текущая активная страница (начиная с 0) */
  currentPage: number;
  /** Массив страниц с данными */
  paginatedData: T[][];
  /** Функция для перехода к следующей или предыдущей странице */
  handlePaginationClick: (direction: 'next' | 'prev') => void;
  /** Функция для перехода на конкретную страницу */
  handlePaginationNumberClick: (pageNumber: number) => void;
}

/**
 * Хук для реализации пагинации данных
 */
export const usePagination = <T, >(data: T[], itemsPerPage: number): PaginationResult<T> => {
  // Текущая страница
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Разбиение данных на страницы
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

  // Переход к следующей/предыдущей странице
  const handlePaginationClick = useCallback((direction: 'next' | 'prev') => {
    setCurrentPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  // Переход на конкретную страницу
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
'use client';

/**
 * # Movie Seat Booking
 *
 * ## Принцип работы:
 *
 * 1. **Выбор фильма**:
 *    - Пользователь выбирает фильм из выпадающего списка
 *    - Каждый фильм имеет свою стоимость билета
 *    - При выборе фильма обновляется текущая цена билета
 *
 * 2. **Выбор мест**:
 *    - Пользователь может выбирать свободные места в кинозале
 *    - Занятые места отмечены и недоступны для выбора
 *    - Выбранные места визуально выделяются
 *
 * 3. **Расчет стоимости**:
 *    - Автоматически рассчитывается общая стоимость билетов
 *    - Стоимость зависит от выбранного фильма и количества мест
 *
 * 4. **Сохранение данных**:
 *    - Выбранные места и фильм сохраняются в localStorage
 *    - При перезагрузке страницы данные восстанавливаются
 *
 * 5. **Визуализация зала**:
 *    - Схема зала отображает все места с их текущим статусом
 *    - Легенда поясняет значение каждого типа места (свободное, выбранное, занятое)
 */

import { Card, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { JSX, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useStorage } from '@/shared';

/**
 * Тип для данных о фильме
 */
type MovieData = {
  name: string;
  price: number;
  seats: boolean[][];
};

/**
 * Тип для хранилища фильмов
 */
type MoviesStorage = {
  [key: string]: MovieData;
};

/**
 * Исходные данные приложения
 */
const DEFAULT_DATA = {
  movies: ['The Guard ($10)', 'Harry Potter ($12)', 'Detachment ($8)', 'Sing Street ($9)'],
  prices: [10, 12, 8, 9],
};

// Константы для размеров зала
const ROWS = 6;
const COLS = 8;

// Ключи для localStorage
const MOVIE_STORAGE_KEY = 'movie-seat-booking-movie';
const MOVIES_DATA_STORAGE_KEY = 'movie-seat-booking-movies-data';

// Предопределенные занятые места (row, col)
const OCCUPIED_SEATS = [
  [1, 3], [1, 4],
  [2, 6], [2, 7],
  [4, 3], [4, 4],
  [5, 4], [5, 5], [5, 6],
];

// Преобразуем массив занятых мест в Map для быстрого доступа
const OCCUPIED_SEATS_MAP = new Map(
  OCCUPIED_SEATS.map(([row, col]) => [`${row}-${col}`, true]),
);

/**
 * Создает пустой двумерный массив для мест
 * @returns {boolean[][]} Двумерный массив с false значениями
 */
const createEmptySeatsArray = (): boolean[][] => {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
};

/**
 * Создает начальное состояние для хранилища фильмов
 * @returns {MoviesStorage} Объект с данными о фильмах
 */
const createInitialMoviesStorage = (): MoviesStorage => {
  return DEFAULT_DATA.movies.reduce((acc, name, index) => {
    acc[index] = {
      name,
      price: DEFAULT_DATA.prices[index],
      seats: createEmptySeatsArray(),
    };
    return acc;
  }, {} as MoviesStorage);
};

/**
 * Компонент места в зале
 */
const SeatComponent = memo(({
                              row,
                              col,
                              isSelected,
                              isOccupied,
                              onClick,
                            }: {
  row: number;
  col: number;
  isSelected: boolean;
  isOccupied: boolean;
  onClick: () => void;
}) => {
  const seatClass = `w-full h-8 border-3 border-black ${
    isOccupied
      ? 'bg-white cursor-not-allowed'
      : isSelected
        ? 'bg-red-400 cursor-pointer'
        : 'bg-gray-300 hover:bg-amber-300 cursor-pointer'
  }`;

  return (
    <button
      className={seatClass}
      disabled={isOccupied}
      onClick={onClick}
      aria-label={`Seat ${row}-${col} ${isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'}`}
    />
  );
});

SeatComponent.displayName = 'Seat';

/**
 * Компонент ряда мест
 */
const RowComponent = memo(({
                             rowIndex,
                             selectedSeats,
                             onSeatClick,
                           }: {
  rowIndex: number;
  selectedSeats: boolean[][];
  onSeatClick: (row: number, col: number) => void;
}) => {
  return (
    <div className="row grid grid-cols-8 gap-2.5">
      {Array(COLS).fill(null).map((_, col) => (
        <SeatComponent
          key={`seat-${rowIndex}-${col}`}
          row={rowIndex}
          col={col}
          isSelected={selectedSeats[rowIndex][col]}
          isOccupied={OCCUPIED_SEATS_MAP.has(`${rowIndex}-${col}`)}
          onClick={() => onSeatClick(rowIndex, col)}
        />
      ))}
    </div>
  );
});

RowComponent.displayName = 'Row';

/**
 * Компонент бронирования мест в кинотеатре
 * @returns {JSX.Element} Компонент страницы бронирования мест
 */
const MovieSeatBooking = (): JSX.Element => {
  /**
   * Состояние выбранного фильма (индекс)
   */
  const [selectedMovieIndex, setSelectedMovieIndex] = useStorage<number>(MOVIE_STORAGE_KEY, 0);

  /**
   * Хранилище данных о фильмах и их местах
   */
  const [moviesData, setMoviesData] = useStorage<MoviesStorage>(
    MOVIES_DATA_STORAGE_KEY,
    createInitialMoviesStorage()
  );

  /**
   * Локальное состояние для выбранных мест текущего фильма
   */
  const [selectedSeats, setSelectedSeats] = useState<boolean[][]>(
    moviesData[selectedMovieIndex]?.seats || createEmptySeatsArray()
  );

  /**
   * Обновляем локальное состояние мест при изменении фильма
   */
  useEffect(() => {
    setSelectedSeats(moviesData[selectedMovieIndex]?.seats || createEmptySeatsArray());
  }, [selectedMovieIndex, moviesData]);

  /**
   * Обработчик изменения выбранного фильма
   * @param {string} value - Индекс выбранного фильма
   */
  const handleMovieChange = useCallback((value: string) => {
    setSelectedMovieIndex(parseInt(value));
  }, [setSelectedMovieIndex]);

  /**
   * Обработчик клика по месту
   * @param {number} row - Номер ряда
   * @param {number} col - Номер места в ряду
   */
  const handleSeatClick = useCallback((row: number, col: number) => {
    if (OCCUPIED_SEATS_MAP.has(`${row}-${col}`)) return;

    setSelectedSeats(prev => {
      const newSeats = [...prev];
      newSeats[row] = [...prev[row]];
      newSeats[row][col] = !newSeats[row][col];

      // Обновляем данные о местах в хранилище фильмов
      setMoviesData(prevData => ({
        ...prevData,
        [selectedMovieIndex]: {
          ...prevData[selectedMovieIndex],
          seats: newSeats
        }
      }));

      return newSeats;
    });
  }, [selectedMovieIndex, setMoviesData]);

  /**
   * Подсчет количества выбранных мест и общей стоимости
   */
  const { selectedSeatsCount, totalPrice } = useMemo(() => {
    const count = selectedSeats.reduce((total, row) =>
      total + row.filter(Boolean).length, 0);
    return {
      selectedSeatsCount: count,
      totalPrice: count * moviesData[selectedMovieIndex]?.price || 0,
    };
  }, [selectedSeats, selectedMovieIndex, moviesData]);

  return (
    <Card className="max-w-md w-full mx-auto p-4 rounded gap-3">
      <div>
        <Label className="grid gap-1">
          <span className="text-sm font-medium">Pick a movie:</span>
          <Select value={selectedMovieIndex.toString()} onValueChange={handleMovieChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_DATA.movies.map((movie, index) => (
                <SelectItem key={movie} value={index.toString()}>
                  {movie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>

      <div
        className="h-28 grid place-items-center bg-gray-500 text-center font-bold text-white uppercase border-4 border-black dark:border-white">
        {moviesData[selectedMovieIndex]?.name || DEFAULT_DATA.movies[selectedMovieIndex]}
      </div>

      <div className="grid gap-2.5">
        {Array(ROWS).fill(null).map((_, row) => (
          <RowComponent
            key={`row-${row}`}
            rowIndex={row}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
          />
        ))}
      </div>

      <p className="text-center">
        You have selected <span className="font-bold">{selectedSeatsCount}</span> seats for a price of{' '}
        <span className="font-bold">${totalPrice}</span>
      </p>
    </Card>
  );
};

export default MovieSeatBooking;
'use client';

/**
 * # Игра "Найди пару" (Memory Matching Game)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация игры**:
 *    - Создается набор карточек, каждая карточка представлена дважды для формирования пар
 *    - Карточки перемешиваются случайным образом при старте игры
 *    - Инициализируются состояния для отслеживания открытых, совпавших карточек и ходов
 *
 * 2. **Игровой процесс**:
 *    - Игрок открывает карточки, нажимая на них
 *    - За один ход можно открыть максимум две карточки
 *    - Если открытые карточки совпадают, они остаются открытыми
 *    - Если карточки не совпадают, они автоматически закрываются через короткий промежуток времени
 *    - Каждое открытие карточки считается как один ход
 *
 * 3. **Завершение игры**:
 *    - Игра завершается, когда все пары карточек найдены
 *    - Отображается поздравление и количество сделанных ходов
 *    - Игрок может начать новую игру, нажав кнопку "Restart"
 *
 * 4. **Оптимизация производительности**:
 *    - Используются мемоизированные колбэки для предотвращения лишних рендеров
 *    - Эффекты имеют корректные зависимости для предотвращения бесконечных циклов
 *    - Таймеры корректно очищаются для предотвращения утечек памяти
 *    - Компоненты игровой доски и экрана завершения мемоизированы для оптимизации рендеринга
 *
 * 5. **Доступность**:
 *    - Карточки имеют атрибуты ARIA для улучшения доступности
 *    - Используются семантические роли для интерактивных элементов
 *    - Добавлены описательные метки для скринридеров
 *
 * @type {React.FC}
 * @returns {JSX.Element} Компонент игры "Найди пару"
 */

import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import _ from 'lodash';
import { Button } from '@/components/ui';

/**
 * @typedef {Object} CardItem
 * @property {number} id - Уникальный идентификатор карточки
 * @property {string} value - Значение карточки (эмодзи)
 */
type CardItem = {
  id: number;
  value: string;
}

/**
 * Начальный набор карточек для игры
 * @constant {CardItem[]}
 */
const INITIAL_CARDS: CardItem[] = [
  { id: 1, value: '🍎' }, { id: 2, value: '🍐' }, { id: 3, value: '🍋' },
  { id: 4, value: '🥝' }, { id: 5, value: '🍇' }, { id: 6, value: '🍉' },
];

/**
 * Компонент игры "Найди пару"
 *
 * @description
 * Основной компонент игры, который управляет состоянием игры,
 * обрабатывает действия пользователя и отображает игровую доску.
 *
 * @returns {JSX.Element} Компонент игры
 */
const MemoryMatchingPage = (): JSX.Element => {
  // Используем useMemo для начального перемешивания карт, чтобы избежать повторного перемешивания при ререндерах
  const initialCards = useMemo(() => _.shuffle([...INITIAL_CARDS, ...INITIAL_CARDS]), []);
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [endGame, setEndGame] = useState<boolean>(false);

  /**
   * Обрабатывает переворот карточки
   *
   * @param {number} idx - Индекс карточки в массиве
   * @returns {void}
   */
  const flipCard = useCallback((idx: number) => {
    // Предотвращаем открытие уже открытых карт или открытие более 2 карт одновременно
    if (opened.includes(idx) || opened.length === 2) return;

    setMoves(prevMoves => prevMoves + 1);
    setOpened(prevOpened => [...prevOpened, idx]);
  }, [opened]);

  /**
   * Перезапускает игру, сбрасывая все состояния
   *
   * @returns {void}
   */
  const handleRestart = useCallback(() => {
    setCards(_.shuffle([...INITIAL_CARDS, ...INITIAL_CARDS]));
    setOpened([]);
    setMatched([]);
    setMoves(0);
    setEndGame(false);
  }, []);

  /**
   * Эффект для проверки совпадений открытых карточек
   *
   * @description
   * Когда открыты две карточки, проверяет их на совпадение.
   * Если карточки совпадают, добавляет их в список совпавших.
   * В любом случае, закрывает карточки через 800мс.
   */
  useEffect(() => {
    if (opened.length !== 2) return;

    const [firstCard, secondCard] = opened.map(idx => cards[idx]);

    if (firstCard.value === secondCard.value) {
      setMatched(prevMatched => [...prevMatched, firstCard.id]);
    }

    // Закрываем карточки через небольшую задержку
    const timer = setTimeout(() => setOpened([]), 800);
    return () => clearTimeout(timer);
  }, [opened, cards]);

  /**
   * Эффект для проверки завершения игры
   *
   * @description
   * Когда количество совпавших карточек равно количеству
   * уникальных карточек, игра считается завершенной.
   */
  useEffect(() => {
    if (matched.length === INITIAL_CARDS.length) setEndGame(true);
  }, [matched]);

  /**
   * Мемоизированный компонент игровой доски
   *
   * @type {JSX.Element}
   */
  const gameBoard = useMemo(() => (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
      {cards.map((item, idx) => (
        <div
          key={idx}
          className={`card ${opened.includes(idx) || matched.includes(item.id) ? 'flipped' : ''}`}
          onClick={() => flipCard(idx)}
          role="button"
          aria-label={`Card ${idx + 1}, ${opened.includes(idx) || matched.includes(item.id) ? 'flipped' : 'hidden'}`}
        >
          <div className="inner">
            <div className="front">{item.value}</div>
            <div className="back">?</div>
          </div>
        </div>
      ))}
    </div>
  ), [cards, opened, matched, flipCard]);

  /**
   * Мемоизированный компонент экрана завершения игры
   *
   * @type {JSX.Element}
   */
  const endGameScreen = useMemo(() => (
    <div className="grid gap-2 text-center max-w-xl mx-auto">
      <p className="text-2xl font-semibold">You win ✨</p>
      <p className="text-lg">
        You completed the game in <span className="font-semibold">{moves}</span> steps
      </p>
      <Button onClick={handleRestart}>Restart</Button>
    </div>
  ), [moves, handleRestart]);

  return (
    <Card className="max-w-3xl w-full mx-auto p-4 rounded">
      {endGame ? endGameScreen : gameBoard}
    </Card>
  );
};

export default MemoryMatchingPage;
import { createElement, JSX } from 'react';
import { selectHangmanData } from '@/app/projects/medium/hangman-game/features';
import { useAppSelector } from '@/app/projects/medium/hangman-game/app';

/**
 * Компонент для отображения виселицы в игре Hangman
 * 
 * Визуализирует состояние виселицы на основе количества неправильных букв.
 * Каждая неправильная буква добавляет новую часть тела к виселице.
 * Всего 6 частей тела: голова, туловище, левая рука, правая рука, левая нога, правая нога.
 * 
 * @returns {JSX.Element} SVG-изображение виселицы с отображаемыми частями тела
 */
const Figure = (): JSX.Element => {
  /**
   * Получение массива неправильных букв из Redux-хранилища
   */
  const { wrongLetters } = useAppSelector(selectHangmanData);

  /**
   * Массив частей тела с их SVG-параметрами
   * Каждая часть тела отображается последовательно при увеличении количества неправильных букв
   * 
   * @type {Array<{type: string, props: Object}>}
   */
  const bodyParts = [
    { type: 'circle', props: { cx: 140, cy: 70, r: 20, fill: '#fff' } }, // Голова
    { type: 'line', props: { x1: 140, y1: 90, x2: 140, y2: 150 } }, // Тело
    { type: 'line', props: { x1: 140, y1: 120, x2: 120, y2: 100 } }, // Левая рука
    { type: 'line', props: { x1: 140, y1: 120, x2: 160, y2: 100 } }, // Правая рука
    { type: 'line', props: { x1: 140, y1: 150, x2: 120, y2: 180 } }, // Левая нога
    { type: 'line', props: { x1: 140, y1: 150, x2: 160, y2: 180 } }, // Правая нога
  ];

  return (
    <div className="grid justify-items-center">
      <svg height="250" width="200" className="stroke-black dark:stroke-white stroke-[5px]">
        {/* Верхняя перекладина */}
        <line x1="60" y1="20" x2="140" y2="20" />
        {/* Вертикальная линия для подвешивания */}
        <line x1="140" y1="20" x2="140" y2="50" />
        {/* Вертикальная опора */}
        <line x1="60" y1="20" x2="60" y2="230" />
        {/* Основание */}
        <line x1="20" y1="230" x2="100" y2="230" />
        {/* Отображение частей тела в зависимости от количества неправильных букв */}
        {bodyParts.map((part, index) => (
          wrongLetters.length > index && createElement(part.type, { key: index, ...part.props })
        ))}
      </svg>
    </div>
  );
};

export default Figure;
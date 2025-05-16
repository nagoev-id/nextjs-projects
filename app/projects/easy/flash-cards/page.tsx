'use client';

/**
 * # Флеш-карточки для обучения
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение отображает сетку карточек с вопросами
 *    - Каждая карточка изначально показывает только вопрос
 *    - Состояние selectedId отслеживает, какая карточка в данный момент перевернута
 *
 * 2. **Взаимодействие с карточками**:
 *    - Пользователь может нажать на карточку, чтобы увидеть ответ
 *    - При повторном нажатии карточка переворачивается обратно, показывая вопрос
 *    - В один момент времени может быть перевернута только одна карточка
 *
 * 3. **Доступность**:
 *    - Карточки доступны для навигации с клавиатуры (tabIndex={0})
 *    - Поддерживаются клавиши Enter и Пробел для переворачивания карточек
 *    - Каждая карточка имеет соответствующие ARIA-атрибуты для скринридеров
 *
 * 4. **Визуальная обратная связь**:
 *    - Перевернутая карточка меняет цвет фона на зеленый для визуального выделения
 *    - При наведении на неперевернутые карточки происходит легкое изменение цвета
 *
 * 5. **Адаптивный дизайн**:
 *    - Сетка карточек автоматически адаптируется под размер экрана
 *    - На маленьких экранах отображается одна колонка, на больших - до четырех колонок
 */

import { Card } from '@/components/ui/card';
import { JSX, KeyboardEvent, useCallback, useState } from 'react';

/**
 * Тип данных для элемента флеш-карточки
 * @typedef {Object} MockItem
 * @property {number} id - Уникальный идентификатор карточки
 * @property {string} question - Текст вопроса на карточке
 * @property {string} answer - Текст ответа на карточке
 */
type MockItem = {
  id: number;
  question: string;
  answer: string;
}

/**
 * Массив данных для флеш-карточек с вопросами и ответами по React
 * @constant {MockItem[]} MOCK
 */
const MOCK: MockItem[] = [
  { id: 3457, question: 'What language is React based on?', answer: 'JavaScript' },
  { id: 7336, question: 'What are the building blocks of React apps?', answer: 'Components' },
  { id: 8832, question: 'What\'s the name of the syntax we use to describe a UI in React?', answer: 'JSX' },
  { id: 1297, question: 'How to pass data from parent to child components?', answer: 'Props' },
  { id: 9103, question: 'How to give components memory?', answer: 'useState hook' },
  {
    id: 2002,
    question: 'What do we call an input element that is completely synchronised with state?',
    answer: 'Controlled element',
  },
];

/**
 * Компонент страницы с флеш-карточками
 * Позволяет пользователю просматривать вопросы и ответы, переворачивая карточки
 *
 * @returns {JSX.Element} Компонент страницы с флеш-карточками
 */
const FlashCardsPage = (): JSX.Element => {
  /**
   * Состояние для отслеживания ID выбранной (перевернутой) карточки
   * @type {[number|null, React.Dispatch<React.SetStateAction<number|null>>]}
   */
  const [selectedId, setSelectedId] = useState<number | null>(null);

  /**
   * Обработчик клика по карточке
   * Переворачивает карточку, показывая либо вопрос, либо ответ
   *
   * @param {number} id - ID карточки, по которой произошел клик
   */
  const handleCardClick = useCallback((id: number) => {
    setSelectedId(prevId => prevId === id ? null : id);
  }, []);

  /**
   * Обработчик нажатия клавиш для доступности с клавиатуры
   * Реагирует на клавиши Enter и Пробел для переворачивания карточки
   *
   * @param {KeyboardEvent<HTMLLIElement>} e - Событие нажатия клавиши
   * @param {number} id - ID карточки, на которой произошло событие
   */
  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLLIElement>, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(id);
    }
  }, [handleCardClick]);

  return (
    <Card className="max-w-6xl w-full mx-auto p-4 rounded">
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" aria-label="Flash cards">
        {MOCK.map(({ answer, id, question }: MockItem) => (
          <li
            key={id}
            onClick={() => handleCardClick(id)}
            onKeyDown={(e) => handleKeyPress(e, id)}
            tabIndex={0}
            role="button"
            aria-pressed={selectedId === id}
            aria-label={`Flash card for question: ${question}`}
            className={`
                cursor-pointer 
                p-3 
                border-2 
                border-gray-500 
                rounded 
                flex 
                justify-center 
                items-center 
                text-center 
                min-h-[120px]
                transition-colors
                ${selectedId === id ? 'bg-green-200' : 'bg-white hover:bg-gray-50'}
              `}
          >
            {selectedId === id ? answer : question}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default FlashCardsPage;
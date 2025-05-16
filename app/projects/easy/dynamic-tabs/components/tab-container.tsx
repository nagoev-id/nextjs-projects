'use client';


import { JSX, ReactNode, useCallback, useMemo, useState } from 'react';

/**
 * Тип функции для рендеринга вкладок
 * Принимает параметры состояния и возвращает ReactNode для отображения вкладок
 * 
 * @param {boolean} isVertical - Флаг вертикального расположения вкладок
 * @param {number} activeTabIndex - Индекс активной вкладки
 * @param {number} tabsCount - Количество вкладок
 * @param {TabClickHandler} handleTabClick - Обработчик клика по вкладке
 * @returns {ReactNode} Компонент вкладок
 */
type TabsRenderer = (
  isVertical: boolean,
  activeTabIndex: number,
  tabsCount: number,
  handleTabClick: TabClickHandler,
) => ReactNode;

/**
 * Тип обработчика клика по вкладке
 * Функция, вызываемая при клике на вкладку
 * 
 * @param {number} index - Индекс вкладки, по которой произошел клик
 * @returns {void}
 */
type TabClickHandler = (index: number) => void

/**
 * Тип функции для рендеринга содержимого вкладок
 * Принимает параметры состояния и возвращает ReactNode для отображения содержимого
 * 
 * @param {number} activeTabIndex - Индекс активной вкладки
 * @param {number} tabsCount - Количество вкладок
 * @returns {ReactNode} Компонент содержимого вкладок
 */
type TabContentRenderer = (
  activeTabIndex: number,
  tabsCount: number,
) => ReactNode;

/**
 * Интерфейс свойств компонента TabsContainer
 * Определяет параметры, необходимые для настройки контейнера вкладок
 * 
 * @property {string} title - Заголовок контейнера вкладок
 * @property {boolean} isVertical - Флаг вертикального расположения вкладок
 * @property {TabsRenderer} renderTabs - Функция для рендеринга вкладок
 * @property {TabContentRenderer} renderTabContent - Функция для рендеринга содержимого вкладок
 * @property {number} [tabsCount=3] - Количество вкладок (по умолчанию 3)
 */
interface TabsContainerProps {
  title: string;
  isVertical: boolean;
  renderTabs: TabsRenderer;
  renderTabContent: TabContentRenderer;
  tabsCount?: number;
}

/**
 * Компонент контейнера вкладок
 * Управляет состоянием активной вкладки и рендерит вкладки и их содержимое
 * с помощью переданных функций рендеринга
 * 
 * @param {TabsContainerProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент контейнера вкладок
 */
const TabsContainer = ({
  title,
  isVertical,
  renderTabs,
  renderTabContent,
  tabsCount = 3,
}: TabsContainerProps): JSX.Element => {

  /**
   * Состояние для хранения индекса активной вкладки
   * Начальное значение - 0 (первая вкладка)
   */
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  /**
   * Обработчик клика по вкладке
   * Проверяет валидность индекса и обновляет состояние активной вкладки
   * Мемоизирован для предотвращения ненужных перерисовок
   * 
   * @param {number} index - Индекс вкладки, по которой произошел клик
   * @returns {void}
   */
  const handleTabClick = useCallback((index: number): void => {
    if (index >= 0 && index < tabsCount) {
      setActiveTabIndex(index);
    }
  }, [tabsCount]);

  /**
   * Мемоизированный класс контейнера
   * Определяет CSS классы в зависимости от ориентации вкладок
   * Пересчитывается только при изменении параметра isVertical
   * 
   * @returns {string} CSS классы для контейнера
   */
  const containerClass = useMemo(() => {
    return isVertical
      ? 'border grid rounded sm:grid-cols-[200px_auto] sm:items-start tabs-item tabs-item--vertical'
      : 'border grid rounded tabs-item--horizontal';
  }, [isVertical]);

  return (
    <section aria-labelledby="tabs-title">
      <h3 id="tabs-title" className="font-bold text-2xl text-center mb-4 ">
        {title}
      </h3>

      <div
        className={containerClass}
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      >
        {/* Рендеринг вкладок с помощью переданной функции */}
        {renderTabs(isVertical, activeTabIndex, tabsCount, handleTabClick)}
        
        {/* Рендеринг содержимого вкладок с помощью переданной функции */}
        {renderTabContent(activeTabIndex, tabsCount)}
      </div>
    </section>
  );
};

export default TabsContainer;
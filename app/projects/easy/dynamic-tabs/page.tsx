'use client';

/**
 * # Динамические вкладки
 * 
 * ## Принцип работы:
 * 
 * 1. **Архитектура компонентов**:
 *    - Приложение использует паттерн рендер-пропсов для гибкой настройки вкладок
 *    - Основной компонент DynamicTabsPage содержит логику и рендеринг вкладок
 *    - Компонент TabsContainer принимает функции рендеринга и управляет состоянием вкладок
 * 
 * 2. **Управление состоянием**:
 *    - Каждый контейнер вкладок имеет собственное состояние activeTabIndex
 *    - При клике на вкладку обновляется состояние и отображается соответствующее содержимое
 *    - Состояние мемоизируется для предотвращения ненужных перерисовок
 * 
 * 3. **Рендеринг вкладок**:
 *    - Функция renderTabs создает список вкладок с соответствующими атрибутами доступности
 *    - Активная вкладка выделяется визуально с помощью CSS классов
 *    - Поддерживается как клавиатурная навигация, так и управление мышью
 * 
 * 4. **Рендеринг содержимого**:
 *    - Функция renderTabContent создает панели содержимого для каждой вкладки
 *    - Отображается только содержимое активной вкладки, остальные скрыты
 *    - Содержимое вкладок адаптируется к доступному пространству
 * 
 * 5. **Адаптивный дизайн**:
 *    - Поддерживаются как горизонтальные, так и вертикальные вкладки
 *    - Макет автоматически адаптируется к размеру экрана
 *    - На мобильных устройствах вкладки отображаются в столбец для лучшего UX
 * 
 * 6. **Доступность**:
 *    - Реализованы ARIA-атрибуты для улучшения доступности (role, aria-selected, aria-controls)
 *    - Поддерживается навигация с клавиатуры (Enter, Space)
 *    - Структура HTML семантически корректна для работы со скринридерами
 */

import { JSX, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { TabsContainer } from './components';

/**
 * Компонент страницы с динамическими вкладками
 * Демонстрирует горизонтальные и вертикальные вкладки с использованием рендер-пропсов
 * 
 * @returns {JSX.Element} Компонент страницы с динамическими вкладками
 */
const DynamicTabsPage = (): JSX.Element => {

  /**
   * Функция для рендеринга вкладок
   * Создает список вкладок с соответствующими атрибутами доступности
   * 
   * @param {boolean} isVertical - Флаг вертикального расположения вкладок
   * @param {number} activeIndex - Индекс активной вкладки
   * @param {number} tabsCount - Количество вкладок
   * @param {Function} handleTabClick - Обработчик клика по вкладке
   * @returns {JSX.Element} Компонент вкладок
   */
  const renderTabs = useCallback((
    isVertical: boolean,
    activeIndex: number,
    tabsCount: number,
    handleTabClick: (index: number) => void): JSX.Element => {
    const baseClasses = 'border cursor-pointer font-bold p-3';
    const activeClasses = 'active bg-slate-900 text-white dark:bg-white dark:text-black';

    return (
      <ul className={isVertical ? 'grid sm:border-r-2' : 'grid sm:grid-cols-3'} role="tablist">
        {Array.from({ length: tabsCount }).map((_, i) => (
          <li
            key={i}
            role="tab"
            tabIndex={0}
            id={`tab-${i}`}
            aria-selected={i === activeIndex}
            aria-controls={`panel-${i}`}
            onClick={() => handleTabClick(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(i);
              }
            }}
            className={`${baseClasses} ${i === activeIndex ? activeClasses : ''}`}
          >
            Tab {i + 1}
          </li>
        ))}
      </ul>
    );
  }, []);

  /**
   * Функция для рендеринга содержимого вкладок
   * Создает панели содержимого для каждой вкладки, отображая только активную
   * 
   * @param {number} activeIndex - Индекс активной вкладки
   * @param {number} tabsCount - Количество вкладок
   * @returns {JSX.Element} Компонент содержимого вкладок
   */
  const renderTabContent = useCallback((activeIndex: number, tabsCount: number): JSX.Element => {
    const baseClasses = 'border p-3 h-full';
    const activeClasses = 'active';

    return (
      <div className="relative tabs__body overflow-hidden h-full">
        {Array.from({ length: tabsCount }).map((_, i) => (
          <div 
            key={i}
            id={`panel-${i}`}
            role="tabpanel"
            aria-labelledby={`tab-${i}`}
            hidden={i !== activeIndex}
            className={`${baseClasses} ${i === activeIndex ? activeClasses : ''}`}
          >
            <h3 className="font-bold text-lg">Tab {i + 1}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, sequi!</p>
          </div>
        ))}
      </div>
    );
  }, []);

  /**
   * Конфигурация контейнеров вкладок
   * Определяет типы контейнеров (горизонтальные и вертикальные)
   * 
   * @type {Array<{title: string, isVertical: boolean}>}
   */
  const tabContainers = useMemo(() => [
    { title: 'Horizontal Tabs', isVertical: false },
    { title: 'Vertical Tabs', isVertical: true },
  ], []);

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded">
      <div className="tabs gap-5 grid">
        {tabContainers.map((config, index) => (
          <TabsContainer
            key={index}
            title={config.title}
            isVertical={config.isVertical}
            renderTabs={renderTabs}
            renderTabContent={renderTabContent}
            tabsCount={3}
          />
        ))}
      </div>
    </Card>
  );
};

export default DynamicTabsPage;
'use client';

/**
 * # Компонент аккордеон
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение создает аккордеон с предопределенными элементами
 *    - Каждый элемент содержит заголовок, описание и настройку поведения (isClosed)
 *    - Элементы аккордеона отображаются в карточке с соответствующими стилями
 *
 * 2. **Типы аккордеонов**:
 *    - Первый тип (isClosed: false): позволяет открывать несколько блоков одновременно
 *    - Второй тип (isClosed: true): при открытии нового блока закрывает ранее открытые
 *
 * 3. **Взаимодействие с пользователем**:
 *    - Пользователь может нажимать на заголовки для открытия/закрытия содержимого
 *    - В зависимости от типа аккордеона (isClosed) поведение при клике различается
 *    - Анимация плавно показывает и скрывает содержимое при переключении
 *
 * 4. **Управление состоянием**:
 *    - Состояние открытия/закрытия каждого элемента управляется через состояние openItems
 *    - Для аккордеонов с isClosed: true реализована логика закрытия других элементов
 *
 * 5. **Стилизация**:
 *    - Используются стили из файла styles.css для оформления аккордеона
 *    - Компонент Card из UI библиотеки обеспечивает базовую структуру и внешний вид
 */

import { Card } from '@/components/ui/card';
import { JSX, useEffect, useRef, useState } from 'react';
import { IoChevronDown, IoChevronUpOutline, IoInformationCircleSharp } from 'react-icons/io5';

/**
 * Тип данных для элемента аккордеона
 * @typedef {Object} AccordionItem
 * @property {string} id - Уникальный идентификатор элемента аккордеона
 * @property {string} headline - Заголовок элемента аккордеона
 * @property {string} description - Описание или содержимое элемента аккордеона
 * @property {boolean} isClosed - Флаг, определяющий поведение аккордеона:
 *                               true - при открытии закрывает другие элементы,
 *                               false - позволяет открывать несколько элементов одновременно
 */
type AccordionItem = {
  id: string;
  headline: string;
  description: string;
  isClosed: boolean;
};

/**
 * Массив данных для элементов аккордеона
 * @constant {AccordionItem[]} ACCORDION_DATA
 */
const ACCORDION_DATA: AccordionItem[] = [
  {
    id: 'accordion-1',
    headline: 'Accordion 1',
    description: 'Shows the block without closing the previously opened',
    isClosed: false,
  },
  {
    id: 'accordion-2',
    headline: 'Accordion 2',
    description: 'Shows the block by closing the previously opened',
    isClosed: true,
  },
];

/**
 * Компонент страницы с аккордеоном
 * Отображает карточку с элементами аккордеона, созданными на основе ACCORDION_DATA
 *
 * @returns {JSX.Element} Компонент страницы аккордеона
 */
const AccordionPage = (): JSX.Element => {
  // Объект для хранения открытых элементов для каждого аккордеона
  // Ключ - id аккордеона, значение - массив индексов открытых элементов
  const [openItemsMap, setOpenItemsMap] = useState<Record<string, number[]>>({
    'accordion-1': [],
    'accordion-2': [],
  });

  // Рефы для доступа к DOM элементам содержимого аккордеона
  const bodyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Хранение высот контента для каждого элемента аккордеона
  const [contentHeights, setContentHeights] = useState<Record<string, number>>({});

  // Эффект для измерения высоты контента при монтировании и изменении размеров окна
  useEffect(() => {
    const updateHeights = () => {
      const newHeights: Record<string, number> = {};

      Object.keys(bodyRefs.current).forEach(key => {
        const element = bodyRefs.current[key];
        if (element) {
          // Временно делаем элемент видимым для измерения высоты
          const originalHeight = element.style.height;
          const originalPadding = element.style.padding;
          const originalOverflow = element.style.overflow;

          element.style.height = 'auto';
          element.style.paddingTop = '15px';
          element.style.paddingBottom = '15px';
          element.style.overflow = 'hidden';

          // Измеряем высоту содержимого
          newHeights[key] = element.scrollHeight;

          // Возвращаем исходные стили
          element.style.height = originalHeight;
          element.style.padding = originalPadding;
          element.style.overflow = originalOverflow;
        }
      });

      setContentHeights(newHeights);
    };

    // Измеряем высоты при монтировании
    updateHeights();

    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  /**
   * Обработчик переключения состояния элемента аккордеона
   * @param {string} accordionId - ID аккордеона
   * @param {number} index - Индекс элемента
   * @param {boolean} isClosed - Флаг, указывающий закрывать ли другие элементы при открытии
   */
  const handleToggle = (accordionId: string, index: number, isClosed: boolean): void => {
    setOpenItemsMap(prev => {
      const currentOpenItems = prev[accordionId] || [];

      // Если элемент уже открыт, закрываем его
      if (currentOpenItems.includes(index)) {
        return { ...prev, [accordionId]: currentOpenItems.filter(i => i !== index) };
      }

      // Если это аккордеон с закрытием других элементов
      if (isClosed) {
        return { ...prev, [accordionId]: [index] };
      }

      // Иначе добавляем элемент к открытым
      return {
        ...prev, [accordionId]: [...currentOpenItems, index],
      };
    });
  };

  /**
   * Устанавливает реф для элемента содержимого аккордеона
   * @param {string} key - Уникальный ключ для элемента
   * @param {HTMLDivElement} element - DOM элемент
   */
  const setBodyRef = (key: string, element: HTMLDivElement | null): void => {
    if (element) {
      bodyRefs.current[key] = element;
    }
  };

  /**
   * Проверяет, открыт ли элемент аккордеона
   * @param {string} accordionId - ID аккордеона
   * @param {number} index - Индекс элемента
   * @returns {boolean} true, если элемент открыт
   */
  const isItemOpen = (accordionId: string, index: number): boolean => {
    return (openItemsMap[accordionId] || []).includes(index);
  };

  return (
    <Card className="p-4 grid items-start accordion mx-auto max-w-4xl gap-4 w-full 2xl:grid-cols-2 max-w-8xl">
      {ACCORDION_DATA.map((item) => (
        <div className="grid gap-4" key={item.id}>
          <h3 className="font-bold text-2xl text-center">{item.headline}</h3>
          <p
            className="items-center inline-flex gap-2.5 mx-auto text-center py-1.5 px-2.5 max-w-max rounded-md bg-gray-200 dark:bg-accent">
            <IoInformationCircleSharp stopColor="#443df6" />{item.description}</p>
          <div className="rounded-md shadow-sm grid gap-4 p-4">
            {Array.from({ length: 4 }).map((_, i) => {
              const isOpen = isItemOpen(item.id, i);
              const bodyRefKey = `${item.id}-${i}`;
              const contentHeight = contentHeights[bodyRefKey] || 0;

              return (
                <div className="overflow-hidden border" key={i}>
                  <div
                    className={`${isOpen ? 'bg-slate-200 border-b' : ''} hover:bg-slate-100 transition-all flex items-center cursor-pointer min-h-[60px] p-4 justify-between dark:bg-accent`}
                    onClick={() => handleToggle(item.id, i, item.isClosed)}
                    aria-expanded={isOpen}
                    aria-controls={`${bodyRefKey}`}
                  >
                    <span>Lorem ipsum dolor sit amet {i + 1}</span>
                    <div>
                      {isOpen ? <IoChevronUpOutline /> : <IoChevronDown />}
                    </div>
                  </div>
                  <div
                    id={`${bodyRefKey}`}
                    className="grid gap-1 h-0 pl-4 pr-4 transition-all"
                    ref={(el) => setBodyRef(bodyRefKey, el)}
                    style={{
                      height: isOpen ? `${contentHeight}px` : '0px',
                      paddingTop: isOpen ? '15px' : '0px',
                      paddingBottom: isOpen ? '15px' : '0px',
                    }}
                  >
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minima nesciunt sapiente
                      veniam voluptatem Consectetur dicta enim laudantium reprehenderit voluptas</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default AccordionPage;
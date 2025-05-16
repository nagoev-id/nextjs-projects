'use client';

/**
 * # Компонент выпадающего списка (Dropdown UI)
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация компонента**:
 *    - При загрузке компонента создается закрытый выпадающий список (isOpen = false)
 *    - Инициализируется массив элементов списка с иконками и текстовыми метками
 *    - Создается ref для отслеживания DOM-элемента выпадающего списка
 * 
 * 2. **Взаимодействие с пользователем**:
 *    - При нажатии на кнопку-триггер список открывается или закрывается (toggleDropdown)
 *    - Стрелка индикатора (FiChevronDown) поворачивается, указывая на состояние списка
 *    - Когда список открыт, отображаются все элементы с соответствующими иконками
 * 
 * 3. **Обработка внешних кликов**:
 *    - Компонент отслеживает клики вне области выпадающего списка
 *    - При клике вне списка, он автоматически закрывается
 *    - Для этого используется обработчик событий, прикрепленный к document
 * 
 * 4. **Отображение элементов списка**:
 *    - Каждый элемент списка содержит иконку и текстовую метку
 *    - Иконки динамически импортируются из библиотеки react-icons
 *    - Элементы списка отображаются только когда isOpen = true
 * 
 * 5. **Управление состоянием**:
 *    - Состояние открытия/закрытия списка хранится в переменной isOpen
 *    - Переключение состояния происходит через функцию toggleDropdown
 *    - Состояние также меняется при кликах вне компонента
 * 
 * 6. **Очистка ресурсов**:
 *    - При размонтировании компонента удаляются все обработчики событий
 *    - Это предотвращает утечки памяти и ошибки в работе приложения
 */

import './styles.css';
import { JSX, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FiBell, FiBook, FiChevronDown, FiFolder, FiPlusCircle, FiSettings, FiUser } from 'react-icons/fi';
import { IconType } from 'react-icons';

/**
 * Тип для элемента данных выпадающего списка
 * @typedef {Object} MockDataItem
 * @property {string} ico - Имя иконки из библиотеки react-icons/fi
 * @property {string} label - Текстовая метка элемента списка
 */
type MockDataItem = {
  ico: string;
  label: string;
}

/**
 * Тип для карты иконок
 * @typedef {Object} IconMap
 * @property {IconType} [key: string] - Компонент иконки из библиотеки react-icons
 */
type IconMap = {
  [key: string]: IconType;
}

/**
 * Карта иконок для динамического импорта
 * Связывает строковые идентификаторы с компонентами иконок
 */
const icons: IconMap = {
  FiBell,
  FiBook,
  FiFolder,
  FiPlusCircle,
  FiSettings,
  FiUser,
};

/**
 * Данные для элементов выпадающего списка
 * Каждый элемент содержит идентификатор иконки и текстовую метку
 */
const mockData: MockDataItem[] = [
  { ico: 'FiPlusCircle', label: 'Create New' },
  { ico: 'FiBook', label: 'All Drafts' },
  { ico: 'FiFolder', label: 'Move To' },
  { ico: 'FiUser', label: 'Profile Settings' },
  { ico: 'FiBell', label: 'Notification' },
  { ico: 'FiSettings', label: 'Settings' },
];

/**
 * Компонент страницы с выпадающим списком
 * Демонстрирует реализацию интерактивного выпадающего меню с иконками
 * 
 * @returns {JSX.Element} Компонент страницы с выпадающим списком
 */
const DropdownUIPage = (): JSX.Element => {
  /**
   * Состояние открытия/закрытия выпадающего списка
   */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  /**
   * Реф для отслеживания DOM-элемента выпадающего списка
   * Используется для определения кликов вне компонента
   */
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /**
   * Переключает состояние открытия/закрытия выпадающего списка
   */
  const toggleDropdown = (): void => setIsOpen(!isOpen);

  /**
   * Эффект для обработки кликов вне компонента
   * Закрывает выпадающий список при клике вне его области
   */
  useEffect(() => {
    /**
     * Обработчик клика вне компонента
     * 
     * @param {MouseEvent} event - Событие клика мыши
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Добавляем обработчик при монтировании компонента
    document.addEventListener('mousedown', handleClickOutside);
    
    // Удаляем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <div className="components">
        <div className="component01 grid place-items-center" ref={dropdownRef}>
          <div className="dropdown w-full">
            <button
              className="dropdown__trigger w-full"
              onClick={toggleDropdown}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              Dropdown
              <FiChevronDown 
                className={isOpen ? 'dropdown__arrow dropdown__arrow--open' : 'dropdown__arrow'} 
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <ul className="dropdown__list show" id="dropdown-menu" role="menu">
                {mockData.map((item, index) => {
                  const Icon = icons[item.ico];
                  return (
                    <li key={index} className="dropdown__item" role="menuitem">
                      <a href="#" className="dropdown__link">
                        {Icon ? <Icon aria-hidden="true" /> : null} {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DropdownUIPage;
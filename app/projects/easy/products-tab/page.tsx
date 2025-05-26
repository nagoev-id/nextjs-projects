'use client';

/**
 * # Табы с фильтрацией продуктов
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - При загрузке компонента создается состояние с полным списком продуктов
 *    - Категории автоматически извлекаются из данных продуктов с помощью Set для уникальности
 *    - По умолчанию выбрана категория "all", которая показывает все продукты
 *
 * 2. **Фильтрация продуктов**:
 *    - Функция filteredProducts использует useMemo для оптимизации производительности
 *    - Фильтрация происходит только при изменении выбранной категории
 *    - Если выбрана категория "all", возвращаются все продукты
 *    - Иначе возвращаются только продукты соответствующей категории
 *
 * 3. **Переключение категорий**:
 *    - При клике на кнопку категории вызывается handleCategoryChange
 *    - Функция обновляет состояние, сохраняя выбранную категорию
 *    - Используется useCallback для предотвращения ненужных повторных рендеров
 *
 * 4. **Отображение интерфейса**:
 *    - Кнопки категорий отображаются в верхней части с выделением активной категории
 *    - Продукты отображаются в виде сетки карточек с адаптивной версткой
 *    - Каждая карточка содержит изображение, название, цену и описание продукта
 *
 * 5. **Оптимизация производительности**:
 *    - Мемоизация отфильтрованных продуктов с помощью useMemo
 *    - Мемоизация обработчика изменения категории с помощью useCallback
 *    - Использование ключей для оптимизации рендеринга списков
 */

import { productsData } from '@/app/projects/easy/products-tab/mock';
import { JSX, useCallback, useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { HELPERS } from '@/shared';
import Image from 'next/image';

/**
 * Компонент для отображения продуктов с фильтрацией по категориям
 *
 * @component ProductsTabPage
 * @description
 * Отображает список продуктов с возможностью фильтрации по категориям.
 * Категории автоматически извлекаются из данных продуктов.
 * Компонент использует оптимизированные методы рендеринга с помощью useMemo и useCallback.
 *
 * @returns {JSX.Element} Компонент с табами категорий и карточками продуктов
 */
const ProductsTabPage = (): JSX.Element => {
  /**
   * Состояние компонента для хранения данных о продуктах и категориях
   *
   * @type {Object}
   * @property {Array} items - Массив всех продуктов из исходных данных
   * @property {string} category - Текущая выбранная категория (по умолчанию 'all')
   * @property {Array<string>} categories - Массив всех доступных категорий, включая 'all'
   */
  const [items, setItems] = useState({
    items: productsData,
    category: 'all',
    categories: ['all', ...new Set(productsData.map(item => item.category))],
  });

  /**
   * Мемоизированный список отфильтрованных продуктов на основе выбранной категории
   *
   * @type {Array}
   * @description Возвращает все продукты, если выбрана категория 'all',
   * иначе возвращает только продукты, соответствующие выбранной категории.
   * Перерасчет происходит только при изменении выбранной категории.
   */
  const filteredProducts = useMemo(() => {
    return items.category === 'all'
      ? productsData
      : productsData.filter(product => product.category.toLowerCase() === items.category.toLowerCase());
  }, [items.category]);

  /**
   * Обработчик изменения выбранной категории
   *
   * @function
   * @param {string} category - Новая выбранная категория
   * @description Обновляет состояние компонента, устанавливая новую выбранную категорию.
   * Мемоизирован с помощью useCallback для предотвращения ненужных повторных рендеров.
   */
  const handleCategoryChange = useCallback((category: string) => {
    setItems(prevState => ({ ...prevState, category }));
  }, []);

  return (
    <Card className="max-w-7xl w-full mx-auto p-4 rounded">
      <div className="grid gap-3">
        {/* Categories List */}
        <ul className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="Product categories">
          {items.categories.map((category) => (
            <li key={category}>
              <Button
                variant={category === items.category ? 'default' : 'secondary'}
                onClick={() => handleCategoryChange(category)}
                role="tab"
                aria-selected={category === items.category}
                aria-controls={`${category}-panel`}
              >
                {category === 'all' ? 'All' : HELPERS.capitalizeFirstLetter(category)}
              </Button>
            </li>
          ))}
        </ul>

        {/* Categories Items */}
        <ul
          className="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
          role="tabpanel"
          id={`${items.category}-panel`}
          aria-label={`Products in category ${items.category}`}
        >
          {filteredProducts.map(({ title, price, img, desc, category }) => (
            <li className="overflow-hidden rounded border" data-category={category} key={`${category}-${title}`}>
              <Image
                width={300}
                height={250}
                priority={false}
                className="h-[250px] w-full object-cover"
                src={img}
                alt={title}
              />
              <div className="grid gap-3 p-3">
                <div className="flex justify-between">
                  <h4 className="text-lg font-bold">{title}</h4>
                  <p className="font-medium">${price}</p>
                </div>
                <p className="text-sm">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ProductsTabPage;
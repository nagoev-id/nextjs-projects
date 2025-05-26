'use client';

/**
 * # Фильтр продуктов
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение загружает список продуктов из mock-данных
 *    - Состояние хранит текущую выбранную компанию, поисковый запрос и список всех компаний
 *    - Список компаний формируется автоматически из уникальных значений в данных
 *
 * 2. **Фильтрация продуктов**:
 *    - Продукты фильтруются по двум критериям: компания и поисковый запрос
 *    - Поиск выполняется по названию продукта и названию компании
 *    - Результаты фильтрации кэшируются с помощью useMemo для оптимизации производительности
 *    - Поисковый запрос обрабатывается с задержкой (debounce) для уменьшения количества перерисовок
 *
 * 3. **Интерфейс пользователя**:
 *    - Поисковое поле для ввода запроса
 *    - Кнопки для фильтрации по компаниям
 *    - Сетка продуктов с адаптивным дизайном (1-3 колонки в зависимости от размера экрана)
 *    - Сообщение, если ничего не найдено
 *
 * 4. **Оптимизация производительности**:
 *    - Мемоизация отфильтрованных продуктов и списка компаний
 *    - Debounce для поискового запроса
 *    - Предотвращение ненужных перерисовок компонентов
 */

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { productsData } from '@/app/projects/easy/product-filter/mock';
import { Badge, Button, Card, Input } from '@/components/ui';
import { HELPERS } from '@/shared';
import Image from 'next/image';

/**
 * Компонент страницы фильтрации продуктов
 * @returns {JSX.Element} Компонент страницы фильтрации продуктов
 */
const ProductFilterPage = () => {
  // Состояние для хранения текущего поискового запроса с debounce
  const [searchQuery, setSearchQuery] = useState('');
  // Состояние для хранения значения ввода (без debounce)
  const [inputValue, setInputValue] = useState('');
  // Состояние для хранения текущей выбранной компании
  const [activeCompany, setActiveCompany] = useState('all');

  // Мемоизированный список уникальных компаний
  const companies = useMemo(() => {
    return ['All', ...new Set(productsData.map(({ company }) => company))];
  }, []);

  /**
   * Обработчик изменения поискового запроса с debounce
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения ввода
   */
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  /**
   * Обработчик отправки формы поиска
   * @param {FormEvent<HTMLFormElement>} event - Событие отправки формы
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(inputValue);
  };

  /**
   * Обработчик выбора компании для фильтрации
   * @param {string} company - Название выбранной компании
   */
  const handleSetActiveCompany = useCallback((company: string) => {
    setActiveCompany(company);
  }, []);

  // Применяем debounce к поисковому запросу
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300); // 300ms задержка

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Мемоизированный список отфильтрованных продуктов
  const filteredProducts = useMemo(() => {
    const lowercaseQuery = searchQuery.toLowerCase();
    const lowercaseActiveCompany = activeCompany.toLowerCase();

    return productsData.filter(({ company, title }) => {
      const lowercaseCompany = company.toLowerCase();
      const lowercaseTitle = title.toLowerCase();
      const matchesCompany = lowercaseActiveCompany === 'all' || lowercaseCompany === lowercaseActiveCompany;
      const matchesQuery = lowercaseTitle.includes(lowercaseQuery) || lowercaseCompany.includes(lowercaseQuery);
      return matchesCompany && matchesQuery;
    });
  }, [activeCompany, searchQuery]);

  // Мемоизированные кнопки компаний для предотвращения ненужных перерисовок
  const companyButtons = useMemo(() => {
    return companies.map((company) => (
      <li key={company}>
        <Button
          variant={company.toLowerCase() === activeCompany.toLowerCase() ? 'default' : 'secondary'}
          onClick={() => handleSetActiveCompany(company)}
          aria-pressed={company.toLowerCase() === activeCompany.toLowerCase()}
        >
          {HELPERS.capitalizeFirstLetter(company)}
        </Button>
      </li>
    ));
  }, [companies, activeCompany, handleSetActiveCompany]);

  return (
    <Card className="max-w-7xl w-full mx-auto p-4 rounded">
      <div className="grid items-start gap-3 xl:grid-cols-[300px_1fr]">
        <div className="grid gap-3">
          <form onSubmit={handleSubmit} role="search">
            <Input
              name="query"
              type="search"
              placeholder="Search"
              value={inputValue}
              onChange={handleQueryChange}
              aria-label="Search products"
            />
          </form>
          <h5 className="text-sm font-medium" id="company-filter">Company</h5>
          <ul className="flex flex-wrap gap-2" aria-labelledby="company-filter" role="radiogroup">
            {companyButtons}
          </ul>
        </div>
        <div>
          {filteredProducts.length === 0 ? (
            <h5 className="font-medium" role="status">No products matched your search</h5>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3" aria-label="Product list">
              {filteredProducts.map(({ price, company, title, image, id }) => (
                <li key={id}>
                  <Card className="p-0 gap-0">
                    <Image
                      priority={true}
                      width="100"
                      height="100"
                      className="h-[250px] w-full object-cover"
                      src={image}
                      alt={`Product image: ${title}`}
                    />
                    <div className="grid gap-2 p-3">
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p>{HELPERS.formatPrice(Number(price))}</p>
                      <Badge>{company}</Badge>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductFilterPage;
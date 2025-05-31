'use client';

/**
 * # Приложение отслеживания рынка криптовалют (Crypto Market Tracker)
 *
 * ## Принцип работы:
 *
 * 1. **Получение данных**:
 *    - Приложение использует RTK Query (useGetAllQuery) для получения данных о криптовалютах из API
 *    - Данные включают информацию о цене, объеме торгов, рыночной капитализации и изменении цены за 24 часа
 *    - Состояния загрузки (isLoading), успеха (isSuccess) и ошибки (isError) отслеживаются для управления UI
 *
 * 2. **Фильтрация и поиск**:
 *    - Пользователь может искать криптовалюты по имени, символу или ID через поле поиска
 *    - Поиск реализован с использованием debounce для оптимизации производительности
 *    - Фильтрация выполняется в реальном времени по мере ввода пользователем
 *
 * 3. **Сортировка данных**:
 *    - Данные можно сортировать по любому столбцу таблицы (ID, имя, цена, изменение за 24ч, объем, капитализация)
 *    - Поддерживается сортировка как по возрастанию (ASC), так и по убыванию (DESC)
 *    - При клике на заголовок столбца меняется порядок сортировки или выбирается новый столбец для сортировки
 *
 * 4. **Визуальное представление**:
 *    - Данные отображаются в виде таблицы с возможностью сортировки по столбцам
 *    - Положительные и отрицательные изменения цены выделяются зеленым и красным цветом соответственно
 *    - Тренд цены отображается с помощью цветовых индикаторов и текстовых меток
 *    - Числовые значения форматируются для удобства чтения (разделители тысяч, фиксированное количество знаков после запятой)
 *
 * 5. **Оптимизация производительности**:
 *    - Используется useMemo для кэширования отфильтрованных и отсортированных данных
 *    - Применяется debounce для предотвращения излишних перерисовок при вводе в поле поиска
 *    - Компоненты рендерятся условно в зависимости от состояния загрузки данных
 *
 * 6. **Навигация и детали**:
 *    - Каждая криптовалюта содержит ссылку на страницу с подробной информацией
 *    - Переход осуществляется через Next.js Link для оптимизации клиентской маршрутизации
 *
 * 7. **Обработка состояний UI**:
 *    - Отображение спиннера во время загрузки данных
 *    - Вывод сообщения об ошибке при неудачном запросе
 *    - Информирование пользователя при отсутствии результатов поиска
 *
 * 8. **Типизация данных**:
 *    - Строгая типизация с использованием TypeScript для всех компонентов, функций и данных
 *    - Определены типы для криптовалют, заголовков таблицы и параметров сортировки
 *
 * Приложение предоставляет интуитивно понятный интерфейс для мониторинга рынка криптовалют
 * с возможностью быстрого поиска, сортировки и анализа данных в реальном времени.
 */

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, JSX, useMemo, useState } from 'react';
import { Crypto, CryptoList, useGetAllQuery } from '@/app/projects/medium/crypto-market-tracker/features';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

/**
 * Определение типа для заголовков таблицы
 */
type TableHeader = {
  key: string;
  label: string;
};

/**
 * Заголовки таблицы с криптовалютами
 */
const headers: TableHeader[] = [
  { key: 'id', label: 'Coin' },
  { key: 'name', label: 'Name' },
  { key: 'current_price', label: 'Price' },
  { key: 'price_change_percentage_24h', label: '24h' },
  { key: 'total_volume', label: 'Volume' },
  { key: 'market_cap', label: 'Mkt Cap' },
  { key: 'price_trend', label: 'Price Trend' },
];

/**
 * Функция сортировки элементов по указанному ключу и порядку
 * 
 * @param items - Список криптовалют для сортировки
 * @param sortType - Ключ, по которому выполняется сортировка
 * @param sortOrder - Порядок сортировки (по возрастанию или убыванию)
 * @returns Отсортированный список криптовалют
 */
const sortItems = (items: CryptoList, sortType: keyof Crypto, sortOrder: 'ASC' | 'DESC'): CryptoList => {
  return [...items].sort((a, b) => {
    if (a[sortType] == null || b[sortType] == null) return 0;
    const compareResult = a[sortType]! > b[sortType]! ? 1 : -1;
    return sortOrder === 'ASC' ? compareResult : -compareResult;
  });
};

/**
 * Компонент страницы отслеживания рынка криптовалют
 * 
 * @returns JSX элемент страницы
 */
const CryptoMarketTrackerPage = (): JSX.Element => {
  const { data, isSuccess, isError, isLoading } = useGetAllQuery();
  const [sortType, setSortType] = useState<keyof Crypto>('market_cap');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * Обработчик изменения типа сортировки
   * 
   * @param key - Ключ для сортировки
   */
  const handleSortType = (key: keyof Crypto): void => {
    if (key === sortType) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortType(key);
      setSortOrder('ASC');
    }
  };

  /**
   * Обработчик поиска с задержкой для оптимизации производительности
   * 
   * @param e - Событие изменения ввода
   */
  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value.toLowerCase());
  }, 300);

  /**
   * Мемоизированные отфильтрованные и отсортированные данные
   */
  const filteredAndSortedData = useMemo((): CryptoList => {
    if (isSuccess && data) {
      const filtered = searchTerm
        ? data.filter(crypto =>
          crypto.name.toLowerCase().includes(searchTerm) ||
          crypto.symbol.toLowerCase().includes(searchTerm) ||
          crypto.id.toLowerCase().includes(searchTerm),
        )
        : data;

      return sortItems(filtered, sortType, sortOrder);
    }
    return [];
  }, [isSuccess, data, sortType, sortOrder, searchTerm]);

  return (
    <Card className="w-full max-w-6xl min-w-6xl mx-auto overflow-auto p-0 gap-0 rounded-sm">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <Input
          type="text"
          placeholder="Search by name, symbol or id..."
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {/* Loading */}
      {isLoading && <Spinner className="my-4" />}

      {/* Error */}
      {isError && <p className="text-center p-8 text-red-500">An error occurred while fetching data.</p>}

      {/* No Results */}
      {isSuccess && filteredAndSortedData.length === 0 && (
        <p className="text-center p-4">No cryptocurrencies found matching your search.</p>
      )}

      {/* Success */}
      {isSuccess && filteredAndSortedData.length > 0 && (
        <table className="w-full">
          <thead className="border-b bg-muted/50">
          <tr className="divide-x">
            {headers.map(({ key, label }) => {
              // Определяем ключ для сортировки
              const sortKey = key === 'price_trend' ? 'price_change_percentage_24h' : key as keyof Crypto;
              
              return (
                <th
                  key={key}
                  className={`p-2 cursor-pointer uppercase hover:bg-muted transition-colors ${
                    sortType === sortKey ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSortType(sortKey)}
                >
                  {label}
                  {sortType === sortKey && (sortOrder === 'ASC' ? ' ▲' : ' ▼')}
                </th>
              );
            })}
          </tr>
          </thead>
          <tbody className="divide-y">
          {filteredAndSortedData.map(({
                                        id,
                                        name,
                                        image,
                                        current_price,
                                        price_change_percentage_24h,
                                        total_volume,
                                        market_cap,
                                        symbol,
                                      }) => (
            <tr key={id} className="divide-x hover:bg-muted/30 transition-colors">
              <td className="p-3 text-sm whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Image width="100" height="100" className="w-5 h-5 md:w-10 md:h-10" src={image} alt={name} />
                  <Link
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    href={`/projects/medium/crypto-market-tracker/pages/crypto/${id}`}>
                    {symbol.toUpperCase()}
                  </Link>
                </div>
              </td>
              <td className="p-3 text-sm whitespace-nowrap font-semibold">{name}</td>
              <td
                className="p-3 text-sm whitespace-nowrap">${current_price.toLocaleString()}</td>
              <td
                className={`p-3 text-sm whitespace-nowrap ${price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {price_change_percentage_24h.toFixed(2)}%
              </td>
              <td
                className="p-3 text-sm whitespace-nowrap">${total_volume.toLocaleString()}</td>
              <td
                className="p-3 text-sm whitespace-nowrap">${market_cap.toLocaleString()}</td>
              <td className="p-3 text-sm whitespace-nowrap">
                  <span
                    className={`p-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg ${
                      price_change_percentage_24h > 0
                        ? 'text-green-800 bg-green-200 dark:text-green-200 dark:bg-green-800'
                        : 'text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-800'
                    }`}>
                    {price_change_percentage_24h > 0 ? 'Upward Trend' : 'Downward Trend'}
                  </span>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};

export default CryptoMarketTrackerPage;
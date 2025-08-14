'use client';

/**
 * # Страница детальной информации о криптовалюте
 *
 * ## Принцип работы:
 *
 * 1. **Получение данных о конкретной криптовалюте**:
 *    - Компонент извлекает параметр ID из URL с помощью хука useParams
 *    - Используется RTK Query (useGetByIdQuery) для получения детальных данных о криптовалюте по её ID
 *    - Во время загрузки отображается спиннер, при ошибке - сообщение об ошибке
 *
 * 2. **Отображение информации**:
 *    - Основные данные представлены в виде карточек: текущая цена, рыночная капитализация, изменение за 24ч, объем торгов
 *    - Положительные и отрицательные изменения цены выделяются зеленым и красным цветом соответственно
 *    - Числовые значения форматируются для удобства чтения (разделители тысяч, фиксированное количество знаков после запятой)
 *    - Отображается логотип криптовалюты, название и символ
 *
 * 3. **Навигация**:
 *    - Кнопка "Back" позволяет вернуться на предыдущую страницу с помощью router.back()
 *    - Используется Next.js router для управления навигацией
 *
 * 4. **Обработка HTML-контента**:
 *    - Описание криптовалюты может содержать HTML-разметку, которая безопасно отображается с помощью dangerouslySetInnerHTML
 *    - Это позволяет сохранить форматирование и ссылки в описании
 *
 * 5. **Адаптивный дизайн**:
 *    - Использование grid-layout с адаптивными breakpoints для корректного отображения на разных устройствах
 *    - Размер заголовка и расположение элементов меняются в зависимости от размера экрана
 *
 * 6. **Оптимизация производительности**:
 *    - Условный рендеринг для предотвращения ошибок при отсутствии данных
 *    - Мемоизация компонента для предотвращения лишних перерисовок
 *    - Оптимизированная загрузка изображений через компонент Image из Next.js
 *
 * 7. **Обработка состояний UI**:
 *    - Четкое разделение состояний загрузки, ошибки и успешного получения данных
 *    - Информативные сообщения для пользователя в каждом из состояний
 *
 * Страница предоставляет детальную информацию о выбранной криптовалюте в удобном для восприятия формате,
 * с возможностью быстрого возврата к списку всех криптовалют.
 */

import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { JSX, useMemo } from 'react';
import { CryptoData, useGetByIdQuery } from '@/app/projects/medium/crypto-market-tracker/features';
import DOMPurify from 'dompurify';

/**
 * Компонент страницы с детальной информацией о криптовалюте
 * 
 * @returns {JSX.Element} Компонент страницы детальной информации
 */
const DetailPage = (): JSX.Element => {
  // Получение ID криптовалюты из параметров URL
  const { id } = useParams();
  // Инициализация роутера для навигации
  const router = useRouter();
  // Запрос данных о криптовалюте с использованием RTK Query
  const { data, isSuccess, isError, isLoading } = useGetByIdQuery(id as string);

  // Мемоизированные данные о криптовалюте для предотвращения лишних перерисовок
  const cryptoData = useMemo(() => {
    return isSuccess && data ? data as CryptoData : null;
  }, [isSuccess, data]);

  // Отображение спиннера во время загрузки данных
  if (isLoading) {
    return <Spinner className="mx-auto my-8" aria-label="Loading cryptocurrency data" />;
  }

  // Отображение сообщения об ошибке при неудачном запросе
  if (isError) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <Button onClick={() => router.back()} className="max-w-max">Back</Button>
        <p className="text-center text-red-500" role="alert">
          An error occurred while fetching data. Please try again later.
        </p>
      </Card>
    );
  }

  // Отображение сообщения при отсутствии данных
  if (!cryptoData) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <Button onClick={() => router.back()} className="max-w-max">Back</Button>
        <p className="text-center" role="status">No data available for this cryptocurrency.</p>
      </Card>
    );
  }

  // Основной рендеринг страницы с данными о криптовалюте
  return (
    <Card className="w-full max-w-4xl mx-auto p-4 gap-2">
      <Button
        onClick={() => router.back()}
        className="max-w-max mb-4"
        aria-label="Go back to cryptocurrency list"
      >
        Back
      </Button>
      
      {/* Заголовок с изображением и названием криптовалюты */}
      <div className="flex items-center mb-6">
        <Image 
          src={cryptoData.image.large} 
          alt={`${cryptoData.name} logo`} 
          width={64} 
          height={64} 
          className="mr-4"
          priority
        />
        <h1 className="text-lg md:text-3xl font-bold">
          {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
        </h1>
      </div>
      
      {/* Сетка с основными показателями */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4">
        {/* Текущая цена */}
        <Card className="rounded-none shadow-none gap-0 border p-0">
          <p className="font-semibold bg-accent p-2">Current Price:</p>
          <p className='p-2'>${cryptoData.market_data.current_price.usd.toLocaleString()}</p>
        </Card>
        
        {/* Рыночная капитализация */}
        <Card className="rounded-none shadow-none gap-0 border p-0">
          <p className="font-semibold bg-accent p-2">Market Cap:</p>
          <p className='p-2'>${cryptoData.market_data.market_cap.usd.toLocaleString()}</p>
        </Card>
        
        {/* Изменение цены за 24 часа */}
        <Card className="rounded-none shadow-none gap-0 border p-0">
          <p className="font-semibold bg-accent p-2">24h Change:</p>
          <p 
            className={cryptoData.market_data.price_change_percentage_24h > 0 ? 'text-green-600 p-2' : 'text-red-600 p-2'}
            aria-label={`Price change in 24 hours: ${cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%`}
          >
            {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </Card>
        
        {/* Общий объем торгов */}
        <Card className="rounded-none shadow-none gap-0 border p-0">
          <p className="font-semibold bg-accent p-2">Total Volume:</p>
          <p className='p-2'>${cryptoData.market_data.total_volume.usd.toLocaleString()}</p>
        </Card>
      </div>
      
      {/* Описание криптовалюты */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Description:</h2>
        {cryptoData.description.en ? (
          <div 
            className="prose max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cryptoData.description.en) }} 
          />
        ) : (
          <p>No description available.</p>
        )}
      </div>
    </Card>
  );
};

export default DetailPage;
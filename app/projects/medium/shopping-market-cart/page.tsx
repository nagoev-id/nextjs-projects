'use client';

/**
 * # Приложение корзины покупок
 *
 * ## Принцип работы:
 *
 * 1. **Загрузка и отображение товаров**:
 *    - При монтировании компонента выполняется запрос к API для получения списка товаров
 *    - Товары отображаются в виде карточек с изображением, названием и ценой
 *    - Реализована адаптивная сетка для разных размеров экрана
 *
 * 2. **Управление корзиной**:
 *    - Пользователь может добавлять товары в корзину нажатием кнопки "Add to Cart"
 *    - После добавления товара появляются кнопки "+" и "-" для изменения количества
 *    - Текущее количество товара отображается как между кнопками, так и в виде бейджа в углу карточки
 *
 * 3. **Состояние приложения**:
 *    - Для управления состоянием используется Redux (через RTK)
 *    - Данные о товарах и корзине хранятся централизованно
 *    - Запросы к API выполняются с помощью RTK Query
 *
 * 4. **Оптимизация производительности**:
 *    - Мемоизация функций-обработчиков для предотвращения лишних рендеров
 *    - Оптимизация рендеринга списка товаров
 *    - Правильная обработка состояний загрузки и ошибок
 */

import { JSX, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { Button, Card, Spinner } from '@/components/ui';
import {
  Product,
  selectMarketData,
  updateCartItemAmount,
  useGetProductsQuery,
} from '@/app/projects/medium/shopping-market-cart/features';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/shopping-market-cart/app';
import { HELPERS } from '@/shared';

/**
 * Компонент страницы корзины покупок
 * 
 * @returns {JSX.Element} Компонент страницы корзины покупок
 */
const ShoppingMarketCartPage = (): JSX.Element => {
  const { data, isError, isLoading, isSuccess } = useGetProductsQuery();
  const dispatch = useAppDispatch();
  const { items, cartItems } = useAppSelector(selectMarketData);

  /**
   * Обновляет количество товара в корзине
   * 
   * @param {Product} device - Товар для обновления
   * @param {number} change - Изменение количества (+1 или -1)
   */
  const handleUpdateCart = useCallback((device: Product, change: number): void => {
    dispatch(updateCartItemAmount({ id: device.id, change }));
  }, [dispatch]);

  /**
   * Получает текущее количество товара в корзине
   * 
   * @param {number} id - ID товара
   * @returns {number} Количество товара в корзине
   */
  const getItemAmount = useCallback((id: number): number => {
    return cartItems.find(item => item.id === id)?.amount ?? 0;
  }, [cartItems]);

  /**
   * Рендерит карточку товара
   * 
   * @param {Product} device - Данные товара
   * @returns {JSX.Element} Элемент карточки товара
   */
  const renderDeviceCard = useCallback((device: Product): JSX.Element => {
    const amount = getItemAmount(device.id);
    return (
      <li key={device.id}>
        <Card className="p-2 flex flex-col gap-2.5 h-full relative">
          {amount > 0 && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {amount}
            </div>
          )}
          <div className="mb-auto w-[150px] h-[150px] mx-auto grid justify-items-center items-center relative">
            <Image
              width="200"
              height="200"
              priority={true}
              src={device.image}
              alt={device.title}
              className="object-contain w-full h-full absolute"
            />
          </div>
          <div>
            <div className="p-2">
              <h3 className="font-bold text-sm">{device.title}</h3>
              <p>{HELPERS.formatPrice(device.price)}</p>
            </div>
            <div className="grid gap-2.5 mt-auto">
              {amount === 0 ? (
                <Button onClick={() => handleUpdateCart(device, 1)}>
                  Add to Cart
                </Button>
              ) : (
                <div className="flex justify-between items-center">
                  <Button onClick={() => handleUpdateCart(device, -1)}>
                    <Minus size={16} />
                  </Button>
                  <span>{amount}</span>
                  <Button onClick={() => handleUpdateCart(device, 1)}>
                    <Plus size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </li>
    );
  }, [getItemAmount, handleUpdateCart]);

  /**
   * Мемоизированный список карточек товаров
   */
  const productCards = useMemo(() => {
    return items?.map(device => renderDeviceCard(device));
  }, [items, renderDeviceCard]);

  return (
    <Card className="p-4">
      {/* Loading */}
      {isLoading && <Spinner className="mx-auto" />}

      {/* Error */}
      {isError && (
        <p className="text-center text-red-500 p-4">
          Error when loading data. Please try again later.
        </p>
      )}

      {/* Success */}
      {isSuccess && data && (
        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {productCards}
        </ul>
      )}

      {/* No items */}
      {isSuccess && (!items || items.length === 0) && (
        <p className="text-center p-4">No products available.</p>
      )}
    </Card>
  );
};

export default ShoppingMarketCartPage;
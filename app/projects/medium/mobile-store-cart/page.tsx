'use client';

import { JSX, memo, useCallback, useMemo } from 'react';
import { Button, Card, Spinner } from '@/components/ui';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import {
  Mobile,
  selectMobileStoreData,
  updateCartItemAmount,
  useGetAllQuery,
} from '@/app/projects/medium/mobile-store-cart/features';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/mobile-store-cart/app';
import { HELPERS } from '@/shared';

/**
 * Компонент карточки устройства
 *
 * @param {Object} props - Свойства компонента
 * @param {Mobile} props.device - Данные устройства
 * @param {number} props.amount - Количество устройств в корзине
 * @param {Function} props.onUpdateCart - Функция обновления корзины
 * @returns {JSX.Element} Карточка устройства
 */
const DeviceCard = memo(({
                           device,
                           amount,
                           onUpdateCart,
                         }: {
  device: Mobile;
  amount: number;
  onUpdateCart: (device: Mobile, change: number) => void;
}): JSX.Element => (
  <Card className="p-2 flex flex-col gap-2.5 h-full">
    <Image
      width="100"
      height="100"
      priority={true}
      className="max-w-[200px] mx-auto"
      src={device.img}
      alt={device.title}
    />
    <h3 className="font-semibold uppercase text-center">
      {device.title} ({HELPERS.formatPrice(parseFloat(device.price))})
    </h3>
    <div className="grid gap-2.5 mt-auto">
      {amount === 0 ? (
        <Button onClick={() => onUpdateCart(device, 1)}>
          Add to Cart
        </Button>
      ) : (
        <div className="flex justify-between items-center">
          <Button onClick={() => onUpdateCart(device, -1)}>
            <Minus size={16} />
          </Button>
          <span>{amount}</span>
          <Button onClick={() => onUpdateCart(device, 1)}>
            <Plus size={16} />
          </Button>
        </div>
      )}
    </div>
  </Card>
));

DeviceCard.displayName = 'DeviceCard';

/**
 * Компонент страницы магазина мобильных устройств
 *
 * @returns {JSX.Element} Страница магазина
 */
const MobileStorePage = (): JSX.Element => {
  const { data, isError, isLoading } = useGetAllQuery('');
  const dispatch = useAppDispatch();
  const { items, cartItems } = useAppSelector(selectMobileStoreData);

  /**
   * Мемоизированная функция обновления корзины
   *
   * @param {Mobile} device - Устройство для обновления
   * @param {number} change - Изменение количества (+1 или -1)
   */
  const handleUpdateCart = useCallback((device: Mobile, change: number): void => {
    dispatch(updateCartItemAmount({ id: Number(device.id), change }));
  }, [dispatch]);

  /**
   * Мемоизированная карта количества устройств в корзине
   */
  const amountMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach(item => map.set(item.id, item.amount));
    return map;
  }, [cartItems]);

  /**
   * Получение количества устройства в корзине
   *
   * @param {string} id - Идентификатор устройства
   * @returns {number} Количество устройства в корзине
   */
  const getItemAmount = useCallback((id: string): number => {
    return amountMap.get(id) || 0;
  }, [amountMap]);

  // Отображение состояния загрузки
  if (isLoading) return <Spinner />;

  // Отображение ошибки
  if (isError) return <p>Error when loading data.</p>;

  return (
    <Card className="p-4">
      <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {items?.map(device => (
          <li key={device.id}>
            <DeviceCard
              device={device}
              amount={getItemAmount(device.id)}
              onUpdateCart={handleUpdateCart}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default MobileStorePage;
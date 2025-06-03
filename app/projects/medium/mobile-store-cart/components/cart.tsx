'use client';

import { JSX, memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/mobile-store-cart/app';
import {
  clearCartItems,
  Mobile,
  removeCartItem,
  selectMobileStoreData,
  updateCartItemAmount,
} from '@/app/projects/medium/mobile-store-cart/features';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { HELPERS } from '@/shared';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';

/**
 * @typedef {Object} CartItemProps
 * @property {Mobile} device - Объект устройства, содержащий информацию о товаре
 * @property {Function} onUpdateAmount - Функция для обновления количества товара
 * @property {Function} onRemove - Функция для удаления товара из корзины
 */

/**
 * Компонент элемента корзины
 * 
 * @component
 * @param {CartItemProps} props - Свойства компонента
 * @param {Mobile} props.device - Объект устройства, содержащий информацию о товаре
 * @param {Function} props.onUpdateAmount - Функция для обновления количества товара
 * @param {Function} props.onRemove - Функция для удаления товара из корзины
 * @returns {JSX.Element} Элемент списка корзины с карточкой товара
 * 
 * @description
 * Мемоизированный компонент, отображающий отдельный элемент в корзине покупок.
 * Включает изображение товара, название, цену, элементы управления количеством
 * и кнопку удаления с диалогом подтверждения.
 */
const CartItem = memo(({ device, onUpdateAmount, onRemove }: {
  device: Mobile;
  onUpdateAmount: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}): JSX.Element => {
  return (
    <li>
      <Card className="p-2 flex flex-col gap-2.5 h-full">
        <Image
          width={50}
          height={50}
          priority={true}
          className="max-w-[50px] mx-auto"
          src={device.img}
          alt={device.title}
        />
        <h3 className="font-semibold uppercase text-center">
          {device.title} ({HELPERS.formatPrice(parseFloat(device.price))})
        </h3>
        <div className="grid gap-2.5 mt-auto">
          <div className="grid grid-cols-3 gap-2.5">
            <Button onClick={() => onUpdateAmount(device.id, 1)}>
              <Plus size={16} />
            </Button>
            <Button variant="link">{device.amount}</Button>
            <Button
              onClick={() => onUpdateAmount(device.id, -1)}
              disabled={device.amount <= 1}
            >
              <Minus size={16} />
            </Button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete device from cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(device.id)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </li>
  );
});

CartItem.displayName = 'CartItem';

/**
 * Компонент корзины покупок
 * 
 * @component
 * @returns {JSX.Element} Компонент корзины с выдвижной панелью
 * 
 * @description
 * Основной компонент корзины покупок, который отображает:
 * 1. Кнопку для открытия корзины с индикатором количества товаров
 * 2. Выдвижную панель со списком товаров в корзине
 * 3. Элементы управления для изменения количества товаров и их удаления
 * 4. Общую сумму заказа и кнопку очистки корзины
 * 
 * Компонент использует Redux для управления состоянием корзины и
 * оптимизирован с помощью мемоизации обработчиков событий и
 * выделения подкомпонентов для предотвращения лишних рендеров.
 */
const Cart = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector(selectMobileStoreData);
  
  /**
   * Обработчик очистки корзины
   * 
   * @function
   * @returns {void}
   */
  const handleClearCart = useCallback(() => {
    dispatch(clearCartItems());
  }, [dispatch]);

  /**
   * Обработчик изменения количества товара
   * 
   * @function
   * @param {number} id - Идентификатор товара
   * @param {number} change - Величина изменения (1 для увеличения, -1 для уменьшения)
   * @returns {void}
   */
  const handleUpdateAmount = useCallback((id: string, change: number) => {
    dispatch(updateCartItemAmount({ id, change }));
  }, [dispatch]);

  /**
   * Обработчик удаления товара из корзины
   * 
   * @function
   * @param {number} id - Идентификатор товара для удаления
   * @returns {void}
   */
  const handleRemoveClick = useCallback((id: string) => {
    dispatch(removeCartItem(id));
  }, [dispatch]);
  
  // Форматирование общей суммы для отображения
  const formattedTotal = HELPERS.formatPrice(parseFloat(total.toFixed(2)));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingBag />
          <span>{amount}</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="grid gap-1 mb-2">
          <SheetTitle>Edit cart items</SheetTitle>
          <SheetDescription>Make changes to your cart.</SheetDescription>
        </SheetHeader>

        {cartItems.length > 0 ? (
          <>
            <ul className="grid gap-2">
              {cartItems.map(device => (
                <CartItem 
                  key={device.id}
                  device={device}
                  onUpdateAmount={handleUpdateAmount}
                  onRemove={handleRemoveClick}
                />
              ))}
            </ul>

            <div className="grid gap-2 mt-3">
              <p className="text-center">
                Total: <span className="font-semibold">{formattedTotal}</span>
              </p>
              <Button onClick={handleClearCart}>Clear cart</Button>
            </div>
          </>
        ) : (
          <p className="text-center py-4">Your cart is empty</p>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
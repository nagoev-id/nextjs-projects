import { JSX, useCallback } from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
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
import Image from 'next/image';
import { HELPERS } from '@/shared';
import {
  clearCartItems,
  Product,
  removeCartItem,
  selectMarketData,
  updateCartItemAmount,
} from '@/app/projects/medium/shopping-market-cart/features';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/shopping-market-cart/app';

/**
 * Компонент корзины покупок
 *
 * @description Отображает боковую панель с товарами в корзине, позволяет изменять количество товаров,
 * удалять товары и очищать корзину. Использует Redux для управления состоянием.
 *
 * @returns {JSX.Element} Компонент корзины покупок
 */
const Cart = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector(selectMarketData);

  /**
   * Обработчик очистки корзины
   *
   * @description Диспатчит действие для удаления всех товаров из корзины
   */
  const handleClearCart = useCallback(() => {
    dispatch(clearCartItems());
  }, [dispatch]);

  /**
   * Обработчик изменения количества товара
   *
   * @param {number} id - Идентификатор товара
   * @param {number} change - Величина изменения (положительная для увеличения, отрицательная для уменьшения)
   */
  const handleUpdateAmount = useCallback((id: number, change: number) => {
    dispatch(updateCartItemAmount({ id, change }));
  }, [dispatch]);

  /**
   * Обработчик удаления товара из корзины
   *
   * @param {number} id - Идентификатор товара для удаления
   */
  const handleRemoveClick = useCallback((id: number) => {
    dispatch(removeCartItem(id));
  }, [dispatch]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingBag />
          <span>{amount}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-3">
        <SheetHeader className="grid gap-1 p-0">
          <SheetTitle>Edit cart items</SheetTitle>
          <SheetDescription>Make changes to your cart.</SheetDescription>
        </SheetHeader>

        {/* Список товаров в корзине */}
        <ul className="grid gap-2">
          {cartItems?.map(({ id, title, price, image, amount }: Product) => (
            <li key={id}>
              <Card className="p-2 flex flex-col gap-2.5 h-full">
                {/* Изображение товара */}
                <div className="mb-auto w-24 h-24 mx-auto grid place-items-center relative">
                  <Image
                    width={100}
                    height={100}
                    priority
                    src={image}
                    alt={title}
                    className="object-contain w-full h-full absolute"
                  />
                </div>
                {/* Информация о товаре */}
                <h3 className="font-semibold uppercase text-center">
                  {title} ({HELPERS.formatPrice(price)})
                </h3>
                <div className="grid gap-2.5 mt-auto">
                  {/* Кнопки управления количеством */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <Button onClick={() => handleUpdateAmount(id, 1)}>
                      <Plus size={16} />
                    </Button>
                    <Button variant="link">{amount}</Button>
                    <Button
                      onClick={() => handleUpdateAmount(id, -1)}
                      disabled={amount <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                  {/* Диалог подтверждения удаления */}
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
                          This action cannot be undone. This will permanently delete item from cart.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveClick(id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        {/* Итоговая информация и кнопка очистки корзины */}
        <div className="grid gap-2 mt-3">
          <p className="text-center">
            Total: <span className="font-semibold">{HELPERS.formatPrice(total)}</span>
          </p>
          <Button onClick={handleClearCart}>Clear cart</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

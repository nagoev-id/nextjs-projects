import React, { JSX } from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

/**
 * Варианты отображения контейнера спиннера
 * 
 * @property {Object} variants - Доступные варианты настройки
 * @property {Object} variants.show - Управляет видимостью спиннера
 */
export const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

/**
 * Варианты отображения иконки загрузки
 * 
 * @property {Object} variants - Доступные варианты настройки
 * @property {Object} variants.size - Размеры иконки загрузки
 */
export const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/**
 * Интерфейс свойств компонента Spinner
 * 
 * @typedef {Object} SpinnerProps
 * @property {string} [size='medium'] - Размер иконки загрузки ('small', 'medium', 'large')
 * @property {boolean} [show=true] - Флаг видимости спиннера
 * @property {string} [className] - Дополнительные CSS классы для иконки загрузки
 * @property {React.ReactNode} [children] - Дочерние элементы (например, текст загрузки)
 * @property {React.HTMLAttributes<HTMLDivElement>} [props] - Дополнительные HTML атрибуты
 */
interface SpinnerProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Компонент индикатора загрузки (спиннер)
 * 
 * Отображает анимированную иконку загрузки с возможностью настройки размера и видимости.
 * Может содержать дополнительный текст или элементы внутри.
 * 
 * @example
 * // Базовое использование
 * <Spinner />
 * 
 * @example
 * // С настройками и текстом
 * <Spinner size="large" show={isLoading} className="text-blue-500">
 *   Загрузка данных...
 * </Spinner>
 * 
 * @param {SpinnerProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент спиннера
 */
export function Spinner({ 
  size, 
  show, 
  children, 
  className, 
  ...props 
}: SpinnerProps): JSX.Element {
  return (
    <div 
      className={spinnerVariants({ show })} 
      role="status"
      aria-live="polite"
      {...props}
    >
      <Loader2 
        className={cn(loaderVariants({ size }), className)} 
        aria-hidden="true"
      />
      {children && (
        <span className="mt-2 text-sm">
          {children}
        </span>
      )}
    </div>
  );
}
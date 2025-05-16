'use client';

import { JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Интерфейс пропсов для компонента ExpandableText
 * @interface ExpandableTextProps
 */
interface ExpandableTextProps {
  /** Содержимое, которое будет отображаться (текст или другие React элементы) */
  children: ReactNode;
  /** Максимальное количество слов для отображения в свернутом состоянии */
  collapsedNumWords?: number;
  /** Текст кнопки для разворачивания содержимого */
  expandButtonText?: string;
  /** Текст кнопки для сворачивания содержимого */
  collapseButtonText?: string;
  /** Цвет кнопки (в формате HEX с или без #) */
  buttonColor?: string;
  /** Начальное состояние развернутости */
  expanded?: boolean;
  /** Дополнительные CSS классы для контейнера */
  className?: string;
}

/**
 * Компонент для отображения текста, который можно развернуть или свернуть.
 *
 * Позволяет ограничить количество отображаемых слов и предоставляет кнопку
 * для переключения между полным и сокращенным представлением текста.
 *
 * @param {ExpandableTextProps} props - Пропсы компонента
 * @returns {JSX.Element} Компонент расширяемого текста
 */
const ExpandableText = ({
                          children,
                          collapsedNumWords = 20,
                          expandButtonText = 'Show more',
                          collapseButtonText = 'Show less',
                          buttonColor = '111111',
                          expanded = false,
                          className = '',
                        }: ExpandableTextProps): JSX.Element => {
  // Состояние развернутости текста
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);

  /**
   * Обрезает текст до указанного количества слов и добавляет многоточие
   * @param {ReactNode} text - Текст для обрезки
   * @returns {ReactNode} Обрезанный текст или исходный ReactNode, если это не строка
   */
  const truncateText = useCallback((text: ReactNode): ReactNode => {
    // Если текст не строка, возвращаем как есть
    if (typeof text !== 'string') return text;

    // Если текст пустой, возвращаем как есть
    if (text.trim() === '') return text;

    // Разбиваем текст на слова
    const words = text.split(' ');

    // Если количество слов больше лимита, обрезаем и добавляем многоточие
    return words.length > collapsedNumWords
      ? `${words.slice(0, collapsedNumWords).join(' ')}...`
      : text;
  }, [collapsedNumWords]);

  /**
   * Переключает состояние развернутости текста
   */
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Обрабатывает цвет кнопки, удаляя # если он присутствует
   */
  const safeButtonColor = useMemo(() => {
    return buttonColor.startsWith('#') ? buttonColor.substring(1) : buttonColor;
  }, [buttonColor]);

  /**
   * Определяет, нужно ли показывать кнопку переключения
   * (если текст короче лимита, кнопка не нужна)
   */
  const shouldShowButton = useMemo(() => {
    if (typeof children !== 'string') return true;
    return children.split(' ').length > collapsedNumWords;
  }, [children, collapsedNumWords]);

  /**
   * Текущий текст для отображения (полный или обрезанный)
   */
  const displayText = useMemo(() => {
    return isExpanded ? children : truncateText(children);
  }, [children, isExpanded, truncateText]);

  return (
    <div
      className={cn('border-2 rounded p-3', className)}
      role="region"
      aria-expanded={isExpanded}
    >
      {/* Контейнер для текста с плавной анимацией высоты */}
      <div className="transition-all duration-300 ease-in-out">
        <span className="leading-[40px] block">
          {displayText}
        </span>
      </div>

      {/* Кнопка для переключения состояния, отображается только если нужна */}
      {shouldShowButton && (
        <button
          className="border-2 rounded py-1.5 px-2.5 ml-1 font-bold bg-blue-100 mt-2 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={handleToggleExpand}
          style={{ color: `#${safeButtonColor}` }}
          aria-label={isExpanded ? collapseButtonText : expandButtonText}
        >
          {isExpanded ? collapseButtonText : expandButtonText}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
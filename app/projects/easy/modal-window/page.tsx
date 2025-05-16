'use client';

/**
 * # Модальное окно с множественными способами закрытия
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение создает кнопку для открытия модального окна
 *    - Устанавливается начальное состояние isModalOpen в false (модальное окно закрыто)
 *    - Создается ref для отслеживания DOM-элемента модального окна
 *
 * 2. **Открытие модального окна**:
 *    - При нажатии на кнопку "Open Modal" вызывается функция handleToggleModal
 *    - Функция меняет состояние isModalOpen на true, что приводит к рендерингу модального окна
 *    - Модальное окно появляется с затемненным фоном (оверлеем)
 *
 * 3. **Закрытие модального окна**:
 *    - Реализовано несколько способов закрытия:
 *      - Нажатие на кнопку с крестиком в верхнем правом углу
 *      - Нажатие на кнопку "Close Modal" внутри окна
 *      - Клик по затемненному фону вне области модального окна
 *      - Нажатие клавиши Escape на клавиатуре
 *    - Все способы вызывают функцию handleToggleModal, которая меняет isModalOpen на false
 *
 * 4. **Обработка кликов вне модального окна**:
 *    - Функция handleOverlayClick проверяет, был ли клик выполнен вне области модального окна
 *    - Используется ref (modalRef) для определения, содержит ли модальное окно элемент, по которому был выполнен клик
 *    - Если клик был вне модального окна, оно закрывается
 *
 * 5. **Обработка нажатия клавиши Escape**:
 *    - Используется useEffect для добавления обработчика события keydown
 *    - При нажатии Escape и открытом модальном окне вызывается handleToggleModal
 *    - При размонтировании компонента обработчик события удаляется для предотвращения утечек памяти
 */


import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoClose } from 'react-icons/io5';

/**
 * Компонент модального окна с различными способами закрытия
 * @returns {JSX.Element} Компонент страницы с модальным окном
 */
const ModalWindowPage = (): JSX.Element => {
  /**
   * Состояние для отслеживания открытия/закрытия модального окна
   */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /**
   * Реф для отслеживания DOM-элемента модального окна
   * Используется для определения кликов вне области модального окна
   */
  const modalRef = useRef<HTMLElement | null>(null);

  /**
   * Переключает состояние модального окна между открытым и закрытым
   *
   * @function
   * @returns {void}
   */
  const handleToggleModal = useCallback((): void => {
    setIsModalOpen(prevState => !prevState);
  }, []);

  /**
   * Обрабатывает клик по оверлею (затемненному фону)
   * Закрывает модальное окно, если клик был выполнен вне области модального окна
   *
   * @function
   * @param {React.MouseEvent<HTMLDivElement>} e - Событие клика
   * @returns {void}
   */
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleToggleModal();
    }
  }, [handleToggleModal]);

  /**
   * Эффект для отслеживания нажатия клавиши Escape
   * Добавляет и удаляет обработчик события при монтировании/размонтировании компонента
   */
  useEffect(() => {
    /**
     * Обрабатывает нажатие клавиши Escape для закрытия модального окна
     *
     * @function
     * @param {KeyboardEvent} event - Событие нажатия клавиши
     * @returns {void}
     */
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isModalOpen) handleToggleModal();
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isModalOpen, handleToggleModal]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <Button className="w-full" onClick={handleToggleModal}>Open Modal</Button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 grid place-items-center p-3" onClick={handleOverlayClick}>
          <section className="bg-white p-4 rounded max-w-md relative grid gap-4 dark:bg-accent" ref={modalRef}>
            <button className="absolute top-2 right-2" onClick={handleToggleModal} aria-label="Закрыть">
              <IoClose className="text-2xl" />
            </button>
            <h2 className="text-2xl font-bold">Title</h2>
            <p>
              &ldquo;It&apos;s only after we&apos;ve lost everything that we&apos;re free to do anything.&rdquo; ―
              Chuck Palahniuk, Fight Club
            </p>
            <Button variant="destructive" onClick={handleToggleModal}>Close Modal</Button>
          </section>
        </div>
      )}
    </Card>
  );
};

export default ModalWindowPage;
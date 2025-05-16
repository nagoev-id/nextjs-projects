'use client';

/**
 * # Компонент согласия на использование cookie (Cookie Consent)
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация компонента**:
 *    - При загрузке компонента создаются два состояния: для отслеживания принятия cookie (`isCookieAccepted`) и для отслеживания закрытия диалога (`isDialogClosed`)
 *    - Компонент проверяет, было ли ранее дано согласие на использование cookie, путем поиска строки 'customCookies' в document.cookie
 *
 * 2. **Отображение уведомления**:
 *    - Если согласие на использование cookie не было дано ранее, отображается карточка с уведомлением
 *    - Уведомление содержит заголовок с иконкой cookie, текст с объяснением, ссылку "Подробнее" и две кнопки: "Принять" и "Отклонить"
 *    - Карточка фиксируется в левом нижнем углу экрана
 *
 * 3. **Взаимодействие с пользователем**:
 *    - При нажатии на кнопку "Принять" (`handleAcceptClick`):
 *      - Диалог скрывается (устанавливается `isDialogClosed` в true)
 *      - Создается cookie с именем 'cookieBy' и значением 'customCookies'
 *      - Устанавливается срок действия cookie на 30 дней
 *    - При нажатии на кнопку "Отклонить" (`handleDeclineClick`):
 *      - Диалог просто скрывается (устанавливается `isDialogClosed` в true)
 *      - Cookie не создается
 *
 * 4. **Управление состоянием**:
 *    - Если cookie уже принят (`isCookieAccepted` = true), компонент не отображается (возвращает null)
 *    - Если диалог закрыт (`isDialogClosed` = true), компонент визуально скрывается с помощью класса 'hidden'
 *    - Состояние принятия cookie проверяется при каждой загрузке компонента
 *
 * 5. **Сохранение предпочтений пользователя**:
 *    - Предпочтения пользователя сохраняются в cookie браузера
 *    - При последующих посещениях сайта уведомление не будет отображаться, если срок действия cookie не истек
 */

import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { JSX, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Компонент страницы согласия на использование cookie
 * Отображает всплывающее уведомление о использовании cookie на сайте
 * и запрашивает согласие пользователя
 *
 * @returns {JSX.Element | null} Компонент уведомления о cookie или null, если согласие уже дано
 */
const CookieConsentPage = (): JSX.Element | null => {
  /**
   * Состояние, отслеживающее, было ли принято согласие на использование cookie
   * Если true, компонент не будет отображаться
   */
  const [isCookieAccepted, setIsCookieAccepted] = useState<boolean>(false);

  /**
   * Состояние, отслеживающее, был ли закрыт диалог
   * Если true, компонент будет скрыт с помощью CSS
   */
  const [isDialogClosed, setIsDialogClosed] = useState<boolean>(false);

  /**
   * Эффект для проверки наличия cookie при загрузке компонента
   * Устанавливает isCookieAccepted в true, если cookie уже существует
   */
  useEffect(() => {
    // Проверяем, содержит ли строка document.cookie подстроку 'customCookies'
    setIsCookieAccepted(document.cookie.includes('customCookies'));
  }, []);

  /**
   * Обработчик нажатия на кнопку "Отклонить"
   * Скрывает диалог, но не создает cookie
   */
  const handleDeclineClick = useCallback((): void => {
    setIsDialogClosed(true);
  }, []);

  /**
   * Обработчик нажатия на кнопку "Принять"
   * Скрывает диалог и создает cookie с сроком действия 30 дней
   */
  const handleAcceptClick = useCallback((): void => {
    // Скрываем диалог
    setIsDialogClosed(true);

    // Вычисляем срок действия cookie в секундах (30 дней)
    const thirtyDaysInSeconds: number = 30 * 24 * 60 * 60;

    // Создаем cookie с именем 'cookieBy', значением 'customCookies' и сроком действия 30 дней
    document.cookie = `cookieBy=customCookies; max-age=${thirtyDaysInSeconds}; path=/; SameSite=Lax`;
  }, []);

  // Если cookie уже принят, не отображаем компонент
  if (isCookieAccepted) {
    return null;
  }

  return (
    <Card
      className={`fixed bottom-8 left-8 grid max-w-md gap-3 rounded-lg p-3 shadow ${isDialogClosed && 'hidden'}`}
      role="alertdialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <h3 id="cookie-title" className="flex items-center gap-3 text-lg font-bold">
        <Cookie aria-hidden="true" />
        Cookies Consent
      </h3>
      <p id="cookie-description">
        This website uses cookies to help you have a superior and more relevant
        browsing experience on the website.
      </p>
      <Button variant='link' className='max-w-max'
         aria-label="Read more about cookies usage">
        <Link href="#">Read more</Link>
      </Button>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleAcceptClick}
          aria-label="Accept cookies"
        >
          Accept
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeclineClick}
          aria-label="Decline cookies"
        >
          Decline
        </Button>
      </div>
    </Card>
  );
};

export default CookieConsentPage;
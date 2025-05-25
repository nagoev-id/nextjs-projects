'use client';

/**
 * # Приложение уведомлений (Toast Notification)
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и настройка**:
 *    - Приложение использует кастомный хук useToasts для управления состоянием уведомлений
 *    - Конфигурация уведомлений (TOAST_CONFIG) определяет внешний вид и поведение для каждого типа уведомления
 *    - Поддерживаются 4 типа уведомлений: success, error, warning, info - каждый со своей иконкой и цветом
 * 
 * 2. **Создание уведомлений**:
 *    - Пользователь может создать уведомление, нажав на соответствующую кнопку типа
 *    - При нажатии вызывается функция addToast с указанием типа уведомления
 *    - Каждому уведомлению присваивается уникальный идентификатор (используется crypto.randomUUID или fallback)
 *    - Новое уведомление добавляется в массив состояния toasts
 * 
 * 3. **Отображение уведомлений**:
 *    - Уведомления отображаются в виде списка в правом верхнем углу экрана
 *    - Каждое уведомление представлено компонентом Toast, который получает тип, конфигурацию и функцию закрытия
 *    - Уведомления имеют анимацию появления (animate-showToast)
 * 
 * 4. **Автоматическое закрытие**:
 *    - Каждое уведомление автоматически закрывается через заданное время (по умолчанию 5000 мс)
 *    - Таймер создается внутри компонента Toast с использованием useEffect
 *    - При размонтировании компонента таймер очищается для предотвращения утечек памяти
 * 
 * 5. **Ручное закрытие**:
 *    - Пользователь может закрыть уведомление вручную, нажав на кнопку с иконкой крестика
 *    - При закрытии вызывается функция removeToast с идентификатором уведомления
 *    - Уведомление удаляется из массива состояния toasts
 * 
 * 6. **Оптимизация производительности**:
 *    - Кнопки для создания уведомлений мемоизированы с помощью useMemo для предотвращения лишних перерисовок
 *    - Функции addToast и removeToast мемоизированы с помощью useCallback в хуке useToasts
 *    - Каждое уведомление имеет уникальный ключ для оптимизации обновления DOM
 */

import { Button, Card } from '@/components/ui';
import { JSX, useMemo } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useToasts } from './hooks';
import { ToastType } from './types';
import { Toast } from './components';

/**
 * Конфигурация для всех типов уведомлений
 * @constant
 * @type {Object}
 * @property {Object} types - Словарь типов уведомлений
 * @property {Object} types.success - Конфигурация для успешных уведомлений
 * @property {Object} types.error - Конфигурация для уведомлений об ошибках
 * @property {Object} types.warning - Конфигурация для предупреждающих уведомлений
 * @property {Object} types.info - Конфигурация для информационных уведомлений
 * @property {number} time - Время в миллисекундах, через которое уведомление автоматически закроется
 */
const TOAST_CONFIG = {
  types: {
    success: {
      icon: <FaRegCheckCircle />,
      text: 'This is a success toast.',
      color: 'rgb(10, 191, 48)',
      type: 'default' as const,
    },
    error: {
      icon: <IoMdClose />,
      text: 'This is an error toast.',
      color: 'rgb(226, 77, 76)',
      type: 'destructive' as const,
    },
    warning: {
      icon: <FiAlertTriangle />,
      text: 'This is a warning toast.',
      color: 'rgb(233, 189, 12)',
      type: 'secondary' as const,
    },
    info: {
      icon: <FiAlertCircle />,
      text: 'This is an information toast.',
      color: 'rgb(52, 152, 219)',
      type: 'outline' as const,
    },
  },
  time: 5000,
};

/**
 * Компонент страницы с демонстрацией системы уведомлений
 * 
 * Отображает набор кнопок для создания различных типов уведомлений
 * и список активных уведомлений в правом верхнем углу экрана.
 * 
 * @returns {JSX.Element} Компонент страницы уведомлений
 */
const ToastNotificationPage = (): JSX.Element => {
  /**
   * Получение методов и состояния из кастомного хука управления уведомлениями
   */
  const { toasts, addToast, removeToast } = useToasts();

  /**
   * Мемоизированный набор кнопок для создания уведомлений разных типов
   * Перерендеривается только при изменении функции addToast
   */
  const toastButtons = useMemo(
    () => {
      return (Object.entries(TOAST_CONFIG.types) as [ToastType, typeof TOAST_CONFIG.types[ToastType]][]).map(
        ([key, value]) => (
          <Button variant={value.type} key={key} onClick={() => addToast(key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ),
      );
    },
    [addToast],
  );

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      {/* Список активных уведомлений */}
      <ul className="grid gap-2.5 fixed right-5 top-8" aria-live="polite" role="status">
        {toasts.map(({ id, type }) => (
          <Toast key={id} type={type} onCloseAction={() => removeToast(id)} config={TOAST_CONFIG} />
        ))}
      </ul>
      {/* Кнопки для создания уведомлений */}
      <div className="grid gap-2 sm:grid-cols-4">
        {toastButtons}
      </div>
    </Card>
  );
};

export default ToastNotificationPage;
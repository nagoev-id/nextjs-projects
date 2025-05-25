'use client';

import { JSX, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { ToastType } from '@/app/projects/easy/toast-notification/types';

/**
 * Интерфейс свойств компонента Toast
 * @interface ToastProps
 * @property ToastType - Тип уведомления, определяющий его внешний вид
 * @property {Function} onCloseAction - Функция обратного вызова для закрытия уведомления
 * @property {Object} config - Объект конфигурации уведомления
 * @property {Object} config.types - Словарь типов уведомлений
 * @property {Object} config.types[key] - Конфигурация для конкретного типа уведомления
 * @property {JSX.Element} config.types[key].icon - Иконка для отображения в уведомлении
 * @property {string} config.types[key].text - Текст уведомления
 * @property {string} config.types[key].color - Цвет иконки уведомления
 * @property {number} config.time - Время в миллисекундах, через которое уведомление автоматически закроется
 */
interface ToastProps {
  type: ToastType;
  onCloseAction: () => void;
  config: {
    types: {
      [key: string]: {
        icon: JSX.Element;
        text: string;
        color: string;
      };
    };
    time: number;
  };
}

/**
 * Компонент Toast - отображает всплывающее уведомление с заданным типом
 *
 * Компонент автоматически закрывается через заданное время и может быть закрыт
 * пользователем вручную с помощью кнопки закрытия.
 *
 * @param {ToastProps} props - Свойства компонента
 * @param {('success'|'error'|'warning'|'info')} props.type - Тип уведомления
 * @param {Function} props.onCloseAction - Функция для закрытия уведомления
 * @param {Object} props.config - Конфигурация уведомления
 *
 * @returns {JSX.Element} Компонент уведомления
 */
export const Toast = ({ type, onCloseAction, config }: ToastProps): JSX.Element => {
  const { icon, text, color } = config.types[type];

  /**
   * Эффект для автоматического закрытия уведомления через заданное время
   * Создает таймер, который вызывает функцию закрытия через config.time миллисекунд
   * Очищает таймер при размонтировании компонента
   */
  useEffect(() => {
    const timer = setTimeout(onCloseAction, config.time);
    return () => clearTimeout(timer);
  }, [onCloseAction, config.time]);

  return (
    <li
      className={`flex items-center animate-showToast rounded-md shadow-md gap-2.5 max-w-md overflow-hidden p-4 relative w-full bg-white dark:bg-accent z-10 ${type}`}>
      <div className="text-2xl mr-3" style={{ color }}>{icon}</div>
      <span className="flex-grow">{text}</span>
      <button className="p-1" onClick={onCloseAction} aria-label="Close notification">
        <IoMdClose />
      </button>
    </li>
  );
};
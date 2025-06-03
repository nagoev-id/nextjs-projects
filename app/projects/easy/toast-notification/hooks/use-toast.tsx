import { useCallback, useState } from 'react';
import { ToastItem, ToastType } from '@/app/projects/easy/toast-notification/page';

/**
 * Хук для управления уведомлениями
 * @returns {object} Методы для добавления и удаления уведомлений, массив уведомлений
 */
const useToasts = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID()
      ? Number(Date.now())
      : Number(Date.now());
    setToasts((prev) => [...prev, { id, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default useToasts;
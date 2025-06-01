'use client';

/**
 * # Tag Input Box
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и хранение данных**:
 *    - Приложение использует localStorage для сохранения тегов между сессиями
 *    - При первом запуске загружаются сохраненные теги или устанавливаются теги по умолчанию ('dev', 'react')
 *    - Максимальное количество тегов ограничено 10
 * 
 * 2. **Добавление тегов**:
 *    - Пользователь может добавить новый тег, введя его в поле ввода и нажав Enter или запятую
 *    - Перед добавлением выполняются проверки:
 *      - Тег не должен быть пустым
 *      - Тег не должен дублировать существующие (проверка без учета регистра)
 *      - Общее количество тегов не должно превышать 10
 *    - При успешном добавлении показывается уведомление об успехе
 *    - При нарушении условий показывается соответствующее уведомление об ошибке
 * 
 * 3. **Удаление тегов**:
 *    - Каждый тег можно удалить индивидуально, нажав на него
 *    - Все теги можно удалить одновременно с помощью кнопки "Remove All"
 *    - Перед массовым удалением показывается диалог подтверждения
 *    - После удаления показывается уведомление об успехе
 * 
 * 4. **Отслеживание состояния**:
 *    - Приложение отображает количество оставшихся доступных слотов для тегов
 *    - Поле ввода автоматически получает фокус при загрузке страницы
 *    - Поле ввода блокируется, когда достигнут лимит тегов
 *    - Кнопка "Remove All" блокируется, когда нет тегов для удаления
 * 
 * 5. **Синхронизация с хранилищем**:
 *    - При любом изменении списка тегов обновляется localStorage
 *    - При полном удалении тегов запись в localStorage также удаляется
 * 
 * 6. **Доступность**:
 *    - Все интерактивные элементы имеют соответствующие ARIA-атрибуты
 *    - Теги можно удалять как с помощью мыши, так и с клавиатуры
 *    - Уведомления информируют пользователя о результатах действий
 */

import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { useStorage } from '@/shared/hooks';
import { Card } from '@/components/ui/card';
import { FaTimes } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Компонент Tag Input Box
 * 
 * Позволяет пользователям создавать, управлять и сохранять коллекцию тегов.
 * Поддерживает добавление, удаление и сохранение тегов между сессиями.
 * 
 * @returns {JSX.Element} Компонент страницы с полем ввода тегов
 */
const TagInputBoxPage = (): JSX.Element => {
  /**
   * Хук для работы с localStorage
   * @type {[string[], (value: string[]) => void, () => void]}
   */
  const [storedTags, setStoredTags, removeStorageTags] = useStorage<string[]>('tags', []);
  
  /**
   * Состояние для хранения текущего списка тегов
   * Инициализируется сохраненными тегами или значениями по умолчанию
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
   */
  const [tags, setTags] = useState<string[]>(
    Array.isArray(storedTags) && storedTags.length > 0 ? storedTags : ['dev', 'react']
  );
  
  /**
   * Состояние для отслеживания количества оставшихся доступных слотов для тегов
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [remainingTags, setRemainingTags] = useState<number>(10 - tags.length);
  
  /**
   * Ссылка на элемент ввода для добавления новых тегов
   * @type {React.RefObject<HTMLInputElement>}
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Устанавливает фокус на поле ввода при монтировании компонента
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Обновляет счетчик оставшихся тегов и сохраняет текущие теги в localStorage
   * при изменении списка тегов
   */
  useEffect(() => {
    setRemainingTags(10 - tags.length);
    setStoredTags(tags);
  }, [tags, setStoredTags]);

  /**
   * Добавляет новый тег в список
   * Проверяет валидность тега и обновляет состояние
   * Показывает соответствующие уведомления
   */
  const addTag = useCallback(() => {
    const newTag = inputRef.current?.value.trim().toLowerCase();
    if (!newTag) return;
    
    const isTagExists = tags.some(tag => tag.toLowerCase() === newTag);
    const isValidTag = !isTagExists && tags.length < 10;

    if (isValidTag) {
      setTags(prevTags => [...prevTags, newTag]);
      toast.success('Tag added successfully!', { richColors: true });
    } else {
      if (isTagExists) {
        toast.error('Tag already exists!', { richColors: true });
      }
      if (tags.length >= 10) {
        toast.error('Maximum number of tags reached!', { richColors: true });
      }
    }
    
    // Очищаем поле ввода после попытки добавления
    inputRef.current!.value = '';
  }, [tags]);

  /**
   * Удаляет указанный тег из списка
   * 
   * @param {string} tag - Тег для удаления
   */
  const handleRemoveTag = useCallback((tag: string) => {
    setTags(prevTags => prevTags.filter(t => t !== tag));
    toast.success('Tag removed successfully!', { richColors: true });
  }, []);

  /**
   * Обрабатывает нажатия клавиш в поле ввода
   * Добавляет тег при нажатии Enter или запятой
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Событие нажатия клавиши
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  /**
   * Удаляет все теги и очищает localStorage
   * Вызывается после подтверждения в диалоговом окне
   */
  const handleRemoveAllTags = useCallback(() => {
    setTags([]);
    removeStorageTags();
    toast.success('All tags removed successfully!', { richColors: true });
  }, [removeStorageTags]);

  return (
    <Card className="max-w-md grid gap-4 w-full mx-auto p-4 rounded">
      <div className="grid gap-3">
        <p>Press enter or add a comma after each tag</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              onClick={() => handleRemoveTag(tag)}
              className="bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-white px-2 py-1 rounded flex items-center cursor-pointer"
              role="button"
              aria-label={`Remove tag ${tag}`}
            >
              {tag}
              <FaTimes className="ml-2 cursor-pointer" aria-hidden="true" />
            </span>
          ))}
          <Input
            ref={inputRef}
            spellCheck={false}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= 10}
            placeholder="Add a tag..."
            aria-label="Add a new tag"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p><span className="font-bold">{remainingTags}</span> tags are remaining</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={remainingTags === 10}
              aria-label="Remove all tags"
            >
              Remove All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your tags.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveAllTags}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default TagInputBoxPage;
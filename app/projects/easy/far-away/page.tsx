'use client';

/**
 * # Приложение "Far Away" - Список вещей для путешествия
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние:**
 *    - Приложение использует React с хуками для управления состоянием (useState, useCallback, useMemo).
 *    - Основное состояние включает список предметов (items) и текущий метод сортировки (sortBy).
 *    - Форма управляется с помощью react-hook-form с валидацией Zod.
 *
 * 2. **Добавление предметов:**
 *    - Пользователь может добавить предмет, указав его количество и описание.
 *    - При отправке формы новый предмет добавляется в список, форма сбрасывается.
 *
 * 3. **Управление списком:**
 *    - Каждый предмет можно отметить как упакованный или удалить из списка.
 *    - Реализована возможность очистки всего списка с подтверждением.
 *
 * 4. **Сортировка:**
 *    - Пользователь может сортировать список по порядку ввода, описанию или статусу упаковки.
 *    - Сортировка осуществляется с помощью useMemo для оптимизации производительности.
 *
 * 5. **Статистика:**
 *    - Приложение отображает общее количество предметов, количество упакованных и процент готовности.
 *    - Статистическое сообщение динамически обновляется при изменении списка.
 *
 * 6. **Оптимизация:**
 *    - Используются мемоизированные колбэки (useCallback) для оптимизации рендеринга.
 *    - Вычисляемые значения (например, отсортированный список) кэшируются с помощью useMemo.
 *
 * 7. **UI компоненты:**
 *    - Используются кастомные UI компоненты (Card, Button, Checkbox, Select) для создания интерфейса.
 *    - Форма ввода и список предметов стилизованы с использованием Tailwind CSS.
 *
 * Приложение предоставляет удобный интерфейс для создания и управления списком вещей для путешествия,
 * позволяя пользователям эффективно организовывать свой багаж.
 */

import { JSX, useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput, FormSelect } from '@/components/layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

/**
 * Тип, представляющий отдельный предмет в списке.
 */
type Item = {
  description: string;
  quantity: number;
  packed: boolean;
  id: number;
};

/**
 * Схема валидации формы с использованием Zod.
 */
const formSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.string().min(1, 'Quantity must be at least 1'),
});

/**
 * Тип значений формы, выведенный из схемы Zod.
 */
type FormValues = z.infer<typeof formSchema>;

/**
 * Основной компонент страницы Far Away.
 * @returns {JSX.Element} Отрендеренный компонент страницы.
 */
const FarAwayPage = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [sortBy, setSortBy] = useState<string>('input');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      quantity: '1',
    },
    mode: 'onChange',
  });

  /**
   * Обработчик добавления нового предмета в список.
   * @param {FormValues} values - Значения из формы.
   */
  const handleAddItems = useCallback((values: FormValues): void => {
    setItems(prevItems => [
      ...prevItems,
      {
        description: values.description,
        quantity: Number(values.quantity),
        packed: false,
        id: Date.now(),
      },
    ]);

    form.reset();
  }, [form]);

  /**
   * Обработчик удаления предмета из списка.
   * @param {number} id - ID предмета для удаления.
   */
  const handleDeleteItem = useCallback((id: number): void => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  /**
   * Обработчик переключения статуса упаковки предмета.
   * @param {number} id - ID предмета для переключения.
   */
  const handleToggleItem = useCallback((id: number): void => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, packed: !item.packed } : item,
      ),
    );
  }, []);

  /**
   * Обработчик очистки всего списка предметов.
   */
  const handleClearList = useCallback((): void => {
    if (items.length > 0 && window.confirm('Are you sure you want to delete all items?')) {
      setItems([]);
    }
  }, [items.length]);

  /**
   * Обработчик изменения метода сортировки.
   * @param {string} value - Новый метод сортировки.
   */
  const handleSortChange = useCallback((value: string): void => {
    setSortBy(value);
  }, []);

  /**
   * Мемоизированный отсортированный список предметов.
   */
  const sortedItems = useMemo(() => {
    if (items.length === 0) return [];

    const itemsCopy = [...items];

    if (sortBy === 'description') {
      return [...itemsCopy].sort((a, b) =>
        a.description.toLowerCase().localeCompare(b.description.toLowerCase()),
      );
    }

    if (sortBy === 'packed') {
      return [...itemsCopy].sort((a, b) => {
        return Number(a.packed) - Number(b.packed);
      });
    }

    return itemsCopy;
  }, [items, sortBy]);

  const numItems = items.length;
  const numPacked = items.filter(item => item.packed).length;
  const percentage = numItems > 0 ? Math.round((numPacked / numItems) * 100) : 0;

  /**
   * Мемоизированное статистическое сообщение.
   */
  const statsMessage = useMemo(() => {
    if (!numItems) return 'Start adding some items to your packing list 🚀';
    if (percentage === 100) return 'You got everything! Ready to go ✈️';
    return `💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`;
  }, [numItems, numPacked, percentage]);

  /**
   * Мемоизированный список опций количества.
   */
  const quantityOptions = useMemo(() =>
      Array.from({ length: 20 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    []);

  /**
   * Опции сортировки.
   */
  const sortOptions = [
    { value: 'input', label: 'Sort by input order' },
    { value: 'description', label: 'Sort by description' },
    { value: 'packed', label: 'Sort by packed status' },
  ];

  return (
    <Card className="max-w-xl w-full grid gap-3 mx-auto p-4 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddItems)} className="grid gap-3">
          <h3 className="text-center">What do you need for your 😍 trip?</h3>
          <FormSelect
            form={form}
            name="quantity"
            options={quantityOptions}
            label="Quantity"
            placeholder="Select quantity"
            selectProps={{
              className: 'w-full',
              value: form.watch('quantity')?.toString(),
            }}
          />
          <FormInput form={form} name="description" label="Item Description" placeholder="Description" />
          <Button type="submit">Add</Button>
        </form>
      </Form>

      <div className="grid gap-3">
        <ul className="grid gap-3">
          {sortedItems.map((item) => (
            <li className="flex items-center space-x-2" key={item.id}>
              <Checkbox
                id={`item-${item.id}`}
                checked={item.packed}
                onCheckedChange={() => handleToggleItem(item.id)}
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-grow ${item.packed ? 'line-through text-gray-500' : ''}`}
              >
                {item.quantity} {item.description}
              </label>
              <button onClick={() => handleDeleteItem(item.id)} className="text-red-500">
                <Trash2 />
              </button>
            </li>
          ))}
        </ul>

        <div className="grid gap-3">
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort items" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="destructive"
            onClick={handleClearList}
            disabled={items.length === 0}
          >
            Clear list
          </Button>
        </div>
      </div>

      <p className="text-center">{statsMessage}</p>
    </Card>
  );
};

export default FarAwayPage;
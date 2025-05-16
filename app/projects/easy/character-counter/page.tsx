'use client';

/**
 * # Счетчик символов и слов
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - При загрузке приложение создает пустое текстовое поле и счетчики с нулевыми значениями
 *    - Устанавливаются состояния для текста и статистики (символы, слова, пробелы, буквы)
 * 
 * 2. **Ввод текста**:
 *    - Пользователь вводит текст в текстовое поле
 *    - При каждом изменении текста обновляется состояние text
 * 
 * 3. **Обработка статистики**:
 *    - Функция updateStats анализирует текст и вычисляет статистику
 *    - Для оптимизации производительности используется debounce (300мс)
 *    - Это предотвращает слишком частые пересчеты при быстром вводе
 * 
 * 4. **Отображение результатов**:
 *    - Статистика отображается в виде сетки из четырех блоков
 *    - Каждый блок показывает отдельный параметр: символы, слова, пробелы, буквы
 * 
 * 5. **Очистка ресурсов**:
 *    - При размонтировании компонента отменяются отложенные вызовы функции
 *    - Это предотвращает утечки памяти и ошибки состояния
 */

import { Card } from '@/components/ui/card';
import { debounce } from 'lodash';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, JSX, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Интерфейс для статистики текста
 * @interface Stats
 * @property {string} text - Исходный текст
 * @property {number} chars - Общее количество символов
 * @property {number} words - Количество слов
 * @property {number} spaces - Количество пробелов
 * @property {number} letters - Количество букв
 */
interface Stats {
  text: string;
  chars: number;
  words: number;
  spaces: number;
  letters: number;
}

/**
 * Интерфейс для элемента статистики
 * @interface StatItem
 * @property {string} key - Уникальный ключ элемента
 * @property {string} label - Отображаемая метка
 * @property {number} value - Числовое значение
 */
interface StatItem {
  key: string;
  label: string;
  value: number;
}

/**
 * Компонент счетчика символов и слов
 * Анализирует введенный текст и показывает статистику в реальном времени
 * 
 * @returns {JSX.Element} Компонент счетчика символов
 */
const CharacterCounterPage = (): JSX.Element => {
  // Начальное состояние статистики
  const initialStats: Stats = {
    text: '',
    chars: 0,
    words: 0,
    spaces: 0,
    letters: 0,
  };

  // Состояния для хранения статистики и текста
  const [stats, setStats] = useState<Stats>(initialStats);
  const [text, setText] = useState<string>('');

  /**
   * Обновляет статистику на основе введенного текста
   * @param {string} text - Текст для анализа
   */
  const updateStats = useCallback((text: string): void => {
    if (!text) {
      setStats(initialStats);
      return;
    }
    
    setStats({
      text,
      chars: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      spaces: (text.match(/\s/g) || []).length,
      letters: (text.match(/\p{L}/gu) || []).length,
    });
  }, []);

  /**
   * Создает отложенную версию функции обновления статистики
   * Предотвращает частые пересчеты при быстром вводе
   */
  const debouncedStats = useMemo(
    () => debounce(updateStats, 300), 
    [updateStats]
  );

  /**
   * Обработчик изменения текста в текстовом поле
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Событие изменения
   */
  const handleTextareaChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  }, []);

  /**
   * Эффект для обновления статистики при изменении текста
   * Отменяет отложенные вызовы при размонтировании компонента
   */
  useEffect(() => {
    debouncedStats(text);
    
    return () => {
      debouncedStats.cancel();
    };
  }, [debouncedStats, text]);

  /**
   * Массив элементов статистики для отображения
   */
  const statItems: StatItem[] = [
    { key: 'chars', label: 'Chars', value: stats.chars },
    { key: 'words', label: 'Words', value: stats.words },
    { key: 'spaces', label: 'Spaces', value: stats.spaces },
    { key: 'letters', label: 'Letters', value: stats.letters },
  ];

  return (
    <Card className="max-w-md grid gap-3 w-full mx-auto p-4 rounded">
      <Textarea
        placeholder="Enter some text below"
        aria-label="Textarea for character counter"
        onChange={handleTextareaChange}
        value={text}
      />
      <div 
        className="grid grid-cols-4"
        aria-live="polite"
        role="region"
        aria-label="Text statistics"
      >
        {statItems.map(({ key, label, value }) => (
          <p 
            className="border flex justify-center items-center p-2 gap-1" 
            key={key}
          >
            {label}: <span className="font-bold">{value}</span>
          </p>
        ))}
      </div>
    </Card>
  );
};

export default CharacterCounterPage;
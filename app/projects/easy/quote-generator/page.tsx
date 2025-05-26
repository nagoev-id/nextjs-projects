'use client';

/**
 * # Генератор цитат
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение использует React Hook Form для управления формой выбора источника цитат
 *    - Состояние включает текущую цитату, статус загрузки и выбранный источник API
 *
 * 2. **Получение цитат**:
 *    - Пользователь выбирает источник цитат из выпадающего списка
 *    - При отправке формы выполняется запрос к выбранному API
 *    - Поддерживаются различные форматы ответов от разных API
 *
 * 3. **Обработка данных**:
 *    - Полученные данные обрабатываются в зависимости от формата ответа API
 *    - Извлекаются текст цитаты и автор (если доступен)
 *
 * 4. **Взаимодействие с пользователем**:
 *    - Отображение цитаты в карточке с возможностью копирования в буфер обмена
 *    - Индикация загрузки и обработка ошибок с уведомлениями
 */

import { useState } from 'react';
import { Button, Card, Spinner } from '@/components/ui';
import { FaRegClipboard } from 'react-icons/fa6';
import { HELPERS } from '@/shared';
import quoteAPIs from '@/app/projects/easy/quote-generator/mock';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { FormSelect } from '@/components/layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/app/projects/easy/quote-generator/utils';

/**
 * Тип для представления цитаты
 * @typedef {Object} Quote
 * @property {string} text - Текст цитаты
 * @property {string|false} author - Автор цитаты или false, если автор неизвестен
 */
type Quote = {
  text: string;
  author: string | false;
}

/**
 * Тип для представления данных о цитате, получаемых от различных API
 * Поддерживает множество форматов ответов от разных источников
 *
 * @typedef {Object} QuoteData
 * @property {string} [value] - Текст цитаты (используется в некоторых API)
 * @property {string} [author] - Автор цитаты
 * @property {string} [content] - Содержание цитаты
 * @property {string|Object} [quote] - Цитата (может быть строкой или объектом)
 * @property {string} [quote.author] - Автор цитаты (если quote - объект)
 * @property {string} [quote.body] - Текст цитаты (если quote - объект)
 * @property {string} [quoteText] - Текст цитаты (альтернативный формат)
 * @property {string} [quoteAuthor] - Автор цитаты (альтернативный формат)
 * @property {string} [punchline] - Концовка шутки (для API с шутками)
 * @property {string} [setup] - Начало шутки (для API с шутками)
 * @property {string} [insult] - Текст оскорбления (для API с оскорблениями)
 * @property {string} [affirmation] - Текст аффирмации (для API с аффирмациями)
 */
type QuoteData = {
  value?: string;
  author?: string;
  content?: string;
  quote?: string | { author?: string; body?: string };
  quoteText?: string;
  quoteAuthor?: string;
  punchline?: string;
  setup?: string;
  insult?: string;
  affirmation?: string;
}

const QuoteGeneratorPage = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Настройка формы с валидацией через React Hook Form и Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      source: '',
    },
  });

  /**
   * Получает данные о цитате из выбранного API
   *
   * @param {string} source - URL источника цитат
   * @returns {Promise<AxiosResponse<QuoteData>>} Промис с ответом от API
   */
  const fetchQuoteData = async (source: string): Promise<AxiosResponse<QuoteData>> => {
    if (source === 'https://api.api-ninjas.com/v1/quotes') {
      return axios.get<QuoteData>(source, {
        headers: { 'X-Api-Key': 'akxWnVBvUmGAjheE9llulw==TVZ6WIhfWDdCsx9o' },
      });
    }
    return axios.get<QuoteData>(source);
  };

  /**
   * Обрабатывает полученные данные о цитате и обновляет состояние
   * Поддерживает различные форматы данных от разных API
   *
   * @param {QuoteData|QuoteData[]} data - Данные о цитате или массив данных
   */
  const processQuoteData = (data: QuoteData | QuoteData[]): void => {
    if (Array.isArray(data)) {
      handleArrayData(data);
    } else if (data.value) {
      setQuote({ text: data.value, author: false });
    } else if (data.author && data.content) {
      setQuote({ text: data.content, author: data.author });
    } else if (data.author && data.quote && typeof data.quote === 'string') {
      setQuote({ text: data.quote, author: data.author });
    } else if (data.quoteText && data.quoteAuthor) {
      setQuote({ text: data.quoteText, author: data.quoteAuthor });
    } else if (data.punchline && data.setup) {
      setQuote({ text: data.setup, author: data.punchline });
    } else if (data.quote && typeof data.quote === 'object') {
      handleQuoteObject(data.quote);
    } else if (data.insult) {
      setQuote({ text: data.insult, author: false });
    } else if (data.affirmation) {
      setQuote({ text: data.affirmation, author: false });
    }
  };

  /**
   * Обрабатывает массив данных о цитатах
   * Выбирает случайную цитату из массива или обрабатывает единственную цитату
   *
   * @param {QuoteData[]} data - Массив данных о цитатах
   */
  const handleArrayData = (data: QuoteData[]): void => {
    if (data.length === 1) {
      setQuote({ text: (data[0] as any).toString(), author: false });
    } else {
      const { text, author, yoast_head_json } = data[Math.floor(Math.random() * data.length)] as any;
      if (yoast_head_json) {
        setQuote({ text: yoast_head_json.og_description, author: yoast_head_json.og_title });
      } else {
        setQuote({ text, author });
      }
    }
  };

  /**
   * Обрабатывает объект цитаты в специальном формате
   * Извлекает текст и автора из объекта
   *
   * @param {{ author?: string; body?: string }} quote - Объект с данными о цитате
   */
  const handleQuoteObject = (quote: { author?: string; body?: string }): void => {
    if (quote.author && quote.body) {
      setQuote({ text: quote.body, author: quote.author });
    }
  };

  /**
   * Обработчик отправки формы
   * Запускает процесс получения и обработки цитаты из выбранного источника
   *
   * @param {FormValues} formData - Данные формы с выбранным источником
   * @returns {Promise<void>} Промис, завершающийся после обработки запроса
   */
  const onSubmit = async ({ source }: FormValues): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await fetchQuoteData(source);
      processQuoteData(data);
    } catch (error) {
      console.error('Failed to fetch quote data:', error);
      toast.error('Failed to fetch quote data', { richColors: true });
      setQuote(null);
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormSelect
            form={form}
            name="source"
            label="Select Quote Source"
            placeholder="Select Source"
            options={quoteAPIs.map(({ name, value }) => ({ label: name, value }))}
            selectProps={{ className: 'w-full' }}
          />
          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            aria-busy={loading}
          >
            {loading ? 'Loading...' : 'Get Quote'}
          </Button>
        </form>
      </Form>

      {/* Loading */}
      {loading && <Spinner />}

      {/* Quote */}
      {!loading && quote && (
        <div className="grid rounded border bg-gray-50 p-3 mt-4 dark:bg-slate-800">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => HELPERS.copyToClipboard(quote.text)}
              aria-label="Copy quote to clipboard"
            >
              <FaRegClipboard className="mr-1" /> Copy
            </Button>
          </div>
          <p className="text-lg mb-2">"{quote.text}"</p>
          {quote.author && <p className="text-right italic">— {quote.author}</p>}
        </div>
      )}
    </Card>
  );
};

export default QuoteGeneratorPage;
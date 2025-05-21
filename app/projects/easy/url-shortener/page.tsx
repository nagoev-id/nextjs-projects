'use client';

/**
 * # URL Shortener Application
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение создает форму для ввода URL и пустой массив для хранения сокращенных URL
 *    - Устанавливаются начальные состояния для отслеживания статуса запросов (загрузка, ошибка, успех)
 *    - Настраивается валидация формы с использованием Zod и React Hook Form
 *
 * 2. **Ввод URL**:
 *    - Пользователь вводит длинный URL в текстовое поле
 *    - Форма валидирует URL в реальном времени, проверяя его на соответствие формату
 *
 * 3. **Отправка запроса**:
 *    - При отправке формы вызывается функция onSubmit
 *    - Функция fetchShortenedUrls отправляет POST-запрос к API TinyURL с введенным URL
 *    - Запрос включает авторизационный токен в заголовке для доступа к API
 *
 * 4. **Обработка ответа**:
 *    - При успешном ответе от API извлекаются данные о сокращенном URL и времени создания
 *    - Новый сокращенный URL добавляется в массив urls
 *    - Отображается уведомление об успешном сокращении URL
 *    - Форма сбрасывается для нового ввода
 *
 * 5. **Обработка ошибок**:
 *    - При возникновении ошибки в процессе запроса устанавливается соответствующий статус
 *    - Отображается уведомление об ошибке
 *    - Ошибка логируется в консоль для отладки
 *
 * 6. **Отображение результатов**:
 *    - Сокращенные URL отображаются в виде списка карточек
 *    - Каждая карточка содержит сокращенный URL, время создания и кнопку для копирования
 *    - URL представлен в виде активной ссылки, которую можно открыть в новой вкладке
 *
 * 7. **Дополнительные функции**:
 *    - Копирование сокращенного URL в буфер обмена при нажатии на кнопку "Copy"
 *    - Отображение времени создания каждого сокращенного URL
 *    - Визуальная индикация состояния загрузки при отправке запроса
 */

import { JSX, useCallback, useState } from 'react';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { HELPERS } from '@/shared';
import { CopyIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { urlShortenerValidateSchema, UrlShortenerValidateSchemaSchema } from '@/app/projects/easy/url-shortener/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import axios from 'axios';

/**
 * Интерфейс для сокращенного URL
 * @interface ShortenedUrl
 * @property {string} tiny_url - Сокращенный URL, полученный от API
 * @property {string} created_at - Дата и время создания сокращенного URL в формате ISO
 */
interface ShortenedUrl {
  tiny_url: string;
  created_at: string;
}

/**
 * Интерфейс состояния запроса к API
 * @interface FetchStatus
 * @property {boolean} isLoading - Флаг, указывающий на выполнение запроса в данный момент
 * @property {boolean} isError - Флаг, указывающий на наличие ошибки при последнем запросе
 * @property {boolean} isSuccess - Флаг, указывающий на успешное выполнение последнего запроса
 */
interface FetchStatus {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Компонент страницы сокращения URL
 * Позволяет пользователям сокращать длинные URL-адреса с помощью API TinyURL
 * и сохранять историю сокращенных URL в рамках текущей сессии
 *
 * @returns {JSX.Element} Компонент страницы сокращения URL
 */
const URLShortenerPage = (): JSX.Element => {
  /**
   * Состояние для хранения списка сокращенных URL
   * @type {[ShortenedUrl[], React.Dispatch<React.SetStateAction<ShortenedUrl[]>>]}
   */
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  /**
   * Состояние для отслеживания статуса запроса к API
   * @type {[FetchStatus, React.Dispatch<React.SetStateAction<FetchStatus>>]}
   */
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  /**
   * Инициализация формы с валидацией через React Hook Form и Zod
   * Настраивает валидацию URL в реальном времени при вводе
   */
  const form = useForm<UrlShortenerValidateSchemaSchema>({
    resolver: zodResolver(urlShortenerValidateSchema),
    defaultValues: { url: '' },
    mode: 'onChange',
  });

  /**
   * Отправляет запрос к API TinyURL для сокращения URL
   * Обновляет состояние приложения в зависимости от результата запроса
   *
   * @param {string} url - URL для сокращения
   * @returns {Promise<ShortenedUrl>} Объект с данными о сокращенном URL
   * @throws {Error} Ошибка при неудачном запросе к API
   */
  const fetchShortenedUrls = useCallback(async (url: string) => {
    try {
      // Устанавливаем состояние загрузки
      setFetchStatus({ isLoading: true, isError: false, isSuccess: false });

      // Конфигурация API
      const API_KEY = 'Wl2gadYaQ1kxXvyrscpipz5ThB6rg5euC0FGoPH1L5IqkLrnxALD7D0N7Hef';
      const API_URL = 'https://api.tinyurl.com/create';

      // Отправка запроса к API
      const { data } = await axios.post(
        API_URL,
        { url },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Извлечение данных из ответа API
      const shortenedUrl = {
        tiny_url: data.data.tiny_url,
        created_at: data.data.created_at,
      };

      // Обновление списка сокращенных URL и статуса запроса
      setUrls(prev => [...prev, shortenedUrl]);
      setFetchStatus({ isLoading: false, isError: false, isSuccess: true });

      return shortenedUrl;
    } catch (error) {
      // Обработка ошибок
      console.error('An error occurred:', error);
      setFetchStatus({ isLoading: false, isError: true, isSuccess: false });
      throw error;
    }
  }, []);

  /**
   * Обработчик отправки формы
   * Вызывает функцию сокращения URL и обрабатывает результат
   *
   * @param {UrlShortenerValidateSchemaSchema} formData - Данные формы с URL для сокращения
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async ({ url }: UrlShortenerValidateSchemaSchema) => {
    try {
      // Отправка запроса на сокращение URL
      await fetchShortenedUrls(url);

      // Уведомление об успешном сокращении
      toast.success('URL shortened successfully', {
        richColors: true,
      });
    } catch (error) {
      // Обработка и отображение ошибки
      console.error(error);
      toast.error('An error occurred', {
        richColors: true,
        description: 'Failed to shorten URL',
      });
    } finally {
      // Сброс формы независимо от результата
      form.reset();
    }
  }, [fetchShortenedUrls, form]);

  return (
    <Card className="p-4 gap-0 max-w-2xl mx-auto w-full">
      {/* Форма ввода URL */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 items-end">
          <FormInput
            form={form}
            name="url"
            label="Enter URL to shorten"
            placeholder="Enter your URL"
            aria-label="URL input field"
          />
          <div className="inline-flex gap-2">
            <Button
              type="submit"
              disabled={fetchStatus.isLoading}
              aria-busy={fetchStatus.isLoading}
            >
              {fetchStatus.isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Индикатор загрузки */}
      {fetchStatus.isLoading && <Spinner className="mt-4" aria-label="Loading" />}

      {/* Сообщение об ошибке */}
      {fetchStatus.isError && (
        <p
          className="text-center text-red-500 font-medium mt-4"
          role="alert"
          aria-live="assertive"
        >
          Failed to shorten URL
        </p>
      )}

      {/* Список сокращенных URL */}
      {fetchStatus.isSuccess && urls.length > 0 && (
        <Card
          className="grid border-none py-2 gap-3 shadow-none"
          aria-label="Shortened URLs list"
        >
          {urls.map(({ tiny_url, created_at }, index) => (
            <Card className="p-3 rounded-sm shadow-none gap-2" key={`${tiny_url}-${index}`}>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <Link href={tiny_url} target="_blank" rel="noopener noreferrer"
                      className="text-blue-500 hover:underline">
                  {tiny_url}
                </Link>
                <Button variant="outline" size="sm" onClick={() => HELPERS.copyToClipboard(tiny_url)}>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Created at: {new Date(created_at).toLocaleString()}</p>
            </Card>
          ))}
        </Card>
      )}
    </Card>
  );
};

export default URLShortenerPage;
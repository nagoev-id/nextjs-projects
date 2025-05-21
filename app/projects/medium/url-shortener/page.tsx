/**
 * Приложение для сокращения URL-адресов
 * 
 * Это приложение предоставляет удобный интерфейс для сокращения URL-адресов. Вот как оно работает:
 * 
 * 1. Пользовательский интерфейс:
 *    - Форма с полем ввода для длинных URL-адресов
 *    - Кнопка отправки для запуска процесса сокращения
 *    - Область отображения сокращенных URL-адресов с функцией копирования
 * 
 * 2. Основной функционал:
 *    - Пользователи могут вводить любой валидный URL-адрес
 *    - Приложение проверяет введенный URL с помощью схемы Zod
 *    - Использует Redux для управления состоянием (RTK Query для API-запросов)
 *    - Отображает состояние загрузки во время API-запросов
 *    - Показывает уведомления об успехе/ошибке
 * 
 * 3. Возможности:
 *    - Валидация URL-адресов
 *    - Валидация формы в реальном времени
 *    - Функция копирования в буфер обмена
 *    - Адаптивный дизайн
 *    - История сокращенных URL-адресов
 *    - Временная метка для каждого сокращенного URL
 * 
 * 4. Обработка ошибок:
 *    - Ошибки валидации формы
 *    - Обработка ошибок API
 *    - Обратная связь через уведомления
 */

'use client';

import { JSX, useCallback } from 'react';
import { shortenerSlice, useShortenUrlMutation } from '@/app/projects/medium/url-shortener/features';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  urlShortenerValidateSchema,
  UrlShortenerValidateSchemaSchema,
} from '@/app/projects/medium/url-shortener/utils';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { HELPERS } from '@/shared';
import { CopyIcon } from 'lucide-react';

/**
 * Компонент URLShortenerPage
 * 
 * @component
 * @description Главный компонент приложения для сокращения URL-адресов, который обрабатывает 
 * функциональность сокращения URL и отображает результаты.
 * 
 * @returns {JSX.Element} Отрендеренный интерфейс сокращения URL
 */
const URLShortenerPage = (): JSX.Element => {
  // Хук RTK Query для сокращения URL
  const [shortenUrl, { isLoading, isError, isSuccess, data }] = useShortenUrlMutation();
  
  // Redux селектор для доступа к истории сокращенных URL
  const shortenedUrls = useSelector(shortenerSlice.selectors.selectShortenedUrls);

  // Инициализация формы с валидацией
  const form = useForm<UrlShortenerValidateSchemaSchema>({
    resolver: zodResolver(urlShortenerValidateSchema),
    defaultValues: { url: '' },
    mode: 'onChange',
  });

  /**
   * Обрабатывает отправку формы для сокращения URL
   * 
   * @param {UrlShortenerValidateSchemaSchema} param0 - Данные формы, содержащие URL для сокращения
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async ({ url }: UrlShortenerValidateSchemaSchema) => {
    try {
      await shortenUrl({ url }).unwrap();
      toast.success('URL shortened successfully', {
        richColors: true,
      });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred', {
        richColors: true,
        description: 'Failed to shorten URL',
      });
    } finally {
      form.reset();
    }
  }, [form, shortenUrl]);

  return (
    <Card className="p-4 gap-0 max-w-2xl mx-auto w-full">
      {/* Форма ввода URL */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 items-end">
          <FormInput form={form} name="url" label="Enter URL to shorten" placeholder="Enter your URL" />
          <div className="inline-flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Состояние загрузки */}
      {isLoading && <Spinner className="mt-4" />}

      {/* Состояние ошибки */}
      {isError && <p className="text-center text-red-500 font-medium mt-4">Failed to shorten URL</p>}

      {/* Отображение результатов */}
      {isSuccess && data && shortenedUrls.length > 0 && (
        <Card className="grid border-none py-2 gap-3 shadow-none">
          {shortenedUrls.map(({ tiny_url, created_at }) => (
            <Card className="p-3 rounded-sm shadow-none gap-2" key={tiny_url}>
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
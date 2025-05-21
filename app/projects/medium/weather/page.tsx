'use client';

/**
 * # Приложение прогноза погоды
 *
 * ## Подробный принцип работы:
 *
 * 1. **Инициализация и автозагрузка**:
 *    - При монтировании компонента приложение проверяет, есть ли в localStorage сохранённый последний поисковый запрос пользователя (например, название города).
 *    - Если такой запрос найден, автоматически выполняется запрос к погодному API для получения актуальных данных по этому городу.
 *    - Поле ввода формы поиска предзаполняется этим значением для удобства пользователя.
 *
 * 2. **Поиск и валидация**:
 *    - Пользователь вводит название города в форму поиска.
 *    - При отправке формы происходит валидация данных с помощью схемы Zod (например, проверка на пустую строку и корректность формата).
 *    - Если валидация проходит успешно, выполняется асинхронный запрос к погодному API.
 *    - На время загрузки отображается спиннер-индикатор.
 *
 * 3. **Обработка и отображение результатов**:
 *    - При успешном получении данных отображается:
 *      - Название города, регион и страна
 *      - Текущая дата
 *      - Описание погодных условий и иконка
 *      - Температура, день/ночь
 *      - Прогноз на несколько дней (минимальная и максимальная температура)
 *    - Успешный поисковый запрос сохраняется в localStorage для автозаполнения в будущем.
 *    - В случае ошибки отображается информативное сообщение об ошибке.
 *
 * 4. **Управление историей поиска**:
 *    - Пользователь может очистить историю поиска кнопкой "Clear History".
 *    - При этом удаляется значение из localStorage, сбрасывается форма и очищаются данные о погоде.
 *
 * 5. **Адаптивность интерфейса**:
 *    - Интерфейс оптимизирован для разных размеров экранов: на мобильных устройствах элементы перестраиваются для лучшего UX.
 *    - Используются современные UI-компоненты и семантические атрибуты для доступности.
 *
 * ## Используемые технологии:
 * - React, React Hook Form, Zod, Redux Toolkit Query, LocalStorage, кастомные хуки и компоненты UI
 *
 * ---
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JSX, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { HELPERS } from '@/shared';
import { FormInput } from '@/components/layout/form/form-input';

import { useStorage } from '@/app/projects/easy/countdown/hooks';
import { WeatherFormSchema, weatherFormValidateSchema } from './utils/validateSchema';
import { ForecastDay, useLazyGetWeatherByQueryQuery } from '@/app/projects/medium/weather/features/weatherApi';

/**
 * Компонент страницы прогноза погоды
 *
 * Позволяет пользователю искать информацию о погоде по названию города,
 * отображает текущие погодные условия и прогноз на несколько дней.
 * Сохраняет историю поиска в localStorage для удобства пользователя.
 *
 * @component
 * @returns {JSX.Element} Компонент страницы прогноза погоды
 */
const WeatherPage = (): JSX.Element => {
  /**
   * Хук для выполнения запроса погоды
   * Возвращает функцию запроса и объект с состоянием запроса
   *
   * @typedef {Function} fetchWeather - Функция для запроса погоды по городу
   * @typedef {Object} QueryState - Состояния запроса: isLoading, isError, isSuccess, data, reset
   */
  const [fetchWeather, { 
    isLoading, 
    isError, 
    isSuccess, 
    data: weather, 
    reset 
  }] = useLazyGetWeatherByQueryQuery();

  /**
   * Хук для сохранения последнего успешного запроса в localStorage
   *
   * @param {string} key - Ключ для хранения в localStorage
   * @param {string} initialValue - Начальное значение (пустая строка)
   * @returns {[string, Function, Function]} - Кортеж [значение, функция установки, функция сброса]
   */
  const [lastQuery, setLastQuery, resetLastQuery] = useStorage<string>('weather-last-query', '');

  /**
   * Настройка формы с валидацией через react-hook-form и zod
   * Предзаполняет поле запроса последним сохраненным значением
   *
   * @type {UseFormReturn<WeatherFormSchema>}
   */
  const form = useForm<WeatherFormSchema>({
    resolver: zodResolver(weatherFormValidateSchema),
    defaultValues: { query: lastQuery || '' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы поиска погоды
   * Выполняет запрос к API и сохраняет успешный запрос в localStorage
   *
   * @function
   * @param {WeatherFormSchema} formData - Данные формы с запросом
   * @returns {Promise<void>} Промис завершения запроса
   */
  const onSubmit = useCallback(async ({ query }: WeatherFormSchema): Promise<void> => {
    try {
      await fetchWeather(query.trim());
      // Сохраняем успешный запрос в localStorage
      setLastQuery(query.trim());
    } catch (error) {
      console.error('Weather search error:', error);
      toast.error('Failed to fetch weather data', { richColors: true });
    }
  }, [fetchWeather, setLastQuery]);

  /**
   * Эффект для автоматического выполнения запроса при первой загрузке
   * Если в localStorage есть сохраненный запрос, выполняет его
   *
   * @effect
   */
  useEffect(() => {
    if (lastQuery && !weather) {
      fetchWeather(lastQuery);
    }
  }, [lastQuery, fetchWeather, weather]);

  /**
   * Обработчик сброса истории поиска
   * Очищает localStorage, сбрасывает форму и очищает данные о погоде
   *
   * @function
   * @returns {void}
   */
  const handleResetHistory = useCallback((): void => {
    // Очищаем сохраненный запрос
    resetLastQuery();
    // Сбрасываем форму
    form.reset({ query: '' });
    // Сбрасываем состояние запроса API
    reset();
  }, [resetLastQuery, form, reset]);

  return (
    <Card className="grid gap-3 max-w-2xl w-full mx-auto p-4 rounded">
      {/* Форма поиска */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormInput
            form={form}
            name="query"
            type="input"
            placeholder="Enter a city name"
            disabled={isLoading}
            aria-label="City name for weather search"
          />
          <div className="grid gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              aria-label="Search for weather"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            {lastQuery && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetHistory}
                disabled={isLoading}
                aria-label="Clear search history"
              >
                Clear History
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Состояния загрузки */}
      {isLoading && <Spinner className="mx-auto" aria-label="Loading weather data" />}

      {/* Сообщение об ошибке */}
      {isError && (
        <p className="text-red-400 text-center font-semibold" role="alert">
          Something went wrong. Please try again later.
        </p>
      )}

      {/* Отображение данных о погоде */}
      {isSuccess && weather && (
        <div className="grid gap-2 place-items-center" role="region" aria-label="Weather information">
          <h3 className="text-center text-lg font-bold">
            <span>{weather.name}</span> {weather.region && `${weather.region},`} {weather.country}
          </h3>
          <p className="text-center text-lg font-medium">{HELPERS.formattedDate()}</p>
          <p>{weather.text}</p>
          {weather.icon && (
            <img 
              src={weather.icon} 
              alt={`Weather icon: ${weather.text}`} 
              loading="lazy" 
              width="64" 
              height="64" 
            />
          )}
          <p className="text-xl font-medium">{weather.is_day ? 'Day' : 'Night'}</p>
          <p className="text-2xl font-bold">{weather.temp_c}<sup>&deg;</sup></p>

          {/* Прогноз на несколько дней */}
          <ul 
            className="grid gap-2 sm:grid-cols-3 sm:gap-5 w-full" 
            aria-label="Weather forecast for upcoming days"
          >
            {weather.forecastday.map((forecast: ForecastDay) => (
              <li 
                key={forecast.date} 
                className="grid place-items-center gap-1 p-2 border rounded"
                aria-label={`Forecast for ${forecast.date}`}
              >
                <p className="font-medium">{forecast.date}</p>
                <div>
                  <p>
                    <span className="font-bold">Min:</span> {forecast.day.mintemp_c as number}
                    <sup>&deg;</sup>
                  </p>
                  <p>
                    <span className="font-bold">Max:</span> {forecast.day.maxtemp_c as number}
                    <sup>&deg;</sup>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default WeatherPage;
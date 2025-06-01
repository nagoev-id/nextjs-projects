/**
 * Приложение прогноза погоды
 *
 * Это приложение предоставляет интерфейс для получения информации о погоде. Вот как оно работает:
 *
 * 1. Архитектура приложения:
 *    - Построено на Next.js с использованием клиентского рендеринга ('use client')
 *    - Использует React Hook Form для управления формой
 *    - Применяет Zod для валидации данных
 *    - Использует axios для API-запросов
 *    - Включает компоненты UI из локальной библиотеки
 *
 * 2. Основной функционал:
 *    - Поиск погоды по названию города
 *    - Отображение текущих погодных условий
 *    - Прогноз погоды на несколько дней
 *    - Сохранение последнего поискового запроса
 *
 * 3. Особенности:
 *    - Сохранение истории поиска в localStorage
 *    - Автоматическая загрузка последнего запроса
 *    - Отображение температуры в градусах Цельсия
 *    - Индикация дневного/ночного времени
 *    - Прогноз минимальной и максимальной температуры
 *
 * 4. Обработка ошибок:
 *    - Валидация пользовательского ввода
 *    - Обработка ошибок API
 *    - Информативные сообщения об ошибках
 *    - Индикаторы загрузки данных
 */

'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import axios from 'axios';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { HELPERS } from '@/shared';
import { useStorage } from '@/shared/hooks';
import { WeatherFormSchema, weatherFormValidateSchema } from '@/app/projects/easy/weather/utils';

/**
 * Интерфейс данных о погоде
 * @interface WeatherData
 * @property {string} text - Текстовое описание погоды
 * @property {string} icon - URL иконки погоды
 * @property {number} is_day - Индикатор времени суток (1 - день, 0 - ночь)
 * @property {number} temp_c - Текущая температура в градусах Цельсия
 * @property {Array<ForecastDay>} forecastday - Прогноз на несколько дней
 * @property {string} name - Название города
 * @property {string} region - Регион
 * @property {string} country - Страна
 */
interface WeatherData {
    text: string;
    icon: string;
    is_day: number;
    temp_c: number;
    forecastday: Array<{
        date: string;
        day: {
            mintemp_c: number;
            maxtemp_c: number;
        };
    }>;
    name: string;
    region: string;
    country: string;
}

/**
 * Интерфейс состояния запроса к API
 * @interface FetchStatus
 * @property {boolean} isLoading - Флаг загрузки
 * @property {boolean} isError - Флаг ошибки
 * @property {boolean} isSuccess - Флаг успешного запроса
 */
interface FetchStatus {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
}

/**
 * Компонент страницы погоды
 *
 * @component
 * @description
 * Главный компонент приложения погоды, который обеспечивает:
 * 1. Поиск погоды по названию города
 * 2. Отображение текущих погодных условий
 * 3. Показ прогноза на несколько дней
 * 4. Сохранение истории поиска
 *
 * @returns {JSX.Element} Компонент страницы погоды
 */
const WeatherPage = (): JSX.Element => {
    // Состояние запроса к API
    const [fetchStatus, setFetchStatus] = useState<FetchStatus>({
        isLoading: false,
        isError: false,
        isSuccess: false,
    });

    // Данные о погоде
    const [weather, setWeather] = useState<WeatherData | null>(null);

    // Хук для работы с localStorage
    const [lastQuery, setLastQuery, resetLastQuery] = useStorage<string>('weather-last-query', '');

    // Инициализация формы с валидацией
    const form = useForm<WeatherFormSchema>({
        resolver: zodResolver(weatherFormValidateSchema),
        defaultValues: {query: lastQuery || ''},
        mode: 'onChange',
    });

    /**
     * Получает данные о погоде для указанного города
     *
     * @async
     * @param {string} query - Название города для поиска
     * @returns {Promise<void>}
     */
    const fetchWeather = useCallback(async (query: string): Promise<void> => {
        setFetchStatus(prevState => ({
            ...prevState,
            isLoading: true,
            isError: false,
            isSuccess: false,
        }));

        try {
            const API_KEY = '2260a9d16e4a45e1a44115831212511';
            const API_URL = 'https://api.weatherapi.com/v1/forecast.json';

            const {data} = await axios.get(API_URL, {
                params: {
                    key: API_KEY,
                    q: query,
                    days: 5,
                    aqi: 'no',
                    alerts: 'no'
                }
            });

            setWeather({
                text: data.current.condition.text,
                icon: data.current.condition.icon,
                is_day: data.current.is_day,
                temp_c: data.current.temp_c,
                forecastday: data.forecast.forecastday,
                name: data.location.name,
                region: data.location.region,
                country: data.location.country,
            });

            setFetchStatus(prevState => ({
                ...prevState,
                isLoading: false,
                isSuccess: true,
            }));
        } catch (error) {
            console.error('Weather API error:', error);
            toast.error('Failed to fetch weather data', {richColors: true});

            setFetchStatus({
                isError: true,
                isLoading: false,
                isSuccess: false,
            });
        }
    }, []);

    /**
     * Обработчик отправки формы поиска
     *
     * @async
     * @param {WeatherFormSchema} formData - Данные формы
     * @returns {Promise<void>}
     */
    const onSubmit = useCallback(async ({query}: WeatherFormSchema): Promise<void> => {
        const trimmedQuery = query.trim();

        try {
            await fetchWeather(trimmedQuery);
            setLastQuery(trimmedQuery);
        } catch (error) {
            console.error('Weather search error:', error);
            toast.error('Failed to fetch weather data', {richColors: true});
        }
    }, [fetchWeather, setLastQuery]);

    /**
     * Сбрасывает историю поиска и состояние приложения
     */
    const handleResetHistory = useCallback((): void => {
        resetLastQuery();
        form.reset({query: ''});
        setFetchStatus({
            isError: false,
            isLoading: false,
            isSuccess: false,
        });
        setWeather(null);
    }, [resetLastQuery, form]);

    // Загрузка данных при первом рендере
    useEffect(() => {
        if (lastQuery && !weather) {
            fetchWeather(lastQuery);
        }
    }, [lastQuery, fetchWeather, weather]);

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
                        disabled={fetchStatus.isLoading}
                        aria-label="City name for weather search"
                    />
                    <div className="grid gap-2">
                        <Button
                            type="submit"
                            disabled={fetchStatus.isLoading}
                            aria-label="Search for weather"
                        >
                            {fetchStatus.isLoading ? 'Searching...' : 'Search'}
                        </Button>
                        {lastQuery && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResetHistory}
                                disabled={fetchStatus.isLoading}
                                aria-label="Clear search history"
                            >
                                Clear History
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            {/* Состояния загрузки */}
            {fetchStatus.isLoading && <Spinner className="mx-auto" aria-label="Loading weather data"/>}

            {/* Сообщение об ошибке */}
            {fetchStatus.isError && (
                <p className="text-red-400 text-center font-semibold" role="alert">
                    Something went wrong. Please try again later.
                </p>
            )}

            {/* Отображение данных о погоде */}
            {fetchStatus.isSuccess && weather && (
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
                        {weather.forecastday.map((forecast) => (
                            <li
                                key={forecast.date}
                                className="grid place-items-center gap-1 p-2 border rounded"
                                aria-label={`Forecast for ${forecast.date}`}
                            >
                                <p className="font-medium">{forecast.date}</p>
                                <div>
                                    <p>
                                        <span className="font-bold">Min:</span> {forecast.day.mintemp_c}
                                        <sup>&deg;</sup>
                                    </p>
                                    <p>
                                        <span className="font-bold">Max:</span> {forecast.day.maxtemp_c}
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
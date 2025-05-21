import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовые типы для API
interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: Record<string, unknown>;
  astro: Record<string, unknown>;
  hour: unknown[];
}

// Типы для ответа API
interface WeatherApiResponse {
  location: Location;
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

// Трансформированные данные для использования в приложении
interface WeatherData {
  text: string;
  icon: string;
  is_day: number;
  temp_c: number;
  forecastday: ForecastDay[];
  name: string;
  region: string;
  country: string;
}

// Конфигурация API
const API_CONFIG = {
  baseUrl: 'https://api.weatherapi.com/v1/',
  key: '2260a9d16e4a45e1a44115831212511',
  endpoints: {
    forecast: (query: string) => 
      `forecast.json?key=2260a9d16e4a45e1a44115831212511&q=${query}&days=5&aqi=no&alerts=no`,
  }
};

// Создание API с использованием RTK Query
export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    getWeatherByQuery: builder.query<WeatherData, string>({
      query: (query) => API_CONFIG.endpoints.forecast(query),
      transformResponse: (response: WeatherApiResponse): WeatherData => ({
        text: response.current.condition.text,
        icon: response.current.condition.icon,
        is_day: response.current.is_day,
        temp_c: response.current.temp_c,
        forecastday: response.forecast.forecastday,
        name: response.location.name,
        region: response.location.region,
        country: response.location.country,
      }),
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const { useLazyGetWeatherByQueryQuery } = weatherApi;

// Экспорт типов для использования в других файлах
export type { WeatherData, ForecastDay };
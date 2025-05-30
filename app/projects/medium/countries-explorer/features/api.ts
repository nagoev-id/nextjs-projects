import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * @typedef {Object} Country
 * @property {string} name - Название страны
 * @property {string} capital - Столица страны
 * @property {string} region - Регион, в котором находится страна
 * @property {number} population - Население страны
 * @property {Object} flags - Флаги страны
 * @property {string} flags.svg - URL SVG-изображения флага
 * @property {string} flags.png - URL PNG-изображения флага
 * @property {boolean} independent - Признак независимости страны
 */
export type Country = {
  name: string;
  capital: string;
  region: string;
  population: number;
  flags: {
    svg: string;
    png: string;
  };
  independent: boolean;
};

/**
 * @typedef {Country[]} Countries
 */
export type Countries = Country[];

/**
 * @typedef {Object} CountryDetail
 * @property {string} nativeName - Название страны на родном языке
 * @property {string} flag - URL изображения флага
 * @property {string} subregion - Субрегион страны
 * @property {string[]} topLevelDomain - Список доменов верхнего уровня страны
 * @property {Object.<string, {name: string, symbol: string}>} currencies - Валюты страны
 * @property {Object.<string, {name: string, nativeName: string}>} languages - Языки страны
 * @property {string[]} borders - Коды граничащих стран
 */
export type CountryDetail = Country & {
  nativeName: string;
  flag: string;
  subregion: string;
  topLevelDomain: string[];
  currencies: Record<string, { name: string; symbol: string }>;
  languages: Record<string, { name: string; nativeName: string }>;
  borders: string[];
};

/**
 * @typedef {Object} CountryCodeResponse
 * @description Тип для ответа API при запросе информации о стране по коду
 * @property {string} name - Название страны
 * @property {string} alpha3Code - Трехбуквенный код страны
 */
export type CountryCodeResponse = {
  name: string;
  alpha3Code: string;
};

/**
 * @interface ApiConfig
 * @description Интерфейс для конфигурации API
 * @property {string} baseUrl - Базовый URL API
 * @property {Object} endpoints - Объект с методами для формирования эндпоинтов
 * @property {function(): string} endpoints.read - Метод для получения эндпоинта списка всех стран
 * @property {function(name: string): string} endpoints.readByName - Метод для получения эндпоинта информации о стране по имени
 */
interface ApiConfig {
  baseUrl: string;
  endpoints: {
    read: () => string;
    readByName: (name: string) => string;
  };
}

/**
 * @interface BorderCountriesCache
 * @description Интерфейс для кеша пограничных стран
 * @property {string} [countryCode] - Название страны (значение) для соответствующего кода страны (ключ)
 */
interface BorderCountriesCache {
  [countryCode: string]: string;
}

/**
 * @constant {ApiConfig} API_CONFIG
 * @description Конфигурация API
 */
const API_CONFIG: ApiConfig = {
  baseUrl: 'https://restcountries.com/v2/',
  endpoints: {
    read: () => 'all?fields=name,capital,flags,population,region',
    readByName: (name: string) => `name/${name}`,
  },
};

/**
 * @const {Object} api
 * @description Создание API с использованием RTK Query
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    /**
     * @function get
     * @description Запрос для получения списка всех стран
     * @returns {Countries} Массив объектов с информацией о странах
     */
    get: builder.query<Countries, string>({
      query: () => API_CONFIG.endpoints.read(),
    }),
    /**
     * @function getByName
     * @description Запрос для получения детальной информации о стране по имени
     * @param {string} name - Название страны
     * @returns {CountryDetail} Объект с детальной информацией о стране
     */
    getByName: builder.query<CountryDetail, string>({
      query: (name) => API_CONFIG.endpoints.readByName(name),
      transformResponse: async (response: CountryDetail[]) => {
        if (!response.length) {
          throw new Error('Country not found');
        }
        const country = response[0];
        const countryBorders = await fetchBorderCountries(country.borders);

        return {
          ...country,
          borders: countryBorders,
        };
      }
    }),
  }),
});

/**
 * @const {BorderCountriesCache} borderCountriesCache
 * @description Простой кеш в памяти для пограничных стран
 */
const borderCountriesCache: BorderCountriesCache = {};

/**
 * @function fetchBorderCountries
 * @description Получает названия пограничных стран по их кодам. Использует кеширование для оптимизации запросов.
 * @param {string[] | undefined} borders - Массив кодов стран (alpha3Code)
 * @returns {Promise<string[]>} Промис с массивом названий стран
 */
async function fetchBorderCountries(borders: string[] | undefined): Promise<string[]> {
  if (!borders || borders.length === 0) {
    return [];
  }

  // Filter out borders that are already in cache
  const cachedBorders: string[] = [];
  const bordersToFetch = borders.filter(code => {
    if (borderCountriesCache[code]) {
      cachedBorders.push(borderCountriesCache[code]);
      return false;
    }
    return true;
  });

  // If all borders are cached, return immediately
  if (bordersToFetch.length === 0) {
    return cachedBorders;
  }

  try {
    const { data }: AxiosResponse<CountryCodeResponse[]> = await axios.get<CountryCodeResponse[]>(
      `${API_CONFIG.baseUrl}alpha`, {
        params: { codes: bordersToFetch.join(',') },
        // Add timeout and retry config for better resilience
        timeout: 5000
      }
    );

    // Update cache with new data
    data.forEach((country, index) => {
      const code = bordersToFetch[index];
      borderCountriesCache[code] = country.name;
    });

    // Combine cached results with new results
    return [...cachedBorders, ...data.map(b => b.name)];
  } catch (error) {
    console.error('Error fetching border countries:', (error as AxiosError).message);
    // Return cached results even if the request fails
    return cachedBorders;
  }
}

/**
 * @description Экспорт хуков для использования в компонентах
 */
export const { useGetQuery, useGetByNameQuery } = api;
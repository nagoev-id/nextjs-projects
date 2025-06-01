import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * @typedef {Object} Crypto
 * @description Представляет информацию о криптовалюте
 * @property {number} ath - Наивысшая цена за все время
 * @property {number} ath_change_percentage - Процентное изменение от наивысшей цены
 * @property {string} ath_date - Дата достижения наивысшей цены
 * @property {number} atl - Самая низкая цена за все время
 * @property {number} atl_change_percentage - Процентное изменение от самой низкой цены
 * @property {string} atl_date - Дата достижения самой низкой цены
 * @property {number} circulating_supply - Текущее предложение в обращении
 * @property {number} current_price - Текущая цена
 * @property {number} fully_diluted_valuation - Полностью разводненная оценка
 * @property {number} high_24h - Самая высокая цена за последние 24 часа
 * @property {string} id - Уникальный идентификатор криптовалюты
 * @property {string} image - URL изображения криптовалюты
 * @property {string} last_updated - Дата последнего обновления информации
 * @property {number} low_24h - Самая низкая цена за последние 24 часа
 * @property {number} market_cap - Рыночная капитализация
 * @property {number} market_cap_change_24h - Изменение рыночной капитализации за 24 часа
 * @property {number} market_cap_change_percentage_24h - Процентное изменение рыночной капитализации за 24 часа
 * @property {number} market_cap_rank - Ранг по рыночной капитализации
 * @property {number} max_supply - Максимальное предложение
 * @property {string} name - Название криптовалюты
 * @property {number} price_change_24h - Изменение цены за 24 часа
 * @property {number} price_change_percentage_24h - Процентное изменение цены за 24 часа
 * @property {Object|null} roi - Информация о возврате инвестиций
 * @property {number} roi.times - Количество раз возврата инвестиций
 * @property {string} roi.currency - Валюта ROI
 * @property {number} roi.percentage - Процент ROI
 * @property {string} symbol - Символ криптовалюты
 * @property {number} total_supply - Общее предложение
 * @property {number} total_volume - Общий объем торгов
 */
export type Crypto = {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  symbol: string;
  total_supply: number;
  total_volume: number;
}

/**
 * @typedef {Crypto[]} CryptoList
 * @description Массив объектов типа Crypto
 */
export type CryptoList = Crypto[]

/**
 * @typedef {Object} CryptoData
 * @description Подробная информация о криптовалюте
 * @property {string} id - Уникальный идентификатор криптовалюты
 * @property {string} name - Название криптовалюты
 * @property {string} symbol - Символ криптовалюты
 * @property {Object} image - Объект с изображениями криптовалюты
 * @property {string} image.large - URL большого изображения
 * @property {Object} market_data - Рыночные данные криптовалюты
 * @property {Object} market_data.current_price - Текущие цены в разных валютах
 * @property {number} market_data.current_price.usd - Текущая цена в USD
 * @property {Object} market_data.market_cap - Рыночная капитализация в разных валютах
 * @property {number} market_data.market_cap.usd - Рыночная капитализация в USD
 * @property {number} market_data.price_change_percentage_24h - Процентное изменение цены за 24 часа
 * @property {Object} market_data.total_volume - Общий объем торгов в разных валютах
 * @property {number} market_data.total_volume.usd - Общий объем торгов в USD
 * @property {Object} description - Описание криптовалюты на разных языках
 * @property {string} description.en - Описание на английском языке
 */
export type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    total_volume: {
      usd: number;
    };
  };
  description: {
    en: string;
  };
}

/**
 * @constant
 * @type {Object}
 * @description Конфигурация API для запросов к CoinGecko
 */
const API_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  endpoints: {
    readAll: () => ({
      url: '/coins/markets',
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
      },
    }),
    readById: (id: string) => ({
      url: `/coins/${id}`,
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    }),
  },
};

/**
 * @const {Object} api
 * @description API для работы с данными о криптовалютах, созданный с использованием RTK Query
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    getAll: builder.query<CryptoList, void>({
      query: () => API_CONFIG.endpoints.readAll(),
    }),
    getById: builder.query<CryptoData, string>({
      query: (id) => API_CONFIG.endpoints.readById(id),
    }),
  }),
});

/**
 * @function useGetAllQuery
 * @description Хук для получения списка всех криптовалют
 * @returns {Object} Объект с данными, состоянием загрузки и ошибками
 */


/**
 * @function useGetByIdQuery
 * @description Хук для получения информации о конкретной криптовалюте по её ID
 * @param {string} id - Идентификатор криптовалюты
 * @returns {Object} Объект с данными, состоянием загрузки и ошибками
 */
export const { useGetAllQuery, useGetByIdQuery } = api;
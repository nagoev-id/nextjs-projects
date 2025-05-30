import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * @typedef {Object} User
 * @description Интерфейс, описывающий данные пользователя GitHub
 * @property {string} login - Логин пользователя
 * @property {number} id - Уникальный идентификатор пользователя
 * @property {string} avatar_url - URL аватара пользователя
 * @property {string} name - Полное имя пользователя
 * @property {string} bio - Биография пользователя
 * @property {string} type - Тип аккаунта (User, Organization и т.д.)
 * @property {boolean} hireable - Флаг доступности пользователя для найма
 * @property {string} location - Местоположение пользователя
 * @property {string} email - Email пользователя
 * @property {string} blog - URL блога или веб-сайта пользователя
 * @property {string} twitter_username - Имя пользователя в Twitter
 * @property {string} html_url - URL профиля пользователя на GitHub
 * @property {number} followers - Количество подписчиков
 * @property {number} following - Количество пользователей, на которых подписан
 * @property {number} public_repos - Количество публичных репозиториев
 * @property {number} public_gists - Количество публичных gists
 */
export type User = {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  type: string;
  hireable: boolean;
  location: string;
  email: string;
  blog: string;
  twitter_username: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
};

/**
 * @typedef {User[]} Users
 * @description Массив пользователей GitHub
 */
export type Users = User[]

/**
 * @typedef {Object} Repository
 * @description Интерфейс, описывающий данные репозитория GitHub
 * @property {number} id - Уникальный идентификатор репозитория
 * @property {string} name - Название репозитория
 * @property {string} description - Описание репозитория
 * @property {string} html_url - URL репозитория на GitHub
 * @property {number} forks - Количество форков репозитория
 * @property {number} open_issues - Количество открытых issues
 * @property {number} watchers_count - Количество наблюдателей
 * @property {number} stargazers_count - Количество звезд
 */
export type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  forks: number;
  open_issues: number;
  watchers_count: number;
  stargazers_count: number;
}

/**
 * @typedef {Object} SearchUsersResponse
 * @description Формат ответа API GitHub при поиске пользователей
 * @property {User[]} items - Массив найденных пользователей
 */
export type SearchUsersResponse = {
  items: User[];
}

/**
 * @typedef {Object} SearchUsersAndReposResponse
 * @description Комбинированный ответ с данными пользователя и его репозиториями
 * @property {User} details - Детальная информация о пользователе
 * @property {Repository[]} repos - Массив репозиториев пользователя
 */
export type SearchUsersAndReposResponse = {
  details: User;
  repos: Repository[];
}

/**
 * @constant {Object} API_CONFIG
 * @description Конфигурация API GitHub
 * @property {string} baseUrl - Базовый URL API GitHub
 * @property {Object} endpoints - Объект с методами для формирования эндпоинтов
 * @property {Function} endpoints.read - Функция для формирования параметров запроса поиска пользователей
 */
const API_CONFIG = {
  baseUrl: 'https://api.github.com/',
  endpoints: {
    read: (query: string) => ({
      url: 'search/users',
      params: { q: query },
    }),
  },
};

/**
 * @constant {Object} api
 * @description API-клиент для взаимодействия с GitHub API, созданный с помощью RTK Query
 * @property {string} reducerPath - Путь для хранения состояния API в Redux store
 * @property {Object} baseQuery - Базовый запрос с настройками
 * @property {Object} endpoints - Определение эндпоинтов API
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    /**
     * @function get
     * @description Запрос для поиска пользователей по заданному запросу
     * @param {string} query - Поисковый запрос
     * @returns {Users} Массив найденных пользователей
     */
    get: builder.query<Users, string>({
      query: (query) => API_CONFIG.endpoints.read(query),
      transformResponse: (response: SearchUsersResponse) => response.items,
    }),
    
    /**
     * @function getDetail
     * @description Запрос для получения детальной информации о пользователе и его репозиториях
     * @param {string} username - Логин пользователя GitHub
     * @returns {SearchUsersAndReposResponse} Объект с информацией о пользователе и его репозиториях
     */
    getDetail: builder.query<SearchUsersAndReposResponse, string>({
      async queryFn(username, _queryApi, _extraOptions, fetchWithBQ) {
        // Выполняем параллельные запросы для получения информации о пользователе и его репозиториях
        const [detailsResult, reposResult] = await Promise.all([
          fetchWithBQ(`users/${username}`),
          fetchWithBQ(`users/${username}/repos`),
        ]);

        // Обрабатываем ошибки запросов
        if (detailsResult.error) return { error: detailsResult.error };
        if (reposResult.error) return { error: reposResult.error };

        // Возвращаем комбинированный результат
        return {
          data: {
            details: detailsResult.data as User,
            repos: reposResult.data as Repository[],
          },
        };
      },
    }),
  }),
});

/**
 * @exports {Object} Экспортируемые хуки для использования в компонентах
 * @property {Function} useLazyGetQuery - Хук для ленивого запроса поиска пользователей
 * @property {Function} useGetDetailQuery - Хук для получения детальной информации о пользователе
 */
export const { useLazyGetQuery, useGetDetailQuery } = api;
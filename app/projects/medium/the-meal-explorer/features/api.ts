import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

/**
 * @typedef {Object} Meal
 * @property {string} idMeal - Уникальный идентификатор блюда
 * @property {string} strMeal - Название блюда
 * @property {string|null} strDrinkAlternate - Альтернативный напиток (если есть)
 * @property {string} strCategory - Категория блюда
 * @property {string} strArea - Регион происхождения блюда
 * @property {string} strInstructions - Инструкции по приготовлению
 * @property {string} strMealThumb - URL изображения блюда
 * @property {string} strTags - Теги блюда
 * @property {string} strYoutube - URL видео на YouTube
 * @property {Object.<string, string|null>} ingredients - Ингредиенты блюда
 * @property {Object.<string, string|null>} measures - Меры ингредиентов
 * @property {string|null} strSource - Источник рецепта
 * @property {string|null} strImageSource - Источник изображения
 * @property {string|null} strCreativeCommonsConfirmed - Подтверждение Creative Commons
 * @property {string|null} dateModified - Дата последнего изменения
 */
export type Meal = {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  ingredients: {
    [key: string]: string | null;
  };
  measures: {
    [key: string]: string | null;
  };
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
}

/** @typedef {Meal[]} Meals */
export type Meals = Meal[];

/**
 * Конфигурация API
 * @type {{baseUrl: string, endpoints: {readByName: (name: string) => string, readById: (id: string) => string}}}
 */
const API_CONFIG = {
  baseUrl: 'https://www.themealdb.com/api/json/v1/1',
  endpoints: {
    readByName: (name: string) => `search.php?s=${name}`,
    readById: (id: string) => `lookup.php?i=${id}`,
  },
};

/**
 * Создание API с использованием RTK Query
 * @description Этот объект содержит все эндпоинты для работы с API TheMealDB
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  endpoints: (builder) => ({
    /**
     * Получение блюд по названию
     * @param {string} name - Название блюда для поиска
     * @returns {Meals} Массив найденных блюд
     */
    getByName: builder.query<Meals, string>({
      query: (name) => API_CONFIG.endpoints.readByName(name),
      transformResponse: (response: { meals: Meals | null }) => response.meals || [],
    }),

    /**
     * Получение случайных блюд
     * @returns {Meal[]} Массив случайных уникальных блюд
     */
    getRandomMeals: builder.query<Meal[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        /**
         * Получение одного случайного блюда
         * @returns {Promise<Meal|null>} Промис с случайным блюдом или null
         */
        const fetchRandomMeal = async (): Promise<Meal | null> => {
          const result = await fetchWithBQ('random.php');
          if (result.error) throw result.error;
          const data = result.data as { meals: Meal[] };
          return data.meals?.[0] || null;
        };

        try {
          const meals = await Promise.all(Array(4).fill(null).map(fetchRandomMeal));
          const uniqueMeals = meals.reduce((acc: Meal[], meal: Meal | null) => {
            if (meal && !acc.some(m => m.idMeal === meal.idMeal)) {
              acc.push(meal);
            }
            return acc;
          }, []);
          return { data: uniqueMeals };
        } catch (error) {
          return { error: error as FetchBaseQueryError };
        }
      },
    }),

    /**
     * Получение блюда по ID
     * @param {string} id - ID блюда
     * @returns {Meal} Объект блюда
     */
    getById: builder.query<Meal, string>({
      query: (id) => API_CONFIG.endpoints.readById(id),
      transformResponse: (response: { meals: Meals | null }) => response.meals?.[0] || {} as Meal,
    }),
  }),
});

/**
 * Экспорт хуков для использования в компонентах
 * @example
 * // Использование в компоненте:
 * const [searchMeals, { data, isLoading }] = useLazyGetByNameQuery();
 * const { data: randomMeals } = useGetRandomMealsQuery();
 * const { data: mealDetails } = useGetByIdQuery(mealId);
 */
export const { useLazyGetByNameQuery, useGetRandomMealsQuery, useGetByIdQuery } = api;
/**
 * @typedef {Object} Pokemon
 * @description Представляет основную информацию о покемоне.
 * @property {number} id - Уникальный идентификатор покемона.
 * @property {string} name - Имя покемона (с заглавной буквы).
 * @property {string} pokemonId - Строковое представление ID покемона (с ведущими нулями).
 * @property {string} type - Основной тип покемона.
 * @property {string} color - Цвет, ассоциированный с типом покемона.
 */
export type Pokemon = {
  id: number;
  name: string;
  pokemonId: string;
  type: string;
  color: string;
}

/**
 * @typedef {Object} InitialPokemonState
 * @description Представляет начальное состояние для хранения данных о покемонах.
 * @property {Pokemon[]} collection - Массив объектов Pokemon.
 * @property {Object|null} selectedPokemon - Информация о выбранном покемоне или null.
 * @property {any[]} selectedPokemon.effect_entries - Массив эффектов покемона.
 * @property {any[]} selectedPokemon.flavor_text_entries - Массив текстовых описаний покемона.
 * @property {any[]} selectedPokemon.names - Массив имен покемона.
 * @property {string} selectedPokemon.name - Имя выбранного покемона.
 * @property {number} selectedPokemon.pokemonId - ID выбранного покемона.
 * @property {boolean} isLoading - Флаг, указывающий на процесс загрузки данных.
 * @property {boolean|null} isError - Флаг ошибки или null, если ошибки нет.
 * @property {boolean} isSuccess - Флаг успешной загрузки данных.
 */
export type InitialPokemonState = {
  collection: Pokemon[];
  selectedPokemon: {
    effect_entries: any[];
    flavor_text_entries: any[];
    names: any[];
    name: string;
    pokemonId: number;
  } | null;
  isLoading: boolean;
  isError: null | boolean;
  isSuccess: boolean;
}

/**
 * @typedef {Object} PokemonData
 * @description Содержит константные данные для работы с API покемонов.
 * @property {number} count - Количество покемонов для загрузки.
 * @property {Object.<string, string>} color - Объект, сопоставляющий типы покемонов с цветами.
 * @property {string} apiUrl - Базовый URL для API покемонов.
 * @property {string} spritesUrl - URL для загрузки изображений покемонов.
 */
export type PokemonData = {
  count: number;
  color: Record<string, string>;
  apiUrl: string;
  spritesUrl: string;
}

/**
 * @typedef {Object} PokemonApiResponse
 * @description Представляет структуру ответа от API покемонов.
 * @property {number} id - Уникальный идентификатор покемона.
 * @property {string} name - Имя покемона.
 * @property {Array<{type: {name: string}}>} types - Массив типов покемона.
 */
export type PokemonApiResponse = {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
}

/**
 * @typedef {Object} PokemonCardData
 * @description Содержит дополнительные данные для карточки покемона.
 * @property {any[]} effect_entries - Массив эффектов покемона.
 * @property {any[]} flavor_text_entries - Массив текстовых описаний покемона.
 * @property {any[]} names - Массив имен покемона.
 * @property {Object} generation - Информация о поколении покемона.
 * @property {string} generation.name - Название поколения покемона.
 */
export type PokemonCardData = {
  effect_entries: any[];
  flavor_text_entries: any[];
  names: any[];
  generation: {
    name: string;
  };
}

/**
 * @typedef {('number'|'prev'|'next')} ButtonType
 * @description Определяет типы кнопок для пагинации.
 */
export type ButtonType = 'number' | 'prev' | 'next';
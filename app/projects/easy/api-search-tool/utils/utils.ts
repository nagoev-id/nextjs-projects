import RESOURCES from '../mock/resources.json';
import { ApiEntry } from '@/app/projects/easy/api-search-tool/types';

/**
 * Группировка API по категориям для быстрого доступа
 * 
 * @returns {Record<string, ApiEntry[]>} Объект с API, сгруппированными по категориям
 */
export const categorizedResults = (): Record<string, ApiEntry[]> => {
  return RESOURCES.entries.reduce<Record<string, ApiEntry[]>>((acc, entry) => {
    const { Category } = entry;
    if (!acc[Category]) {
      acc[Category] = [];
    }
    acc[Category].push(entry);
    return acc;
  }, {});
};

/**
 * Фильтрует API по поисковому запросу
 * Поиск осуществляется по названию, описанию и категории API
 *
 * @param {string} searchQuery - Поисковый запрос
 * @param {Record<string, ApiEntry[]>} categorized - Объект с API, сгруппированными по категориям
 * @returns {ApiEntry[]} Отфильтрованный массив API
 */
export const filterResults = (searchQuery: string, categorized: Record<string, ApiEntry[]>): ApiEntry[] => {
  const normalizedQuery = searchQuery.toLowerCase();
  return Object.values(categorized).flatMap(category =>
    category.filter(({ API, Description, Category }: ApiEntry) =>
      [API, Description, Category].some(field =>
        field.toLowerCase().includes(normalizedQuery),
      ),
    ),
  );
};
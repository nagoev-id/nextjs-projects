/**
 * Тип для элемента API
 * @property {string} API - Название API
 * @property {string} Description - Описание API
 * @property {string} Auth - Тип аутентификации
 * @property {boolean} HTTPS - Поддерживает ли API HTTPS
 * @property {string} Cors - Политика CORS
 * @property {string} Link - Ссылка на документацию API
 * @property {string} Category - Категория API
 */
export type ApiEntry = {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}
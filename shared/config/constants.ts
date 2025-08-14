import { ListOfProjects, ProjectLabel, ProjectLevel } from '@/shared/types/types';
import { Metadata } from 'next';
import { ALL_PROJECTS, getAllProjects, getProjectsByLevel } from './projects';

/**
 * @constant
 * @type {Metadata}
 * @description Метаданные проекта, используемые для SEO и описания приложения
 * @property {string} title - Заголовок проекта
 * @property {string} description - Краткое описание проекта
 * @property {string[]} keywords - Ключевые слова для SEO
 * @property {Object[]} authors - Информация об авторах проекта
 * @property {string} authors[].name - Имя автора
 * @property {string} authors[].url - URL профиля автора
 */
export const PROJECTS_METADATA: Metadata = {
  title: 'Next.js Starter Template',
  description: 'A Next.js starter template with a minimalistic design and a clean code structure.',
  keywords: ['Next.js', 'React'],
  authors: [{ name: 'Alim Nagoev', url: 'https://github.com/nagoev-alim' }],
};

/**
 * @constant
 * @type {ListOfProjects}
 * @description Список всех проектов, сгруппированных по уровню сложности и типу
 *
 * Теперь использует модульную структуру:
 * - Легкие проекты: shared/config/projects/easy.ts
 * - Средние проекты: shared/config/projects/medium.ts
 * - Сложные проекты: shared/config/projects/hard.ts (будущие)
 *
 * Преимущества новой структуры:
 * - Модульность и разделение ответственности
 * - Легкость добавления новых проектов
 * - Использование фабричных функций
 * - Категоризация проектов
 * - Типобезопасность
 * - Возможность ленивой загрузки
 */
export const PROJECTS_LIST: ListOfProjects = ALL_PROJECTS as ListOfProjects;

// ===============================================
// 🚀 UTILITY FUNCTIONS (Утилитарные функции)
// ===============================================

/**
 * Получить все проекты
 */
export const getProjects = getAllProjects;

/**
 * Получить проекты по уровню сложности
 */
export const getProjectsByDifficulty = getProjectsByLevel;

/**
 * Получить легкие проекты
 */
export function getEasyProjectsFromConstants() {
  return getProjectsByLevel(ProjectLevel.easy);
}

/**
 * Получить средние проекты
 */
export function getMediumProjectsFromConstants() {
  return getProjectsByLevel(ProjectLevel.medium);
}

/**
 * Получить сложные проекты
 */
export function getHardProjects() {
  return getProjectsByLevel(ProjectLevel.hard);
}

/**
 * Получить количество проектов по уровням
 */
export function getProjectCounts() {
  const easy = Object.keys(getEasyProjectsFromConstants()).length;
  const medium = Object.keys(getMediumProjectsFromConstants()).length;
  const hard = Object.keys(getHardProjects()).length;

  return {
    easy,
    medium,
    hard,
    total: easy + medium + hard,
  };
}

/**
 * Проверить существование проекта
 */
export function projectExists(label: ProjectLabel): boolean {
  return label in PROJECTS_LIST;
}

/**
 * Получить информацию о проекте по метке
 */
export function getProjectInfo(label: ProjectLabel) {
  return PROJECTS_LIST[label] || null;
}

// ===============================================
// 📊 PROJECT STATISTICS (Статистика проектов)
// ===============================================

/**
 * Статистика проектов для дашборда
 */
export function getProjectStatistics() {
  const counts = getProjectCounts();
  const allProjects = getAllProjects();

  // Подсчет по категориям (если есть расширенная информация)
  const categoryCounts: Record<string, number> = {};
  Object.values(allProjects).forEach(project => {
    if ('category' in project && project.category) {
      categoryCounts[project.category] = (categoryCounts[project.category] || 0) + 1;
    }
  });

  return {
    ...counts,
    byCategory: categoryCounts,
    lastUpdated: new Date().toISOString(),
  };
}

// Экспортируем все утилиты из модульной структуры
export * from './projects';
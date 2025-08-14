import { ProjectLevel } from '@/shared/types/types';
import { ExtendedProjectInfo, filterProjectsByLevel, getProjectStats } from '../project-helpers';
import { EASY_PROJECTS, getEasyProjects, getEasyProjectsByCategory } from './easy';
import { MEDIUM_PROJECTS, getMediumProjects, getMediumProjectsByCategory } from './medium';

/**
 * Объединенный список всех проектов
 */
export const ALL_PROJECTS: Record<string, ExtendedProjectInfo> = {
  ...EASY_PROJECTS,
  ...MEDIUM_PROJECTS,
  // ...HARD_PROJECTS, // когда будут добавлены
};

/**
 * Получить все проекты
 */
export function getAllProjects(): Record<string, ExtendedProjectInfo> {
  return ALL_PROJECTS;
}

/**
 * Получить проекты по уровню сложности
 */
export function getProjectsByLevel(level: ProjectLevel): Record<string, ExtendedProjectInfo> {
  switch (level) {
    case ProjectLevel.easy:
      return getEasyProjects();
    case ProjectLevel.medium:
      return getMediumProjects();
    case ProjectLevel.hard:
      return {}; // пока пустой
    default:
      return {};
  }
}

/**
 * Статистика всех проектов
 */
export function getAllProjectsStats() {
  return getProjectStats(ALL_PROJECTS);
}

/**
 * Экспорт функций для получения проектов по категориям
 */
export {
  getEasyProjects,
  getEasyProjectsByCategory,
  getMediumProjects,
  getMediumProjectsByCategory,
};

/**
 * Экспорт отдельных коллекций проектов
 */
export {
  EASY_PROJECTS,
  MEDIUM_PROJECTS,
};

/**
 * Экспорт хелперов и типов
 */
export * from '../project-helpers'; 
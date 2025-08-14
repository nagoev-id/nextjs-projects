import { ProjectLevel, ProjectInfo } from '@/shared/types/types';

/**
 * Расширенный тип проекта с категорией
 */
export interface ExtendedProjectInfo extends ProjectInfo {
  category?: ProjectCategory;
}

/**
 * Базовые пути для проектов по уровням сложности
 */
export const PROJECT_PATHS = {
  [ProjectLevel.easy]: 'easy',
  [ProjectLevel.medium]: 'medium', 
  [ProjectLevel.hard]: 'hard',
} as const;

/**
 * Категории проектов для группировки
 */
export enum ProjectCategory {
  UI_COMPONENTS = 'UI Components & Interactions',
  THEME_DESIGN = 'Theme & Design',
  TEXT_TOOLS = 'Text & Character Tools',
  TIME_DATE = 'Time & Date Tools',
  CALCULATORS = 'Calculators & Converters',
  GAMES = 'Games & Entertainment',
  DATA_INFO = 'Data & Information Apps',
  SEARCH_FILTER = 'Search & Filter Tools',
  API_INTEGRATION = 'External API Integration',
  LOCATION = 'Location & Geography',
  QR_FILES = 'QR Code & File Tools',
  IMAGE_PROCESSING = 'Image Processing',
  FORMS = 'Input & Form Components',
  PERSONAL_MGMT = 'Personal Management',
  SOCIAL = 'Social & Sharing',
  UTILITIES = 'Utilities & Tools',
  HEALTH = 'Health & Wellness',
  REDUX = 'Redux State Management',
  SECURITY = 'Advanced Security & Tools',
  COMPLEX_GAMES = 'Complex Games',
  FORM_MGMT = 'Form Management',
  FINANCIAL = 'Financial & Market Data',
  ECOMMERCE = 'E-commerce & Shopping',
  ENTERTAINMENT = 'Entertainment & Media',
  DEV_TOOLS = 'Developer Tools',
  LIBRARY_MGMT = 'Library & Book Management',
  TASK_MGMT = 'Task & Project Management',
  ADVANCED_CALC = 'Advanced Calculators',
}

/**
 * Фабричная функция для создания проекта
 */
export function createProject(
  title: string,
  description: string,
  slug: string,
  level: ProjectLevel,
  category?: ProjectCategory
): ProjectInfo {
  return {
    title,
    description,
    href: `${PROJECT_PATHS[level]}/${slug}`,
    level,
  };
}

/**
 * Фабричная функция для создания группы проектов
 */
export function createProjectGroup(
  level: ProjectLevel,
  category: ProjectCategory,
  projects: Array<{
    title: string;
    description: string;
    slug: string;
  }>
): Record<string, ProjectInfo> {
  return projects.reduce((acc, project) => {
    const key = project.slug.replace(/-/g, '').replace(/\s+/g, '');
    acc[key] = createProject(
      project.title,
      project.description,
      project.slug,
      level,
      category
    );
    return acc;
  }, {} as Record<string, ProjectInfo>);
}

/**
 * Генератор описаний для стандартных типов проектов
 */
export const ProjectDescriptions = {
  counter: (type = 'simple') => `A ${type} and interactive counter application.`,
  calculator: (type = 'basic') => `A ${type} calculator app with modern interface.`,
  weather: (features = 'current weather conditions and forecasts') => 
    `A weather app that displays ${features}.`,
  game: (name: string, description: string) => 
    `Play the exciting ${name} game. ${description}`,
  tracker: (type: string, features = 'tracking and management') => 
    `Track your ${type} with ${features} features.`,
  explorer: (type: string, features = 'search and exploration') => 
    `Discover and explore ${type} with ${features} capabilities.`,
  generator: (type: string, features = 'customizable options') => 
    `Generate ${type} with ${features}.`,
  converter: (type: string, features = 'multiple units and formats') => 
    `Convert ${type} between ${features}.`,
};

/**
 * Валидация структуры проекта
 */
export function validateProject(project: ProjectInfo): boolean {
  return !!(
    project.title &&
    project.description &&
    project.href &&
    project.level &&
    Object.values(ProjectLevel).includes(project.level)
  );
}

/**
 * Фильтрация проектов по уровню
 */
export function filterProjectsByLevel(
  projects: Record<string, ProjectInfo>,
  level: ProjectLevel
): Record<string, ProjectInfo> {
  return Object.entries(projects).reduce((acc, [key, project]) => {
    if (project.level === level) {
      acc[key] = project;
    }
    return acc;
  }, {} as Record<string, ProjectInfo>);
}

/**
 * Получение проектов по категории
 */
export function getProjectsByCategory(
  projects: Record<string, ExtendedProjectInfo>,
  category: ProjectCategory
): Record<string, ExtendedProjectInfo> {
  return Object.entries(projects).reduce((acc, [key, project]) => {
    if ('category' in project && project.category === category) {
      acc[key] = project;
    }
    return acc;
  }, {} as Record<string, ExtendedProjectInfo>);
}

/**
 * Статистика проектов
 */
export function getProjectStats(projects: Record<string, ProjectInfo>) {
  const stats = {
    total: 0,
    byLevel: {
      [ProjectLevel.easy]: 0,
      [ProjectLevel.medium]: 0,
      [ProjectLevel.hard]: 0,
    },
    byCategory: {} as Record<string, number>,
  };

  Object.values(projects).forEach(project => {
    stats.total++;
    stats.byLevel[project.level]++;
    
    // Проверяем если проект имеет категорию (для расширенных проектов)
    const extendedProject = project as ExtendedProjectInfo;
    if (extendedProject.category) {
      stats.byCategory[extendedProject.category] = (stats.byCategory[extendedProject.category] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Поиск проектов по тексту
 */
export function searchProjects(
  projects: Record<string, ProjectInfo>,
  query: string
): Record<string, ProjectInfo> {
  const lowerQuery = query.toLowerCase();
  
  return Object.entries(projects).reduce((acc, [key, project]) => {
    const searchableText = `${project.title} ${project.description}`.toLowerCase();
    if (searchableText.includes(lowerQuery)) {
      acc[key] = project;
    }
    return acc;
  }, {} as Record<string, ProjectInfo>);
}

/**
 * Получение проектов с пагинацией
 */
export function paginateProjects(
  projects: Record<string, ProjectInfo>,
  page: number = 1,
  pageSize: number = 10
) {
  const entries = Object.entries(projects);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedEntries = entries.slice(startIndex, endIndex);
  const paginatedProjects = Object.fromEntries(paginatedEntries);
  
  return {
    projects: paginatedProjects,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: entries.length,
      totalPages: Math.ceil(entries.length / pageSize),
      hasNextPage: endIndex < entries.length,
      hasPrevPage: page > 1,
    }
  };
} 
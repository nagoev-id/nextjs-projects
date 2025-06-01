'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

/**
 * @interface ProjectCardProps
 * @description Интерфейс для пропсов компонента ProjectCard
 * @property {string} title - Заголовок проекта
 * @property {string} description - Описание проекта
 * @property {string} href - Ссылка на страницу проекта
 * @property {string} level - Уровень сложности проекта
 */
interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  level: string;
}

/**
 * @typedef {Object} LevelConfig
 * @property {string} label - Отображаемая метка уровня сложности
 * @property {string} className - CSS-классы для стилизации бейджа уровня сложности
 */

/**
 * @type {Object.<string, LevelConfig>}
 * @description Конфигурация стилей и меток для различных уровней сложности
 */
const levelConfig = {
  easy: {
    label: 'Easy',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800',
  },
  hard: {
    label: 'Hard',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800',
  },
};

/**
 * Компонент карточки проекта
 * 
 * @type {React.FC<ProjectCardProps>}
 * @param {ProjectCardProps} props - Пропсы компонента
 * @returns {JSX.Element} Отрендеренная карточка проекта
 *
 * @description
 * Этот компонент отображает карточку проекта с заголовком, описанием и бейджем уровня сложности.
 * Он использует компоненты из библиотеки Shadcn UI и Next.js Link для создания интерактивной карточки.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, href, level }) => {
  /**
   * Мемоизированные значения метки и класса для бейджа уровня сложности
   * @type {{label: string, className: string}}
   */
  const { label, className } = useMemo(() => {
    const normalizedLevel = level.toLowerCase();
    return levelConfig[normalizedLevel as keyof typeof levelConfig] || {
      label: level,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
  }, [level]);

  return (
    <Card className="transition-all duration-300 hover:shadow-md p-0 rounded-sm dark:bg-accent">
      <Link href={`/projects/${href}`} className="block">
        <CardHeader className="p-4">
          <Badge className={`max-w-max font-medium ${className}`}>
            {label}
          </Badge>
          <CardTitle className="mt-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default ProjectCard;
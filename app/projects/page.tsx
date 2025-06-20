'use client';
import { Footer, Header, Main, ProjectCard } from '@/components/layout';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { PROJECTS_LIST } from '@/shared';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * @typedef {'all' | 'level' | 'title' | 'description'} FilterProperty
 * @description Тип для свойств фильтрации проектов
 */
type FilterProperty = 'all' | 'level' | 'title' | 'description';

/**
 * @typedef {'all' | 'easy' | 'medium' | 'hard'} ProjectLevel
 * @description Тип для уровней сложности проектов
 */

type ProjectLevel = 'all' | 'easy' | 'medium' | 'hard'

/**
 * @typedef {Object} FilterProps
 * @property {string} text - Текст поиска
 * @property {FilterProperty} property - Свойство, по которому производится фильтрация
 * @property {ProjectLevel} level - Уровень сложности для фильтрации
 */
type FilterProps = {
  text: string;
  property: FilterProperty;
  level: ProjectLevel;
}

/**
 * @typedef {Object} LevelOption
 * @property {ProjectLevel} value - Значение уровня сложности
 * @property {string} label - Отображаемая метка уровня сложности
 */
type LevelOption = {
  value: ProjectLevel;
  label: string;
};

/**
 * @type {LevelOption[]}
 * @description Массив опций уровней сложности для выбора
 */
const levels: LevelOption[] = [
  { value: 'all', label: 'All levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

/**
 * Компонент домашней страницы
 *
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренная домашняя страница
 *
 * @description
 * Этот компонент отображает список проектов с возможностью фильтрации и поиска.
 * Он использует компоненты из библиотеки Shadcn UI для создания интерфейса фильтрации.
 */
const ProjectsPage = () => {
  /**
   * Состояние фильтра
   * @type {[FilterProps, React.Dispatch<React.SetStateAction<FilterProps>>]}
   */
  const [filter, setFilter] = useState<FilterProps>({
    text: '',
    property: 'all',
    level: 'all',
  });

  /**
   * Отфильтрованный список проектов
   * @type {[string, any][]}
   */
  const filteredProjects = useMemo(() => {
    return Object.entries(PROJECTS_LIST).filter(([_, project]) => {
      const searchText = filter.text.toLowerCase();
      const matchesLevel = filter.level === 'all' || project.level === filter.level;

      const matchesSearch =
        filter.property === 'all' ? (
          project.level.toLowerCase().includes(searchText) ||
          project.title.toLowerCase().includes(searchText) ||
          project.description.toLowerCase().includes(searchText)
        ) : (project[filter.property] as string).toLowerCase().includes(searchText);

      return matchesLevel && matchesSearch;
    });
  }, [filter]);

  /**
   * Обработчик изменения фильтра
   *
   * @type {(type: keyof FilterProps, value: string) => void}
   * @param {keyof FilterProps} type - Тип изменяемого свойства фильтра
   * @param {string} value - Новое значение свойства
   */
  const handleFilterChange = useCallback((type: keyof FilterProps, value: string) => {
    setFilter(prevState => ({ ...prevState, [type]: value }));
  }, []);


  return (
    <div className="flex flex-col text-foreground min-h-screen">
      <Header title='Projects List' showAbout={false} />
      <Main>
        {/* Компоненты фильтрации */}
        <div className="grid gap-3 mb-3 md:grid-cols-3">
          <Input
            placeholder="Search for projects..."
            value={filter.text}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange('text', e.target.value)}
            className="w-full"
          />
          <Select
            value={filter.property}
            onValueChange={(value: FilterProperty) => handleFilterChange('property', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              <SelectItem value="level">Level</SelectItem>
              <SelectItem value="title">Name</SelectItem>
              <SelectItem value="description">Description</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.level}
            onValueChange={(value: ProjectLevel) => handleFilterChange('level', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(({ label, value }) => (
                <SelectItem key={label} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Отображение отфильтрованных проектов */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredProjects.map(([key, project]) => (
              <ProjectCard
                key={key}
                title={project.title}
                description={project.description}
                href={project.href}
                level={project.level}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </Main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
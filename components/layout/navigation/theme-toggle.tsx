'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';

/**
 * @typedef {Object} ThemeOption
 * @property {string} value - Значение темы ('light', 'dark', 'system')
 * @property {string} label - Отображаемое название темы
 */

type ThemeOption = {
  value: 'light' | 'dark' | 'system';
  label: string;
}

/**
 * @type {ThemeOption[]}
 * @description Массив опций для выбора темы
 */
const options: ThemeOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/**
 * Компонент переключателя темы
 *
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренный компонент переключателя темы
 *
 * @description
 * Этот компонент создает выпадающее меню для переключения между светлой, темной и системной темами.
 * Он использует хук useTheme из библиотеки next-themes для управления темой приложения.
 */
const ThemeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(({ label, value }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
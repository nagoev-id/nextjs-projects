'use client';

import { JSX } from 'react';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

type Theme = {
  name: string;
  color: string;
}

const THEMES: Theme[] = [
  { name: 'cyan', color: 'bg-cyan-500' },
  { name: 'rose', color: 'bg-rose-500' },
  { name: 'amber', color: 'bg-amber-500' },
  { name: 'violet', color: 'bg-violet-500' },
  { name: 'emerald', color: 'bg-emerald-500' },
];

export const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps): JSX.Element => {
  return (
    <div className="flex space-x-2">
      {THEMES.map(theme => (
        <button
          key={theme.name}
          type="button"
          onClick={() => onThemeChange(theme.name)}
          className={`w-6 h-6 rounded-full ${theme.color} transition duration-200 ${selectedTheme === theme.name ? 'ring-2 ring-offset-2 ring-offset-gray-700 ring-white' : ''}`}
          aria-label={`Select ${theme.name} theme`}
        />
      ))}
    </div>
  );
};

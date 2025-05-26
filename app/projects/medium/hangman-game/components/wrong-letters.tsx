import { JSX } from 'react';
import { selectHangmanData } from '@/app/projects/medium/hangman-game/features';
import { useAppSelector } from '@/app/projects/medium/hangman-game/app';
import { Badge } from '@/components/ui';

/**
 * Компонент для отображения неправильно угаданных букв в игре Hangman
 *
 * Отображает все буквы, которые были введены пользователем, но отсутствуют в загаданном слове.
 * Каждая неправильная буква отображается в виде отдельного элемента с красным фоном.
 * Если неправильных букв нет, компонент не отображается.
 *
 * Визуально представляет пользователю информацию о его ошибках и помогает
 * отслеживать, какие буквы уже были использованы неудачно.
 *
 * @returns {JSX.Element | null} Компонент с отображением неправильных букв или null, если таких букв нет
 */
const WrongLetters = (): JSX.Element | null => {
  /**
   * Получение массива неправильно угаданных букв из Redux-хранилища
   */
  const { wrongLetters } = useAppSelector(selectHangmanData);

  /**
   * Если неправильных букв нет, не отображаем компонент
   */
  if (wrongLetters.length === 0) return null;

  return (
    <div className="grid gap-1 font-bold text-lg text-center uppercase dark:text-accent">
      <div className="flex gap-1 justify-center font-bold">
        {wrongLetters.map((letter, index) => (
          <Badge
            variant="destructive"
            key={index}
            className="h-[30px] w-[30px]"
            aria-label={`The wrong letter: ${letter}`}
          >
            {letter}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default WrongLetters;
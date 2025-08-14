import { selectHangmanData } from '@/app/projects/medium/hangman-game/features';
import { useAppSelector } from '@/app/projects/medium/hangman-game/app';
import { JSX, useCallback } from 'react';
import { Badge } from '@/components/ui';

/**
 * Компонент для отображения загаданного слова в игре Hangman
 *
 * Отображает каждую букву загаданного слова в виде отдельного элемента.
 * Буквы, которые уже были угаданы пользователем, отображаются открыто.
 * Неугаданные буквы отображаются как пустые ячейки.
 *
 * @returns {JSX.Element | null} Компонент с отображением загаданного слова или null, если слово не загружено
 */
const Word = (): JSX.Element | null => {
  /**
   * Получение загаданного слова и массива правильно угаданных букв из Redux-хранилища
   */
  const { word, correctLetters } = useAppSelector(selectHangmanData);

  /**
   * Проверяет, должна ли буква быть отображена (угадана пользователем)
   *
   * @param {string} letter - Проверяемая буква
   * @returns {string} Буква, если она угадана, или пустая строка, если не угадана
   */
  const isLetterRevealed = useCallback((letter: string): string => {
    return correctLetters.includes(letter) ? letter : '';
  }, [correctLetters]);

  /**
   * Если слово еще не загружено, не отображаем компонент
   */
  if (!word) return null;

  return (
    <div className="inline-flex justify-center gap-1 font-bold text-lg uppercase">
      {word.split('').map((letter, index) => (
        <Badge
          key={`${letter}-${index}`}
          variant="outline"
          className="h-[30px] w-[30px] border-2 border-black dark:border-white"
          aria-label={`Буква ${index + 1} из ${word.length}`}
        >
          {isLetterRevealed(letter)}
        </Badge>
      ))}
    </div>
  );
};

export default Word;
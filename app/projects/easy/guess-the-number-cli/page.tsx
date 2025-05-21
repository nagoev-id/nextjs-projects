'use client';

import { useCallback, useRef, useState } from 'react';
import { HELPERS } from '@/shared';
import { toast } from 'sonner';

type Guess = {
  number: number;
  message: string;
  isGuessed: boolean;
}

const GuessTheNumberCLIPage = () => {
  const [userGuess, setUserGuess] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [secretNumber] = useState<number>(() => HELPERS.getRandomNumber(1, 100));
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputType = inputRef.current?.type;
    const inputValue = inputRef.current?.value.trim() ?? '';

    if (inputValue.length === 0 && inputType === 'text' && !userGuess) {
      toast('Please enter a valid input', {
        richColors: true,
      });
      return;
    }

    if (inputType === 'text' && userGuess === null) {
      setUserGuess(inputValue);
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      return;
    }

    const value = Number(inputValue);

    if (userGuess && (!Number.isFinite(value) || value < 0 || value > 100)) {
      toast('Please enter a valid number between 0 and 100', {
        richColors: true,
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    if (inputType === 'number' && userGuess) {
      setGuesses(prevState => {
        const message = value > secretNumber
          ? 'Too high. Try again 😸'
          : value < secretNumber
            ? 'Too low. Try again 😸'
            : `🎊 Right. The number you've guessed: ${value}`;
        const isGuessed = value === secretNumber;
        if (isGuessed) {
          setIsFinished(true);
          HELPERS.showConfetti();
        }
        return [...prevState, { number: value, message, isGuessed }];
      });
    }

    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [secretNumber, userGuess]);
  
  return (
    <div className="grid gap-3 p-4 text-yellow-400 xl:text-2xl bg-neutral-700 rounded-md dark:bg-black">
      <h1 className="text-2xl font-bold md:text-3xl">🎲 Guess number</h1>
      {userGuess !== null && (
        <p>😄 <span className="font-bold uppercase">{userGuess}</span>, there is a number between <span
          className="font-bold">0</span> and <span className="font-bold">100</span>. Try to
          guess it in the
          fewest number of tries. After each attempt, there will be a message with the text - <span
            className="font-bold uppercase">low</span> or <span className="font-bold uppercase">high</span>
        </p>
      )}

      {guesses.length !== 0 && (
        <ul className="grid gap-3">
          {guesses.map(({ number, message, isGuessed }, idx) => (
            <li className="grid gap-2" key={idx}>
              <p className="text-2xl font-medium">➡️ {number}</p>
              <p>{message}</p>
              {isGuessed && <p>🎉 Number of attempts: <span className="font-bold">{guesses.length}</span></p>}
            </li>
          ))}
        </ul>
      )}
      {!isFinished && (
        <form onSubmit={handleFormSubmit}>
          <label>
            <input
              className="border-b-2 border-yellow-400 bg-transparent px-3 py-2.5 outline-none"
              type={!userGuess ? 'text' : 'number'}
              name={!userGuess ? 'name' : 'guess'}
              placeholder={!userGuess ? '👋 Enter your name' : 'Enter number'}
              ref={inputRef}
              autoFocus
            />
          </label>
        </form>
      )}
    </div>
  );
};

export default GuessTheNumberCLIPage;
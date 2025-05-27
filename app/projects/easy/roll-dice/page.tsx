'use client';

import { Card } from '@/components/ui/card';
import { JSX, useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MdInfo } from 'react-icons/md';
import Image from 'next/image';
import dice1 from './assets/dice-1.png';
import dice2 from './assets/dice-2.png';
import dice3 from './assets/dice-3.png';
import dice4 from './assets/dice-4.png';
import dice5 from './assets/dice-5.png';
import dice6 from './assets/dice-6.png';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HELPERS } from '@/shared';

/**
 * Игра "Бросок кубика"
 *
 * Двухигровая игра, где цель - первым набрать 100 очков.
 * Игроки по очереди бросают кубик и накапливают очки.
 * Если выпадает 1, текущие очки сгорают и ход переходит к другому игроку.
 * Игрок может "сохранить" накопленные очки, добавив их к общему счету.
 */

const WINNING_SCORE = 100;
const INITIAL_SCORES: [number, number] = [0, 0];
const PLAYERS: [0, 1] = [0, 1];
const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

type GameState = {
  scores: [number, number];
  currentScore: number;
  activePlayer: 0 | 1;
  isPlaying: boolean;
  diceValue: number | null;
}

/**
 * Компонент диалога с правилами игры
 */
const GameRulesDialog = (): JSX.Element => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full" variant="outline">About <MdInfo size={25} className="text-blue-500" /></Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>About Roll Dice</DialogTitle>
        <div>
          <p>Roll Dice is a two-player game where the goal is to reach 100 points first. Here are the rules:</p>

          <p>1. Players take turns rolling a single die as many times as they wish.</p>
          <p>2. Each roll is added to the player's ROUND score.</p>
          <p>3. If a player rolls a 1, their ROUND score becomes zero, and it's the next player's turn.</p>
          <p>
            4. A player can choose to 'Hold', which adds their ROUND score to their TOTAL score. Then it's the
            next player's turn.
          </p>
          <p>5. The first player to reach 100 points on their TOTAL score wins the game.</p>

          <p>
            <span className="font-bold">Strategy is key:</span> decide when to keep rolling for a higher score and when
            to play it safe and hold.
            Good luck!
          </p>
        </div>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/**
 * Основной компонент игры
 */
const RollDicePage = (): JSX.Element => {
  // Состояние игры
  const [gameState, setGameState] = useState<GameState>({
    scores: INITIAL_SCORES,
    currentScore: 0,
    activePlayer: 0 as 0 | 1,
    isPlaying: true,
    diceValue: null as number | null,
  });

  /**
   * Возвращает стили для контейнера игрока
   * @param player - Индекс игрока (0 или 1)
   */
  const getPlayerContainerStyle = useCallback((player: 0 | 1): string => `
    min-h-[300px] border-4 rounded-md p-4 flex flex-col text-center transition-all
    ${gameState.activePlayer === player ? 'border-red-500' : ''}
    ${!gameState.isPlaying && gameState.activePlayer === player ? 'border-green-500' : ''}
  `, [gameState.activePlayer, gameState.isPlaying]);

  /**
   * Возвращает стили для блока текущего счета
   * @param player - Индекс игрока (0 или 1)
   */
  const getCurrentScoreStyle = useCallback((player: 0 | 1): string => `
    border-4 rounded-md grid place-items-center transition-all p-3
    ${gameState.activePlayer === player ? 'border-red-500' : ''}
    ${!gameState.isPlaying && gameState.activePlayer === player ? 'border-green-500' : ''}
  `, [gameState.activePlayer, gameState.isPlaying]);

  /**
   * Инициализирует новую игру
   */
  const initGame = useCallback((): void => {
    setGameState({
      scores: INITIAL_SCORES,
      currentScore: 0,
      activePlayer: 0,
      isPlaying: true,
      diceValue: null,
    });
  }, []);

  /**
   * Обрабатывает бросок кубика
   */
  const handleRollDiceClick = useCallback((): void => {
    if (!gameState.isPlaying) return;

    const dice = HELPERS.getRandomNumber(1, 6);
    setGameState(prev => ({
      ...prev,
      diceValue: dice - 1, // Индекс массива изображений (0-5)
      currentScore: dice !== 1 ? prev.currentScore + dice : 0,
      activePlayer: dice !== 1 ? prev.activePlayer : (prev.activePlayer === 0 ? 1 : 0),
    }));
  }, [gameState.isPlaying]);

  /**
   * Обрабатывает сохранение текущих очков
   */
  const handleHoldClick = useCallback((): void => {
    if (!gameState.isPlaying) return;

    setGameState(prev => {
      const newScores: [number, number] = [prev.scores[0], prev.scores[1]];
      newScores[prev.activePlayer] += prev.currentScore;
      const isGameOver = newScores[prev.activePlayer] >= WINNING_SCORE;

      // Если игра окончена, оставляем активным текущего игрока (победителя)
      const newActivePlayer = isGameOver ? prev.activePlayer : (prev.activePlayer === 0 ? 1 : 0);

      return {
        ...prev,
        scores: newScores,
        currentScore: 0,
        activePlayer: newActivePlayer,
        isPlaying: !isGameOver,
      };
    });
  }, [gameState.isPlaying]);

  // Мемоизированное изображение кубика для предотвращения ненужных ререндеров
  const diceImage = useMemo(() => {
    if (gameState.diceValue === null) return null;

    return (
      <Image
        width={100}
        height={100}
        alt={`Dice showing ${gameState.diceValue + 1}`}
        className="border-4 rounded-md max-w-sm mx-auto w-full"
        src={diceImages[gameState.diceValue]}
        priority
      />
    );
  }, [gameState.diceValue]);

  return (
    <Card className="grid gap-4 w-full mx-auto max-w-4xl p-4 sm:grid-cols-3">
      {PLAYERS.map(player => (
        <div key={player} className={getPlayerContainerStyle(player)}>
          <h3 className="font-bold text-2xl uppercase mb-2">Player {player + 1}</h3>
          <p className="font-bold text-4xl mb-auto">{gameState.scores[player]}</p>
          <div className={getCurrentScoreStyle(player)}>
            <p className="font-bold uppercase">Current</p>
            <p className="font-bold text-4xl">{gameState.activePlayer === player ? gameState.currentScore : 0}</p>
          </div>
        </div>
      ))}
      <div className="grid place-items-start gap-2 sm:col-start-2 sm:col-end-3 sm:row-start-1 sm:row-end-2">
        {diceImage}
        <div className="grid gap-2 place-items-baseline w-full mt-auto">
          <Button
            className="w-full"
            onClick={initGame}
            aria-label="Start a new game"
          >
            New game
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleRollDiceClick}
            disabled={!gameState.isPlaying}
            aria-label="Roll the dice"
          >
            Roll dice
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleHoldClick}
            disabled={!gameState.isPlaying || gameState.currentScore === 0}
            aria-label="Hold current score"
          >
            Hold
          </Button>
          <GameRulesDialog />
        </div>
      </div>
    </Card>
  );
};

export default RollDicePage;
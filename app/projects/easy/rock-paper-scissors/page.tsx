'use client';

/**
 * # Игра "Камень, ножницы, бумага"
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация игры**:
 *    - Игра начинается с начального состояния: счет 0:0, сообщение приветствия
 *    - Максимальное количество попыток установлено на 3 (первый, кто наберет 3 очка, побеждает)
 *    - Пользователю предлагается сделать выбор между камнем, ножницами и бумагой
 *
 * 2. **Игровой процесс**:
 *    - Пользователь выбирает один из трех вариантов (камень, ножницы, бумага)
 *    - Компьютер случайным образом выбирает свой вариант
 *    - Определяется результат раунда по классическим правилам:
 *      - Камень побеждает ножницы
 *      - Ножницы побеждают бумагу
 *      - Бумага побеждает камень
 *      - При одинаковом выборе - ничья (оба получают по очку)
 *    - Обновляется счет и отображается сообщение о результате раунда
 *
 * 3. **Завершение игры**:
 *    - Игра завершается, когда один из игроков (или оба при ничьей) набирает 3 очка
 *    - В зависимости от результата отображается соответствующее сообщение:
 *      - Победа пользователя: "You won the game! 🏆" (с эффектом конфетти)
 *      - Победа компьютера: "You lost the game! 🤡"
 *      - Ничья: "It's a draw! 🤝"
 *    - Пользователю предлагается кнопка для повторной игры
 *
 * 4. **Управление состоянием**:
 *    - Все состояние игры хранится в едином объекте state
 *    - Используются мемоизированные функции для предотвращения лишних перерендеров
 *    - Эффект useEffect отслеживает изменения счета и проверяет условия завершения игры
 *
 * 5. **Доступность и UX**:
 *    - Интерфейс оптимизирован для разных размеров экрана
 *    - Добавлены ARIA-атрибуты для улучшения доступности
 *    - Анимации и визуальные эффекты улучшают пользовательский опыт
 */

import { useCallback, useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { LiaHandPaper, LiaHandRock, LiaHandScissors } from 'react-icons/lia';
import { HELPERS } from '@/shared';

/**
 * Возможные варианты выбора в игре
 * @typedef {'rock' | 'paper' | 'scissors'} Choice
 */
type Choice = 'rock' | 'paper' | 'scissors';

/**
 * Возможные результаты раунда
 * @typedef {'win' | 'lose' | 'draw'} Result
 */
type Result = 'win' | 'lose' | 'draw';

/**
 * Типы завершения игры
 * @typedef {'success' | 'loading' | 'error'} GameEndType
 * success - победа пользователя
 * loading - ничья
 * error - победа компьютера
 */
type GameEndType = 'success' | 'loading' | 'error';

/**
 * Доступные варианты выбора в игре
 * @constant {Choice[]}
 */
const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

/**
 * Отображаемые названия вариантов выбора
 * @constant {Record<Choice, string>}
 */
const CHOICES_DISPLAY: Record<Choice, string> = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };

/**
 * Текстовые описания результатов для отображения
 * @constant {Record<Result, string>}
 */
const RESULT_TEXT: Record<Result, string> = { win: 'beats', lose: 'loses to', draw: 'equals' };

/**
 * Максимальное количество очков для победы
 * @constant {number}
 */
const MAX_ATTEMPTS = 3;

/**
 * Интерфейс состояния игры
 * @interface GameState
 * @property {string} message - Текущее сообщение для отображения
 * @property {number} maxAttempts - Максимальное количество очков для победы
 * @property {Object} score - Текущий счет игры
 * @property {number} score.user - Очки пользователя
 * @property {number} score.computer - Очки компьютера
 * @property {boolean} isFinished - Флаг завершения игры
 */
type GameState = {
  message: string;
  maxAttempts: number;
  score: { user: number; computer: number };
  isFinished: boolean;
}

/**
 * Начальное состояние игры
 * @constant {GameState}
 */
const DEFAULT_GAME_STATE: GameState = {
  message: 'Get Started, Let\'s Rock!',
  maxAttempts: MAX_ATTEMPTS,
  score: { user: 0, computer: 0 },
  isFinished: false,
};

/**
 * Компонент игры "Камень, ножницы, бумага"
 * Позволяет пользователю играть против компьютера по классическим правилам
 *
 * @returns {JSX.Element} Компонент игры
 */
const RockPaperScissorsPage = () => {
  /**
   * Состояние игры
   * @type {[GameState, React.Dispatch<React.SetStateAction<GameState>>]}
   */
  const [game, setGame] = useState<GameState>(DEFAULT_GAME_STATE);

  /**
   * Определяет результат раунда на основе выборов игрока и компьютера
   *
   * @param {Choice} user - Выбор пользователя
   * @param {Choice} computer - Выбор компьютера
   * @returns {Result} Результат раунда (win, lose или draw)
   */
  const getResult = useCallback((user: Choice, computer: Choice): Result => {
    // Если выборы одинаковые - ничья
    if (user === computer) return 'draw';

    // Таблица выигрышных комбинаций: ключ побеждает значение
    const winConditions: Record<Choice, Choice> = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };

    // Если выбор пользователя побеждает выбор компьютера - победа, иначе - поражение
    return winConditions[user] === computer ? 'win' : 'lose';
  }, []);

  /**
   * Обновляет сообщение о результате раунда
   *
   * @param {Choice} userChoice - Выбор пользователя
   * @param {Choice} computerChoice - Выбор компьютера
   * @param {Result} result - Результат раунда
   */
  const showMessage = useCallback((userChoice: Choice, computerChoice: Choice, result: Result): void => {
    // Формируем сообщение о результате раунда
    const message = `
      ${CHOICES_DISPLAY[userChoice]} <span class="text-sm">(user)</span> 
      ${RESULT_TEXT[result].toUpperCase()} 
      ${CHOICES_DISPLAY[computerChoice]} <span class="text-sm">(comp)</span>.
    `;
    // Обновляем состояние с новым сообщением
    setGame(prevGame => ({ ...prevGame, message: message.trim() }));
  }, []);

  /**
   * Обрабатывает результат раунда и обновляет счет
   *
   * @param {Choice} userChoice - Выбор пользователя
   * @param {Choice} computerChoice - Выбор компьютера
   * @param {Result} result - Результат раунда
   */
  const showResult = useCallback((userChoice: Choice, computerChoice: Choice, result: Result): void => {
    // Обновляем счет в зависимости от результата
    setGame(prevState => {
      // Создаем новый объект score для иммутабельного обновления
      const newScore = {
        user: prevState.score.user,
        computer: prevState.score.computer,
      };

      // Обновляем счет в зависимости от результата
      if (result === 'draw') {
        // При ничьей оба получают по очку
        newScore.user += 1;
        newScore.computer += 1;
      } else if (result === 'win') {
        // При победе пользователя увеличиваем его счет
        newScore.user += 1;
      } else {
        // При поражении пользователя увеличиваем счет компьютера
        newScore.computer += 1;
      }

      return {
        ...prevState,
        score: newScore,
      };
    });

    // Отображаем сообщение о результате
    showMessage(userChoice, computerChoice, result);
  }, [showMessage]);

  /**
   * Обработчик клика по опции (камень/ножницы/бумага)
   *
   * @param {Choice} choice - Выбор пользователя
   */
  const handleOptionClick = useCallback((choice: Choice) => {
    // Генерируем случайный выбор компьютера
    const computerChoice = CHOICES[HELPERS.getRandomNumber(0, CHOICES.length - 1)];

    // Определяем результат и обновляем состояние
    showResult(choice, computerChoice, getResult(choice, computerChoice));
  }, [getResult, showResult]);

  /**
   * Обработчик сброса игры
   * Возвращает игру к начальному состоянию
   */
  const handleResetGameClick = useCallback(() => {
    setGame(DEFAULT_GAME_STATE);
  }, []);

  /**
   * Завершает игру с определенным результатом
   *
   * @param {GameEndType} typeEnd - Тип завершения игры
   */
  const finishGame = useCallback((typeEnd: GameEndType): void => {
    // Обновляем состояние за один вызов setGame вместо двух
    setGame(prevGame => {
      const messages: Record<GameEndType, string> = {
        success: 'You won the game! 🏆',
        loading: 'It\'s a draw! 🤝',
        error: 'You lost the game! 🤡',
      };

      // Если победа, показываем конфетти
      if (typeEnd === 'success') {
        HELPERS.showConfetti();
      }

      return {
        ...prevGame,
        isFinished: true,
        message: messages[typeEnd] || 'Game over!',
      };
    });
  }, []);

  /**
   * Эффект для проверки условий завершения игры
   */
  useEffect(() => {
    const { user, computer } = game.score;
    const { maxAttempts } = game;

    // Проверяем условия завершения только если игра еще не завершена
    if (!game.isFinished) {
      if (user === maxAttempts && computer < maxAttempts) {
        finishGame('success');
      } else if (computer === maxAttempts && user < maxAttempts) {
        finishGame('error');
      } else if (user === maxAttempts && computer === maxAttempts) {
        finishGame('loading');
      }
    }
  }, [game.score, game.maxAttempts, game.isFinished, finishGame]);

  // Иконки для выбора
  const choiceIcons = {
    rock: <LiaHandRock size={50} aria-hidden="true" />,
    paper: <LiaHandPaper size={50} aria-hidden="true" />,
    scissors: <LiaHandScissors size={50} aria-hidden="true" />,
  };

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded gap-3">
      <div
        className="border-4 border-black dark:border-white relative font-bold text-6xl md:text-8xl flex justify-center items-center p-10 bg-white dark:bg-gray-800 text-black dark:text-white"
        role="region"
        aria-label="Game score"
      >
        <span className="absolute top-1/2 -translate-y-1/2 text-sm left-0 p-2 bg-red-400 text-white">user</span>
        <span className="absolute top-1/2 -translate-y-1/2 text-sm right-0 p-2 bg-red-400 text-white">computer</span>
        <span>{game.score.user}</span>:
        <span>{game.score.computer}</span>
      </div>

      {/* Сообщение о результате */}
      <div
        className="text-center font-medium text-xl"
        dangerouslySetInnerHTML={{ __html: game.message }}
        aria-live="polite"
      />

      {/* Кнопки выбора */}
      {!game.isFinished && (
        <ul
          className="options grid gap-4 grid-cols-3 justify-items-center max-w-md mx-auto"
          role="group"
          aria-label="Game options"
        >
          {CHOICES.map((choice) => (
            <li key={choice}>
              <button
                className="border-4 border-black w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] p-2 rounded-full active:scale-95 transition active:border-red-400 dark:border-gray-500"
                onClick={() => handleOptionClick(choice)}
                aria-label={CHOICES_DISPLAY[choice]}
              >
                <div className="pointer-events-none flex justify-center">
                  {choiceIcons[choice]}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!game.isFinished && <p className="text-center font-medium">Make your move.</p>}

      {game.isFinished && (
        <Button variant="destructive" onClick={handleResetGameClick} aria-label="Start a new game">
          Repeat Game
        </Button>
      )}
    </Card>
  );
};

export default RockPaperScissorsPage;
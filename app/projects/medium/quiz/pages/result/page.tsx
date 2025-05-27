'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { JSX, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/quiz/app';
import { resetQuiz, selectQuizData } from '@/app/projects/medium/quiz/features';

/**
 * @typedef {Object} QuizData
 * @property {number} score - Текущий счет пользователя
 * @property {Array<Object>} questions - Массив вопросов квиза
 * @property {Object} settings - Настройки квиза
 */

/**
 * Компонент страницы результатов квиза
 * @type {React.FC}
 * @returns {JSX.Element} Элемент страницы результатов
 */
const ResultPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { score, questions, settings } = useAppSelector(selectQuizData);
  console.log(settings);
  /**
   * Общее количество вопросов в квизе
   * @type {number}
   */
  const totalQuestions = useMemo(() => questions.length, [questions]);

  /**
   * Процент правильных ответов
   * @type {number}
   */
  const scorePercentage = useMemo(() =>
      Math.round((score / totalQuestions) * 100) || 0,
    [score, totalQuestions],
  );

  /**
   * Сообщение с обратной связью на основе результата
   * @type {string}
   */
  const feedbackMessage = useMemo(() => {
    if (scorePercentage >= 80) return 'Excellent! You\'re a quiz master! 🏆';
    if (scorePercentage >= 60) return 'Great job! Well done! 👏';
    if (scorePercentage >= 40) return 'Good effort! Keep practicing! 👍';
    return 'Keep learning and try again! 📚';
  }, [scorePercentage]);

  /**
   * Обработчик для начала новой игры
   * @type {() => void}
   */
  const handleStartNewGame = useCallback(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  return (
    <Card className="max-w-md w-full mx-auto p-6 rounded">
      <div className="grid gap-4 place-items-center">
        <h2 className="text-2xl font-bold">Quiz is completed 🎉</h2>

        <div className="text-center space-y-2 w-full">
          <p className="text-lg">
            Your account: <span className="font-bold">{score}</span> / {totalQuestions}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                scorePercentage >= 70 ? 'bg-green-500' :
                  scorePercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>

          <p className="font-medium text-lg">{scorePercentage}%</p>
        </div>

        <p className="text-center mt-2">{feedbackMessage}</p>

        <Link href="/projects/medium/quiz" className="w-full">
          <Button
            onClick={handleStartNewGame}
            className="w-full mt-4"
          >
            Start a new game
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ResultPage;
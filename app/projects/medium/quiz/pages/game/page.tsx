'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/quiz/app';
import { incrementScore, nextQuestion, selectQuizData } from '@/app/projects/medium/quiz/features';
import { Label, RadioGroup, RadioGroupItem } from '@/components/ui';

/**
 * @typedef {Object} Question
 * @property {string} question - Текст вопроса
 * @property {string} correct_answer - Правильный ответ
 * @property {string[]} incorrect_answers - Массив неправильных ответов
 */
type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * @typedef {Object} AnswerState
 * @property {string} selected - Выбранный ответ
 * @property {boolean} answered - Флаг, указывающий, был ли дан ответ
 */
type AnswerState = {
  selected: string;
  answered: boolean;
}

/**
 * Компонент страницы игры в квиз
 * @type {React.FC}
 * @returns {JSX.Element|null} Элемент страницы игры или null, если нет вопросов
 */
const GamePage = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { questions, currentQuestionIndex, score, quizCompleted } = useAppSelector(selectQuizData);
  const router = useRouter();
  const [answer, setAnswer] = useState<AnswerState>({
    selected: '',
    answered: false,
  });

  useEffect(() => {
    if (questions.length === 0) {
      router.push('/projects/medium/quiz');
    }
    if (quizCompleted) {
      router.push('/projects/medium/quiz/pages/result');
    }
  }, [questions.length, router, quizCompleted]);

  // Возвращаем null, если нет вопросов
  if (questions.length === 0) {
    return null;
  }

  /**
   * Текущий вопрос
   * @type {Question}
   */
  const currentQuestion = useMemo(() =>
      questions[currentQuestionIndex] as Question,
    [questions, currentQuestionIndex],
  );

  /**
   * Правильный ответ на текущий вопрос
   * @type {string}
   */
  const correctAnswer = useMemo(() =>
      decodeURIComponent(currentQuestion.correct_answer),
    [currentQuestion],
  );

  /**
   * Все варианты ответов для текущего вопроса
   * @type {string[]}
   */
  const allAnswers = useMemo(() =>
      [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
        .sort()
        .map(answer => decodeURIComponent(answer)),
    [currentQuestion],
  );

  /**
   * Обработчик изменения выбранного ответа
   * @param {string} value - Выбранный ответ
   */
  const handleAnswerChange = useCallback((value: string) => {
    setAnswer(prevState => ({
      ...prevState,
      selected: value,
    }));
  }, []);

  /**
   * Обработчик отправки ответа
   */
  const handleSubmitAnswer = useCallback(() => {
    if (answer.selected === correctAnswer) {
      dispatch(incrementScore());
    }
    setAnswer(prevState => ({
      ...prevState,
      answered: true,
    }));
  }, [answer.selected, correctAnswer, dispatch]);

  /**
   * Обработчик перехода к следующему вопросу
   */
  const handleNextQuestion = useCallback(() => {
    setAnswer({ selected: '', answered: false });
    dispatch(nextQuestion());
  }, [dispatch]);

  /**
   * Получение цвета для ответа в зависимости от его статуса
   * @param {string} answerText - Текст ответа
   * @returns {string} CSS-класс для цвета ответа
   */
  const getAnswerColor = useCallback((answerText: string): string => {
    if (!answer.answered) return '';
    if (answerText === correctAnswer) return 'font-bold text-green-500';
    if (answerText === answer.selected) return 'font-bold text-red-500';
    return '';
  }, [answer.answered, answer.selected, correctAnswer]);

  /**
   * Процент правильных ответов
   * @type {number}
   */
  const scorePercentage = useMemo(() =>
      Math.round((score / questions.length) * 100),
    [score, questions.length],
  );

  return (
    <Card className="gap-2 max-w-2xl mx-auto w-full p-3  rounded-md">
      {!quizCompleted && (
        <>
          <h2 className="text-xl font-bold text-center">Question {currentQuestionIndex + 1} / {questions.length}</h2>
          <p className="text-center">{decodeURIComponent(currentQuestion.question)}</p>
          <RadioGroup
            value={answer.selected}
            onValueChange={handleAnswerChange}
            disabled={answer.answered}
            className="grid gap-3 my-3"
          >
            {allAnswers.map((answerOption, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  className="border-black dark:border-white"
                  value={answerOption}
                  id={`answer-${index}`}
                />
                <Label
                  htmlFor={`answer-${index}`}
                  className={getAnswerColor(answerOption)}
                >
                  {answerOption}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {answer.answered ? (
            <Button onClick={handleNextQuestion}>Next Question</Button>
          ) : (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!answer.selected}
            >
              Submit Answer
            </Button>
          )}
          <div className="text-center">
            Score: <span className="font-bold">{scorePercentage}%</span>
          </div>
        </>
      )}
    </Card>
  );
};

export default GamePage;
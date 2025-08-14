'use client';

/**
 * # Приложение для настройки и запуска квиза
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка:**
 *    - Компонент использует React с хуками состояния и эффектов.
 *    - Для управления формой используется react-hook-form с валидацией Zod.
 *    - Состояние приложения управляется через Redux (useAppDispatch).
 *    - Для навигации используется Next.js router.
 *
 * 2. **Структура данных:**
 *    - Определены типы Option и ConfigFeatures для структурирования опций квиза.
 *    - CONFIG_FEATURES содержит предопределенные опции для типа, сложности и категорий вопросов.
 *
 * 3. **Форма настройки квиза:**
 *    - Пользователь может выбрать количество вопросов, категорию, сложность и тип.
 *    - Форма использует кастомные компоненты FormInput и FormSelect.
 *    - Валидация формы осуществляется с помощью Zod схемы.
 *
 * 4. **Обработка отправки формы:**
 *    - При отправке формы данные фильтруются, удаляя неиспользуемые опции.
 *    - Выполняется асинхронный запрос к API для получения вопросов (handleGetQuestions).
 *    - В случае успеха, вопросы сохраняются в Redux store, и происходит переход на страницу игры.
 *    - При ошибке выводится уведомление пользователю.
 *
 * 5. **Управление состоянием:**
 *    - Успешно полученные вопросы сохраняются в Redux store (setQuestions).
 *    - Перед началом новой игры происходит сброс состояния квиза (resetQuiz).
 *
 * 6. **Навигация:**
 *    - После успешной настройки и получения вопросов, пользователь перенаправляется на страницу игры.
 *
 * 7. **Обработка ошибок:**
 *    - Ошибки при запросе данных обрабатываются, и пользователю выводится уведомление.
 *    - Используется библиотека toast для отображения уведомлений.
 *
 * 8. **Дизайн и UI:**
 *    - Используются компоненты UI из общей библиотеки (Card, Button, Form).
 *    - Форма стилизована с использованием классов для центрирования и отступов.
 *
 * Этот компонент служит отправной точкой для пользователя, позволяя настроить параметры квиза
 * перед началом игры, обеспечивая гибкость и удобство использования.
 */

import { JSX, useCallback } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { resetQuiz, setQuestions, useLazyGetQuestionsQuery } from '@/app/projects/medium/quiz/features';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/projects/medium/quiz/app';
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/layout';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, formSchema } from '@/app/projects/medium/quiz/utils';

/**
 * @typedef {Object} Option
 * @property {string} value - Значение опции
 * @property {string} label - Отображаемая метка опции
 */
type Option = {
  value: string;
  label: string;
}

/**
 * @typedef {Object} ConfigFeatures
 * @property {Option[]} type - Массив опций для типа вопросов
 * @property {Option[]} difficulty - Массив опций для сложности
 * @property {Option[]} categories - Массив опций для категорий
 */
type ConfigFeatures = {
  type: Option[];
  difficulty: Option[];
  categories: Option[];
}

/**
 * Конфигурация опций для настройки квиза
 * @type {ConfigFeatures}
 */
const CONFIG_FEATURES: ConfigFeatures = {
  type: [
    { value: 'any', label: 'Any Type' },
    { value: 'multiple', label: 'Multiple-choice' },
    { value: 'boolean', label: 'True/False' },
  ],
  difficulty: [
    { value: 'any', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ],
  categories: [
    { value: 'any', label: 'Any Category' },
    { value: '9', label: 'General Knowledge' },
    { value: '10', label: 'Entertainment: Books' },
    { value: '11', label: 'Entertainment: Film' },
    { value: '12', label: 'Entertainment: Music' },
    { value: '13', label: 'Entertainment: Musicals & Theatres' },
    { value: '14', label: 'Entertainment: Television' },
    { value: '15', label: 'Entertainment: Video Games' },
    { value: '16', label: 'Entertainment: Board Games' },
    { value: '17', label: 'Science & Nature' },
    { value: '18', label: 'Science: Computers' },
    { value: '19', label: 'Science: Mathematics' },
    { value: '20', label: 'Mythology' },
    { value: '21', label: 'Sports' },
    { value: '22', label: 'Geography' },
    { value: '23', label: 'History' },
    { value: '24', label: 'Politics' },
    { value: '25', label: 'Art' },
    { value: '26', label: 'Celebrities' },
    { value: '27', label: 'Animals' },
    { value: '28', label: 'Vehicles' },
    { value: '29', label: 'Entertainment: Comics' },
    { value: '30', label: 'Science: Gadgets' },
    { value: '31', label: 'Entertainment: Japanese Anime & Manga' },
    { value: '32', label: 'Entertainment: Cartoon & Animations' },
  ],
};
/**
 * Компонент страницы настройки квиза
 * @returns {JSX.Element} Элемент страницы настройки квиза
 */
const QuizPage = (): JSX.Element => {
  const [handleGetQuestions] = useLazyGetQuestionsQuery();
  const dispatch = useAppDispatch();
  const router = useRouter();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '10',
      category: 'any',
      difficulty: 'any',
      type: 'any',
    },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы
   * @param {FormSchema} values - Значения формы
   */
  const onSubmit = useCallback(async (values: FormSchema) => {
    const { amount, category, difficulty, type } = values;

    /**
     * Фильтрация значений формы для отправки на сервер
     * @type {FormSchema}
     */
    const filteredValues = Object.entries({ amount, category, difficulty, type })
      .reduce((acc, [key, value]) => {
        if (value !== 'any' && key !== 'amount') {
          (acc as any)[key] = value;
        } else if (key === 'amount') {
          acc.amount = value;
        }
        return acc;
      }, { amount: values.amount } as FormSchema);

    try {
      // @ts-expect-error - API response type needs to be properly typed
      const { data } = await handleGetQuestions(filteredValues);
      if (data) {
        // @ts-expect-error - Redux action payload type needs to be properly typed
        dispatch(setQuestions(data));
        dispatch(resetQuiz());
        router.push('/projects/medium/quiz/pages/game');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to configure quiz. Please try again.', { richColors: true });
    } finally {
      form.reset();
    }
  }, [dispatch, form, handleGetQuestions, router]);

  return (
    <Card className="max-w-xl mx-auto w-full p-2 gap-1">
      <p className="text-center font-bold text-xl">Configure Quiz</p>
      <p className="text-center">Set up all the fields and then start solving Quiz</p>

      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} name="amount" type="number" label="Amount" />
          <FormSelect
            form={form}
            name="category"
            placeholder="Category"
            label="Category"
            options={CONFIG_FEATURES.categories}
            selectProps={{
              className: 'w-full',
            }}
          />
          <FormSelect
            form={form}
            name="difficulty"
            placeholder="Difficulty"
            label="Difficulty"
            options={CONFIG_FEATURES.difficulty}
            selectProps={{
              className: 'w-full',
            }}
          />
          <FormSelect
            form={form}
            name="type"
            placeholder="Type"
            label="Type"
            options={CONFIG_FEATURES.type}
            selectProps={{
              className: 'w-full',
            }}
          />
          <Button type="submit">Start Quiz</Button>
        </form>
      </Form>
    </Card>
  );
};

export default QuizPage;
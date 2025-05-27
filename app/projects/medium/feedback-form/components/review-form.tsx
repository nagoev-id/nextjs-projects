'use client';

import { Button, Form } from '@/components/ui';
import { JSX, useCallback, useMemo } from 'react';
import { useCreateReviewMutation } from '@/app/projects/medium/feedback-form/features';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormSchema } from '@/app/projects/medium/feedback-form/utils';
import { FormInput, FormSelect } from '@/components/layout';
import { toast } from 'sonner';

/**
 * Компонент формы для создания отзыва.
 * Позволяет пользователям вводить текст отзыва и выбирать рейтинг.
 *
 * @returns {JSX.Element} Отрендеренная форма отзыва.
 */
const ReviewForm = (): JSX.Element => {
  const [handleCreateReview] = useCreateReviewMutation();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации.
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { review: '', rating: '10' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы.
   * Создает новый отзыв и обрабатывает результат операции.
   *
   * @param {FormSchema} values - Значения формы для отправки.
   */
  const onSubmit = useCallback(async (values: FormSchema) => {
    try {
      await handleCreateReview(values);
      toast.success('Feedback submitted successfully', { richColors: true });
      form.reset();
    } catch (error) {
      console.error('An error occurred:', error);
      toast('An error occurred while submitting the form. Please try again.', {
        richColors: true,
      });
    }
  }, [form, handleCreateReview]);

  /**
   * Обработчик сброса формы.
   * Сбрасывает все поля формы к их начальным значениям.
   */
  const handleReset = useCallback(() => form.reset(), [form]);

  /**
   * Мемоизированный массив опций для выбора рейтинга.
   */
  const ratingOptions = useMemo(() => [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Below Average' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Above Average' },
    { value: '5', label: '5 - Good' },
    { value: '6', label: '6 - Very Good' },
    { value: '7', label: '7 - Great' },
    { value: '8', label: '8 - Excellent' },
    { value: '9', label: '9 - Outstanding' },
    { value: '10', label: '10 - Perfect' },
  ], []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-md p-4">
        <FormInput
          form={form}
          type="textarea"
          label="Enter feedback description"
          name="review"
          placeholder="Write a review"
        />
        <FormSelect
          form={form}
          name="rating"
          placeholder="Select rating"
          label="Select feedback rating"
          selectProps={{
            className: 'w-full',
          }}
          options={ratingOptions}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="submit">Submit</Button>
          <Button variant="outline" type="button" onClick={handleReset}>Reset</Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
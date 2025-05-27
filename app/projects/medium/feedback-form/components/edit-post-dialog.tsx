'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaRegEdit } from 'react-icons/fa';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feedback, useUpdateReviewMutation } from '@/app/projects/medium/feedback-form/features';
import { formSchema, FormSchema } from '@/app/projects/medium/feedback-form/utils';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/components/layout';

/**
 * Интерфейс пропсов для компонента EditPostDialog.
 * @interface EditPostDialogProps
 * @property {Feedback} post - Объект отзыва для редактирования.
 * @property {boolean} isOpen - Флаг, указывающий, открыт ли диалог.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsOpen - Функция для изменения состояния открытия диалога.
 */
interface EditPostDialogProps {
  post: Feedback;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Компонент диалогового окна для редактирования отзыва.
 * @param {EditPostDialogProps} props - Пропсы компонента.
 * @returns {JSX.Element} Компонент EditPostDialog.
 */
const EditPostDialog = ({ post, isOpen, setIsOpen }: EditPostDialogProps) => {
  const [updatePost] = useUpdateReviewMutation();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации.
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: post.review,
      rating: post.rating,
    },
    mode: 'onChange',
  });

  /**
   * Эффект для сброса формы при открытии диалога.
   */
  useEffect(() => {
    if (isOpen) {
      form.reset({
        review: post.review,
        rating: post.rating,
      });
    }
  }, [isOpen, post.review, post.rating, form]);

  /**
   * Обработчик отправки формы редактирования.
   * @param {FormSchema} values - Значения формы.
   */
  const onEditSubmit = useCallback(async (values: FormSchema): Promise<void> => {
    try {
      await updatePost({ reviewId: post.id, updatedData: values }).unwrap();
      toast.success('Post updated successfully', { richColors: true });
      setIsOpen(false);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to update post', { richColors: true });
    }
  }, [updatePost, setIsOpen, post.id]);

  /**
   * Обработчик открытия диалога.
   */
  const handleOpenDialog = useCallback(() => setIsOpen(true), [setIsOpen]);

  /**
   * Мемоизированный массив опций рейтинга.
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpenDialog}>
          <FaRegEdit />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit feedback</DialogTitle>
          <DialogDescription>
            Make changes to your feedback here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
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
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
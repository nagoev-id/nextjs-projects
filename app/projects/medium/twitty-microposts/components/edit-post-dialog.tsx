'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Post, useUpdateMutation } from '@/app/projects/medium/twitty-microposts/features';
import { JSX, useCallback } from 'react';
import { FormInput } from '@/components/layout';
import { FormSchema, formSchema } from '@/app/projects/medium/twitty-microposts/utils';
import { toast } from 'sonner';

/**
 * Интерфейс для пропсов компонента EditPostDialog.
 * @interface
 */
interface EditPostDialog {
  /** Пост для редактирования */
  post: Post;
  /** Состояние открытия диалога */
  isOpen: boolean;
  /** Функция для изменения состояния открытия диалога */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Компонент диалогового окна для редактирования поста.
 * 
 * @type {React.FC<EditPostDialog>}
 * @param {Object} props - Пропсы компонента
 * @param {Post} props.post - Пост для редактирования
 * @param {boolean} props.isOpen - Состояние открытия диалога
 * @param {function} props.setIsOpen - Функция для изменения состояния открытия диалога
 * @returns {JSX.Element} Отрендеренный компонент диалогового окна
 */
const EditPostDialog = ({ post, isOpen, setIsOpen }: EditPostDialog): JSX.Element => {
  /** Хук для обновления поста */
  const [updatePost] = useUpdateMutation();

  /** Инициализация формы с использованием react-hook-form и zod для валидации */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
    },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы.
   * 
   * @param {FormSchema} values - Значения формы
   */
  const onSubmit = useCallback(async (values: FormSchema) => {
    try {
      const { data } = await updatePost({ id: post.id, ...values });
      if (data) {
        toast.success('Post updated successfully!', {
          richColors: true,
        });
        setIsOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while submitting the form. Please try again.', {
        richColors: true,
      });
    }
  }, [updatePost, post.id, setIsOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <FaRegEdit />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>
            Make changes to your post here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput form={form} name="title" label="Title" placeholder='Title' />
            <FormInput form={form} name="body" label="Body" placeholder='Body' type="textarea" />
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
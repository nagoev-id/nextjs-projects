'use client';

import { JSX, useCallback } from 'react';
import { useCreateMutation } from '@/app/projects/medium/twitty-microposts/features';
import { useForm } from 'react-hook-form';
import { formSchema, FormSchema } from '@/app/projects/medium/twitty-microposts/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Form } from '@/components/ui';
import { FormInput } from '@/components/layout';

/**
 * Компонент формы для создания нового поста.
 * 
 * @type {React.FC}
 * @returns {JSX.Element} Отрендеренная форма создания поста
 * 
 * @description
 * Этот компонент использует react-hook-form для управления формой,
 * zod для валидации данных и RTK Query для отправки мутации создания поста.
 */
const CreatePostForm = (): JSX.Element => {
  /** Хук для создания нового поста */
  const [createPost] = useCreateMutation();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации
   * @type {<FormSchema>}
   */
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
    },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы.
   * 
   * @type {(values: FormSchema) => Promise<void>}
   * @param {FormSchema} values - Значения формы
   */
  const onSubmit = useCallback(async (values: FormSchema) => {
    try {
      const { data } = await createPost(values);
      if (data) {
        toast.success('Post created successfully!', {
          richColors: true,
        });
        form.reset();
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while submitting the form. Please try again.', {
        richColors: true,
      });
    }
  }, [createPost, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput form={form} name="title" label="Post Title" placeholder="Hello World!" />
        <FormInput form={form} name="body" label="Post Description" type="textarea"
                   placeholder="Place for your description" />
        <div className="inline-flex gap-2">
          <Button type="submit">Submit</Button>
          <Button variant="destructive" type="reset" onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
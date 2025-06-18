'use client';

import { JSX, useCallback } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SCHEMA_LIST, ValidateSchema } from '@/app/projects/hard/pets-tinder/utils';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';
import { useResetPasswordMutation } from '@/app/projects/hard/pets-tinder/redux';
import { useRouter } from 'next/navigation';

const ResetPasswordPage = (): JSX.Element => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const form = useForm<ValidateSchema['RESET_PASSWORD']>({
    resolver: zodResolver(SCHEMA_LIST.RESET_PASSWORD),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (values: ValidateSchema['RESET_PASSWORD']) => {
    try {
      await resetPassword(values).unwrap();
      toast.success('Инструкции по сбросу пароля отправлены на вашу почту');
      router.push('/projects/hard/pets-tinder/pages/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Ошибка при сбросе пароля');
    }
  }, [resetPassword, router]);

  return (
    <Card className="p-4 max-w-md w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Сброс пароля</h2>
        <p className="text-muted-foreground">Введите ваш email для получения инструкций по сбросу пароля</p>
      </div>
      
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Введите ваш email"
            type="email"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Отправить инструкции для сброса'}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <p>Запомнили пароль? <a href="/projects/hard/pets-tinder/pages/login" className="underline hover:no-underline">Войти</a></p>
      </div>
    </Card>
  );
};

export default ResetPasswordPage;
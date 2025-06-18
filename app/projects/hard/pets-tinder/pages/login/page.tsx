'use client';

import { JSX, useCallback } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useSignInMutation } from '@/app/projects/hard/pets-tinder/redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SCHEMA_LIST, ValidateSchema } from '@/app/projects/hard/pets-tinder/utils';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui';

const LoginPage = (): JSX.Element => {
  const [signIn, { isLoading }] = useSignInMutation();
  const router = useRouter();

  const form = useForm<ValidateSchema['SIGN_IN']>({
    resolver: zodResolver(SCHEMA_LIST.SIGN_IN),
    defaultValues: {
      email: 'u@u.com',
      password: 'pass',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (values: ValidateSchema['SIGN_IN']) => {
    try {
      await signIn(values).unwrap();
      toast.success('Вход выполнен успешно');
      router.push('/projects/hard/pets-tinder');
    } catch (error) {
      console.error('Ошибка входа:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось войти');
    }
  }, [signIn, router]);

  return (
    <Card className="p-4 max-w-md w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Вход в аккаунт</h2>
        <p className="text-muted-foreground">Введите данные для входа в свой аккаунт</p>
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
          <FormInput
            form={form}
            name="password"
            label="Пароль"
            placeholder="Введите ваш пароль"
            type="password"
          />
          <div className="text-right">
            <Link 
              href="/projects/hard/pets-tinder/pages/reset-password" 
              className="text-sm text-primary hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <p>Нет аккаунта?{' '}
          <Link
            href="/projects/hard/pets-tinder/pages/register"
            className="underline hover:no-underline">
            Создать аккаунт
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;
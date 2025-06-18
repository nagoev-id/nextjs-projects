'use client';

import { JSX, useCallback } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SCHEMA_LIST, ValidateSchema } from '@/app/projects/hard/pets-tinder/utils';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignUpMutation } from '@/app/projects/hard/pets-tinder/redux';
import { Label } from '@/components/ui';

const RegisterPage = (): JSX.Element => {
  const [signUp, { isLoading }] = useSignUpMutation();
  const router = useRouter();

  const form = useForm<ValidateSchema['SIGN_UP']>({
    resolver: zodResolver(SCHEMA_LIST.SIGN_UP),
    defaultValues: {
      email: 'nagoevt@tutamail.com',
      password: 'Passw0rd!',
      confirmPassword: 'Passw0rd!',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (values: ValidateSchema['SIGN_UP']) => {
    try {
      await signUp(values).unwrap();
      toast.success('Аккаунт успешно создан! Пожалуйста, проверьте вашу почту для подтверждения аккаунта.');
      router.push('/projects/hard/pets-tinder');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось зарегистрироваться');
    }
  }, [signUp, router]);

  return (
    <Card className="p-4 max-w-md w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Регистрация</h2>
        <p className="text-muted-foreground">Создайте аккаунт, чтобы начать работу</p>
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
          <FormInput
            form={form}
            name="confirmPassword"
            label="Подтверждение пароля"
            placeholder="Подтвердите ваш пароль"
            type="password"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
      </Form>

              <div className="mt-4 text-center">
          <p>Уже есть аккаунт?{' '}
            <Link
              href="/projects/hard/pets-tinder/pages/login"
              className="underline hover:no-underline">
              Войти
            </Link>
          </p>
        </div>
    </Card>
  );
};

export default RegisterPage;
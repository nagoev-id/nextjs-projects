'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SCHEMA_LIST, supabase, ValidateSchema } from '@/app/projects/hard/pets-tinder/utils';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUpdatePasswordMutation } from '@/app/projects/hard/pets-tinder/redux/api/auth-api';

const UpdatePasswordPage = (): JSX.Element => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Use the reset password mutation
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  // Extract the access token from the URL hash on component mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const token = hash.split('access_token=')[1].split('&')[0];
      setAccessToken(token);

      // Set the session using the hash parameters
      const hashParams = new URLSearchParams(hash.substring(1));
      const session = {
        access_token: hashParams.get('access_token'),
        refresh_token: hashParams.get('refresh_token'),
        expires_in: parseInt(hashParams.get('expires_in') || '0'),
        token_type: hashParams.get('token_type'),
      };

      if (session.access_token) {
        // @ts-ignore
        supabase.auth.setSession(session);
      }
    } else {
      toast.error('Неверный или отсутствующий токен');
      setTimeout(() => {
        router.push('/projects/hard/pets-tinder/pages/login');
      }, 2000);
    }
  }, [router]);

  const form = useForm<ValidateSchema['UPDATE_PASSWORD']>({
    resolver: zodResolver(SCHEMA_LIST.UPDATE_PASSWORD),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async (values: ValidateSchema['UPDATE_PASSWORD']) => {
    if (!accessToken) {
      toast.error('Отсутствует access token');
      return;
    }

    try {
      await updatePassword({ password: values.password }).unwrap();
      toast.success('Пароль успешно обновлен');
      setTimeout(() => {
        router.push('/projects/hard/pets-tinder/pages/login');
      }, 2000);
    } catch (error) {
      console.error('Ошибка при обновлении пароля:', error);
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить пароль');
    }
  }, [accessToken, updatePassword, router]);

  return (
    <Card className="p-4 max-w-md w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Установка нового пароля</h2>
        <p className="text-muted-foreground">Введите новый пароль ниже</p>
      </div>

      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            form={form}
            name="password"
            label="Новый пароль"
            placeholder="Введите новый пароль"
            type="password"
          />
          <FormInput
            form={form}
            name="confirmPassword"
            label="Подтвердите пароль"
            placeholder="Подтвердите новый пароль"
            type="password"
          />
          <Button type="submit" disabled={isLoading || !accessToken}>
            {isLoading ? 'Обновление пароля...' : 'Обновить пароль'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UpdatePasswordPage;
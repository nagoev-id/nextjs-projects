'use client';

import React, { JSX, useEffect } from 'react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/app/projects/hard/pets-tinder/redux/api/users-api';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';
import { ErrorCard, LoadingCard } from '@/app/projects/hard/pets-tinder/components/ui';
import { SCHEMA_LIST, ValidateSchema } from '@/app/projects/hard/pets-tinder/utils';
import { FormInput } from '@/components/layout';


const ProfilePage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const userId = user?.id;
  
  const { data: userData, isLoading, error } = useGetUserByIdQuery(userId || '', { skip: !userId });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const form = useForm<ValidateSchema['PROFILE_USER_UPDATE']>({
    resolver: zodResolver(SCHEMA_LIST.PROFILE_USER_UPDATE),
    defaultValues: {
      username: '',
      full_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username,
        full_name: userData.full_name,
        phone: userData.phone || '',
      });
    }
  }, [userData, form]);

  const onSubmit = async (values: ValidateSchema['PROFILE_USER_UPDATE']) => {
    if (!userId) return;
    
    try {
      await updateUser({
        id: userId,
        username: values.username,
        full_name: values.full_name,
        phone: values.phone,
      }).unwrap();
      
      toast.success('Профиль успешно обновлен');
    } catch (err) {
      toast.error('Не удалось обновить профиль');
      console.error('Ошибка обновления:', err);
    }
  };

  if (isLoading) {
    return <LoadingCard message="Загрузка профиля..." />;
  }

  if (error) {
    return <ErrorCard message="Не удалось загрузить данные профиля" />;
  }

  if (!userData) {
    return <ErrorCard message="Данные профиля не найдены" />;
  }

  return (
    <Card className="p-4 gap-2">
      <CardHeader className='p-0'>
        <CardTitle>Ваш Профиль</CardTitle>
        <CardDescription>Просмотр и обновление информации вашего профиля</CardDescription>
      </CardHeader>
      
      <CardContent className='p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormInput
              form={form}
              name='username'
              label='Имя пользователя'
              placeholder='Введите имя пользователя'
            />

            <FormInput
              form={form}
              name='full_name'
              label='Полное Имя'
              placeholder='Введите ваше полное имя'
            />

            <FormInput
              form={form}
              name='phone'
              label='Номер телефона'
              placeholder='Введите ваш номер телефона'
              type='tel'
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Обновление...' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="p-0">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Детали аккаунта</div>
          <div className="text-sm text-muted-foreground">Электронная почта: {userData.email}</div>
          <div className="text-sm text-muted-foreground">Аккаунт создан: {new Date(userData.registration_date).toLocaleDateString()}</div>
          <div className="text-sm text-muted-foreground">Последний вход: {new Date(userData.last_login).toLocaleDateString()}</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfilePage;
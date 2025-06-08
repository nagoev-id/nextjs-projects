'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { signInFormSchema, signUpFormSchema } from '@/app/projects/hard/todo-list/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/layout';
import { useSignInMutation, useSignUpMutation } from '@/app/projects/hard/todo-list/redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * @interface AuthForm
 * @description Интерфейс для пропсов компонента формы аутентификации
 * @property {boolean} [isSignUp=false] - Флаг, указывающий, что форма должна отображаться в режиме регистрации
 */
interface AuthForm {
  isSignUp?: boolean;
}

/**
 * @typedef {Object} FormValues
 * @description Тип для значений формы аутентификации
 * @property {string} email - Email пользователя
 * @property {string} password - Пароль пользователя
 * @property {string} [confirmPassword] - Подтверждение пароля (только для регистрации)
 */
type FormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

/**
 * Компонент формы аутентификации
 *
 * @description Компонент, который отображает форму входа или регистрации пользователя.
 * Поддерживает переключение между режимами входа и регистрации, валидацию полей с помощью Zod,
 * и отправку данных через RTK Query.
 *
 * @param {AuthForm} props - Пропсы компонента
 * @param {boolean} [props.isSignUp=false] - Флаг для отображения формы в режиме регистрации
 * @returns {JSX.Element} Отрендеренный компонент формы аутентификации
 */
export const AuthForm = ({ isSignUp = false }: AuthForm): JSX.Element => {
  /**
   * Состояние для отслеживания текущего режима формы
   * true - вход, false - регистрация
   */
  const [isAuth, setIsAuth] = useState<boolean>(!isSignUp);

  /**
   * Хуки RTK Query для выполнения запросов аутентификации
   */
  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();

  /**
   * Хук для навигации после успешной аутентификации
   */
  const router = useRouter();

  /**
   * Инициализация формы с помощью react-hook-form и валидацией Zod
   * Схема валидации меняется в зависимости от текущего режима формы
   */
  const form = useForm<FormValues>({
    resolver: zodResolver(isAuth ? signInFormSchema : signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  /**
   * Сбрасывает форму при изменении режима аутентификации
   */
  useEffect(() => {
    form.reset();
  }, [isAuth, form]);

  /**
   * Переключает режим формы между входом и регистрацией
   * и сбрасывает значения полей формы
   */
  const toggleAuthMode = useCallback(() => {
    form.reset();
    setIsAuth(prev => !prev);
  }, [form]);

  /**
   * Обрабатывает отправку формы
   *
   * @param {FormValues} formValues - Значения полей формы
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async (formValues: FormValues) => {
    const { email, password } = formValues;
    try {
      if (isAuth) {
        await signIn({ email, password }).unwrap();
        toast.success('Signed in successfully');
        router.push('/projects/hard/todo-list/todos');
      } else {
        await signUp({ email, password }).unwrap();
        toast.success('Account created successfully! Please check your email to confirm your account.');
        setIsAuth(!isAuth);
      }
    } catch (error) {
      if (isAuth) {
        console.error('Sign in error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      } else {
        console.error('Sign up error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create account');
      }
    }
  }, [isAuth, signIn, signUp, router]);

  return (
    <Card className="p-4 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold">
          {isAuth ? 'Sign In' : 'Create an Account'}
        </h2>
        <p className="text-muted-foreground">
          {isAuth
            ? 'Enter your credentials to access your account'
            : 'Create an account to get started'}
        </p>
      </div>
      {/* Form */}
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email */}
          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
          />
          {/* Password */}
          <FormInput
            form={form}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
          {/* Confirm Password */}
          {!isAuth && (
            <FormInput
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
            />
          )}
          {/* Submit Button */}
          <Button type="submit" disabled={isAuth ? isSignInLoading : isSignUpLoading}>
            {isAuth
              ? (isSignInLoading ? 'Signing in...' : 'Sign In')
              : (isSignUpLoading ? 'Creating account...' : 'Sign Up')
            }
          </Button>
        </form>
      </Form>
      {/* Footer */}
      <div className="flex justify-center flex-wrap gap-1.5 text-center">
        <p>{isAuth ? 'Don\'t have an account?' : 'Already have an account?'}</p>
        <button
          type="button"
          onClick={toggleAuthMode}
          className="underline hover:no-underline cursor-pointer"
        >
          {isAuth ? 'Create an Account' : 'Sign In'}
        </button>
      </div>
    </Card>
  );
};
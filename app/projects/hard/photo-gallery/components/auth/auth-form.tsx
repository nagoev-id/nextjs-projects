'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import { useSignInMutation, useSignUpMutation } from '@/app/projects/hard/photo-gallery/redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CONFIG, SCHEMA_LIST } from '@/app/projects/hard/photo-gallery/utils';
import { toast } from 'sonner';
import { Button, Card, Form } from '@/components/ui';
import { FormInput } from '@/components/layout';

interface AuthForm {
  isSignUp?: boolean;
}

type FormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type FormField = {
  name: keyof FormValues;
  label: string;
  placeholder: string;
  type: 'email' | 'password';
  isAuth?: boolean;
};

const { FORM } = CONFIG.COMPONENTS.AUTH;

const AuthForm = ({ isSignUp = false }: AuthForm): JSX.Element => {
  const [isAuth, setIsAuth] = useState<boolean>(!isSignUp);
  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(isAuth ? SCHEMA_LIST.SIGN_IN : SCHEMA_LIST.SIGN_UP),
    defaultValues: {
      email: '',
      password: '',
      ...(isAuth ? {} : { confirmPassword: '' }),
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset();
  }, [isAuth, form]);

  const toggleAuthMode = useCallback(() => {
    form.reset();
    setIsAuth(prev => !prev);
  }, [form]);

  const onSubmit = useCallback(async (formValues: FormValues) => {
    const { email, password } = formValues;
    try {
      const result = isAuth
        ? await signIn({ email, password }).unwrap()
        : await signUp({ email, password }).unwrap();

      if (isAuth) {
        router.push('/projects/hard/photo-gallery');
      } else {
        setIsAuth(true);
      }
      toast.success(FORM.SUBMIT_SUCCESS(isAuth));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : FORM.SUBMIT_ERROR(isAuth);
      console.error(error);
      toast.error(errorMessage);
      return null;
    }
  }, [isAuth, signIn, signUp, router]);

  return (
    <div className="max-w-2xl w-full mx-auto">
      <Card className="p-4 w-full">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold">{FORM.LABELS.HEADER(isAuth)}</h2>
          <p className="text-muted-foreground">{FORM.LABELS.SUB_HEADER(isAuth)}</p>
        </div>
        {/* Form */}
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {FORM.LABELS.FIELDS.filter(field =>
              !field.isAuth || (!isAuth && field.isAuth),
            ).map((field, index) => {
              const typedField = field as FormField;
              return (
                <FormInput
                  key={`${typedField.name}-${index}`}
                  form={form}
                  name={typedField.name}
                  label={typedField.label}
                  placeholder={typedField.placeholder}
                  type={typedField.type}
                />
              );
            })}
            <Button type="submit" disabled={isAuth ? isSignInLoading : isSignUpLoading}>
              {FORM.LABELS.SUBMIT_BUTTON(isAuth)}
            </Button>
          </form>
        </Form>
        {/* Footer */}
        <div className="flex justify-center flex-wrap gap-1.5 text-center">
          <p>{FORM.LABELS.QUESTION(isAuth)}</p>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="underline hover:no-underline cursor-pointer"
          >
            {FORM.LABELS.LINK(isAuth)}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
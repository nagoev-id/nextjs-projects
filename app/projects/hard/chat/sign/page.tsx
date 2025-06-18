'use client';

import { JSX, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/chat/redux';
import { Spinner } from '@/components/ui';
import { AuthForm } from '@/app/projects/hard/chat/components';

const SignPage = (): JSX.Element => {
  const { user, isLoading } = useAppSelector(selectAuthData);
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/projects/hard/chat');
    }
  });

  return isLoading ? <Spinner /> : <AuthForm />;
};

export default SignPage;
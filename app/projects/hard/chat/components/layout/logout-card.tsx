'use client';

import { JSX } from 'react';
import { Button, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface LogoutCardProps {
  title?: string;
  message?: string;
  url?: string;
  pageTitle?: string;
}

const LogoutCard = ({ title, message, url, pageTitle }: LogoutCardProps): JSX.Element => {
  const router = useRouter();
  return (
    <Card className="p-4 grid gap-2 place-items-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{message}</p>
      <Button onClick={() => router.push(url || '/projects/hard/chat/sign')}>
        Go to {pageTitle || 'Login'}
      </Button>
    </Card>
  );
};

export default LogoutCard;
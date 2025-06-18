'use client';

import { JSX } from 'react';
import { Card, Spinner } from '@/components/ui';

interface LoadingCardProps {
  message?: string;
  children?: React.ReactNode;
}

export const LoadingCard = ({ message = 'Загрузка...', children }: LoadingCardProps): JSX.Element => {
  return (
    <Card className="grid place-items-center p-8">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
};
'use client';

import { JSX, ReactNode } from 'react';
import { Card, Spinner } from '@/components/ui';

interface LoadingCardProps {
  message?: string;
  children?: ReactNode;
}

export const LoadingCard = ({ message = 'Loading...' }: LoadingCardProps): JSX.Element => (
  <Card className="grid place-items-center p-8">
    <div className="flex flex-col items-center gap-4">
      <Spinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </Card>
);
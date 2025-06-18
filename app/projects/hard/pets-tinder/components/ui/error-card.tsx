'use client';

import { JSX, ReactNode } from 'react';
import { Card } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  message?: string;
  children?: ReactNode;
}

export const ErrorCard = ({ message = 'Ошибка загрузки данных. Пожалуйста, попробуйте снова.', children }: ErrorCardProps): JSX.Element => {
  return (
    <Card className="p-8 grid place-items-center gap-4">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm text-red-600">{message}</p>
        {children}
      </div>
    </Card>
  );
};
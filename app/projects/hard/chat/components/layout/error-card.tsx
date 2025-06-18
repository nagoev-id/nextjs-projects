'use client';

import { Card } from '@/components/ui';
import { ReactNode } from 'react';

interface ErrorCardProps {
  text?: string;
  children?: ReactNode;
}

const ErrorCard = ({ text, children }: ErrorCardProps) => {
  return (
    <Card className="p-4 grid place-items-center gap-2">
      <p className="text-red-600">{text || 'Error loading photos. Please try again.'}</p>
      {children}
    </Card>
  );
};

export default ErrorCard;
'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface ToplineProps {
  title?: string;
  hasButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const Topline = ({ title, buttonLink, hasButton, buttonText }: ToplineProps): JSX.Element => {
  return (
    <div className="grid gap-2 sm:flex sm:justify-between sm:items-center">
      <h2 className="text-lg font-bold">{title}</h2>
      {hasButton && buttonLink && (
        <Link href={buttonLink}>
          <Button className="cursor-pointer" size="sm">{buttonText}</Button>
        </Link>
      )}
    </div>
  );
};

export default Topline;
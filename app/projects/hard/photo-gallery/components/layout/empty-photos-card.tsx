'use client';

import { Button, Card } from '@/components/ui';
import Link from 'next/link';

interface EmptyPhotosProps {
  text?: string;
  hasButton?: boolean;
  buttonLink?: string;
  buttonText?: string;
}

const EmptyPhotos = ({ text, hasButton, buttonLink, buttonText }: EmptyPhotosProps) => {
  return (
    <Card className="p-4 grid place-items-center gap-2">
      <p>{text || 'No photos available yet.'}</p>
      {hasButton && buttonLink && buttonText && (
        <Link href={buttonLink || '/projects/hard/photo-gallery/photos/new'}>
          <Button size="sm">{buttonText}</Button>
        </Link>
      )}
    </Card>
  );
};

export default EmptyPhotos;
'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}

const SafeImage = ({ src, alt, className, priority = false }: SafeImageProps) => {
  const [state, setState] = useState({
    error: false,
    isLoading: true,
    fallbackImage: 'https://placehold.co/600x400?text=Image+Not+Available',
  });

  return (
    <>
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spinner className="h-6 w-6" />
        </div>
      )}
      <Image
        width={400}
        height={300}
        src={state.error ? state.fallbackImage : src}
        alt={alt}
        className={className}
        priority={priority}
        onError={() => setState((prev) => ({ ...prev, error: true }))}
        onLoad={() => setState((prev) => ({ ...prev, isLoading: false }))}
        unoptimized
      />
    </>
  );
};

export default SafeImage;
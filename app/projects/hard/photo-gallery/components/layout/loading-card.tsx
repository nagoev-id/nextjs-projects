'use client';

import { Card, Spinner } from '@/components/ui';

const LoadingCard = () => {
  return (
    <Card className="grid place-items-center">
      <Spinner />
    </Card>
  );
};

export default LoadingCard;
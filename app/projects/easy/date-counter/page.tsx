'use client';

import { Card } from '@/components/ui/card';
import { DateCounter1 } from './components';
import { DateCounter2 } from '@/app/projects/easy/date-counter/components';

const DateCounterPage = () => {
  return (
    <Card className="grid gap-2 md:grid-cols-2 border-none p-4 sm:gap-5 items-start">
      <DateCounter1 />
      <DateCounter2 />
    </Card>
  );
};

export default DateCounterPage;
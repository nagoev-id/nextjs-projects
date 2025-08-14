'use client';

import { JSX } from 'react';
import { Card } from '@/components/ui';
import { useStorage } from '@/shared/hooks';
import { CountdownForm } from '@/app/projects/easy/event-countdown/components';

// Define the countdown type
type Countdown = {
  id: number;
  name: string;
  datetime: string;
  theme: string;
  reminder: number;
};

const EventCountdownPage = (): JSX.Element => {
  const [countdowns, setCountdowns] = useStorage<Countdown[]>('countdowns', [{
    id: 1,
    name: 'New Year\'s Eve',
    datetime: '2025-12-31T23:59:59',
    theme: 'emerald',
    reminder: 1, // Reminder in days before the event
  }]);

  return (
    <Card>
      <CountdownForm />
    </Card>
  );
};

export default EventCountdownPage;
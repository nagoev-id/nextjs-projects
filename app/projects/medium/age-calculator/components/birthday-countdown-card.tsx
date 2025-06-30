import { Card } from '@/components/ui';
import { useEffect, useMemo, useState } from 'react';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components';
import { FunFacts } from '@/app/projects/easy/age-calculator/utils';

export const BirthdayCountdownCard = ({ birthdayCountdown }: { birthdayCountdown: FunFacts['birthdayCountdown'] }) => {
  const [countdown, setCountdown] = useState(birthdayCountdown);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        const [hours, minutes, seconds] = prevCountdown.time.split(':').map(Number);

        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = prevCountdown.days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        if (newDays < 0 || (newDays === 0 && newHours === 0 && newMinutes === 0 && newSeconds === 0)) {
          clearInterval(timer);
          return prevCountdown;
        }

        return {
          days: newDays,
          time: `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const renderData = useMemo(() => [
    {
      label: 'days',
      value: countdown.days,
    },
    {
      label: 'time',
      value: countdown.time,
    },
  ], [countdown.days, countdown.time]);

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text="Birthday countdown in" />
      <div className="grid sm:grid-cols-2 text-center">
        {renderData.map(({ label, value }) => (
          <div key={label}>
            <p className="text-3xl font-bold">{value}</p>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
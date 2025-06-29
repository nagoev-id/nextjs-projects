import { Card } from '@/components/ui';
import { useEffect, useState } from 'react';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components/headline-card';

interface BirthdayCountdownCardProps {
  birthdayCountdown: {
    days: number;
    time: string;
  };
}

export const BirthdayCountdownCard = ({ birthdayCountdown }: BirthdayCountdownCardProps) => {
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

        // Если отсчет закончился, останавливаем таймер
        if (newDays < 0 || (newDays === 0 && newHours === 0 && newMinutes === 0 && newSeconds === 0)) {
          clearInterval(timer);
          return prevCountdown; // Возвращаем предыдущее состояние, чтобы не показывать отрицательные значения
        }

        return {
          days: newDays,
          time: `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text="Birthday countdown in" />
      <div className="grid grid-cols-2 text-center">
        <div>
          <p className="text-3xl font-bold">{countdown.days}</p>
          <p>days</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{countdown.time}</p>
          <p>time</p>
        </div>
      </div>
    </Card>
  );
};
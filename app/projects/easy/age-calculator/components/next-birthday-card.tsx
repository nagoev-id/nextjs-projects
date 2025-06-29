import { Card } from '@/components/ui';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components/headline-card';

interface NextBirthdayProps {
  nextBirthday: {
    months: number;
    days: number;
    dayOfWeek: string;
  };
}

interface TimeUnitProps {
  value: number;
  unit: string;
}

const TimeUnit = ({ value, unit }: TimeUnitProps) => (
  <div>
    <p className="text-3xl font-bold">{value}</p>
    <p>{unit}</p>
  </div>
);

const DayOfWeek = ({ day }: { day: string }) => (
  <div>
    <p className="text-lg">On {day}</p>
  </div>
);

export const NextBirthdayCard = ({ nextBirthday }: NextBirthdayProps) => {
  const timeUnits = [
    { value: nextBirthday.months, unit: 'months' },
    { value: nextBirthday.days, unit: 'days' },
  ];

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text='Your upcoming birthday in' />
      <div className="grid grid-cols-3 text-center">
        {timeUnits.map(({ value, unit }) => (
          <TimeUnit key={unit} value={value} unit={unit} />
        ))}
        <DayOfWeek day={nextBirthday.dayOfWeek} />
      </div>
    </Card>
  );
};
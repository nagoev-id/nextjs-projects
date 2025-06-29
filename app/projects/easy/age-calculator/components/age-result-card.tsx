import { Card } from '@/components/ui';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components/headline-card';

interface AgeResultCardProps {
  age: {
    years: number;
    months: number;
    days: number;
  }
}

interface AgeUnitProps {
  value: number;
  unit: string;
}

const AgeUnit = ({ value, unit }: AgeUnitProps) => (
  <div>
    <p className="text-xl sm:text-5xl font-bold">{value}</p>
    <p className="text-xl">{unit}</p>
  </div>
);

export const AgeResultCard = ({ age }: AgeResultCardProps) => {
  const ageUnits = [
    { value: age.years, unit: 'years' },
    { value: age.months, unit: 'months' },
    { value: age.days, unit: 'days' },
  ];

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text='Age' />
      <div className="grid sm:grid-cols-3 text-center">
        {ageUnits.map(({ value, unit }) => (
          <AgeUnit key={unit} value={value} unit={unit} />
        ))}
      </div>
    </Card>
  );
};
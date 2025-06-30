import { Card } from '@/components/ui';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components';
import { FunFacts } from '@/app/projects/easy/age-calculator/utils';

export const HalfBirthdayCard = ({ halfBirthday }: { halfBirthday: FunFacts['halfBirthday'] }) => (
  <Card className="p-4 gap-2">
    <HeadlineCard text="Half Birthday" />
    <p className="text-lg font-bold">
      {halfBirthday.date} <span className="text-lg">On {halfBirthday.dayOfWeek}</span>
    </p>
  </Card>
);
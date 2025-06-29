import React, { useMemo } from 'react';
import { Card } from '@/components/ui';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components/headline-card';

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

type PlanetAges = {
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
}

interface PlanetAgesCardProps {
  age: AgeResult;
  planetAges: PlanetAges;
}

const PLANET_CONFIG = [
  { name: 'Mercury', color: 'bg-gray-300', key: 'mercury' },
  { name: 'Venus', color: 'bg-yellow-200', key: 'venus' },
  { name: 'Mars', color: 'bg-red-500', key: 'mars' },
  { name: 'Jupiter', color: 'bg-orange-300', key: 'jupiter' },
  { name: 'Saturn', color: 'bg-yellow-500', key: 'saturn' },
] as const;

const PlanetAge = React.memo(({ name, color, age }: { name: string; color: string; age: number }) => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 ${color} rounded-full flex-shrink-0`}></div>
    <div>
      <p>Age on {name}</p>
      <p className="text-xl text-blue-500 font-medium">{age.toFixed(2)} years</p>
    </div>
  </div>
));

PlanetAge.displayName = 'PlanetAge';

export const PlanetAgesCard = React.memo(({ planetAges }: PlanetAgesCardProps) => {
  const planetList = useMemo(() =>
      PLANET_CONFIG.map(planet => (
        <PlanetAge
          key={planet.key}
          name={planet.name}
          color={planet.color}
          age={planetAges[planet.key]}
        />
      )),
    [planetAges],
  );

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text='Amazing Facts' />
      <div className="grid gap-2">
        {planetList}
      </div>
    </Card>
  );
});

PlanetAgesCard.displayName = 'PlanetAgesCard';
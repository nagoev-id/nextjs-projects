import React, { useMemo } from 'react';
import { Card } from '@/components/ui';
import { LifeStat } from '@/app/projects/easy/age-calculator/components/life-stat';
import { HeadlineCard } from '@/app/projects/easy/age-calculator/components/headline-card';

interface LifeStats {
  breathsTaken: number;
  heartbeats: number;
  laughs: number;
  sleepYears: number;
  hairLength: number;
  nailLength: number;
}

type LifeStatsKey = keyof LifeStats;

interface LifeStatConfig {
  icon: string;
  bgColor: string;
  label: string;
  key: LifeStatsKey;
  suffix: string;
}

const LIFE_STATS_CONFIG: LifeStatConfig[] = [
  { icon: '💨', bgColor: 'bg-blue-100', label: 'You\'ve taken around', key: 'breathsTaken', suffix: 'breaths' },
  { icon: '❤️', bgColor: 'bg-red-100', label: 'Your heart has beaten', key: 'heartbeats', suffix: 'times' },
  { icon: '😄', bgColor: 'bg-yellow-100', label: 'You\'ve laughed around', key: 'laughs', suffix: 'times' },
  { icon: '😴', bgColor: 'bg-purple-100', label: 'Your sleep time is about', key: 'sleepYears', suffix: 'years' },
  { icon: '👱', bgColor: 'bg-yellow-100', label: 'Hair length (if never cut)', key: 'hairLength', suffix: 'cm' },
  { icon: '💅', bgColor: 'bg-pink-100', label: 'Nail length (if never cut)', key: 'nailLength', suffix: 'cm' },
];

export const LifeStatsCard = React.memo(({ lifeStats }: { lifeStats: LifeStats }) => {
  const formattedStats = useMemo(() => {
    return LIFE_STATS_CONFIG.map(stat => ({
      ...stat,
      value: stat.key === 'sleepYears'
        ? `${lifeStats[stat.key].toFixed(1)} ${stat.suffix}`
        : stat.key === 'hairLength' || stat.key === 'nailLength'
          ? `${lifeStats[stat.key].toFixed(2)} ${stat.suffix} or ${(lifeStats[stat.key] / 100).toFixed(4)} meters`
          : `${lifeStats[stat.key].toLocaleString()} ${stat.suffix}`,
    }));
  }, [lifeStats]);

  return (
    <Card className="p-4 gap-2">
      <HeadlineCard text='Interesting Facts About Your Life' />
      <div className="grid gap-4">
        {formattedStats.map((stat, index) => (
          <LifeStat
            key={index}
            icon={stat.icon}
            bgColor={stat.bgColor}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </Card>
  );
});

LifeStatsCard.displayName = 'LifeStatsCard';
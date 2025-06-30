export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays?: number;
}

export interface PlanetAges {
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
}

export interface LifeStats {
  breathsTaken: number;
  heartbeats: number;
  laughs: number;
  sleepYears: number;
  hairLength: number;
  nailLength: number;
}

export type LifeStatsKey = keyof LifeStats;

export interface FunFacts {
  nextBirthday: {
    months: number;
    days: number;
    dayOfWeek: string;
  };
  birthdayCountdown: {
    days: number;
    time: string;
  };
  halfBirthday: {
    date: string;
    dayOfWeek: string;
  };
  planetAges: PlanetAges;
  lifeStats: LifeStats;
}

export type DobFieldName = 'day' | 'month' | 'year';

export type DobField = {
  name: DobFieldName;
  label: string;
  length: number;
  transform?: (i: number) => number;
};

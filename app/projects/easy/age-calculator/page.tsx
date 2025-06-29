'use client';

import { JSX, useCallback, useMemo, useState, useEffect } from 'react';
import { Button, Card, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/layout';
import {
  AgeResultCard,
  BirthdayCountdownCard,
  HalfBirthdayCard,
  LifeStatsCard,
  NextBirthdayCard,
  PlanetAgesCard,
} from '@/app/projects/easy/age-calculator/components';

// Types
interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

interface PlanetAges {
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
}

interface LifeStats {
  breathsTaken: number;
  heartbeats: number;
  laughs: number;
  sleepYears: number;
  hairLength: number;
  nailLength: number;
}

interface FunFacts {
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

interface FormValues {
  day: string;
  month: string;
  year: string;
  currentDate: string;

  [key: string]: unknown;
}

// Constants
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const AgeCalculatorPage = (): JSX.Element => {
  const currentDate = useMemo(() => {
    const date = new Date();
    return {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString(),
      isoDate: date.toISOString().split('T')[0],
    };
  }, []);

  const [result, setResult] = useState<{ age: AgeResult; funFacts: FunFacts; birthDate: Date; currentDate: Date } | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  const form = useForm<FormValues>({
    defaultValues: {
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      currentDate: currentDate.isoDate,
    },
  });

  // Real-time countdown update
  useEffect(() => {
    if (!result) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextBirthdayYear = now.getFullYear() + (
        now.getMonth() > result.birthDate.getMonth() ||
        (now.getMonth() === result.birthDate.getMonth() && now.getDate() >= result.birthDate.getDate())
          ? 1 : 0
      );
      const nextBirthdayDate = new Date(nextBirthdayYear, result.birthDate.getMonth(), result.birthDate.getDate());
      
      const birthdayDiff = nextBirthdayDate.getTime() - now.getTime();
      
      if (birthdayDiff <= 0) {
        setCountdown('00 : 00 : 00');
        return;
      }

      const hours = Math.floor((birthdayDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((birthdayDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((birthdayDiff % (1000 * 60)) / 1000);

      setCountdown(`${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [result]);

  // Age calculation
  const calculateAge = useCallback((birthDate: Date, currentDate: Date): AgeResult => {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += prevMonthDate.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  }, []);

  // Get month name helper
  const getMonthName = useCallback((monthIndex: number): string => {
    return MONTHS[monthIndex];
  }, []);

  // Calculate next birthday with improved accuracy
  const calculateNextBirthday = useCallback((birthDate: Date, currentDate: Date) => {
    const nextBirthdayYear = currentDate.getFullYear() + (
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())
        ? 1 : 0
    );
    const nextBirthdayDate = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());

    // Calculate more accurate months and days until next birthday
    let monthsUntil = nextBirthdayDate.getMonth() - currentDate.getMonth();
    let daysUntil = nextBirthdayDate.getDate() - currentDate.getDate();

    if (daysUntil < 0) {
      monthsUntil--;
      const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      daysUntil += daysInPrevMonth;
    }

    if (monthsUntil < 0) {
      monthsUntil += 12;
    }

    // Calculate total days until next birthday
    const birthdayDiff = nextBirthdayDate.getTime() - currentDate.getTime();
    const totalDaysUntil = Math.ceil(birthdayDiff / (1000 * 60 * 60 * 24));

    // Calculate initial time until birthday (will be updated by useEffect)
    const birthdayHours = Math.floor((birthdayDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const birthdayMinutes = Math.floor((birthdayDiff % (1000 * 60 * 60)) / (1000 * 60));
    const birthdaySeconds = Math.floor((birthdayDiff % (1000 * 60)) / 1000);

    return {
      nextBirthday: {
        months: monthsUntil,
        days: daysUntil,
        dayOfWeek: DAYS_OF_WEEK[nextBirthdayDate.getDay()],
      },
      birthdayCountdown: {
        days: totalDaysUntil,
        time: `${String(birthdayHours).padStart(2, '0')} : ${String(birthdayMinutes).padStart(2, '0')} : ${String(birthdaySeconds).padStart(2, '0')}`,
      },
    };
  }, []);

  // Calculate half birthday
  const calculateHalfBirthday = useCallback((birthDate: Date, currentDate: Date) => {
    const halfBirthdayDate = new Date(currentDate.getFullYear(),
      (birthDate.getMonth() + 6) % 12,
      birthDate.getDate());

    if (halfBirthdayDate < currentDate) {
      halfBirthdayDate.setFullYear(halfBirthdayDate.getFullYear() + 1);
    }

    return {
      halfBirthday: {
        date: `${halfBirthdayDate.getDate()} ${getMonthName(halfBirthdayDate.getMonth())}`,
        dayOfWeek: DAYS_OF_WEEK[halfBirthdayDate.getDay()],
      },
    };
  }, [getMonthName]);

  // Calculate planet ages
  const calculatePlanetAges = useCallback((totalDays: number): PlanetAges => {
    return {
      mercury: Math.round((totalDays / 87.97) * 100) / 100,
      venus: Math.round((totalDays / 224.7) * 100) / 100,
      mars: Math.round((totalDays / 686.98) * 100) / 100,
      jupiter: Math.round((totalDays / 4332.59) * 100) / 100,
      saturn: Math.round((totalDays / 10755.7) * 100) / 100,
    };
  }, []);

  // Calculate life statistics
  const calculateLifeStats = useCallback((totalDays: number): LifeStats => {
    return {
      breathsTaken: Math.round(totalDays * 24 * 60 * 12), // ~12 breaths per minute
      heartbeats: Math.round(totalDays * 24 * 60 * 70),   // ~70 beats per minute
      laughs: Math.round(totalDays * 15),                 // ~15 laughs per day
      sleepYears: Math.round(totalDays * 8 / 365 * 10) / 10, // ~8 hours of sleep per day
      hairLength: Math.round(totalDays * 0.5 * 10) / 10,  // ~0.5 mm per day
      nailLength: Math.round(totalDays * 0.1 * 10) / 10,  // ~0.1 mm per day
    };
  }, []);

  // Calculate all fun facts with corrected currentDate usage
  const calculateFunFacts = useCallback((birthDate: Date, age: AgeResult, currentDate: Date): FunFacts => {
    const birthdayInfo = calculateNextBirthday(birthDate, currentDate);
    const halfBirthdayInfo = calculateHalfBirthday(birthDate, currentDate);
    const planetAges = calculatePlanetAges(age.totalDays);
    const lifeStats = calculateLifeStats(age.totalDays);

    return {
      ...birthdayInfo,
      ...halfBirthdayInfo,
      planetAges,
      lifeStats,
    };
  }, [calculateNextBirthday, calculateHalfBirthday, calculatePlanetAges, calculateLifeStats]);

  // Form submission handler
  const onSubmit = useCallback((formValues: FormValues) => {
    const { day, month, year, currentDate: formCurrentDate } = formValues;

    // Create date objects
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const currentDate = new Date(formCurrentDate);

    // Validate birth date
    if (birthDate > currentDate) {
      alert('Birth date cannot be in the future!');
      return;
    }

    // Calculate age and fun facts
    const age = calculateAge(birthDate, currentDate);
    const funFacts = calculateFunFacts(birthDate, age, currentDate);

    // Update state with results
    setResult({ age, funFacts, birthDate, currentDate });
  }, [calculateAge, calculateFunFacts]);

  // Form fields configuration
  const dobFields = useMemo(() => [
    { name: 'day', label: 'Day', length: 31 },
    { name: 'month', label: 'Month', length: 12 },
    { name: 'year', label: 'Year', transform: (i: number) => new Date().getFullYear() - i, length: 100 },
  ], []);

  return (
    <Card className="p-3 max-w-xl w-full mx-auto">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            form={form}
            name="currentDate"
            label="Current Date"
            type="date"
          />
          <div className="grid sm:grid-cols-3 gap-2">
            {dobFields.map(({ name, label, length, transform }) => (
              <FormSelect
                key={name}
                form={form}
                name={name}
                label={label}
                options={
                  Array.from({ length }, (_, i) => {
                    const value = transform ? transform(i) : i + 1;
                    return { value: String(value), label: String(value) };
                  })
                }
                selectProps={{
                  className: 'w-full',
                }}
              />
            ))}
          </div>
          <Button type="submit">Calculate Age</Button>
        </form>
      </Form>

      {result && (
        <div className="grid gap-2">
          <AgeResultCard age={result.age} />
          <NextBirthdayCard nextBirthday={result.funFacts.nextBirthday} />
          <BirthdayCountdownCard 
            birthdayCountdown={{
              days: result.funFacts.birthdayCountdown.days,
              time: countdown || result.funFacts.birthdayCountdown.time
            }} 
          />
          <HalfBirthdayCard halfBirthday={result.funFacts.halfBirthday} />
          <PlanetAgesCard age={result.age} planetAges={result.funFacts.planetAges} />
          <LifeStatsCard lifeStats={result.funFacts.lifeStats} />
        </div>
      )}
    </Card>
  );
};

export default AgeCalculatorPage;
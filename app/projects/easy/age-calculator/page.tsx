'use client';

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Calendar, Card, Form, Input, Label, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { FormSelect } from '@/components/layout';
import {
  AgeResultCard,
  BirthdayCountdownCard,
  HalfBirthdayCard,
  LifeStatsCard,
  NextBirthdayCard,
  PlanetAgesCard,
} from '@/app/projects/easy/age-calculator/components';
import {
  AgeResult,
  calcTime,
  calculateAge,
  calculateHalfBirthday,
  calculateLifeStats,
  calculateNextBirthday,
  calculatePlanetAges,
  dobFields,
  formSchema,
  FormSchema,
  FunFacts,
} from '@/app/projects/easy/age-calculator/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';

type ResultType = {
  age: AgeResult;
  funFacts: FunFacts;
  birthDate: Date;
  currentDate: Date
}

// Функции для работы с датами
function formatDate(date: Date | undefined): string {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

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

  const [result, setResult] = useState<ResultType | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  // Состояния для календаря
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [value, setValue] = useState<string>(formatDate(new Date()));

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      currentDate: currentDate.isoDate,
    },
  });

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

      setCountdown(calcTime(birthdayDiff));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const calculateFunFacts = useCallback((birthDate: Date, age: AgeResult, currentDate: Date): FunFacts => {
    const birthdayInfo = calculateNextBirthday(birthDate, currentDate);
    const halfBirthdayInfo = calculateHalfBirthday(birthDate, currentDate);
    const planetAges = calculatePlanetAges(age.totalDays ?? 0);
    const lifeStats = calculateLifeStats(age.totalDays ?? 0);

    return {
      ...birthdayInfo,
      ...halfBirthdayInfo,
      planetAges,
      lifeStats,
    };
  }, []);

  const onSubmit = useCallback((formValues: FormSchema) => {
    const { day, month, year, currentDate: formCurrentDate } = formValues;

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const currentDate = new Date(formCurrentDate);

    if (birthDate > currentDate) {
      toast.error('Birth date cannot be in the future!', { richColors: true });
      return;
    }

    const age = calculateAge(birthDate, currentDate);
    const funFacts = calculateFunFacts(birthDate, age, currentDate);

    setResult({ age, funFacts, birthDate, currentDate });
  }, [calculateFunFacts]);

  return (
    <Card className="p-3 max-w-xl w-full mx-auto">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Поле выбора текущей даты с календарем */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="current-date" className="px-1">
              Current Date
            </Label>
            <div className="relative flex gap-2">
              <Input
                id="current-date"
                value={value}
                placeholder="June 01, 2025"
                className="bg-background pr-10"
                onChange={(e) => {
                  const inputDate = new Date(e.target.value);
                  setValue(e.target.value);
                  if (isValidDate(inputDate)) {
                    setDate(inputDate);
                    setMonth(inputDate);
                    // Обновляем значение в форме
                    form.setValue('currentDate', inputDate.toISOString().split('T')[0]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  >
                    <CalendarIcon className="size-3.5" />
                    <span className="sr-only">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setValue(formatDate(selectedDate));
                      if (selectedDate) {
                        form.setValue('currentDate', selectedDate.toISOString().split('T')[0]);
                      }
                      setOpen(false);
                    }}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Поля для выбора даты рождения */}
          <div className="grid sm:grid-cols-3 items-start gap-2">
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
              time: countdown || result.funFacts.birthdayCountdown.time,
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
'use client';

import { ChangeEvent, JSX, useCallback, useEffect, useRef } from 'react';
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
} from '@/app/projects/medium/age-calculator/components';
import {
  AgeResult,
  calcTime,
  calculateAge,
  calculateHalfBirthday,
  calculateLifeStats,
  calculateNextBirthday,
  calculatePlanetAges,
  dobFields,
  formatDate,
  formSchema,
  FormSchema,
  FunFacts,
  isValidDate,
  StoredData,
} from '@/app/projects/medium/age-calculator/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import {
  resetDob,
  selectDobData,
  selectDobDatesAsObjects,
  setCountdown,
  setDate,
  setIsOpen,
  setMonth,
  setResult,
  setValue,
  useAppDispatch,
  useAppSelector,
} from '@/app/projects/medium/age-calculator/redux';
import { useStorage } from '@/shared/hooks';


const AgeCalculatorPage = (): JSX.Element => {
  const { result, currentDate, countdown, value, isOpen } = useAppSelector(selectDobData);
  const { date, month, birthDate } = useAppSelector(selectDobDatesAsObjects);
  const dispatch = useAppDispatch();
  
  // Флаг для отслеживания инициализации
  const isInitializedRef = useRef(false);

  // Используем useStorage для сохранения данных в localStorage
  const [storedData, setStoredData] = useStorage<StoredData>('age-calculator-data', {
    result: null,
    currentDate: {
      day: new Date().getDate().toString(),
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear().toString(),
      isoDate: new Date().toISOString().split('T')[0],
    },
    date: new Date().toISOString(),
    month: new Date().toISOString(),
    value: formatDate(new Date()),
  });

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

  // Загружаем данные из localStorage ТОЛЬКО при первом монтировании
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    
    if (storedData.result) {
      dispatch(setResult(storedData.result));
    }
    
    if (storedData.date && storedData.date !== new Date().toISOString()) {
      dispatch(setDate(storedData.date));
    }
    
    if (storedData.month && storedData.month !== new Date().toISOString()) {
      dispatch(setMonth(storedData.month));
    }
    
    if (storedData.value && storedData.value !== formatDate(new Date())) {
      dispatch(setValue(storedData.value));
    }

    // Обновляем форму с сохранёнными данными только если они отличаются от текущих
    if (storedData.currentDate.day !== currentDate.day) {
      form.setValue('day', storedData.currentDate.day);
    }
    if (storedData.currentDate.month !== currentDate.month) {
      form.setValue('month', storedData.currentDate.month);
    }
    if (storedData.currentDate.year !== currentDate.year) {
      form.setValue('year', storedData.currentDate.year);
    }
    if (storedData.currentDate.isoDate !== currentDate.isoDate) {
      form.setValue('currentDate', storedData.currentDate.isoDate);
    }
  }, [storedData, dispatch, form, currentDate]);

  // Сохраняем данные в localStorage при изменении состояния (только после инициализации)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const dataToStore: StoredData = {
      result,
      currentDate,
      date: date?.toISOString() || new Date().toISOString(),
      month: month?.toISOString() || new Date().toISOString(),
      value,
    };
    
    // Проверяем, нужно ли обновлять данные (избегаем ненужных записей)
    const currentStoredString = JSON.stringify(storedData);
    const newDataString = JSON.stringify(dataToStore);
    
    if (currentStoredString !== newDataString) {
      setStoredData(dataToStore);
    }
  }, [result, currentDate, date, month, value]);

  useEffect(() => {
    if (!result || !birthDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextBirthdayYear = now.getFullYear() + (
        now.getMonth() > birthDate.getMonth() ||
        (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate())
          ? 1 : 0
      );
      const nextBirthdayDate = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());

      const birthdayDiff = nextBirthdayDate.getTime() - now.getTime();

      if (birthdayDiff <= 0) {
        dispatch(setCountdown('00 : 00 : 00'));
        return;
      }

      dispatch(setCountdown(calcTime(birthdayDiff)));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [result, birthDate, dispatch]);

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

    // Convert Date objects to ISO strings before dispatching
    dispatch(setResult({
      age,
      funFacts,
      birthDate: birthDate.toISOString(),
      currentDate: currentDate.toISOString(),
    }));
  }, [calculateFunFacts, dispatch]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const inputDate = new Date(e.target.value);
    dispatch(setValue(e.target.value));
    if (isValidDate(inputDate)) {
      // Convert Date objects to ISO strings before dispatching
      dispatch(setDate(inputDate.toISOString()));
      dispatch(setMonth(inputDate.toISOString()));
      form.setValue('currentDate', inputDate.toISOString().split('T')[0]);
    }
  }, [dispatch, form]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch(setIsOpen(true));
    }
  }, [dispatch]);

  const handleSelectChange = useCallback((selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Convert Date object to ISO string before dispatching
      dispatch(setDate(selectedDate.toISOString()));
      dispatch(setValue(formatDate(selectedDate)));
      form.setValue('currentDate', selectedDate.toISOString().split('T')[0]);
    }
    dispatch(setIsOpen(false));
  }, [dispatch, form]);

  const handleOpenChange = useCallback((open: boolean) => {
    dispatch(setIsOpen(open));
  }, [dispatch]);

  const handleMonthChange = useCallback((newMonth: Date | undefined) => {
    if (newMonth) {
      // Convert Date object to ISO string before dispatching
      dispatch(setMonth(newMonth.toISOString()));
    }
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(resetDob());
    form.reset();
    
    // Очищаем данные из localStorage
    const defaultData: StoredData = {
      result: null,
      currentDate: {
        day: new Date().getDate().toString(),
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString(),
        isoDate: new Date().toISOString().split('T')[0],
      },
      date: new Date().toISOString(),
      month: new Date().toISOString(),
      value: formatDate(new Date()),
    };
    
    setStoredData(defaultData);
  }, [dispatch, form, setStoredData]);

  return (
    <Card className="p-3 max-w-xl w-full mx-auto">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
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
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
              />
              <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
                    onMonthChange={handleMonthChange}
                    onSelect={handleSelectChange}
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
          {result && (
            <Button
              type="reset"
              variant="destructive"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
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
import { AgeResult, DobField, LifeStats, PlanetAges } from '@/app/projects/easy/age-calculator/utils';

/** Массив дней недели */
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Массив названий месяцев */
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Вычисляет возраст на основе даты рождения и текущей даты
 * @param {Date} birthDate - Дата рождения
 * @param {Date} currentDate - Текущая дата
 * @returns {AgeResult} Объект с результатами расчета возраста
 */
export const calculateAge = (birthDate: Date, currentDate: Date): AgeResult => {
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
};

/**
 * Преобразует миллисекунды в строку формата "ЧЧ : ММ : СС"
 * @param {number} value - Количество миллисекунд
 * @returns {string} Отформатированная строка времени
 */
export const calcTime = (value: number) => {
  const hours = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((value % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
};

/**
 * Массив полей для ввода даты рождения
 * @type {DobField[]}
 */
export const dobFields: DobField[] = [
  { name: 'day', label: 'Day', length: 31 },
  { name: 'month', label: 'Month', length: 12 },
  { name: 'year', label: 'Year', transform: (i: number) => new Date().getFullYear() - i, length: 100 },
];

/**
 * Вычисляет дату следующего дня рождения и время до него
 * @param {Date} birthDate - Дата рождения
 * @param {Date} currentDate - Текущая дата
 * @returns {Object} Объект с информацией о следующем дне рождения и обратным отсчетом
 */
export const calculateNextBirthday = (birthDate: Date, currentDate: Date) => {
  const nextBirthdayYear = currentDate.getFullYear() + (
    currentDate.getMonth() > birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())
      ? 1 : 0
  );
  const nextBirthdayDate = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());

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

  const birthdayDiff = nextBirthdayDate.getTime() - currentDate.getTime();
  const totalDaysUntil = Math.ceil(birthdayDiff / (1000 * 60 * 60 * 24));

  return {
    nextBirthday: {
      months: monthsUntil,
      days: daysUntil,
      dayOfWeek: DAYS_OF_WEEK[nextBirthdayDate.getDay()],
    },
    birthdayCountdown: {
      days: totalDaysUntil,
      time: calcTime(birthdayDiff),
    },
  };
};

/**
 * Возвращает название месяца по его индексу
 * @param {number} monthIndex - Индекс месяца (0-11)
 * @returns {string} Название месяца
 */
const getMonthName = (monthIndex: number): string => {
  return MONTHS[monthIndex];
};

/**
 * Вычисляет дату полугодия от дня рождения
 * @param {Date} birthDate - Дата рождения
 * @param {Date} currentDate - Текущая дата
 * @returns {Object} Объект с информацией о полугодии
 */
export const calculateHalfBirthday = (birthDate: Date, currentDate: Date) => {
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
};

/**
 * Вычисляет возраст на разных планетах
 * @param {number} totalDays - Общее количество дней жизни
 * @returns {PlanetAges} Объект с возрастом на разных планетах
 */
export const calculatePlanetAges = (totalDays: number): PlanetAges => {
  return {
    mercury: Math.round((totalDays / 87.97) * 100) / 100,
    venus: Math.round((totalDays / 224.7) * 100) / 100,
    mars: Math.round((totalDays / 686.98) * 100) / 100,
    jupiter: Math.round((totalDays / 4332.59) * 100) / 100,
    saturn: Math.round((totalDays / 10755.7) * 100) / 100,
  };
};

/**
 * Вычисляет различные статистические данные о жизни
 * @param {number} totalDays - Общее количество дней жизни
 * @returns {LifeStats} Объект с различными статистическими данными
 */
export const calculateLifeStats = (totalDays: number): LifeStats => {
  return {
    breathsTaken: Math.round(totalDays * 24 * 60 * 12),
    heartbeats: Math.round(totalDays * 24 * 60 * 70),
    laughs: Math.round(totalDays * 15),
    sleepYears: Math.round(totalDays * 8 / 365 * 10) / 10,
    hairLength: Math.round(totalDays * 0.5 * 10) / 10,
    nailLength: Math.round(totalDays * 0.1 * 10) / 10,
  };
};

/**
 * Форматирует дату в строку
 * @param {Date | undefined} date - Дата для форматирования
 * @returns {string} Отформатированная строка даты
 */
export const formatDate = (date: Date | undefined): string => {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Проверяет, является ли дата действительной
 * @param {Date | undefined} date - Дата для проверки
 * @returns {boolean} true, если дата действительна, иначе false
 */
export const isValidDate = (date: Date | undefined): boolean => {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
};


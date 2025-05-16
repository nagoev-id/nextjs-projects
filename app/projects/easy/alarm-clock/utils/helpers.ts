import { HELPERS } from '@/shared';

type FormattedTime = [string, string, string, string];

export const formatTime = (date: Date): FormattedTime => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return [formattedHours, formattedMinutes, formattedSeconds, period];
};


export const generateNumbers = (num: number): string[] => {
  return Array.from({ length: num }, (_, i) => HELPERS.addLeadingZero(i === 59 ? 0 : i + 1));
}
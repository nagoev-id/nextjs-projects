import { IoMdClose } from 'react-icons/io';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ChangeEvent, JSX, useCallback, useMemo } from 'react';
import { Workout } from '@/app/projects/easy/workout-tracker/page';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

/**
 * Типы тренировок, доступные для выбора
 */
const WORKOUT_TYPES = [
  'walking',
  'running',
  'outdoor-cycling',
  'indoor-cycling',
  'swimming',
  'yoga',
] as const;

/**
 * Свойства компонента строки тренировки
 */
type WorkoutRowProps = {
  workout: Workout;
  updateWorkout: (id: string, field: keyof Workout, value: string | number) => void;
  deleteWorkout: (id: string) => void;
}

/**
 * Компонент строки тренировки
 *
 * Отображает одну запись о тренировке с возможностью редактирования даты,
 * типа тренировки и продолжительности, а также удаления записи.
 *
 * @param {WorkoutRowProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент строки тренировки
 */
const WorkoutRow = ({ workout, updateWorkout, deleteWorkout }: WorkoutRowProps): JSX.Element => {
  /**
   * Обработчик изменения значений в полях ввода
   *
   * @param {keyof Workout} field - Поле для обновления
   * @returns {(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void} Функция-обработчик события
   */
  const handleInputChange = useCallback((field: keyof Workout) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = field === 'duration' ? Number(e.target.value) : e.target.value;
        updateWorkout(workout.id, field, value);
      },
    [workout.id, updateWorkout],
  );

  /**
   * Обработчик удаления тренировки
   */
  const handleDelete = useCallback(() => {
    deleteWorkout(workout.id);
  }, [workout.id, deleteWorkout]);

  /**
   * Мемоизированные опции для выпадающего списка типов тренировок
   */
  const workoutOptions = useMemo(() =>
      WORKOUT_TYPES.map(option => (
        <SelectItem key={option} value={option}>
          {option.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </SelectItem>
      )),
    [],
  );

  return (
    <div className="row grid grid-cols-3">
      <div className="date border p-1">
        <Input
          type="date"
          value={workout.date}
          onChange={handleInputChange('date')}
          className="h-9 focus-visible:ring-blue-400"
          aria-label="Workout date"
        />
      </div>
      <div className="type border p-1">
        <Select
          value={workout.workout}
          onValueChange={(value) => updateWorkout(workout.id, 'workout', value)}
        >
          <SelectTrigger className="h-9 focus-visible:ring-blue-400 w-full" aria-label="Workout type">
            <SelectValue placeholder="Select workout type" />
          </SelectTrigger>
          <SelectContent>
            {workoutOptions}
          </SelectContent>
        </Select>
      </div>
      <div className="duration flex items-center border p-1 gap-1">
        <Input
          type="number"
          min={1}
          max={1440}
          value={workout.duration}
          onChange={(e) => updateWorkout(workout.id, 'duration', Number(e.target.value))}
          className="h-9 min-w-[60px] max-w-[100px] focus-visible:ring-blue-400"
          aria-label="Workout duration in minutes"
        />
        <span className="text-sm">minutes</span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="Delete workout"
              className="ml-auto h-9 px-2"
            >
              <IoMdClose />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your workout entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default WorkoutRow;
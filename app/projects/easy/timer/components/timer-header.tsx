'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimerFormValues, timerSchema } from '@/app/projects/easy/timer/utils';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/layout';


interface TimerHeaderProps {
  onSubmitFormHandler: (value: number) => void;
}

const TimerHeader = ({ onSubmitFormHandler }: TimerHeaderProps) => {

  const form = useForm<TimerFormValues>({
    resolver: zodResolver(timerSchema),
    mode: 'onChange',
  });

  const onSubmit = useCallback((data: TimerFormValues) => {
    onSubmitFormHandler(data.number);
  }, [onSubmitFormHandler]);

  return (
    <>
      <h1 className="text-center font-bold text-2xl">Timer</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormInput form={form} name="number" placeholder="Enter number of minutes" />
          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Start Timer
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TimerHeader;
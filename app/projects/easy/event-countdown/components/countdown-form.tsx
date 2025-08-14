'use client';

import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, Form } from '@/components/ui';
import { FormInput, FormSelect } from '@/components/layout';

// Form validation schema
const countdownFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Event name must be less than 100 characters'),
  datetime: z.string().min(1, 'Date and time is required'),
  theme: z.string().min(1, 'Theme is required'),
  reminder: z.string().min(1, 'Reminder is required'),
});

type CountdownFormValues = z.infer<typeof countdownFormSchema>;

// Theme options
const themeOptions = [
  { value: 'emerald', label: 'Emerald' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'indigo', label: 'Indigo' },
];

// Reminder options (in days)
const reminderOptions = [
  { value: '0', label: 'No reminder' },
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '1 week before' },
  { value: '14', label: '2 weeks before' },
  { value: '30', label: '1 month before' },
];

type CountdownFormProps = {
  onSubmit: (data: {
    name: string;
    datetime: string;
    theme: string;
    reminder: number;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
    datetime: string;
    theme: string;
    reminder: number;
  };
  isEditing?: boolean;
};

export const CountdownForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}: CountdownFormProps): JSX.Element => {
  const form = useForm<CountdownFormValues>({
    resolver: zodResolver(countdownFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      datetime: initialData?.datetime || '',
      theme: initialData?.theme || 'emerald',
      reminder: initialData?.reminder?.toString() || '1',
    },
    mode: 'onChange',
  });

  const handleSubmit = (data: CountdownFormValues) => {
    // Convert datetime to ISO string format if needed
    const datetime = new Date(data.datetime).toISOString();
    
    onSubmit({
      name: data.name,
      datetime,
      theme: data.theme,
      reminder: parseInt(data.reminder),
    });
    
    // Reset form if not editing
    if (!isEditing) {
      form.reset();
    }
  };

  // Get minimum datetime (current time)
  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormInput
            form={form}
            name="name"
            label="Event Name"
            placeholder="Enter event name"
          />
          
          <FormInput
            form={form}
            name="datetime"
            label="Date & Time"
            type="datetime-local"
            min={minDateTime}
          />
          
          <FormSelect
            form={form}
            name="theme"
            label="Theme Color"
            options={themeOptions}
            selectProps={{
              placeholder: "Select a theme",
            }}
          />
          
          <FormSelect
            form={form}
            name="reminder"
            label="Reminder"
            options={reminderOptions}
            selectProps={{
              placeholder: "Select reminder time",
            }}
          />
          
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
};
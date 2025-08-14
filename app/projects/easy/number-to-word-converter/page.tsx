'use client';

import { Button, Card, Form, Label, Textarea } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertNumberToWords, FormSchema, formSchema } from '@/app/projects/easy/number-to-word-converter/utils';
import { useCallback, useState } from 'react';
import { FormInput } from '@/components/layout';
import { toast } from 'sonner';
import { HELPERS } from '@/shared';

const NumberToWordConverter = () => {
  const [state, setState] = useState<null | string>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      number: undefined,
    },
  });

  const onSubmit = useCallback((formData: FormSchema) => {
    try {
      setState(convertNumberToWords(formData.number));
    } catch {
      toast.error('An error occurred during conversion', { richColors: true });
      setState(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setState(null);
    form.reset();
  }, [form]);

  return (
    <Card className="p-4 max-w-xl w-full mx-auto">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            form={form}
            name="number"
            placeholder="Enter a number"
            type="number"
            label="Enter a number"
          />
          {state && (
            <div className="space-y-2">
              <Label>Result</Label>
              <Textarea
                value={state}
                readOnly
                className="bg-muted/50 resize-none min-h-[100px]"
                placeholder="Converted text will appear here..."
                aria-label="Conversion result"
              />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
            >
              Convert
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!state}
              onClick={() => HELPERS.copyToClipboard(state ?? '')}
            >
              Copy
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!state}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>

        </form>
      </Form>
    </Card>
  );
};

export default NumberToWordConverter;
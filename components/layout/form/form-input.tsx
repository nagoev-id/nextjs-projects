'use client';

import { Path, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * Базовые дополнительные свойства для элементов формы
 */
type BaseExtraProps = {
  disabled?: boolean;
  required?: boolean;
  className?: string;
  [key: string]: unknown;
};

/**
 * Базовые свойства для всех компонентов формы
 */
type BaseFormElementProps<T extends Record<string, unknown>> = {
  form: UseFormReturn<T>,
  name: Path<T>,
  label?: string,
  placeholder?: string,
  className?: string,
  labelClassName?: string,
  messageClassName?: string,
  autoComplete?: string
  disabled?: boolean,
};

/**
 * Свойства для компонента ввода текста
 */
type FormInputProps<T extends Record<string, unknown>> = BaseFormElementProps<T> & {
  type?: 'input' | 'textarea' | 'date' | 'datetime-local' | 'number' | 'password' | 'email' | 'color' | 'file' | 'tel';
  inputProps?: BaseExtraProps;
  min?: string;
  max?: string;
};

/**
 * Свойства для компонента выпадающего списка
 */
type FormSelectProps<T extends Record<string, unknown>> = BaseFormElementProps<T> & {
  options: string[] | { value: string; label: string }[];
  selectProps?: BaseExtraProps;
};

/**
 * Стили по умолчанию для полей формы
 */
const FIELD_STYLES = '';

/**
 * Компонент для текстовых полей ввода в форме
 */
export function FormInput<T extends Record<string, unknown>>({
                                                               form,
                                                               name,
                                                               label,
                                                               type = 'input',
                                                               placeholder,
                                                               inputProps = {},
                                                               min,
                                                               max,
                                                               className,
                                                               labelClassName,
                                                               messageClassName,
                                                               autoComplete = 'off',
                                                               disabled = false,
                                                             }: FormInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={cn('', labelClassName)}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            {renderFormElement(type, field, placeholder, inputProps, min, max, autoComplete, disabled)}
          </FormControl>
          <FormMessage className={cn('', messageClassName)} />
        </FormItem>
      )}
    />
  );
}

/**
 * Компонент для выпадающих списков в форме
 */
export function FormSelect<T extends Record<string, unknown>>({
                                                                form,
                                                                name,
                                                                label,
                                                                placeholder,
                                                                options,
                                                                selectProps = {},
                                                                className,
                                                                labelClassName,
                                                                messageClassName,
                                                              }: FormSelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={cn('', labelClassName)}>
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
            value={field.value as string}
            {...selectProps}
          >
            <FormControl>
              <SelectTrigger
                aria-label={label || String(name)}
                className={cn(FIELD_STYLES, selectProps.className)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;

                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage className={cn('', messageClassName)} />
        </FormItem>
      )}
    />
  );
}

/**
 * Вспомогательная функция для рендеринга различных типов элементов формы
 */
function renderFormElement(
  type: 'input' | 'textarea' | 'date' | 'datetime-local' | 'number' | 'password' | 'email' | 'color' | 'file' | 'tel' | undefined,
  field: any,
  placeholder?: string | undefined,
  inputProps?: BaseExtraProps | undefined,
  min?: string | undefined,
  max?: string | undefined,
  autoComplete?: string | undefined,
  disabled?: boolean | undefined,
) {
  const inputFieldProps = {
    onChange: field.onChange,
    onBlur: field.onBlur,
    name: field.name,
    ref: field.ref,
    value: field.value !== undefined && field.value !== null ? String(field.value) : '',
    placeholder,
    className: cn(FIELD_STYLES, inputProps?.className),
    'aria-label': inputProps?.['aria-label'] || field.name,
    autoComplete,
    disabled,
    ...inputProps,
  };

  switch (type) {
    case 'textarea':
      return <Textarea {...inputFieldProps} />;

    case 'date':
      return (
        <Input
          type="date"
          {...inputFieldProps}
          min={min || undefined}
          max={max || undefined}
        />
      );

    case 'datetime-local':
      return (
        <Input
          type="datetime-local"
          {...inputFieldProps}
          min={min || undefined}
          max={max || undefined}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          {...inputFieldProps}
          min={min || undefined}
          max={max || undefined}
          onChange={(e) => {
            const value = e.target.valueAsNumber;
            if (!isNaN(value)) {
              const event = {
                ...e,
                target: {
                  ...e.target,
                  value: value,
                },
              };
              field.onChange(value);
            } else {
              field.onChange(undefined);
            }
          }}
        />
      );

    case 'password':
      return <Input type="password" {...inputFieldProps} />;

    case 'email':
      return <Input type="email" {...inputFieldProps} />;

    case 'color':
      return <Input type="color" {...inputFieldProps} />;

    case 'file':
      return <Input type="file" {...inputFieldProps} />;

    case 'tel':
      return <Input type="tel" {...inputFieldProps} />;

    default:
      return <Input type="text" {...inputFieldProps} />;
  }
}
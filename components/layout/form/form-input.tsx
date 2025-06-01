'use client';

import { Path, UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  type?: 'input' | 'textarea' | 'date' | 'number' | 'password' | 'email' | 'color';
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
 *
 * @example
 * // Базовое текстовое поле
 * <FormInput form={form} name="username" label="Username" />
 *
 * @example
 * // Текстовая область с дополнительными свойствами
 * <FormInput
 *   form={form}
 *   name="description"
 *   label="Description"
 *   type="textarea"
 *   inputProps={{ rows: 4 }}
 * />
 *
 * @example
 * // Поле для ввода даты с минимальным значением
 * <FormInput
 *   form={form}
 *   name="startDate"
 *   label="Start Date"
 *   type="date"
 *   min="2023-01-01"
 * />
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
 *
 * @example
 * // Базовый выпадающий список
 * <FormSelect
 *   form={form}
 *   name="country"
 *   label="Country"
 *   options={["USA", "Canada", "UK"]}
 * />
 *
 * @example
 * // Выпадающий список с объектами значение/метка
 * <FormSelect
 *   form={form}
 *   name="role"
 *   label="User Role"
 *   options={[
 *     { value: "admin", label: "Administrator" },
 *     { value: "user", label: "Regular User" }
 *   ]}
 * />
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
                // Обработка как строк, так и объектов { value, label }
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
  type: 'input' | 'textarea' | 'date' | 'number' | 'password' | 'email' | 'color' | undefined,
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

    case 'number':
      return (
        <Input
          type="number"
          {...inputFieldProps}
          min={min || undefined}
          max={max || undefined}
        />
      );

    case 'password':
      return <Input type="password" {...inputFieldProps} />;

    case 'email':
      return <Input type="email" {...inputFieldProps} />;

    case 'color':
      return <Input type="color" {...inputFieldProps} />;

    default:
      return <Input type="text" {...inputFieldProps} />;
  }
}

/**
 * Экспорт всех компонентов формы из одного файла
 */
export { FormInput as FormTextInput }; // Альтернативное имя для обратной совместимости
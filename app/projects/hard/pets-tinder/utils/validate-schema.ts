import { z } from 'zod';
import { CONFIG } from '@/app/projects/hard/pets-tinder/utils';

const { VALIDATION: { SIGN_UP } } = CONFIG;

// Создаем переиспользуемые схемы для общих паттернов валидации
const createEmailValidator = (config: typeof SIGN_UP.EMAIL | typeof SIGN_UP.SIGN_IN.EMAIL) => {
  return z.string()
    .email({ message: config.MESSAGES.INVALID })
    .refine((email) => {
      const [localPart] = email.split('@');
      return (
        !config.PROHIBITED_CHARACTERS.test(localPart) &&
        !localPart.startsWith('.') &&
        !localPart.endsWith('.') &&
        !localPart.includes('..')
      );
    }, { message: config.MESSAGES.PROHIBITED_CHARACTERS })
    .refine((email) => {
      const domainPart = email.split('@')[1];
      return (
        domainPart &&
        !domainPart.startsWith('.') &&
        !domainPart.endsWith('.') &&
        !domainPart.includes('..')
      );
    }, { message: config.MESSAGES.DOMAIN_INVALID });
};

const createPasswordValidator = (config: typeof SIGN_UP.PASSWORD | typeof SIGN_UP.SIGN_IN.PASSWORD) => {
  return z.string();
  // .min(config.MIN_LENGTH, { message: config.MESSAGES.MIN_LENGTH })
  // .max(config.MAX_LENGTH, { message: config.MESSAGES.MAX_LENGTH })
  // .regex(config.PATTERN, { message: config.MESSAGES.WEAK });
};

// Используем переиспользуемые схемы для создания финальных схем валидации
export const SCHEMA_LIST = {
  SIGN_UP: z.object({
    email: createEmailValidator(SIGN_UP.EMAIL),
    password: createPasswordValidator(SIGN_UP.PASSWORD),
    confirmPassword: createPasswordValidator(SIGN_UP.PASSWORD),
  }).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: SIGN_UP.PASSWORD.MESSAGES.NOT_MATCH,
    path: ['confirmPassword'],
  }),

  SIGN_IN: z.object({
    email: createEmailValidator(SIGN_UP.SIGN_IN.EMAIL),
    password: createPasswordValidator(SIGN_UP.SIGN_IN.PASSWORD),
  }),

  RESET_PASSWORD: z.object({
    email: createEmailValidator(SIGN_UP.SIGN_IN.EMAIL),
  }),

  UPDATE_PASSWORD: z.object({
    password: z.string()
      .min(8, 'Пароль должен быть не менее 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  }),

  PROFILE_USER_UPDATE: z.object({
    username: z.string().min(3, { message: 'Имя пользователя должно быть не менее 3 символов' }),
    full_name: z.string().min(2, { message: 'Полное имя должно быть не менее 2 символов' }),
    phone: z.string().optional(),
  }),

  // Схема для создания нового животного
  ANIMAL_CREATE: z.object({
    name: z.string().min(2, { message: 'Имя должно быть не менее 2 символов' }),
    view: z.enum(['d', 'c'], { 
      errorMap: () => ({ message: 'Должно быть либо собака (d), либо кошка (c)' }) 
    }),
    breed: z.string().min(2, { message: 'Порода должна быть не менее 2 символов' }),
    age: z.coerce.number().int().min(0, { message: 'Возраст должен быть положительным числом' }),
    gender: z.enum(['m', 'w'], { 
      errorMap: () => ({ message: 'Должно быть либо мужской (m), либо женский (w)' }) 
    }),
    price: z.coerce.number().min(0, { message: 'Цена должна быть положительным числом' }),
    color: z.string().min(2, { message: 'Цвет должен быть не менее 2 символов' }).optional(),
    weight: z.coerce.number().min(0, { message: 'Вес должен быть положительным числом' }).optional(),
    height: z.coerce.number().min(0, { message: 'Рост должен быть положительным числом' }).optional(),
    vaccination: z.boolean().default(false),
    pedigree: z.boolean().default(false),
    microchip: z.boolean().default(false),
    description: z.string().optional(),
    status: z.enum(['available', 'reserved', 'closed'], { 
      errorMap: () => ({ message: 'Статус должен быть доступен, зарезервирован или закрыт' }) 
    }).default('available'),
  }),

  // Схема для обновления существующего животного
  ANIMAL_UPDATE: z.object({
    id: z.number(),
    name: z.string().min(2, { message: 'Имя должно быть не менее 2 символов' }).optional(),
    view: z.enum(['d', 'c'], { 
      errorMap: () => ({ message: 'Должно быть либо собака (d), либо кошка (c)' }) 
    }).optional(),
    breed: z.string().min(2, { message: 'Порода должна быть не менее 2 символов' }).optional(),
    age: z.coerce.number().int().min(0, { message: 'Возраст должен быть положительным числом' }).optional(),
    gender: z.enum(['m', 'w'], { 
      errorMap: () => ({ message: 'Должно быть либо мужской (m), либо женский (w)' }) 
    }).optional(),
    price: z.coerce.number().min(0, { message: 'Цена должна быть положительным числом' }).optional(),
    color: z.string().min(2, { message: 'Цвет должен быть не менее 2 символов' }).optional(),
    weight: z.coerce.number().min(0, { message: 'Вес должен быть положительным числом' }).optional(),
    height: z.coerce.number().min(0, { message: 'Рост должен быть положительным числом' }).optional(),
    vaccination: z.boolean().optional(),
    pedigree: z.boolean().optional(),
    microchip: z.boolean().optional(),
    description: z.string().optional(),
    status: z.enum(['available', 'reserved', 'closed'], { 
      errorMap: () => ({ message: 'Статус должен быть доступен, зарезервирован или закрыт' }) 
    }).optional(),
  }),
};

export type ValidateSchema = {
  SIGN_UP: z.infer<typeof SCHEMA_LIST.SIGN_UP>;
  SIGN_IN: z.infer<typeof SCHEMA_LIST.SIGN_IN>;
  RESET_PASSWORD: z.infer<typeof SCHEMA_LIST.RESET_PASSWORD>;
  UPDATE_PASSWORD: z.infer<typeof SCHEMA_LIST.UPDATE_PASSWORD>;
  PROFILE_USER_UPDATE: z.infer<typeof SCHEMA_LIST.PROFILE_USER_UPDATE>;
  ANIMAL_CREATE: z.infer<typeof SCHEMA_LIST.ANIMAL_CREATE>;
  ANIMAL_UPDATE: z.infer<typeof SCHEMA_LIST.ANIMAL_UPDATE>;
};
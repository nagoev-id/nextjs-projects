import { z } from 'zod';
import { CONFIG } from '@/app/projects/hard/photo-gallery/utils';

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
  return z.string()
    .min(config.MIN_LENGTH, { message: config.MESSAGES.MIN_LENGTH })
    .max(config.MAX_LENGTH, { message: config.MESSAGES.MAX_LENGTH })
    .regex(config.PATTERN, { message: config.MESSAGES.WEAK });
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
};

export type ValidateSchema = {
  SIGN_UP: z.infer<typeof SCHEMA_LIST.SIGN_UP>;
  SIGN_IN: z.infer<typeof SCHEMA_LIST.SIGN_IN>;
};
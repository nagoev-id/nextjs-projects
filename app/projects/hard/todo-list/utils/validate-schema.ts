import { z } from 'zod';

export const signUpFormSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});


export const signInFormSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const formCreateSchema = z.object({
  title: z.string().min(2, {
    message: 'Todo title must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Todo description must be at least 2 characters.',
  }),
  category: z.string(),
  color: z.string(),
  date: z.date(),
});

export type FormCreateSchema = z.infer<typeof formCreateSchema>;

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
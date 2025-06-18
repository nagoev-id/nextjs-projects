import { JSX } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { store } from '@/app/projects/hard/pets-tinder/redux';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface PetsHeaderProps {
  title?: string | null | undefined;
  description?: string | null | undefined;
}

export type MenuItem = {
  type: 'item' | 'label' | 'separator';
  label?: string;
  href?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

export type MenuSection = {
  label?: string;
  items: MenuItem[];
}

export interface AuthSliceInitialState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthApiCredentials {
  email: string;
  password: string;
}

export interface AuthApiResponse {
  user: User | null;
  session: Session | null;
}

export interface AuthApiSignOutResponse {
  success: boolean;
}
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

export interface InitialState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User | null>) => {
      state.user = payload;
    },
    setSession: (state, { payload }: PayloadAction<Session | null>) => {
      state.session = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }: PayloadAction<string | null>) => {
      state.error = payload;
    },
  },
});


export const selectAuthData = createSelector(
  (state: { auth: InitialState }): InitialState => state.auth,
  ({ error, user, session, isLoading }) => ({ user, session, isLoading, error }),
);

export const { setUser, setSession, setLoading, setError } = authSlice.actions;

export const authReducer = authSlice.reducer;
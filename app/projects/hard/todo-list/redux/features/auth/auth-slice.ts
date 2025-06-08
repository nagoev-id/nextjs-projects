import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

interface InitialState {
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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
  },
});

export const selectAuthSliceState = (state: { auth: InitialState }): InitialState => state.auth;

export const selectAuthSliceData = createSelector(
  selectAuthSliceState,
  ({ error, user, session, isLoading }) => ({ user, session, isLoading, error }),
);

export const { setUser, setSession, setLoading, setError, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
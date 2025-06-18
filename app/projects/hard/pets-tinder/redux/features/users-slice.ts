import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});


export const usersReducer = usersSlice.reducer;
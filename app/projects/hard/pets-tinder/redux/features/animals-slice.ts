import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {},
});


export const animalsReducer = animalsSlice.reducer;
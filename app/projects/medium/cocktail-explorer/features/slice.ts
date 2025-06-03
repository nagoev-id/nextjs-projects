import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  count: number;
}

const initialState: InitialState = {
  count: 0,
};

const slice = createSlice({
  name: 'sliceName',
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    },
  },
});


export const selectSliceState = (state: { slice: InitialState }): InitialState => {
  return state.slice;
};

export const selectSliceData = createSelector(
  selectSliceState,
  (state) => ({
    count: state.count,
  }),
);

export const { increment, decrement, incrementByAmount, decrementByAmount } = slice.actions;

export const sliceReducer = slice.reducer;
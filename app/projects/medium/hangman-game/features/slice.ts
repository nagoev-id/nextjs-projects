import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type InitialState = {
  isLoading: boolean;
  isError: boolean;
  playable: boolean;
  correctLetters: string[];
  wrongLetters: string[];
  word: string | null;
}

const initialState: InitialState = {
  isLoading: false,
  isError: false,
  playable: true,
  correctLetters: [],
  wrongLetters: [],
  word: null,
};


const axiosInstance = axios.create({
  baseURL: 'https://random-word-api.herokuapp.com',
  timeout: 5000,
});

export const fetchWord = createAsyncThunk(
  'hangman/fetchWord',
  async (_, { rejectWithValue }) => {
    try {
      const { data: [word] } = await axiosInstance.get<string>('word');
      console.log(word);
      return word;
    } catch (error) {
      console.error(error);
      return rejectWithValue('Failed to fetch word');
    }
  },
);

export const hangmanSlice = createSlice({
  name: 'hangman',
  initialState,
  reducers: {
    handlePlayable: (state, action: PayloadAction<boolean>) => {
      state.playable = action.payload;
    },
    handleRestart: (state) => {
      state.correctLetters = [];
      state.wrongLetters = [];
      state.word = null;
      state.playable = true;
      state.isError = false;
    },
    handleCorrectLetter: (state, action: PayloadAction<string>) => {
      state.correctLetters.push(action.payload);
    },
    handleWrongLetter: (state, action: PayloadAction<string>) => {
      state.wrongLetters.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWord.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchWord.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.word = action.payload;
        state.playable = true;
      })
      .addCase(fetchWord.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const selectHangmanState = (state: { hangman: InitialState }): InitialState => state.hangman;

export const selectHangmanData = createSelector(
  selectHangmanState,
  (state) => ({
    wrongLetters: state.wrongLetters,
    correctLetters: state.correctLetters,
    word: state.word,
    playable: state.playable,
    isError: state.isError,
    isLoading: state.isLoading,
  })
);

export const { handleCorrectLetter, handleWrongLetter, handleRestart, handlePlayable } = hangmanSlice.actions;

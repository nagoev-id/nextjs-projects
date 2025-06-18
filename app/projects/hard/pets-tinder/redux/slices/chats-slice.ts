import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/projects/hard/pets-tinder/redux/store';

export interface ChatsState {
  activeChat: number | null;
}

const initialState: ChatsState = {
  activeChat: null,
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<number | null>) => {
      state.activeChat = action.payload;
    },
  },
});

export const { setActiveChat } = chatsSlice.actions;

export const selectChatsData = (state: RootState) => state.chatsReducer;

export default chatsSlice.reducer; 
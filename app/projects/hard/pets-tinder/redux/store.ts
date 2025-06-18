import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  animalsApi,
  animalsReducer,
  authApi,
  authReducer,
  chatApi,
  chatsReducer,
  usersApi,
  usersReducer,
} from '@/app/projects/hard/pets-tinder/redux';

export const store = configureStore({
  reducer: {
    animalsReducer,
    authReducer,
    chatsReducer,
    usersReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [animalsApi.reducerPath]: animalsApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(animalsApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);


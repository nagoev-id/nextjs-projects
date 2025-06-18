export * from './store';
export * from './features';
export * from './api';
// export * from './services';
export * from './hooks';
export * from './components';

import chatsReducer, { setActiveChat, selectChatsData } from './slices/chats-slice';

export {
  chatsReducer,
  setActiveChat,
  selectChatsData
}

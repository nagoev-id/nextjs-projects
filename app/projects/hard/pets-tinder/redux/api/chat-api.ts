import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/app/projects/hard/pets-tinder/utils';

export interface Chat {
  id: number;
  animals_id: number;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: number;
  user_id: string;
  chat_id: number;
  joined_at: string;
}

export interface Message {
  id: number;
  user_id: string;
  chat_id: number;
  text: string;
  sent_at: string;
  is_read: boolean;
}

export interface ChatWithParticipantsAndMessages extends Chat {
  participants: ChatParticipant[];
  messages: Message[];
}

export interface CreateChatRequest {
  animals_id: number;
  participants: string[]; // Массив ID пользователей
}

export interface SendMessageRequest {
  chat_id: number;
  user_id: string;
  text: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    // Получить все чаты пользователя
    getUserChats: builder.query<ChatWithParticipantsAndMessages[], string>({
      async queryFn(userId) {
        try {
          // Получаем ID чатов, в которых участвует пользователь
          const { data: participantsData, error: participantsError } = await supabase
            .from('chat_participants')
            .select('chat_id')
            .eq('user_id', userId);

          if (participantsError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: participantsError.message,
                data: participantsError.details,
              },
            };
          }

          if (!participantsData || participantsData.length === 0) {
            return { data: [] };
          }

          const chatIds = participantsData.map(p => p.chat_id);

          // Получаем информацию о чатах
          const { data: chatsData, error: chatsError } = await supabase
            .from('chats')
            .select('*')
            .in('id', chatIds)
            .order('updated_at', { ascending: false });

          if (chatsError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: chatsError.message,
                data: chatsError.details,
              },
            };
          }

          if (!chatsData || chatsData.length === 0) {
            return { data: [] };
          }

          // Для каждого чата получаем участников и последние сообщения
          const chatsWithDetails = await Promise.all(
            chatsData.map(async (chat) => {
              // Получаем участников чата
              const { data: participants, error: participantsError } = await supabase
                .from('chat_participants')
                .select('*')
                .eq('chat_id', chat.id);

              if (participantsError) {
                throw new Error(participantsError.message);
              }

              // Получаем сообщения чата
              const { data: messages, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chat.id)
                .order('sent_at', { ascending: true });

              if (messagesError) {
                throw new Error(messagesError.message);
              }

              return {
                ...chat,
                participants: participants || [],
                messages: messages || [],
              };
            })
          );

          return { data: chatsWithDetails };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Не удалось загрузить чаты пользователя',
              data: null,
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Chats' as const, id })),
              { type: 'Chats', id: 'LIST' },
            ]
          : [{ type: 'Chats', id: 'LIST' }],
    }),

    // Получить чат по ID
    getChatById: builder.query<ChatWithParticipantsAndMessages, number>({
      async queryFn(chatId) {
        try {
          // Получаем информацию о чате
          const { data: chat, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .eq('id', chatId)
            .single();

          if (chatError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: chatError.message,
                data: chatError.details,
              },
            };
          }

          // Получаем участников чата
          const { data: participants, error: participantsError } = await supabase
            .from('chat_participants')
            .select('*')
            .eq('chat_id', chatId);

          if (participantsError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: participantsError.message,
                data: participantsError.details,
              },
            };
          }

          // Получаем сообщения чата
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('sent_at', { ascending: true });

          if (messagesError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: messagesError.message,
                data: messagesError.details,
              },
            };
          }

          return {
            data: {
              ...chat,
              participants: participants || [],
              messages: messages || [],
            },
          };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Не удалось загрузить чат',
              data: null,
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Chats', id }],
    }),

    // Создать новый чат
    createChat: builder.mutation<Chat, CreateChatRequest>({
      async queryFn({ animals_id, participants }) {
        try {
          // Проверка наличия чата для данного животного между этими участниками
          const { data: existingChats, error: existingChatsError } = await supabase
            .from('chats')
            .select('id')
            .eq('animals_id', animals_id);

          if (existingChatsError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: existingChatsError.message,
                data: existingChatsError.details,
              },
            };
          }

          // Если есть существующие чаты для этого животного, проверим участников
          if (existingChats && existingChats.length > 0) {
            for (const chat of existingChats) {
              const { data: chatParticipants, error: participantsError } = await supabase
                .from('chat_participants')
                .select('user_id')
                .eq('chat_id', chat.id);

              if (participantsError) {
                return {
                  error: {
                    status: 'CUSTOM_ERROR',
                    error: participantsError.message,
                    data: participantsError.details,
                  },
                };
              }

              // Проверяем, есть ли все участники в существующем чате
              const participantIds = chatParticipants?.map(p => p.user_id) || [];
              const allParticipantsPresent = participants.every(id => participantIds.includes(id));

              if (allParticipantsPresent && participantIds.length === participants.length) {
                // Получаем полную информацию о чате
                const { data: existingChat, error: chatError } = await supabase
                  .from('chats')
                  .select('*')
                  .eq('id', chat.id)
                  .single();

                if (chatError) {
                  return {
                    error: {
                      status: 'CUSTOM_ERROR',
                      error: chatError.message,
                      data: chatError.details,
                    },
                  };
                }

                return { data: existingChat };
              }
            }
          }

          // Создаем новый чат
          const { data: chatData, error: chatError } = await supabase
            .from('chats')
            .insert({ animals_id })
            .select()
            .single();

          if (chatError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: chatError.message,
                data: chatError.details,
              },
            };
          }

          // Добавляем участников
          const participantsData = participants.map(user_id => ({
            user_id,
            chat_id: chatData.id,
          }));

          const { error: participantsError } = await supabase
            .from('chat_participants')
            .insert(participantsData);

          if (participantsError) {
            // В случае ошибки удаляем созданный чат
            await supabase.from('chats').delete().eq('id', chatData.id);
            
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: participantsError.message,
                data: participantsError.details,
              },
            };
          }

          return { data: chatData };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Не удалось создать чат',
              data: null,
            },
          };
        }
      },
      invalidatesTags: [{ type: 'Chats', id: 'LIST' }],
    }),

    // Отправить сообщение
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      async queryFn({ chat_id, user_id, text }) {
        try {
          // Проверяем, является ли пользователь участником чата
          const { data: participant, error: participantError } = await supabase
            .from('chat_participants')
            .select('*')
            .eq('chat_id', chat_id)
            .eq('user_id', user_id)
            .single();

          if (participantError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Вы не являетесь участником этого чата',
                data: participantError.details,
              },
            };
          }

          // Отправляем сообщение
          const { data: message, error: messageError } = await supabase
            .from('messages')
            .insert({ chat_id, user_id, text })
            .select()
            .single();

          if (messageError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: messageError.message,
                data: messageError.details,
              },
            };
          }

          // Обновляем время последнего обновления чата
          await supabase
            .from('chats')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', chat_id);

          return { data: message };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Не удалось отправить сообщение',
              data: null,
            },
          };
        }
      },
      invalidatesTags: (result, error, { chat_id }) => [
        { type: 'Chats', id: chat_id },
        { type: 'Messages', id: chat_id },
      ],
    }),

    // Пометить сообщения как прочитанные
    markMessagesAsRead: builder.mutation<{ success: boolean }, { chat_id: number; user_id: string }>({
      async queryFn({ chat_id, user_id }) {
        try {
          const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chat_id', chat_id)
            .neq('user_id', user_id)
            .eq('is_read', false);

          if (error) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: error.message,
                data: error.details,
              },
            };
          }

          return { data: { success: true } };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Не удалось пометить сообщения как прочитанные',
              data: null,
            },
          };
        }
      },
      invalidatesTags: (result, error, { chat_id }) => [
        { type: 'Chats', id: chat_id },
        { type: 'Messages', id: chat_id },
      ],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} = chatApi;

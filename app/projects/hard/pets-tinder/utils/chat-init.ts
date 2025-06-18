import { supabase } from './index';

// Функция для инициализации чата между двумя пользователями
export async function initializeChat(sellerId: string, buyerId: string, animalId: number) {
  try {
    // Проверяем существующие чаты для этого животного
    const { data: existingChats, error: existingChatsError } = await supabase
      .from('chats')
      .select('id')
      .eq('animals_id', animalId);

    if (existingChatsError) {
      console.error('Ошибка проверки существующих чатов:', existingChatsError);
      return null;
    }

    // Если есть существующие чаты для этого животного, проверим участников
    if (existingChats && existingChats.length > 0) {
      for (const chat of existingChats) {
        const { data: participants, error: participantsError } = await supabase
          .from('chat_participants')
          .select('user_id')
          .eq('chat_id', chat.id);

        if (participantsError) {
          console.error('Ошибка проверки участников чата:', participantsError);
          continue;
        }

        // Проверяем, есть ли оба пользователя в существующем чате
        const participantIds = participants?.map(p => p.user_id) || [];
        const allParticipantsPresent = [sellerId, buyerId].every(id => 
          participantIds.includes(id)
        );

        if (allParticipantsPresent && participantIds.length === 2) {
          return chat.id;
        }
      }
    }

    // Создаем новый чат
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert({ animals_id: animalId })
      .select()
      .single();

    if (chatError) {
      console.error('Ошибка создания чата:', chatError);
      return null;
    }

    // Добавляем участников
    const participantsData = [
      { user_id: sellerId, chat_id: chatData.id },
      { user_id: buyerId, chat_id: chatData.id }
    ];

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participantsData);

    if (participantsError) {
      console.error('Ошибка добавления участников чата:', participantsError);
      
      // В случае ошибки удаляем созданный чат
      await supabase
        .from('chats')
        .delete()
        .eq('id', chatData.id);
      
      return null;
    }

    return chatData.id;
  } catch (error) {
    console.error('Ошибка инициализации чата:', error);
    return null;
  }
}

// Функция для отправки первого приветственного сообщения
export async function sendWelcomeMessage(chatId: number, userId: string, animalName: string) {
  try {
    const welcomeText = `Здравствуйте! Я заинтересован(а) в питомце "${animalName}". Можете рассказать о нем подробнее?`;
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: userId,
        text: welcomeText
      })
      .select()
      .single();

    if (error) {
      console.error('Ошибка отправки приветственного сообщения:', error);
      return null;
    }

    // Обновляем время последнего обновления чата
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

    return data;
  } catch (error) {
    console.error('Ошибка отправки приветственного сообщения:', error);
    return null;
  }
} 
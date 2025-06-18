'use client';

import { JSX, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { useGetAllAnimalsQuery, Animal } from '@/app/projects/hard/pets-tinder/redux/api/animals-api';
import { LoadingCard, ErrorCard } from '@/app/projects/hard/pets-tinder/components/ui';
import { useGetUserByIdQuery } from '@/app/projects/hard/pets-tinder/redux/api/users-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateChatMutation } from '@/app/projects/hard/pets-tinder/redux/api/chat-api';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';
import { initializeChat, sendWelcomeMessage } from '@/app/projects/hard/pets-tinder/utils/chat-init';

const PetsPage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const router = useRouter();
  const { data: pets, isLoading, error } = useGetAllAnimalsQuery();
  const [selectedPet, setSelectedPet] = useState<Animal | null>(null);
  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();

  // Вспомогательные функции для отображения свойств питомцев
  const getPetTypeLabel = (view: 'd' | 'c') => {
    return view === 'd' ? 'Собака' : 'Кошка';
  };
  
  const getGenderLabel = (gender: 'm' | 'w') => {
    return gender === 'm' ? 'Самец' : 'Самка';
  };
  
  const getStatusLabel = (status: 'available' | 'reserved' | 'closed') => {
    switch (status) {
      case 'available':
        return 'Доступен';
      case 'reserved':
        return 'Зарезервирован';
      case 'closed':
        return 'Продан';
      default:
        return status;
    }
  };
  
  const getStatusBadgeColor = (status: 'available' | 'reserved' | 'closed') => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  // Компонент для отображения информации о владельце
  const PetOwner = ({ userId }: { userId: string }) => {
    const { data: user, isLoading } = useGetUserByIdQuery(userId);
    
    if (isLoading) return <div>Загрузка...</div>;
    if (!user) return <div>Информация о владельце недоступна</div>;
    
    return (
      <div className="text-sm">
        <p><strong>Владелец:</strong> {user.full_name || user.username}</p>
        <p><strong>Контакт:</strong> {user.phone || 'Не указан'}</p>
      </div>
    );
  };

  // Функция для создания чата с владельцем питомца
  const handleContactOwner = async (pet: Animal) => {
    if (!user) {
      toast.error('Для связи с владельцем необходимо авторизоваться');
      router.push('/projects/hard/pets-tinder/pages/login');
      return;
    }

    if (user.id === pet.user_id) {
      toast.error('Вы не можете создать чат с самим собой');
      return;
    }

    try {
      // Используем функцию инициализации чата
      const chatId = await initializeChat(pet.user_id, user.id, pet.id);
      
      if (!chatId) {
        toast.error('Не удалось создать чат');
        return;
      }
      
      // Отправляем приветственное сообщение
      await sendWelcomeMessage(chatId, user.id, pet.name);
      
      toast.success('Чат создан');
      router.push(`/projects/hard/pets-tinder/pages/chat/${chatId}`);
    } catch (error) {
      console.error('Ошибка создания чата:', error);
      toast.error('Не удалось создать чат');
    }
  };

  if (isLoading) {
    return <LoadingCard message="Загрузка питомцев..." />;
  }

  if (error) {
    return <ErrorCard message="Не удалось загрузить данные о питомцах" />;
  }

  if (!pets || pets.length === 0) {
    return (
      <Card className="p-4">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Питомцы не найдены</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 gap-4">
      <CardHeader className="p-0">
        <div className="grid gap-1.5">
          <CardTitle>Каталог питомцев</CardTitle>
          <CardDescription>Ознакомьтесь со всеми доступными питомцами</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <CardDescription>
                      {getPetTypeLabel(pet.view)} - {pet.breed}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusBadgeColor(pet.status)}>
                    {getStatusLabel(pet.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Возраст: {pet.age} {pet.age === 1 ? 'год' : pet.age > 1 && pet.age < 5 ? 'года' : 'лет'}</div>
                  <div>Пол: {getGenderLabel(pet.gender)}</div>
                  <div>Цена: {pet.price} ₽</div>
                  {pet.color && <div>Окрас: {pet.color}</div>}
                  {pet.weight && <div>Вес: {pet.weight} кг</div>}
                  {pet.height && <div>Рост: {pet.height} см</div>}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {pet.vaccination && (
                    <Badge variant="outline" className="text-xs">Вакцинирован</Badge>
                  )}
                  {pet.pedigree && (
                    <Badge variant="outline" className="text-xs">Родословная</Badge>
                  )}
                  {pet.microchip && (
                    <Badge variant="outline" className="text-xs">Чипирован</Badge>
                  )}
                </div>
                
                {pet.description && (
                  <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {pet.description}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPet(pet)}
                >
                  <Eye className="h-4 w-4 mr-2" /> Подробнее
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" /> В избранное
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Диалог для отображения подробной информации о питомце */}
      <Dialog open={!!selectedPet} onOpenChange={(open) => !open && setSelectedPet(null)}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedPet && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPet.name}</DialogTitle>
                <DialogDescription>
                  {getPetTypeLabel(selectedPet.view)} - {selectedPet.breed}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Основная информация</h4>
                    <div className="mt-1 text-sm">
                      <p>Возраст: {selectedPet.age} {selectedPet.age === 1 ? 'год' : selectedPet.age > 1 && selectedPet.age < 5 ? 'года' : 'лет'}</p>
                      <p>Пол: {getGenderLabel(selectedPet.gender)}</p>
                      <p>Цена: {selectedPet.price} ₽</p>
                      <p>Статус: {getStatusLabel(selectedPet.status)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Характеристики</h4>
                    <div className="mt-1 text-sm">
                      {selectedPet.color && <p>Окрас: {selectedPet.color}</p>}
                      {selectedPet.weight && <p>Вес: {selectedPet.weight} кг</p>}
                      {selectedPet.height && <p>Рост: {selectedPet.height} см</p>}
                      <p>Вакцинирован: {selectedPet.vaccination ? 'Да' : 'Нет'}</p>
                      <p>Родословная: {selectedPet.pedigree ? 'Есть' : 'Нет'}</p>
                      <p>Чипирован: {selectedPet.microchip ? 'Да' : 'Нет'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedPet.description && (
                  <div>
                    <h4 className="text-sm font-medium">Описание</h4>
                    <p className="mt-1 text-sm">{selectedPet.description}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium">Контактная информация</h4>
                  <div className="mt-1">
                    <PetOwner userId={selectedPet.user_id} />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Добавлен: {new Date(selectedPet.created_at).toLocaleDateString('ru-RU')}</p>
                  <p>Обновлен: {new Date(selectedPet.updated_at).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => handleContactOwner(selectedPet)} 
                  disabled={isCreatingChat || !user || user.id === selectedPet.user_id}
                >
                  {isCreatingChat ? 'Создание чата...' : 'Связаться с владельцем'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PetsPage;
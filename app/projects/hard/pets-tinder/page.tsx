'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui';
import { useGetAllAnimalsQuery } from '@/app/projects/hard/pets-tinder/redux/api/animals-api';
import { LoadingCard, ErrorCard } from '@/app/projects/hard/pets-tinder/components/ui';

const HomePage = (): JSX.Element => {
  const { data: pets, isLoading, error } = useGetAllAnimalsQuery();

  // Получаем только доступных питомцев для главной страницы
  const availablePets = pets?.filter(pet => pet.status === 'available').slice(0, 4);

  // Вспомогательные функции для отображения свойств питомцев
  const getPetTypeLabel = (view: 'd' | 'c') => {
    return view === 'd' ? 'Собака' : 'Кошка';
  };

  return (
    <Card className="p-4 gap-4">
      <CardHeader className="p-0">
        <div className="grid gap-1.5">
          <CardTitle className="text-2xl">Добро пожаловать в Pets Tinder</CardTitle>
          <CardDescription>Найдите своего идеального питомца</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 pt-4">
        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Доступные питомцы</h2>
            
            {isLoading && <LoadingCard message="Загрузка питомцев..." />}
            
            {error && <ErrorCard message="Не удалось загрузить данные о питомцах" />}
            
            {!isLoading && !error && availablePets && availablePets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {availablePets.map(pet => (
                  <Link key={pet.id} href={`/projects/hard/pets-tinder/pages/pets?id=${pet.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {getPetTypeLabel(pet.view)} - {pet.breed}
                        </p>
                        <p className="text-sm">Возраст: {pet.age} {pet.age === 1 ? 'год' : pet.age > 1 && pet.age < 5 ? 'года' : 'лет'}</p>
                        <p className="text-sm">Цена: {pet.price} ₽</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : !isLoading && !error ? (
              <p className="text-muted-foreground">Нет доступных питомцев</p>
            ) : null}
            
            <div className="mt-4 flex justify-end">
              <Link href="/projects/hard/pets-tinder/pages/pets">
                <Button variant="outline">
                  Смотреть всех питомцев <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Для владельцев питомцев</h3>
              <p className="text-sm text-muted-foreground mb-4">Зарегистрируйтесь и добавьте своих питомцев для продажи или обмена</p>
              <Link href="/projects/hard/pets-tinder/pages/profile">
                <Button variant="outline" size="sm">
                  Управление питомцами
                </Button>
              </Link>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Для покупателей</h3>
              <p className="text-sm text-muted-foreground mb-4">Найдите идеального питомца для вашего дома</p>
              <Link href="/projects/hard/pets-tinder/pages/pets">
                <Button variant="outline" size="sm">
                  Просмотр каталога
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePage;
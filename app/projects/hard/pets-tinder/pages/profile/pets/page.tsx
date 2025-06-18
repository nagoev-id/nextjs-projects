'use client';

import { JSX, useState } from 'react';
import { Check, Edit, PlusCircle, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
} from '@/components/ui';
import { FormInput, FormSelect } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Animal,
  useCreateAnimalMutation,
  useDeleteAnimalMutation,
  useGetAnimalsByUserIdQuery,
  useUpdateAnimalMutation,
} from '@/app/projects/hard/pets-tinder/redux/api/animals-api';
import { selectAuthData, useAppSelector } from '@/app/projects/hard/pets-tinder/redux';
import { ErrorCard, LoadingCard } from '@/app/projects/hard/pets-tinder/components/ui';
import { SCHEMA_LIST } from '@/app/projects/hard/pets-tinder/utils';

const PetsPage = (): JSX.Element => {
  const { user } = useAppSelector(selectAuthData);
  const userId = user?.id;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Animal | null>(null);
  const [petToDelete, setPetToDelete] = useState<number | null>(null);

  const { data: pets, isLoading, error } = useGetAnimalsByUserIdQuery(userId || '', { skip: !userId });
  const [createAnimal, { isLoading: isCreating }] = useCreateAnimalMutation();
  const [updateAnimal, { isLoading: isUpdating }] = useUpdateAnimalMutation();
  const [deleteAnimal, { isLoading: isDeleting }] = useDeleteAnimalMutation();

  const form = useForm({
    resolver: zodResolver(SCHEMA_LIST.ANIMAL_CREATE),
    defaultValues: {
      name: '',
      view: 'd',
      breed: '',
      age: 0,
      gender: 'm',
      price: 0,
      vaccination: false,
      pedigree: false,
      microchip: false,
      status: 'available',
    },
  } as const);

  const resetForm = () => {
    form.reset({
      name: '',
      view: 'd',
      breed: '',
      age: 0,
      gender: 'm',
      price: 0,
      vaccination: false,
      pedigree: false,
      microchip: false,
      status: 'available',
    });
    setIsAddDialogOpen(false);
    setEditingPet(null);
  };

  const handleEditPet = (pet: Animal) => {
    form.reset({
      name: pet.name,
      view: pet.view,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      price: pet.price,
      color: pet.color,
      weight: pet.weight,
      height: pet.height,
      vaccination: pet.vaccination,
      pedigree: pet.pedigree,
      microchip: pet.microchip,
      description: pet.description,
      status: pet.status,
    });
    setEditingPet(pet);
  };

  const onSubmit = async (values: any) => {
    if (!userId) return;

    try {
      if (editingPet) {
        await updateAnimal({
          id: editingPet.id,
          ...values,
        }).unwrap();
        toast.success('Питомец успешно обновлен');
      } else {
        await createAnimal({
          user_id: userId,
          ...values,
        }).unwrap();
        toast.success('Питомец успешно добавлен');
      }
      resetForm();
    } catch (err) {
      toast.error(editingPet ? 'Не удалось обновить питомца' : 'Не удалось добавить питомца');
      console.error('Ошибка:', err);
    }
  };

  const handleDeletePet = async () => {
    if (petToDelete === null) return;

    try {
      const result = await deleteAnimal(petToDelete).unwrap();
      if (result.success) {
        toast.success('Питомец успешно удален');
        setPetToDelete(null);
      } else {
        toast.error('Не удалось удалить питомца');
      }
    } catch (err) {
      toast.error('Не удалось удалить питомца');
      console.error('Ошибка удаления:', err);
    }
  };

  const getPetTypeLabel = (view: 'd' | 'c') => {
    return view === 'd' ? 'Собака' : 'Кошка';
  };

  const getGenderLabel = (gender: 'm' | 'w') => {
    return gender === 'm' ? 'Самец' : 'Самка';
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

  const getStatusLabel = (status: 'available' | 'reserved' | 'closed') => {
    switch (status) {
      case 'available':
        return 'Доступен';
      case 'reserved':
        return 'Зарезервирован';
      case 'closed':
        return 'Закрыт';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <LoadingCard message="Загрузка ваших питомцев..." />;
  }

  if (error) {
    return <ErrorCard message="Не удалось загрузить данные о питомцах" />;
  }

  return (
    <Card className="p-4 gap-4">
      <CardHeader className="p-0">
        <div className="grid gap-1.5 sm:flex sm:justify-between sm:items-center">
          <div className="grid gap-1.5">
            <CardTitle>Ваши питомцы</CardTitle>
            <CardDescription>Управление объявлениями о питомцах</CardDescription>
          </div>
          <Button className="max-w-max" onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить питомца
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {pets && pets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden p-4 gap-2">
                <CardHeader className="p-0">
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
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Возраст: {pet.age} лет</div>
                    <div>Пол: {getGenderLabel(pet.gender)}</div>
                    <div>Цена: ${pet.price}</div>
                    {pet.color && <div>Цвет: {pet.color}</div>}
                    {pet.weight && <div>Вес: {pet.weight} кг</div>}
                    {pet.height && <div>Рост: {pet.height} см</div>}
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                <CardFooter className="p-4 pt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPet(pet)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Редактировать
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setPetToDelete(pet.id)}>
                        <Trash className="h-4 w-4 mr-1" /> Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Это навсегда удалит объявление о вашем питомце {pet.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPetToDelete(null)}>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePet} disabled={isDeleting}>
                          {isDeleting ? 'Удаление...' : 'Удалить'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center gap-1.5">
            <p className="text-muted-foreground">У вас пока нет размещенных питомцев.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Добавить первого питомца
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isAddDialogOpen || editingPet !== null} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingPet ? 'Редактировать питомца' : 'Добавить нового питомца'}</DialogTitle>
            <DialogDescription>
              {editingPet ? 'Обновите информацию о вашем питомце ниже.' : 'Введите данные о вашем питомце ниже, чтобы создать новое объявление.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="name"
                  label="Имя питомца"
                  placeholder="Введите имя питомца"
                />

                <FormSelect
                  form={form}
                  name="view"
                  label="Тип питомца"
                  options={[
                    { value: 'd', label: 'Собака' },
                    { value: 'c', label: 'Кошка' },
                  ]}
                  selectProps={{
                    className: 'w-full',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="breed"
                  label="Порода"
                  placeholder="Введите породу"
                />

                <FormInput
                  form={form}
                  name="age"
                  label="Возраст (лет)"
                  type="number"
                  placeholder="Введите возраст"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  form={form}
                  name="gender"
                  label="Пол"
                  options={[
                    { value: 'm', label: 'Самец' },
                    { value: 'w', label: 'Самка' },
                  ]}
                  selectProps={{
                    className: 'w-full',
                  }}
                />

                <FormInput
                  form={form}
                  name="price"
                  label="Цена (₽)"
                  type="number"
                  placeholder="Введите цену"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  form={form}
                  name="color"
                  label="Цвет"
                  placeholder="Введите цвет"
                />

                <FormInput
                  form={form}
                  name="weight"
                  label="Вес (кг)"
                  type="number"
                  placeholder="Введите вес"
                />

                <FormInput
                  form={form}
                  name="height"
                  label="Рост (см)"
                  type="number"
                  placeholder="Введите рост"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vaccination"
                    checked={form.watch('vaccination')}
                    onCheckedChange={(checked) => form.setValue('vaccination', checked as boolean)}
                  />
                  <label
                    htmlFor="vaccination"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Вакцинирован
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pedigree"
                    checked={form.watch('pedigree')}
                    onCheckedChange={(checked) => form.setValue('pedigree', checked as boolean)}
                  />
                  <label
                    htmlFor="pedigree"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Родословная
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="microchip"
                    checked={form.watch('microchip')}
                    onCheckedChange={(checked) => form.setValue('microchip', checked as boolean)}
                  />
                  <label
                    htmlFor="microchip"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Чипирован
                  </label>
                </div>
              </div>

              <FormSelect
                form={form}
                name="status"
                label="Статус"
                options={[
                  { value: 'available', label: 'Доступен' },
                  { value: 'reserved', label: 'Зарезервирован' },
                  { value: 'closed', label: 'Закрыт' },
                ]}
                selectProps={{
                  className: 'w-full',
                }}
              />

              <FormInput
                form={form}
                name="description"
                label="Описание (необязательно)"
                type="textarea"
                placeholder="Введите описание питомца"
                inputProps={{ rows: 3 }}
              />

              <DialogFooter className="mt-4">
                <Button variant="outline" type="button" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  <Check className="h-4 w-4 mr-2" />
                  {isCreating || isUpdating ? 'Сохранение...' : editingPet ? 'Обновить питомца' : 'Добавить питомца'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PetsPage;
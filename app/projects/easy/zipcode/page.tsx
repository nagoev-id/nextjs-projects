'use client';

/**
 * # Zip Code Finder
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация:**
 *    - Приложение использует React с хуками для управления состоянием и эффектами.
 *    - При загрузке инициализируется карта Leaflet с начальными координатами.
 *
 * 2. **Форма поиска:**
 *    - Пользователь выбирает страну из выпадающего списка и вводит почтовый индекс.
 *    - Форма проверяет заполнение всех полей перед отправкой.
 *
 * 3. **Запрос данных:**
 *    - При отправке формы выполняется запрос к API Zippopotam.us.
 *    - Запрос выполняется с помощью axios.
 *
 * 4. **Обработка данных:**
 *    - Полученные данные включают координаты, штат и название места.
 *    - Данные форматируются и сохраняются в состоянии приложения.
 *
 * 5. **Обновление карты:**
 *    - На основе полученных координат обновляется положение карты.
 *    - На карте устанавливается маркер с иконкой булавки.
 *
 * 6. **Отображение информации:**
 *    - Информация о местоположении отображается в виде таблицы.
 *    - Таблица содержит широту, долготу, штат и название места.
 *
 * 7. **Обработка ошибок:**
 *    - При возникновении ошибок во время запроса данных выводится уведомление.
 *
 * 8. **Адаптивный дизайн:**
 *    - Интерфейс адаптируется к различным размерам экрана.
 *
 * Приложение предоставляет простой и интуитивно понятный интерфейс для поиска
 * географического положения по почтовому индексу, визуализируя результаты на карте
 * и отображая подробную информацию в удобном формате.
 */
import { Button } from '@/components/ui/button';
import { JSX, useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { codes } from '@/app/projects/easy/zipcode/mock';
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/layout';
import { Form } from '@/components/ui';
import axios from 'axios';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Динамический импорт компонента карты без SSR
 * @type {React.ComponentType<{position: [number, number]}>}
 */
const MapComponent = dynamic(() => import('./components/map'), {
  ssr: false,
  loading: () => <div className="min-h-[300px] w-full border rounded flex items-center justify-center">Loading
    map...</div>,
});

/**
 * Схема валидации формы
 * @type {z.ZodObject<{source: z.ZodString, zip: z.ZodString}>}
 */
const formSchema = z.object({
  source: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Zip code is required'),
});

/**
 * Тип данных формы, соответствующий схеме валидации
 * @typedef {z.infer<typeof formSchema>} FormData
 */
type FormData = z.infer<typeof formSchema>;

/**
 * Компонент страницы поиска по почтовому индексу
 * @component
 * @returns {JSX.Element} Компонент страницы
 */
const ZipCodePage = (): JSX.Element => {
  /**
   * Состояние для хранения данных о местоположении и состояния запроса
   * @type {Object}
   * @property {Object} data - Данные о местоположении
   * @property {Array<{label: string, value: string}>} options - Опции для выбора страны
   * @property {boolean} isLoading - Флаг загрузки
   * @property {boolean} isError - Флаг ошибки
   * @property {boolean} isSuccess - Флаг успешного запроса
   */
  const [placeState, setPlaceState] = useState({
    data: {
      latitude: '', longitude: '', state: '', placeName: '',
    },
    options: codes.map(({ name, value }) => ({ label: name, value })),
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  /**
   * Хук useForm для управления формой
   * @type {UseFormReturn<FormData>}
   */
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { source: '', zip: '' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы
   * @function
   * @async
   * @param {FormData} values - Значения формы
   * @returns {Promise<void>}
   */
  const onSubmit = useCallback(async (values: FormData): Promise<void> => {
    setPlaceState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await axios.get(`https://api.zippopotam.us/${values.source}/${values.zip}`);
      const { latitude, longitude, state, 'place name': placeName } = data.places[0];
      setPlaceState(prev => ({
        ...prev,
        data: { latitude, longitude, state, placeName },
        isLoading: false,
        isError: false,
        isSuccess: true,
      }));
      toast.success('Location found!', { richColors: true });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Location not found. Please check your input.', { richColors: true });
      setPlaceState(prev => ({ ...prev, isLoading: false, isSuccess: false, isError: true }));
    }
  }, []);

  /**
   * Позиция для отображения на карте
   * @type {[number, number]}
   */
  const mapPosition: [number, number] = placeState.data.latitude && placeState.data.longitude
    ? [parseFloat(placeState.data.latitude), parseFloat(placeState.data.longitude)]
    : [51.505, -0.09]; // Лондон по умолчанию

  /**
   * Проверка валидности координат
   * @type {boolean}
   */
  const hasValidCoordinates = placeState.data.latitude &&
    placeState.data.longitude &&
    !isNaN(parseFloat(placeState.data.latitude)) &&
    !isNaN(parseFloat(placeState.data.longitude));

  return (
    <Card className="max-w-sm gap-0 w-full mx-auto p-4 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormSelect
            form={form}
            name="source"
            label="Select Country"
            placeholder="Select Country"
            options={codes.map(({ name, value }) => ({ label: name, value }))}
            selectProps={{
              className: 'w-full',
            }}
          />
          <FormInput
            form={form}
            name="zip"
            label="Zip Code"
            placeholder="Zip Code"
            aria-label="Enter Zip Code"
            disabled={placeState.isLoading}
          />
          <Button type="submit" disabled={placeState.isLoading}>
            {placeState.isLoading ? 'Searching...' : 'Submit'}
          </Button>
        </form>
      </Form>

      {hasValidCoordinates && (
        <div className="mt-4">
          <ul className="grid gap-3 place-items-center text-center sm:grid-cols-2 mb-4">
            <li className="flex flex-col gap-1 w-full p-1 h-full border">
              <p className="font-bold">Latitude</p>
              <p>{placeState.data.latitude}</p>
            </li>
            <li className="flex flex-col gap-1 w-full p-1 h-full border">
              <p className="font-bold">Longitude</p>
              <p>{placeState.data.longitude}</p>
            </li>
            <li className="flex flex-col gap-1 w-full p-1 h-full border">
              <p className="font-bold">State</p>
              <p>{placeState.data.state}</p>
            </li>
            <li className="flex flex-col gap-1 w-full p-1 h-full border">
              <p className="font-bold">Place Name</p>
              <p>{placeState.data.placeName}</p>
            </li>
          </ul>

          {/* Используем отдельный компонент карты */}
          <MapComponent position={mapPosition} />
        </div>
      )}
    </Card>
  );
};

export default ZipCodePage;
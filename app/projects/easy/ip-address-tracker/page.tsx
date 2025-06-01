'use client';

/**
 * # IP Address Tracker
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация:**
 *    - Приложение использует React с хуками для управления состоянием и эффектами.
 *    - При загрузке инициализируется карта Leaflet с начальными координатами.
 *    - Загружается последний сохраненный IP-адрес из локального хранилища.
 *
 * 2. **Форма поиска:**
 *    - Пользователь может ввести IP-адрес или домен в форму поиска.
 *    - Форма управляется с помощью react-hook-form с валидацией Zod.
 *
 * 3. **Запрос данных:**
 *    - При отправке формы или загрузке сохраненного IP выполняется запрос к API ipify.
 *    - Запрос выполняется с помощью axios.
 *
 * 4. **Обработка данных:**
 *    - Полученные данные включают IP-адрес, местоположение, часовой пояс и ISP.
 *    - Данные форматируются и сохраняются в состоянии приложения.
 *
 * 5. **Обновление карты:**
 *    - На основе полученных координат обновляется положение карты.
 *    - На карте устанавливается маркер с иконкой булавки.
 *
 * 6. **Отображение информации:**
 *    - Информация о местоположении отображается в виде списка карточек.
 *    - Каждая карточка содержит определенный тип данных (IP, местоположение, часовой пояс, ISP).
 *
 * 7. **Обработка ошибок:**
 *    - При возникновении ошибок во время запроса данных выводится уведомление.
 *
 * 8. **Сохранение состояния:**
 *    - Последний успешно найденный IP-адрес сохраняется в локальном хранилище.
 *
 * 9. **Адаптивный дизайн:**
 *    - Интерфейс адаптируется к различным размерам экрана.
 *
 * Приложение предоставляет простой и интуитивно понятный интерфейс для отслеживания
 * географического положения IP-адресов или доменов, визуализируя результаты на карте
 * и отображая подробную информацию в удобном формате.
 */

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { MdPushPin } from 'react-icons/md';
import { renderToString } from 'react-dom/server';
import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/layout';
import { Button } from '@/components/ui';
import { formSchema, FormValues } from '@/app/projects/easy/ip-address-tracker/utils';
import { useStorage } from '@/shared/hooks';

/**
 * Дефолтный IP-адрес для начальной загрузки
 */
const DEFAULT_IP = '101.11.201.22';

/**
 * API ключ для сервиса ipify
 */
const API_KEY = 'at_D5MQsxItBHTAuuGXJEefzDtDNm2QH';

/**
 * Начальная конфигурация для отображения информации о местоположении
 */
const INITIAL_LOCATION_CONFIG = [
  { name: 'IP Address', value: DEFAULT_IP, dataType: 'ip' },
  { name: 'Location', value: 'TW Taiwan', dataType: 'location' },
  { name: 'Timezone', value: '+08:00', dataType: 'timezone' },
  { name: 'ISP', value: 'Taiwan Mobile Co., Ltd.', dataType: 'isp' },
];

/**
 * Интерфейс для конфигурации местоположения
 */
interface LocationConfig {
  name: string;
  value: string;
  dataType: string;
}

/**
 * Компонент страницы IP Address Tracker
 * @returns {JSX.Element} Элемент страницы IP Address Tracker
 */
const IPAddressTrackerPage = (): JSX.Element => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [locationConfig, setLocationConfig] = useState<LocationConfig[]>(INITIAL_LOCATION_CONFIG);
  const [storedIp, setStoredIp] = useStorage('ip-address', DEFAULT_IP);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
    mode: 'onChange',
  });

  /**
   * Обновляет карту с новыми координатами и маркером
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   */
  const updateMap = useCallback((lat: number, lng: number) => {
    if (!mapInstance) return;
    mapInstance.setView([lat, lng], 13);
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });
    L.marker([lat, lng], {
      icon: L.divIcon({
        html: renderToString(<MdPushPin size={30} />),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        className: 'custom-icon',
      }),
    }).addTo(mapInstance);
  }, [mapInstance]);

  /**
   * Получает данные о местоположении по IP-адресу
   * @param {string} ipAddress - IP-адрес для поиска
   */
  const fetchData = useCallback(async (ipAddress: string) => {
    try {
      const {
        data: {
          ip,
          isp,
          location: { country, region, city, lat, lng, postalCode, timezone },
        },
      } = await axios.get('https://geo.ipify.org/api/v2/country,city', {
        params: {
          apiKey: API_KEY,
          ipAddress: ipAddress || DEFAULT_IP,
        },
      });

      const locationString = [
        city,
        region,
        country,
        postalCode,
      ].filter(Boolean).join(', ');

      setLocationConfig([
        { name: 'IP Address', value: ip, dataType: 'ip' },
        { name: 'Location', value: locationString, dataType: 'location' },
        { name: 'Timezone', value: timezone, dataType: 'timezone' },
        { name: 'ISP', value: isp, dataType: 'isp' },
      ]);

      updateMap(lat, lng);
    } catch (error) {
      console.error('Error fetching IP data:', error);
      toast.error('Failed to fetch IP data', {
        richColors: true,
      });
    }
  }, [updateMap]);

  /**
   * Обработчик отправки формы
   * @param {FormValues} values - Значения формы
   */
  const onSubmit = useCallback(async (values: FormValues): Promise<void> => {
    const { query } = values;
    setStoredIp(query);
    await fetchData(query);
  }, [fetchData, setStoredIp]);

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current || mapInstance) return;

    const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    setMapInstance(map);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Загрузка данных при инициализации или изменении сохраненного IP
  useEffect(() => {
    if (mapInstance) {
      fetchData(storedIp);
    }
  }, [mapInstance, storedIp, fetchData]);

  return (
    <Card className="max-w-sm w-full gap-0 mx-auto p-4 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormInput
            form={form}
            name="query"
            placeholder="Search for any IP address or domain"
            autoComplete="off"
            aria-label="IP address input"
          />
          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>
      </Form>

      <ul className="grid gap-3 place-items-center text-center sm:grid-cols-2 mt-4">
        {locationConfig.map(({ name, value, dataType }) => (
          <li className="flex flex-col gap-1 w-full p-1 h-full border" key={name}>
            <p className="font-bold">{name}</p>
            <p>{dataType === 'timezone' && 'UTC '}{value}</p>
          </li>
        ))}
      </ul>

      <div className="map min-h-[300px] mt-4" ref={mapRef}></div>
    </Card>
  );
};

export default IPAddressTrackerPage;
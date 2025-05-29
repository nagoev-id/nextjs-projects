'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { MdPushPin } from 'react-icons/md';

/**
 * @interface MapProps
 * @description Интерфейс для пропсов компонента Map
 */
interface MapProps {
  /** Координаты для отображения на карте */
  position: [number, number];
}

/**
 * @type {React.FC<MapProps>}
 * @description Компонент для отображения карты с маркером местоположения
 * @param {Object} props - Пропсы компонента
 * @param {[number, number]} props.position - Координаты для отображения на карте
 * @returns {JSX.Element} Элемент div с картой
 */
const Map = ({ position }: MapProps) => {
  /** Реф для DOM-элемента карты */
  const mapRef = useRef<HTMLDivElement>(null);
  /** Реф для экземпляра карты Leaflet */
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Инициализация карты, если она еще не создана
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(position, 8);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    } else {
      // Карта уже существует, просто обновляем вид
      mapInstanceRef.current.setView(position, 8);
    }

    // Создание иконки маркера
    const icon = L.divIcon({
      html: renderToString(<MdPushPin size={30} />),
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      className: 'custom-icon',
    })

    // Очистка существующих маркеров и добавление нового
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    L.marker(position, { icon }).addTo(mapInstanceRef.current);

    /**
     * @function handleResize
     * @description Обработчик изменения размера окна
     */
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Принудительное изменение размера после небольшой задержки для обеспечения финализации размеров контейнера
    setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position]);

  return (
    <div
      className="map min-h-[300px] w-full border rounded"
      ref={mapRef}
      aria-label="Map showing location"
    />
  );
};

export default Map;
'use client';

/**
 * # Редактор изображений
 *
 * ## Принцип работы:
 *
 * 1. **Загрузка изображения**:
 *    - Пользователь может загрузить изображение, нажав на кнопку "Choose Image"
 *    - Изображение отображается в области предпросмотра с помощью HTML5 Canvas
 *
 * 2. **Применение фильтров**:
 *    - Доступны четыре основных фильтра: яркость (brightness), насыщенность (saturation), инверсия (inversion) и оттенки серого (grayscale)
 *    - Пользователь выбирает фильтр, нажимая на соответствующую кнопку
 *    - Интенсивность фильтра регулируется с помощью ползунка (от 0% до 200%)
 *    - Фильтры применяются в реальном времени с использованием CSS filter API
 *
 * 3. **Трансформация изображения**:
 *    - Поворот: изображение можно повернуть на 90° влево или вправо
 *    - Отражение: изображение можно отразить по горизонтали или вертикали
 *    - Трансформации применяются с использованием методов canvas context (rotate, scale)
 *
 * 4. **Обработка изображения**:
 *    - Все изменения применяются к изображению через HTML5 Canvas API
 *    - При каждом изменении фильтров или трансформаций изображение перерисовывается
 *    - Используется оптимизация с помощью useCallback и useMemo для предотвращения лишних рендеров
 *
 * 5. **Сохранение результата**:
 *    - Пользователь может сохранить отредактированное изображение, нажав кнопку "Save Image"
 *    - Изображение сохраняется в формате PNG с примененными фильтрами и трансформациями
 *    - Для сохранения используется метод toDataURL() canvas и программное создание ссылки для скачивания
 *
 * 6. **Сброс настроек**:
 *    - Кнопка "Reset Filters" возвращает все фильтры и трансформации к исходным значениям
 *    - Исходное изображение остается загруженным и готовым к новым изменениям
 *
 * 7. **Адаптивный дизайн**:
 *    - Интерфейс адаптируется к различным размерам экрана
 *    - На мобильных устройствах элементы управления располагаются над областью предпросмотра
 */
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaArrowRotateLeft, FaArrowRotateRight, FaArrowsLeftRight } from 'react-icons/fa6';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageUpload } from '@/app/projects/easy/image-editor/hooks';

/**
 * @typedef {Object} FilterButtonProps
 * @property {string} filter - Название фильтра
 * @property {string} activeFilter - Текущий активный фильтр
 * @property {function} onClick - Функция-обработчик клика по кнопке фильтра
 */
type FilterButtonProps = {
  filter: keyof Filters;
  activeFilter: keyof Filters;
  onClick: (filter: keyof Filters) => void;
}

/**
 * @typedef {Object} Filters
 * @property {number} brightness - Значение яркости изображения (в процентах)
 * @property {number} saturation - Значение насыщенности изображения (в процентах)
 * @property {number} inversion - Значение инверсии изображения (в процентах)
 * @property {number} grayscale - Значение оттенков серого изображения (в процентах)
 */
type Filters = {
  brightness: number;
  saturation: number;
  inversion: number;
  grayscale: number;
}

/**
 * @typedef {Object} Flip
 * @property {number} horizontal - Коэффициент горизонтального отражения (1 или -1)
 * @property {number} vertical - Коэффициент вертикального отражения (1 или -1)
 */
type Flip = {
  horizontal: number;
  vertical: number;
}

/**
 * Компонент кнопки фильтра
 *
 * @param {FilterButtonProps} props - Свойства компонента
 * @param {string} props.filter - Название фильтра
 * @param {string} props.activeFilter - Текущий активный фильтр
 * @param {function} props.onClick - Функция-обработчик клика
 * @returns {JSX.Element} - Кнопка фильтра с соответствующим стилем
 */
const FilterButton = ({ filter, activeFilter, onClick }: FilterButtonProps) => (
  <Button
    onClick={() => onClick(filter)}
    variant={activeFilter === filter ? 'default' : 'secondary'}
    aria-pressed={activeFilter === filter}
  >
    {filter.charAt(0).toUpperCase() + filter.slice(1)}
  </Button>
);

/**
 * Константы для значений фильтров по умолчанию
 * @constant {Filters}
 */
const DEFAULT_FILTERS: Filters = {
  brightness: 100,
  saturation: 100,
  inversion: 0,
  grayscale: 0,
};

/**
 * Константы для значений отражения по умолчанию
 * @constant {Flip}
 */
const DEFAULT_FLIP: Flip = { horizontal: 1, vertical: 1 };

/**
 * Компонент редактора изображений
 *
 * Позволяет загружать изображения, применять к ним различные фильтры (яркость,
 * насыщенность, инверсия, оттенки серого), а также выполнять трансформации
 * (поворот, отражение). Отредактированное изображение можно сохранить.
 *
 * @returns {JSX.Element} Компонент редактора изображений
 */
const ImageEditorPage = (): JSX.Element => {
  // Хуки и состояния
  /**
   * Хук для работы с загрузкой изображения
   * @type {Object}
   * @property {string|null} image - URL загруженного изображения
   * @property {React.RefObject<HTMLInputElement>} inputRef - Реф для input элемента
   * @property {function} handleImageClick - Обработчик клика для выбора изображения
   * @property {function} handleImageChange - Обработчик изменения выбранного изображения
   */
  const { image, inputRef, handleImageClick, handleImageChange } = useImageUpload();

  /**
   * Состояние фильтров изображения
   * @type {[Filters, React.Dispatch<React.SetStateAction<Filters>>]}
   */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  /**
   * Текущий активный фильтр
   * @type {[keyof Filters, React.Dispatch<React.SetStateAction<keyof Filters>>]}
   */
  const [activeFilter, setActiveFilter] = useState<keyof Filters>('brightness');

  /**
   * Угол поворота изображения (в градусах)
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [rotation, setRotation] = useState<number>(0);

  /**
   * Состояние отражения изображения
   * @type {[Flip, React.Dispatch<React.SetStateAction<Flip>>]}
   */
  const [flip, setFlip] = useState<Flip>(DEFAULT_FLIP);

  /**
   * Реф для доступа к canvas элементу
   * @type {React.RefObject<HTMLCanvasElement>}
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Обработчик изменения значения фильтра
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Событие изменения ползунка
   */
  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setFilters(prev => ({ ...prev, [activeFilter]: value }));
  }, [activeFilter]);

  /**
   * Обработчик выбора активного фильтра
   *
   * @param {keyof Filters} filter - Выбранный фильтр
   */
  const handleFilterClick = useCallback((filter: keyof Filters) => {
    setActiveFilter(filter);
  }, []);

  /**
   * Обработчик поворота изображения
   *
   * @param {'left'|'right'} direction - Направление поворота
   */
  const handleRotate = useCallback((direction: 'left' | 'right') => {
    setRotation(prev => direction === 'left' ? prev - 90 : prev + 90);
  }, []);

  /**
   * Обработчик отражения изображения
   *
   * @param {keyof Flip} direction - Направление отражения (horizontal или vertical)
   */
  const handleFlip = useCallback((direction: keyof Flip) => {
    setFlip(prev => ({ ...prev, [direction]: prev[direction] * -1 }));
  }, []);

  /**
   * Сбрасывает все фильтры и трансформации к значениям по умолчанию
   */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setRotation(0);
    setFlip(DEFAULT_FLIP);
  }, []);

  /**
   * Применяет фильтры и трансформации к изображению на canvas
   *
   * Метод создает новое изображение, применяет к нему все текущие фильтры
   * и трансформации, а затем отрисовывает результат на canvas.
   */
  const applyFilter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    // Обработка ошибок загрузки изображения
    img.onerror = () => {
      console.error('Failed to load image');
    };

    img.onload = () => {
      // Сбрасываем трансформации перед новым рендером
      ctx.resetTransform();

      // Устанавливаем размеры canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Применяем фильтры
      ctx.filter = `brightness(${filters.brightness}%) 
                   saturate(${filters.saturation}%) 
                   invert(${filters.inversion}%) 
                   grayscale(${filters.grayscale}%)`;

      // Применяем трансформации
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flip.horizontal, flip.vertical);

      // Рисуем изображение
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    };

    // Устанавливаем источник изображения после определения обработчиков
    img.src = image;
  }, [image, filters, rotation, flip]);

  /**
   * Сохраняет отредактированное изображение
   *
   * Создает временную ссылку для скачивания изображения с canvas
   * в формате PNG и программно инициирует скачивание.
   */
  const saveImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    try {
      const link = document.createElement('a');
      link.download = `edited_image_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  }, [image]);

  /**
   * Мемоизированные кнопки фильтров
   *
   * @type {JSX.Element[]} Массив кнопок для каждого доступного фильтра
   */
  const filterButtons = useMemo(() => (
    Object.keys(filters).map((filter) => (
      <FilterButton
        key={filter}
        filter={filter as keyof Filters}
        activeFilter={activeFilter}
        onClick={handleFilterClick}
      />
    ))
  ), [filters, activeFilter, handleFilterClick]);

  /**
   * Эффект для применения фильтров при изменении параметров
   *
   * Вызывает функцию applyFilter при изменении изображения или параметров фильтров
   */
  useEffect(() => {
    if (image) {
      applyFilter();
    }
  }, [image, applyFilter]);

  /**
   * Компонент элементов управления фильтрами
   *
   * @type {JSX.Element} Блок с кнопками выбора фильтра и ползунком настройки
   */
  const FilterControls = (
    <div className="grid gap-2">
      <p className="font-medium">Filters</p>
      <div className="grid grid-cols-2 gap-2">
        {filterButtons}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</p>
          <p className="font-bold">{filters[activeFilter]}%</p>
        </div>
        <input
          type="range"
          value={filters[activeFilter]}
          min="0"
          max="200"
          onChange={handleFilterChange}
          aria-label={`Adjust ${activeFilter} level`}
        />
      </div>
    </div>
  );

  /**
   * Компонент элементов управления трансформацией
   *
   * @type {JSX.Element} Блок с кнопками для поворота и отражения изображения
   */
  const TransformControls = (
    <div className="grid gap-2">
      <p className="font-medium">Rotate & Flip</p>
      <div className="grid grid-cols-4 gap-2">
        <Button
          className="p-2 py-4 inline-flex justify-center items-center"
          onClick={() => handleRotate('left')}
          aria-label="Rotate left"
        >
          <FaArrowRotateLeft />
        </Button>
        <Button
          className="p-2 py-4 inline-flex justify-center items-center"
          onClick={() => handleRotate('right')}
          aria-label="Rotate right"
        >
          <FaArrowRotateRight />
        </Button>
        <Button
          className="p-2 py-4 inline-flex justify-center items-center"
          onClick={() => handleFlip('horizontal')}
          aria-label="Flip horizontally"
        >
          <FaArrowsLeftRight />
        </Button>
        <Button
          className="p-2 py-4 inline-flex justify-center items-center"
          onClick={() => handleFlip('vertical')}
          aria-label="Flip vertically"
        >
          <FaArrowsLeftRight className="rotate-90" />
        </Button>
      </div>
    </div>
  );

  /**
   * Компонент предпросмотра изображения
   *
   * @type {JSX.Element} Блок с canvas для отображения редактируемого изображения
   * или сообщение с предложением выбрать изображение
   */
  const ImagePreview = (
    <div
      className="relative overflow-auto grid h-full min-h-[400px] max-h-[600px] place-content-center rounded-md bg-gray-200"
      role="region"
      aria-label="Image preview"
    >
      {image ? (
        <canvas
          ref={canvasRef}
          className="absolute h-full w-full object-contain"
          aria-label="Edited image preview"
        />
      ) : (
        <div className="grid place-items-center gap-2">
          <p>Choose Image Or Edit</p>
        </div>
      )}
    </div>
  );

  /**
   * Компонент кнопок действий
   *
   * @type {JSX.Element} Блок с кнопками для сброса фильтров, выбора и сохранения изображения
   */
  const ActionButtons = (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={resetFilters}
        aria-label="Reset all filters and transformations"
      >
        Reset Filters
      </Button>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        ref={inputRef}
        onChange={handleImageChange}
        aria-label="Upload image"
      />
      <Button
        onClick={handleImageClick}
        aria-label="Choose an image to edit"
      >
        Choose Image
      </Button>
      <Button
        onClick={saveImage}
        disabled={!image}
        aria-label="Save edited image"
      >
        Save Image
      </Button>
    </div>
  );

  return (
    <Card className="max-w-5xl w-full mx-auto p-4 rounded gap-2">
      <div className="grid gap-3 md:grid-cols-[0.3fr_0.7fr]">
        <div className="grid gap-4 content-start">
          {FilterControls}
          {TransformControls}
        </div>
        {ImagePreview}
      </div>
      {ActionButtons}
    </Card>
  );
};

export default ImageEditorPage;
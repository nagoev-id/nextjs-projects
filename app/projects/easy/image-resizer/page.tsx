'use client';

/**
 * # Приложение для изменения размера изображения
 *
 * ## Принцип работы:
 *
 * 1. **Загрузка изображения**:
 *    - Пользователь может загрузить изображение, кликнув на область загрузки или перетащив файл.
 *    - После загрузки изображение отображается в области предпросмотра.
 *
 * 2. **Изменение размеров**:
 *    - Пользователь может ввести новую ширину и высоту изображения в соответствующие поля.
 *    - Если включена опция "Lock aspect ratio", при изменении одного размера второй автоматически корректируется для сохранения пропорций.
 *
 * 3. **Дополнительные опции**:
 *    - "Lock aspect ratio": при включении сохраняет пропорции изображения при изменении размеров.
 *    - "Reduce quality": при включении уменьшает качество изображения для уменьшения размера файла.
 *
 * 4. **Обработка изображения**:
 *    - При нажатии кнопки "Download Image" создается новый canvas с заданными размерами.
 *    - Изображение отрисовывается на canvas с новыми размерами.
 *    - Если включена опция уменьшения качества, применяется соответствующий коэффициент сжатия.
 *
 * 5. **Скачивание результата**:
 *    - Обработанное изображение конвертируется в формат JPEG.
 *    - Создается временная ссылка для скачивания файла.
 *    - Пользователь получает уведомление об успешном изменении размера изображения.
 *
 * 6. **Отзывчивый интерфейс**:
 *    - Интерфейс адаптируется к наличию или отсутствию загруженного изображения.
 *    - Кнопка скачивания активна только при наличии загруженного изображения.
 *
 * 7. **Оптимизация производительности**:
 *    - Используются хуки React для оптимизации рендеринга и обработки событий.
 *    - Функция загрузки изображения мемоизирована для предотвращения ненужных перерендеров.
 */

import React, { JSX, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PiImageSquareBold } from 'react-icons/pi';
import { useImageResize, useImageUpload } from '@/app/projects/easy/image-resizer/hooks';
import { toast } from 'sonner';

/**
 * Компонент для изменения размера изображения
 * @returns {JSX.Element} Элемент React, представляющий интерфейс для изменения размера изображения
 */
const ImageResizerPage = (): JSX.Element => {
  const { image, inputRef, handleImageClick, handleImageChange } = useImageUpload();
  const { dimensions, options, handleInputChange } = useImageResize(image);

  /**
   * Обрабатывает скачивание измененного изображения
   */
  const handleDownload = useCallback(() => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgQuality = options.reduce ? 0.6 : 1.0;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/jpeg', imgQuality);
      a.download = `resized_image_${Date.now()}.jpg`;
      a.click();
      toast.success('Image resized successfully', { richColors: true });
    };
  }, [image, dimensions, options]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 gap-0 rounded">
      <div className={`grid gap-2 transition-all ${image ? 'h-[435px] overflow-none' : 'h-[250px] overflow-hidden'}`}>
        {/* Область загрузки изображения */}
        <div
          className="grid h-[250px] cursor-pointer place-items-center rounded-md border-2 border-dashed"
          onClick={handleImageClick}
        >
          <div className={`relative grid w-full place-items-center gap-2 ${image ? 'h-full' : ''}`}>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              ref={inputRef}
            />
            {!image && <PiImageSquareBold size={50} />}
            {image && <img className="absolute inset-0 h-full w-full object-contain" src={image} alt="Uploaded" />}
            {!image && <p className="font-medium">Browse File to Upload</p>}
          </div>
        </div>
        {/* Элементы управления размером и качеством */}
        <div className="grid gap-2 grid-cols-2">
          <div className="grid gap-1">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              name="width"
              value={dimensions.width}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              name="height"
              value={dimensions.height}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="lock"
              checked={options.lock}
              onCheckedChange={(checked) => handleInputChange({
                target: {
                  name: 'lock',
                  type: 'checkbox',
                  checked,
                },
              } as React.ChangeEvent<HTMLInputElement>)}
            />
            <Label htmlFor="lock">Lock aspect ratio</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="reduce"
              checked={options.reduce}
              onCheckedChange={(checked) => handleInputChange({
                target: {
                  name: 'reduce',
                  type: 'checkbox',
                  checked,
                },
              } as React.ChangeEvent<HTMLInputElement>)}
            />
            <Label htmlFor="reduce">Reduce quality</Label>
          </div>
        </div>
        {/* Кнопка скачивания */}
        <Button onClick={handleDownload} disabled={!image}>Download Image</Button>
      </div>
    </Card>
  );
};

export default ImageResizerPage;
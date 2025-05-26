'use client';

/**
 * # QR Code Generator
 *
 * ## Принцип работы:
 *
 * 1. **Ввод данных и генерация**:
 *    - Пользователь вводит текст или URL в форму
 *    - Выбирает размер QR-кода из предложенных опций
 *    - При отправке формы генерируется QR-код через API QR Server
 *
 * 2. **Отображение и управление**:
 *    - Сгенерированный QR-код отображается на странице
 *    - Пользователь может скачать QR-код как PNG-изображение
 *    - Доступна функция сброса формы и очистки QR-кода
 *
 * 3. **Оптимизация производительности**:
 *    - Мемоизация функций с помощью useCallback
 *    - Мемоизация вычисляемых значений с помощью useMemo
 *    - Эффективная обработка изображений через Canvas API
 */

import { Button, Card, Form } from '@/components/ui';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/layout';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { validate, ValidateSchema } from '@/app/projects/easy/qr-code-generator/utils';
import { toast } from 'sonner';

type QRCodeDefaults = {
  defaultSize: number;
  sizeOptions: readonly number[];
}

const QR_CODE_DEFAULTS: QRCodeDefaults = {
  defaultSize: 300,
  sizeOptions: [100, 200, 300, 400, 500, 600, 700] as const,
};

const QRCodeGeneratorPage = () => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const form = useForm<ValidateSchema>({
    defaultValues: {
      text: '',
      size: QR_CODE_DEFAULTS.defaultSize.toString(),
    },
    mode: 'onChange',
    resolver: zodResolver(validate),
  });

  // Мемоизируем текущий размер для предотвращения лишних вычислений
  const currentSize = useMemo(() =>
      Number(form.watch('size')) || QR_CODE_DEFAULTS.defaultSize,
    [form.watch('size')],
  );

  // Мемоизируем опции размера для предотвращения повторных созданий массива
  const sizeOptions = useMemo(() =>
      QR_CODE_DEFAULTS.sizeOptions.map((size) => ({
        value: size.toString(),
        label: `${size}x${size}`,
      })),
    [],
  );

  const onSubmit = useCallback(({ text, size }: ValidateSchema) => {
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
  }, []);

  const handleDownloadClick = useCallback(async () => {
    if (!qrUrl) {
      toast.error('No QR code generated yet', { richColors: true });
      return;
    }

    try {
      // Получаем ссылку на изображение, которое уже отображается
      const imageElement = document.querySelector('img[alt="QR Code"]') as HTMLImageElement;

      // Проверяем наличие элемента изображения
      if (!imageElement) {
        toast.error('QR code image not found', { richColors: true });
        return;
      }

      // Создаем canvas для преобразования изображения в blob
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Проверяем доступность контекста canvas
      if (!ctx) {
        toast.error('Canvas context not available', { richColors: true });
        return;
      }

      // Устанавливаем размеры canvas равными размерам изображения
      canvas.width = currentSize;
      canvas.height = currentSize;

      // Дожидаемся полной загрузки изображения перед рисованием
      if (imageElement.complete) {
        ctx.drawImage(imageElement, 0, 0, currentSize, currentSize);
        processCanvasToBlob(canvas);
      } else {
        imageElement.onload = () => {
          ctx.drawImage(imageElement, 0, 0, currentSize, currentSize);
          processCanvasToBlob(canvas);
        };
        
        // Обработка ошибки загрузки изображения
        imageElement.onerror = () => {
          toast.error('Failed to load QR code image', { richColors: true });
        };
      }
    } catch (error) {
      console.error('An error occurred during QR code download:', error);
      toast.error('Failed to download QR Code', { richColors: true });
    }
  }, [qrUrl, currentSize]);
  // Выносим логику обработки canvas в отдельную функцию
  const processCanvasToBlob = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        link.click();

        // Освобождаем ресурсы после скачивания
        setTimeout(() => URL.revokeObjectURL(url), 100);
        toast.success('QR Code downloaded successfully', { richColors: true });
      } else {
        throw new Error('Failed to create blob');
      }
    }, 'image/png');
  };

  const handleResetClick = useCallback(() => {
    form.reset({
      text: '',
      size: QR_CODE_DEFAULTS.defaultSize.toString(),
    });
    setQrUrl(null);
  }, [form]);

  return (
    <Card className="max-w-md grid gap-4 w-full mx-auto p-4 rounded">
      {/* Message */}
      <p className="text-center">Paste a url or enter text to create QR code</p>
      {/* Form */}
      <Form {...form}>
        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput form={form} name="text" placeholder="Enter text or url" label="Enter text or url" />
          <FormSelect
            form={form}
            name="size"
            options={sizeOptions}
            selectProps={{
              className: 'w-full',
              value: form.watch('size')?.toString() || QR_CODE_DEFAULTS.defaultSize.toString(),
            }}
            label="QR Code Size"
          />
          <Button type="submit">Generate QR Code</Button>
        </form>
      </Form>
      {/* QR Code Display */}
      {qrUrl && (
        <div className="grid gap-3">
          <Image
            className="mx-auto max-w-[250px] w-full"
            alt="QR Code"
            src={qrUrl}
            width={currentSize}
            height={currentSize}
            priority
            unoptimized
          />
          <Button onClick={handleDownloadClick}>Download QR Code</Button>
          <Button variant="destructive" onClick={handleResetClick}>Clear</Button>
        </div>
      )}
    </Card>
  );
};

export default QRCodeGeneratorPage;
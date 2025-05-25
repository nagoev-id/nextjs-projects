'use client';

/**
 * # QR Code Scanner
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка**:
 *    - Приложение создает интерфейс для загрузки изображений с QR-кодами
 *    - Использует состояния React для управления данными и UI
 *    - Настраивает ссылки на DOM-элементы через useRef
 *
 * 2. **Загрузка QR-кода**:
 *    - Пользователь может кликнуть на область загрузки для выбора файла
 *    - Поддерживается только загрузка изображений (ограничение через accept="image/*")
 *    - При выборе файла автоматически запускается процесс сканирования
 *
 * 3. **Процесс сканирования**:
 *    - Выбранное изображение отправляется на API (api.qrserver.com) через FormData
 *    - Во время сканирования отображается сообщение "Scanning QR Code..."
 *    - API анализирует изображение и возвращает данные, закодированные в QR-коде
 *
 * 4. **Обработка результатов**:
 *    - При успешном сканировании:
 *      - Отображается превью загруженного изображения
 *      - Декодированные данные отображаются в текстовом поле
 *      - Активируются кнопки для копирования данных и закрытия результата
 *    - При ошибке сканирования:
 *      - Показывается уведомление об ошибке через toast
 *      - Интерфейс сбрасывается в исходное состояние
 *
 * 5. **Управление результатами**:
 *    - Пользователь может скопировать декодированный текст в буфер обмена
 *    - Кнопка "Close" сбрасывает интерфейс для новой загрузки
 *    - Интерфейс адаптивно меняет высоту в зависимости от наличия результатов
 *
 * 6. **Обработка ошибок**:
 *    - Обрабатываются ошибки API и сетевые ошибки
 *    - Предоставляется понятная обратная связь через уведомления
 *    - Ведется логирование ошибок в консоль для отладки
 */

import { Button, Card, Input, Textarea } from '@/components/ui';
import { GrDocumentUpload } from 'react-icons/gr';
import { HELPERS } from '@/shared';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

/**
 * Тип для результата сканирования QR-кода
 * @typedef {Object} QRScanResult
 * @property {string} [url] - Декодированные данные из QR-кода
 * @property {File} [file] - Файл изображения с QR-кодом
 * @property {string} [error] - Сообщение об ошибке, если сканирование не удалось
 */
type QRScanResult = {
  url?: string;
  file?: File;
  error?: string;
}

/**
 * Компонент для сканирования QR-кодов из изображений
 *
 * Позволяет пользователям загружать изображения с QR-кодами,
 * декодировать их содержимое и копировать результат.
 *
 * @returns {JSX.Element} Компонент сканера QR-кодов
 */
const QRCodeScannerPage = () => {
  /**
   * Состояние для текста сообщения в области загрузки
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [messageText, setMessageText] = useState<string>('Upload QR Code to Read');

  /**
   * Состояние для хранения декодированных данных QR-кода
   * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
   */
  const [qrData, setQrData] = useState<string | null>(null);

  /**
   * Ссылка на скрытый элемент ввода файла
   * @type {React.RefObject<HTMLInputElement>}
   */
  const inputFileRef = useRef<HTMLInputElement>(null);

  /**
   * Ссылка на элемент изображения для предпросмотра
   * @type {React.RefObject<HTMLImageElement>}
   */
  const imageRef = useRef<HTMLImageElement>(null);

  /**
   * Обновляет UI формы на основе результатов сканирования
   *
   * @param {File | null} file - Загруженный файл изображения или null
   * @param {string | null} url - Декодированные данные или null
   * @returns {boolean} Флаг успешного сканирования QR-кода
   */
  const updateQrFormUI = useCallback((file: File | null = null, url: string | null = null): boolean => {
    const isQrCodeScanned = !!file && !!url;
    setQrData(isQrCodeScanned ? url : null);
    return isQrCodeScanned;
  }, []);

  /**
   * Отправляет запрос к API для декодирования QR-кода
   *
   * @param {File} file - Файл изображения с QR-кодом
   * @param {FormData} formData - Данные формы для отправки на сервер
   * @returns {Promise<QRScanResult>} Результат сканирования QR-кода
   */
  const getQrData = useCallback(async (file: File, formData: FormData): Promise<QRScanResult> => {
    setMessageText('Scanning QR Code...');
    try {
      const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', formData);
      const url = response.data[0]?.symbol[0]?.data;
      return url ? { url, file } : { error: 'Couldn\'t scan QR Code' };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to scan QR Code' };
    } finally {
      setMessageText('Upload QR Code to Scan');
    }
  }, []);

  /**
   * Обновляет интерфейс на основе результатов сканирования
   *
   * @param {File} [file] - Файл изображения с QR-кодом
   * @param {string} [url] - Декодированные данные
   */
  const updateUI = useCallback((file?: File, url?: string) => {
    const isQrCodeScanned = updateQrFormUI(file || null, url || null);
    if (isQrCodeScanned && file && imageRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
      imageRef.current.classList.remove('hidden');
    } else if (imageRef.current) {
      imageRef.current.src = '#';
      imageRef.current.classList.add('hidden');
    }
    if (!isQrCodeScanned && inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }, [updateQrFormUI]);

  /**
   * Обработчик клика по области загрузки
   * Активирует скрытый input для выбора файла
   */
  const handleFormClick = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  /**
   * Обработчик изменения выбранного файла
   * Запускает процесс обработки выбранного файла
   */
  const handleFileInputChange = useCallback(async () => {
    await handleInputChange(inputFileRef.current?.files?.[0] || null);
  }, []);

  /**
   * Обрабатывает выбранный файл и запускает сканирование QR-кода
   *
   * @param {File | null} file - Выбранный файл изображения
   */
  const handleInputChange = useCallback(async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await getQrData(file, formData);
      if (result.error) {
        toast.error('Failed to read QR Code data', { richColors: true });
        updateUI();
      } else {
        updateUI(result.file, result.url);
      }
    } catch (error) {
      console.error('Failed to read QR Code data', error);
      toast.error('Failed to read QR Code data', { richColors: true });
      updateUI();
    }
  }, [getQrData, updateUI]);

  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <div
        className={`grid gap-3 overflow-hidden transition-all duration-300 ${qrData ? 'max-h-[500px]' : 'max-h-[200px]'}`}>
        <form
          className="min-h-[200px] p-8 cursor-pointer grid place-content-center rounded border-2 border-dashed border-black dark:border-white hover:border-blue-500 dark:hover:border-blue-400 transition-all"
          onClick={handleFormClick}
          aria-label="QR code upload area"
        >
          <Input
            type="file"
            className="sr-only hidden"
            onChange={handleFileInputChange}
            ref={inputFileRef}
            accept="image/*"
            aria-label="Upload QR code image"
          />
          <img
            src="#"
            alt="QR code preview"
            width={190}
            height={190}
            className="object-cover hidden mx-auto rounded"
            ref={imageRef}
          />

          {!qrData && (
            <div className="grid place-items-center gap-4 text-center">
              <GrDocumentUpload size={40} className="text-gray-600 dark:text-gray-300" aria-hidden="true" />
              <p className="font-medium">{messageText}</p>
            </div>
          )}
        </form>
        <div className="grid gap-3">
          <Textarea
            className="w-full min-h-[150px] resize-none"
            spellCheck={false}
            disabled
            value={qrData ?? ''}
            aria-label="QR code content"
          />
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              onClick={() => updateUI()}
              className="w-full"
              aria-label="Close QR code"
            >
              Close
            </Button>
            <Button
              onClick={() => HELPERS.copyToClipboard(qrData || '')}
              className="w-full"
              disabled={!qrData}
              aria-label="Copy QR code content"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeScannerPage;
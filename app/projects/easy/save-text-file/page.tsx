'use client';

/**
 * # Компонент сохранения текста в файл
 *
 * ## Принцип работы:
 *
 * 1. **Ввод данных**:
 *    - Пользователь вводит текст в текстовое поле
 *    - Указывает имя файла (опционально)
 *    - Выбирает тип файла из выпадающего списка
 *
 * 2. **Сохранение файла**:
 *    - При нажатии на кнопку создается Blob с указанным типом контента
 *    - Генерируется временная ссылка для скачивания
 *    - Файл скачивается с указанным именем или 'untitled' по умолчанию
 *    - Временная ссылка освобождается для предотвращения утечек памяти
 */

import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * Тип для данных формы
 * @typedef {Object} FormData
 * @property {string} content - Содержимое файла
 * @property {string} filetype - MIME-тип файла
 * @property {string} filename - Имя файла
 */
type FormData = {
  content: string;
  filetype: string;
  filename: string;
}

/**
 * Тип для опций выбора типа файла
 * @typedef {Object} FileTypeOption
 * @property {string} value - MIME-тип файла
 * @property {string} label - Отображаемое название типа файла
 * @property {string} extension - Расширение файла
 */
type FileTypeOption = {
  value: string;
  label: string;
  extension: string;
}

/**
 * Доступные типы файлов для сохранения
 */
const FILE_TYPE_OPTIONS: FileTypeOption[] = [
  { value: 'text/plain', label: 'Text File', extension: '.txt' },
  { value: 'text/javascript', label: 'JS File', extension: '.js' },
  { value: 'text/html', label: 'HTML File', extension: '.html' },
  { value: 'image/svg+xml', label: 'SVG File', extension: '.svg' },
  { value: 'application/msword', label: 'Doc File', extension: '.doc' },
];

/**
 * Компонент страницы для сохранения текста в файл
 * @returns {JSX.Element} Компонент страницы
 */
const SaveTextAsFilePage = () => {
  // Состояние формы
  const [formData, setFormData] = useState<FormData>({
    content: 'Sample text content',
    filetype: 'text/plain',
    filename: '',
  });
  
  // Текущий выбранный тип файла
  const selectedFileType = FILE_TYPE_OPTIONS.find(option => option.value === formData.filetype) || FILE_TYPE_OPTIONS[0];
  
  /**
   * Обработчик изменения данных формы
   * @param {string} name - Имя поля
   * @param {string} value - Новое значение
   */
  const handleFormDataChange = useCallback((name: string, value: string): void => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);
  
  /**
   * Обработчик нажатия на кнопку сохранения
   * Создает и скачивает файл с указанными параметрами
   */
  const handleSaveClick = useCallback((): void => {
    try {
      const { content, filetype, filename } = formData;
      const extension = selectedFileType.extension;
      
      // Создаем имя файла с правильным расширением
      let finalFilename = filename || 'untitled';
      if (!finalFilename.endsWith(extension)) {
        finalFilename += extension;
      }
      
      // Создаем Blob и URL для скачивания
      const blob = new Blob([content], { type: filetype });
      const url = URL.createObjectURL(blob);

      // Создаем и активируем ссылку для скачивания
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      
      // Очищаем ресурсы
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving file:', error);
      // Здесь можно добавить уведомление об ошибке
    }
  }, [formData, selectedFileType]);

  return (
    <Card className="max-w-md grid gap-4 w-full mx-auto p-5 rounded">
      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          className="min-h-[150px] font-mono"
          spellCheck={false}
          placeholder="Enter something to save"
          name="content"
          value={formData.content}
          onChange={(e) => handleFormDataChange('content', e.target.value)}
          aria-label="File content"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="filename">File name</Label>
          <Input
            id="filename"
            name="filename"
            value={formData.filename}
            onChange={(e) => handleFormDataChange('filename', e.target.value)}
            placeholder={`Enter file name (${selectedFileType.extension})`}
            aria-label="File name"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="filetype">Save as</Label>
          <Select 
            onValueChange={(value) => handleFormDataChange('filetype', value)} 
            value={formData.filetype}
          >
            <SelectTrigger id="filetype" aria-label="Select file type" className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {FILE_TYPE_OPTIONS.map(({ value, label, extension }) => (
                <SelectItem key={value} value={value}>
                  {label} ({extension})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleSaveClick}
        aria-label={`Save as ${selectedFileType.label}`}
      >
        Save as {selectedFileType.label} ({selectedFileType.extension})
      </Button>
    </Card>
  );
};

export default SaveTextAsFilePage;
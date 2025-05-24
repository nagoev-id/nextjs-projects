'use client';

/**
 * # Онлайн переводчик текста
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация и настройка**:
 *    - Приложение использует React с хуками состояния для управления текстами и выбранными языками
 *    - По умолчанию установлены языки: английский (источник) и русский (перевод)
 *    - Интерфейс разделен на две текстовые области и элементы управления языками
 * 
 * 2. **Ввод и перевод текста**:
 *    - Пользователь вводит текст в левое поле ввода
 *    - При нажатии кнопки "Translate Text" выполняется запрос к API MyMemory Translation
 *    - Во время перевода кнопка блокируется и отображается состояние загрузки
 *    - Результат перевода отображается в правом поле (только для чтения)
 * 
 * 3. **Управление языками**:
 *    - Для каждого поля (исходный текст и перевод) доступен выпадающий список языков
 *    - При изменении языка текстовые поля очищаются для предотвращения некорректных переводов
 *    - Кнопка между списками языков позволяет быстро поменять языки местами вместе с текстами
 * 
 * 4. **Дополнительные функции**:
 *    - Копирование текста в буфер обмена с помощью кнопки с иконкой буфера
 *    - Озвучивание текста с помощью Web Speech API (кнопка с иконкой динамика)
 *    - Адаптивный дизайн: на мобильных устройствах элементы перестраиваются для удобства использования
 * 
 * 5. **Обработка ошибок**:
 *    - Валидация ввода: предотвращение отправки пустого текста
 *    - Обработка ошибок API с информативными уведомлениями
 *    - Обработка ошибок при озвучивании текста
 * 
 * 6. **Оптимизация производительности**:
 *    - Использование useCallback для мемоизации функций
 *    - Предотвращение ненужных перерисовок компонентов
 *    - Асинхронная обработка запросов к API
 * 
 * ## Используемые технологии:
 * - React (хуки: useState, useCallback)
 * - Axios для HTTP-запросов
 * - Web Speech API для озвучивания текста
 * - Компоненты UI: Button, Card, Select, Textarea
 * - Уведомления через библиотеку Sonner
 * - Tailwind CSS для стилизации
 */

import React, { JSX, useCallback, useState } from 'react';
import { Button, Card, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';
import { toast } from 'sonner';
import { FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { FaRegClipboard } from 'react-icons/fa6';
import { BiVolumeFull } from 'react-icons/bi';
import { HELPERS } from '@/shared';
import { Language, LANGUAGES } from '@/app/projects/easy/online-translator/mock';

/**
 * Тип для хранения исходного и переведенного текста
 * @typedef {Object} TextType
 * @property {string} source - Исходный текст для перевода
 * @property {string} target - Переведенный текст
 */
type TextType = {
  source: string;
  target: string;
}

/**
 * Тип для ответа API перевода
 * @typedef {Object} TranslationResponse
 * @property {Object} responseData - Данные ответа от API
 * @property {string} responseData.translatedText - Переведенный текст
 * @property {number} responseData.match - Процент соответствия перевода (точность)
 */
type TranslationResponse = {
  responseData: {
    translatedText: string;
    match: number;
  };
};

/**
 * Компонент онлайн-переводчика текста
 * 
 * Позволяет пользователям вводить текст, выбирать языки и получать перевод.
 * Включает функции копирования текста и озвучивания.
 * 
 * @returns {JSX.Element} Компонент онлайн-переводчика
 */
const OnlineTranslatorPage = (): JSX.Element => {
  // Состояние для текстов (исходный и переведенный)
  const [textType, setTextType] = useState<TextType>({
    source: '',
    target: '',
  });

  // Состояние для выбранных языков
  const [languageType, setLanguageType] = useState({
    source: 'en-GB',
    target: 'ru-RU',
  });

  // Состояние для отслеживания процесса перевода
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  /**
   * Обработчик изменения текста в поле ввода
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - Событие изменения текста
   */
  const handleTextareaChange = ({ target: { value: source } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextType(prevState => ({ ...prevState, source }));
  };

  /**
   * Обработчик нажатия на кнопку перевода
   * Выполняет запрос к API перевода и обновляет состояние
   */
  const handleTranslateClick = async (): Promise<void> => {
    if (!textType.source.trim()) {
      toast.error('Please enter a source text.', { richColors: true });
      return;
    }

    setIsTranslating(true);

    try {
      const { data: { responseData: { translatedText: target } } } = await axios.get<TranslationResponse>('https://api.mymemory.translated.net/get', {
        params: {
          q: textType.source,
          langpair: `${languageType.source}|${languageType.target}`,
        },
      });
      setTextType(prevState => ({ ...prevState, target }));
    } catch (error) {
      console.error('Error during translation:', error);
      toast.error('Error during translation', { richColors: true });
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Обработчик нажатия на кнопку смены языков
   * Меняет местами исходный и целевой языки, а также тексты
   */
  const handleSwapLanguages = (): void => {
    setTextType(prevState => ({
      source: prevState.target,
      target: prevState.source,
    }));
    setLanguageType(prevState => ({
      source: prevState.target,
      target: prevState.source,
    }));
  };

  /**
   * Функция для озвучивания текста с использованием Web Speech API
   * @param {string} text - Текст для озвучивания
   * @param {string} language - Код языка для озвучивания
   */
  const handleSpeak = useCallback((text: string, language: string): void => {
    if (!text) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language.substring(0, 2);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast.error('Unable to speak text', { richColors: true });
    }
  }, []);

  /**
   * Рендер элементов управления языком (выпадающий список и кнопки)
   * @param {string} text - Текст для копирования/озвучивания
   * @param {string} language - Выбранный язык
   * @param {function} setLanguage - Функция для изменения языка
   * @param {boolean} isSource - Флаг, указывающий является ли это исходным языком
   * @returns {JSX.Element} Элементы управления языком
   */
  const renderLanguageControls = useCallback((
    text: string, 
    language: string, 
    setLanguage: (type: string, value: string) => void, 
    isSource: boolean
  ): JSX.Element => {
    return (
      <div className={`grid ${isSource ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto]'} gap-2`}>
        {isSource && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => HELPERS.copyToClipboard(text)}
              aria-label="Copy source text"
              title="Copy to clipboard"
            >
              <FaRegClipboard />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSpeak(text, language)}
              aria-label="Speak source text"
              title="Speak text"
            >
              <BiVolumeFull />
            </Button>
          </div>
        )}
        <Select
          value={language}
          onValueChange={(value) => {
            const type = isSource ? 'source' : 'target';
            setLanguage(type, value);
            setTextType({
              source: '',
              target: '',
            });
          }}
        >
          <SelectTrigger className="w-full" aria-label={isSource ? 'Source language' : 'Target language'}>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((option: Language) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isSource && (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => HELPERS.copyToClipboard(text)}
              aria-label="Copy translated text"
              title="Copy to clipboard"
            >
              <FaRegClipboard />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSpeak(text, language)}
              aria-label="Speak translated text"
              title="Speak text"
            >
              <BiVolumeFull />
            </Button>
          </div>
        )}
      </div>
    );
  }, [handleSpeak]);

  /**
   * Обработчик изменения выбранного языка
   * @param {string} type - Тип языка ('source' или 'target')
   * @param {string} value - Код выбранного языка
   */
  const handleLanguageChange = (type: string, value: string): void => {
    setLanguageType(prevState => ({
      ...prevState,
      [type]: value,
    }));
  };

  return (
    <Card className="max-w-xl w-full mx-auto grid p-4 rounded gap-2">
      <div className="grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Textarea
            className="min-h-[130px]"
            placeholder="Enter text"
            value={textType.source}
            onChange={handleTextareaChange}
            aria-label="Source text"
          />
          <Textarea
            className="min-h-[130px]"
            placeholder="Translation"
            value={textType.target}
            readOnly
            disabled
            aria-label="Translated text"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
          {renderLanguageControls(textType.source, languageType.source, handleLanguageChange, true)}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSwapLanguages}
              aria-label="Swap languages"
              title="Swap languages and text"
            >
              <FiRefreshCw />
            </Button>
          </div>
          {renderLanguageControls(textType.target, languageType.target, handleLanguageChange, false)}
        </div>
      </div>
      <Button
        className="mt-3"
        onClick={handleTranslateClick}
        disabled={isTranslating}
        aria-label="Translate text"
      >
        {isTranslating ? 'Translating...' : 'Translate Text'}
      </Button>
    </Card>
  );
};

export default OnlineTranslatorPage;
'use client';

/**
 * # Text-to-Speech Converter
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и настройка**:
 *    - Приложение использует Web Speech API для преобразования текста в речь
 *    - При загрузке компонента происходит инициализация SpeechSynthesis и загрузка доступных голосов
 *    - Голоса загружаются асинхронно, особенно в Chrome, поэтому используется событие 'voiceschanged'
 *    - Первый доступный голос выбирается по умолчанию
 *
 * 2. **Ввод текста и выбор голоса**:
 *    - Пользователь вводит текст в текстовую область
 *    - Из выпадающего списка можно выбрать один из доступных голосов (разные языки и акценты)
 *    - Каждый голос представлен своим именем и языковым кодом
 *
 * 3. **Преобразование текста в речь**:
 *    - При нажатии кнопки "Convert To Speech" текст преобразуется в речь
 *    - Создается экземпляр SpeechSynthesisUtterance с введенным текстом
 *    - Устанавливается выбранный голос для произношения
 *    - Начинается воспроизведение речи через метод speak()
 *
 * 4. **Управление воспроизведением**:
 *    - Во время воспроизведения появляется дополнительная кнопка для паузы/возобновления
 *    - Пользователь может приостановить речь кнопкой "Pause Speech"
 *    - Возобновить воспроизведение можно кнопкой "Resume Speech"
 *    - При отправке новой формы предыдущее воспроизведение отменяется
 *
 * 5. **Отслеживание состояния**:
 *    - Приложение отслеживает состояние воспроизведения (активно/приостановлено)
 *    - Используется интервал для периодической проверки статуса речи
 *    - При завершении речи состояние автоматически обновляется
 *
 * 6. **Обработка ошибок и очистка**:
 *    - Проверяется поддержка Web Speech API в браузере
 *    - При отсутствии поддержки показывается уведомление об ошибке
 *    - При размонтировании компонента происходит очистка ресурсов:
 *      - Отмена активного воспроизведения
 *      - Очистка интервалов
 *      - Удаление обработчиков событий
 *
 * 7. **Оптимизация производительности**:
 *    - Используются мемоизированные функции (useCallback) для предотвращения лишних рендеров
 *    - Состояние компонента организовано эффективно для минимизации обновлений
 *    - Используются рефы для доступа к API без перерендеров
 */

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Textarea } from '@/components/ui';
import { toast } from 'sonner';

/**
 * Тип для голосового движка
 * Расширяет стандартный SpeechSynthesisVoice дополнительными свойствами
 *
 * @typedef {Object} Voice
 * @property {string} name - Имя голоса
 * @property {string} lang - Языковой код голоса (например, 'en-US', 'ru-RU')
 */
type Voice = SpeechSynthesisVoice & {
  name: string;
  lang: string;
}

/**
 * Компонент преобразования текста в речь
 * Позволяет вводить текст, выбирать голос и управлять воспроизведением
 *
 * @returns {JSX.Element} Компонент Text-to-Speech
 */
const TTSPage = () => {
  /**
   * Состояние компонента
   * @type {Object}
   * @property {string} text - Текст для преобразования в речь
   * @property {Voice[]} voices - Список доступных голосов
   * @property {string} selectedVoice - Имя выбранного голоса
   * @property {boolean} isSpeaking - Флаг активного воспроизведения
   */
  const [tts, setTts] = useState({
    text: '',
    voices: [] as Voice[],
    selectedVoice: '',
    isSpeaking: false,
  });

  /**
   * Ссылка на объект синтеза речи
   * @type {React.MutableRefObject<SpeechSynthesis|null>}
   */
  const synthRef = useRef<SpeechSynthesis | null>(null);

  /**
   * Ссылка на интервал проверки статуса речи
   * @type {React.MutableRefObject<NodeJS.Timeout|null>}
   */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Инициализация синтеза речи и загрузка доступных голосов
   * Выполняется один раз при монтировании компонента
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      /**
       * Загружает доступные голоса и устанавливает первый голос по умолчанию
       */
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        if (availableVoices.length > 0) {
          setTts(prev => ({
            ...prev,
            voices: availableVoices as Voice[],
            selectedVoice: availableVoices[0].name,
          }));
        }
      };

      // Load voices initially
      loadVoices();

      // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (synthRef.current?.speaking) synthRef.current.cancel();
      };
    } else {
      toast.error('Speech synthesis is not supported in your browser', { richColors: true });
    }
  }, []);

  /**
   * Преобразует текст в речь с выбранным голосом
   *
   * @param {string} text - Текст для преобразования в речь
   */
  const speechText = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = tts.voices.find(v => v.name === tts.selectedVoice);
    if (voice) utterance.voice = voice;

    // Add event listeners for speech events
    utterance.onend = () => {
      setTts(prev => ({ ...prev, isSpeaking: false }));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    if (synthRef.current) synthRef.current.speak(utterance);
    setTts(prev => ({ ...prev, isSpeaking: true }));
  }, [tts.voices, tts.selectedVoice]);

  /**
   * Проверяет статус воспроизведения речи
   * Вызывается периодически для обновления состояния
   */
  const checkSpeechStatus = useCallback(() => {
    if (synthRef.current && !synthRef.current.speaking) {
      setTts(prevState => ({ ...prevState, isSpeaking: false }));
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  /**
   * Переключает состояние воспроизведения (пауза/возобновление)
   */
  const toggleSpeechState = useCallback(() => {
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        if (synthRef.current.paused) {
          synthRef.current.resume();
          setTts(prevState => ({ ...prevState, isSpeaking: true }));
        } else {
          synthRef.current.pause();
          setTts(prevState => ({ ...prevState, isSpeaking: false }));
        }
      }
    }
  }, []);

  /**
   * Обработчик отправки формы
   * Запускает преобразование текста в речь
   *
   * @param {FormEvent<HTMLFormElement>} e - Событие отправки формы
   */
  const handleFormSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = tts.text.trim();
    if (!text) {
      toast.error('Please enter or paste something', { richColors: true });
      return;
    }

    // Cancel any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    // Start new speech
    speechText(text);

    // Set up interval to check speech status
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(checkSpeechStatus, 500);
  }, [tts.text, speechText, checkSpeechStatus]);

  /**
   * Обработчик изменения текста в текстовой области
   *
   * @param {ChangeEvent<HTMLTextAreaElement>} e - Событие изменения текста
   */
  const handleTextareaChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setTts(prevState => ({ ...prevState, text: e.target.value }));
  }, []);

  /**
   * Обработчик изменения выбранного голоса
   *
   * @param {ChangeEvent<HTMLSelectElement>} e - Событие изменения выбора
   */
  const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setTts(prevState => ({ ...prevState, selectedVoice: e.target.value }));
  }, []);

  /**
   * Обработчик нажатия на кнопку паузы/возобновления
   */
  const handleToggleSpeech = useCallback(() => {
    toggleSpeechState();
  }, [toggleSpeechState]);
  return (
    <Card className="max-w-sm w-full mx-auto p-4 rounded">
      <form className="grid gap-3" onSubmit={handleFormSubmit}>
        <label className="grid gap-1">
          <span className="font-medium">Enter Text</span>
          <Textarea
            className="w-full min-h-[150px]"
            placeholder="Enter your text here..."
            value={tts.text}
            onChange={handleTextareaChange}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-medium">Select Voice</span>
          <select
            value={tts.selectedVoice}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder-slate-400 dark:focus:ring-slate-300"
          >
            {tts.voices.map((voice, index) => (
              <option key={`${voice.name}-${voice.lang}-${index}`} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-1 gap-2">
          <Button type="submit">Convert To Speech</Button>
          {synthRef.current?.speaking && (
            <Button type="button" onClick={handleToggleSpeech} variant="secondary">
              {synthRef.current?.paused ? 'Resume Speech' : 'Pause Speech'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default TTSPage;
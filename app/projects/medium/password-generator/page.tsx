'use client';

/**
 * # Генератор паролей
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение использует Redux Toolkit для управления состоянием пароля, его силы и опций генерации
 *    - Начальное состояние включает пустой пароль, индикатор силы "none" и набор опций для генерации
 *    - По умолчанию активирована только опция строчных букв (lowercase)
 *    - Длина пароля по умолчанию установлена на 15 символов
 *
 * 2. **Генерация пароля**:
 *    - Пользователь может настроить длину пароля с помощью ползунка (от 1 до 30 символов)
 *    - Можно выбрать типы символов для включения в пароль (строчные, заглавные, цифры, спецсимволы)
 *    - При изменении длины или набора опций автоматически генерируется новый пароль
 *    - Если не выбрана ни одна опция, генерируется пустой пароль
 *
 * 3. **Оценка силы пароля**:
 *    - После генерации пароля автоматически оценивается его сила
 *    - Учитываются длина пароля и разнообразие используемых символов
 *    - Сила может быть "weak" (слабый), "medium" (средний) или "strong" (сильный)
 *    - Визуальный индикатор меняет цвет в зависимости от силы пароля
 *
 * 4. **Взаимодействие с пользователем**:
 *    - Пользователь может скопировать сгенерированный пароль в буфер обмена
 *    - Можно вручную запустить генерацию нового пароля с текущими настройками
 *    - Интерфейс реагирует на изменения в реальном времени
 *
 * 5. **Оптимизация производительности**:
 *    - Используются мемоизированные селекторы для предотвращения ненужных повторных рендеров
 *    - Применяются хуки useCallback для оптимизации функций-обработчиков
 *    - Эффекты useEffect имеют правильно указанные зависимости для предотвращения лишних вызовов
 *
 * 6. **Доступность**:
 *    - Все интерактивные элементы имеют соответствующие ARIA-атрибуты
 *    - Используется семантическая разметка для лучшей поддержки скринридеров
 *    - Визуальные индикаторы дополнены текстовой информацией
 */

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/projects/medium/password-generator/app';
import {
  generatePassword,
  optionToggle,
  passwordStrength,
  selectPasswordData,
} from '@/app/projects/medium/password-generator/features';
import { Button, Card, Input } from '@/components/ui';
import { FaRegClipboard } from 'react-icons/fa6';
import { HELPERS } from '@/shared';

/**
 * Компонент генератора паролей
 *
 * Позволяет пользователю создавать надежные пароли с настраиваемыми параметрами:
 * - Длина пароля (от 1 до 30 символов)
 * - Типы используемых символов (строчные, заглавные, цифры, специальные символы)
 *
 * Компонент также отображает индикатор силы пароля и предоставляет возможность
 * копирования сгенерированного пароля в буфер обмена.
 *
 * @returns {JSX.Element} Компонент генератора паролей
 */
const PasswordGeneratorPage = () => {
  /**
   * Состояние для хранения выбранной длины пароля
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [inputRange, setInputRange] = useState<number>(15);

  /**
   * Диспетчер Redux для отправки действий
   * @type {AppDispatch}
   */
  const dispatch = useAppDispatch();

  /**
   * Данные о пароле из хранилища Redux
   * @type {Object}
   * @property {string} password - Сгенерированный пароль
   * @property {string} strength - Сила пароля ('weak', 'medium', 'strong' или '')
   * @property {Array<{id: string, checked: boolean, label: string}>} options - Опции генерации пароля
   */
  const { password, strength, options } = useAppSelector(selectPasswordData);

  /**
   * Обработчик изменения ползунка длины пароля
   *
   * @param {ChangeEvent<HTMLInputElement>} e - Событие изменения ползунка
   * @returns {void}
   */
  const handleRangeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value;
    setInputRange(newValue);
  }, []);

  /**
   * Обработчик переключения опций генерации пароля
   *
   * @param {string} id - Идентификатор опции
   * @returns {void}
   */
  const handleOptionToggle = useCallback((id: string) => {
    dispatch(optionToggle(id));
  }, [dispatch]);

  /**
   * Обработчик кнопки генерации пароля
   * Запускает генерацию нового пароля с текущими настройками
   *
   * @returns {void}
   */
  const handleGeneratePassword = useCallback(() => {
    dispatch(generatePassword(inputRange));
  }, [dispatch, inputRange]);

  /**
   * Эффект для автоматической генерации пароля при изменении длины или опций
   *
   * @effect
   * @dependency {AppDispatch} dispatch - Диспетчер Redux
   * @dependency {number} inputRange - Выбранная длина пароля
   * @dependency {Array} options - Опции генерации пароля
   */
  useEffect(() => {
    dispatch(generatePassword(inputRange));
  }, [dispatch, inputRange, options]);

  /**
   * Эффект для оценки силы пароля при его изменении
   *
   * @effect
   * @dependency {AppDispatch} dispatch - Диспетчер Redux
   * @dependency {string} password - Сгенерированный пароль
   */
  useEffect(() => {
    if (password) {
      dispatch(passwordStrength(password));
    }
  }, [dispatch, password]);

  /**
   * Мемоизированные опции пароля с добавленным обработчиком изменения
   * Предотвращает ненужные перерисовки при рендеринге списка опций
   *
   * @type {Array<{id: string, checked: boolean, label: string, onChange: Function}>}
   */
  const passwordOptions = useMemo(() =>
      options.map(option => ({
        ...option,
        onChange: handleOptionToggle,
      })),
    [options, handleOptionToggle],
  );

  return (
    <Card className="max-w-md w-full mx-auto p-4 gap-0 rounded">
      {/* Отображение сгенерированного пароля с кнопкой копирования */}
      <div className="relative grid gap-4">
        <Input type="text" disabled value={password ?? ''} aria-label="Generated Password" />
        <Button
          variant="outline"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={() => HELPERS.copyToClipboard(password)}
          aria-label="Copy password to clipboard"
        >
          <FaRegClipboard size={20} />
        </Button>
      </div>

      {/* Индикатор силы пароля */}
      <div
        className="my-4 h-2 rounded border bg-gray-100 dark:bg-gray-600 indicator"
        data-level={strength}
        role="progressbar"
        aria-label={`Password strength: ${strength || 'none'}`}
      />

      {/* Ползунок для выбора длины пароля */}
      <div className="my-4">
        <div className="flex items-center justify-between gap-1 text-gray-900 dark:text-gray-100">
          <span>Password Length</span>
          <span>{inputRange}</span>
        </div>
        <Input
          className="range w-full"
          type="range"
          value={inputRange}
          min={1}
          max={30}
          step={1}
          onChange={handleRangeChange}
          aria-label="Set password length"
        />
      </div>

      {/* Список опций для генерации пароля */}
      <ul className="grid gap-3 sm:grid-cols-2 mb-4" role="group" aria-label="Password options">
        {passwordOptions.map(({ id, checked, label }) => (
          <li key={id}>
            <label className="flex items-center cursor-pointer text-gray-900 dark:text-gray-100">
              <input
                className="sr-only"
                type="checkbox"
                checked={checked}
                onChange={() => handleOptionToggle(id)}
                aria-label={`Include ${label.toLowerCase()} in password`}
              />
              <span className="checkbox mr-2 border-gray-400 dark:border-gray-500"></span>
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>

      {/* Кнопка для генерации нового пароля */}
      <Button
        onClick={handleGeneratePassword}
        className="w-full"
      >
        Generate Password
      </Button>
    </Card>
  );
};

export default PasswordGeneratorPage;
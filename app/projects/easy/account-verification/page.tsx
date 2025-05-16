'use client';

/**
 * # Компонент верификации аккаунта
 *
 * Компонент для ввода проверочного кода, отправленного на email пользователя.
 * Реализует удобный интерфейс ввода с автоматическим переходом между полями.
 */

import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * Компонент страницы верификации аккаунта
 *
 * @returns {JSX.Element} Компонент страницы верификации
 */
const AccountVerificationPage = (): JSX.Element => {
  // Состояние для хранения введенных цифр кода
  const [digits, setDigits] = useState<string[]>(Array(4).fill(''));

  // Используется для программного управления фокусом
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * Обрабатывает изменение значения в поле ввода цифры
   *
   * @param {number} index - Индекс изменяемого поля
   * @param {string} value - Новое значение поля
   */
  const handleDigitChange = useCallback((index: number, value: string): void => {
    // Проверяем, что введен только один символ и это цифра
    if (value.length <= 1 && /^\d*$/.test(value)) {
      // Обновляем состояние с новым значением
      setDigits(prevDigits => {
        const newDigits = [...prevDigits];
        newDigits[index] = value;
        return newDigits;
      });

      // Если введена цифра и это не последнее поле, переходим к следующему полю
      if (value && index < 3) {
        // Используем реф для программного перемещения фокуса
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, []);

  /**
   * Обрабатывает нажатие клавиш в поле ввода
   *
   * @param {KeyboardEvent} e - Событие нажатия клавиши
   * @param {number} index - Индекс текущего поля
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    // Если нажат Backspace в пустом поле и это не первое поле, переходим к предыдущему
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  /**
   * Устанавливает фокус на первое поле ввода при монтировании компонента
   */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <Card className="grid gap-3 text-center max-w-2xl w-full mx-auto p-4 rounded">
      <p>We emailed you the six-digit code to johndoe@email.com. Enter the code below to confirm your email address.</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            className="h-[40px] w-[40px] rounded border-2 px-1 py-1 text-center !text-6xl font-semibold focus:border-blue-400 focus:outline-none md:h-[80px] md:w-[80px]"
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleDigitChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(e, index)}
            placeholder="0"
            required
            aria-label={`Цифра ${index + 1} проверочного кода`}
          />
        ))}
      </div>
      <p>This is design only. We didn&#39;t actually send you an email as we don&#39;t have your email, right?</p>
    </Card>
  );
};

export default AccountVerificationPage;
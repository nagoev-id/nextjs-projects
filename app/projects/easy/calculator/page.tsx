'use client';

/**
 * # Калькулятор
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и состояние**:
 *    - Приложение использует React с хуками состояния для управления данными калькулятора
 *    - Основные состояния: текущий вывод (output), текущий итог (currentTotal), текущий оператор и флаг ожидания нового ввода
 *    - Калькулятор начинает работу с нулевым значением на дисплее
 *
 * 2. **Обработка цифрового ввода**:
 *    - При нажатии на цифровую кнопку (0-9) значение добавляется к текущему выводу
 *    - Если ожидается новый ввод (после операции), предыдущее значение заменяется новой цифрой
 *    - Начальный ноль заменяется первой введенной цифрой
 *
 * 3. **Математические операции**:
 *    - Поддерживаются основные операции: сложение (+), вычитание (-), умножение (*), деление (/)
 *    - При нажатии на операцию текущее значение сохраняется как промежуточный итог
 *    - Если операция нажимается после предыдущей операции, только оператор обновляется
 *    - При последовательных операциях выполняется предыдущая операция и результат становится новым промежуточным итогом
 *
 * 4. **Специальные функции**:
 *    - Десятичная точка: добавляется только если она еще не присутствует в текущем числе
 *    - Кнопка очистки (C): сбрасывает все состояния калькулятора к начальным значениям
 *    - Кнопка равно (=): выполняет текущую операцию и отображает результат
 *
 * 5. **Обработка ошибок**:
 *    - При делении на ноль выводится сообщение "Error"
 *    - Результаты округляются до 12 значащих цифр для предотвращения ошибок с плавающей точкой
 *
 * 6. **Клавиатурный ввод**:
 *    - Поддерживается ввод с клавиатуры для всех операций:
 *      - Цифры 0-9 для ввода чисел
 *      - Операторы +, -, *, / для соответствующих операций
 *      - Точка (.) для десятичной дроби
 *      - Enter для выполнения операции (=)
 *      - Escape для очистки (C)
 *    - Клавиатурный ввод игнорируется, если фокус находится на элементах ввода текста
 *
 * 7. **Пользовательский интерфейс**:
 *    - Адаптивный дизайн с использованием Tailwind CSS
 *    - Четкое визуальное разделение между дисплеем и кнопками
 *    - Кнопка равно (=) выделена цветом и размером для удобства использования
 *    - Все элементы имеют ARIA-атрибуты для доступности
 */

import { Card } from '@/components/ui/card';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { CalculatorDisplay, DigitButtons, OperationButtons } from './components';

/**
 * Тип для математических операторов калькулятора
 * @typedef {'+' | '-' | '*' | '/' | '='} Operator
 */
type Operator = '+' | '-' | '*' | '/' | '=';

/**
 * Тип для функций вычисления
 * @typedef {(a: number, b: number) => number | string} CalculateFunction
 */
type CalculateFunction = (a: number, b: number) => number | string;

/**
 * Тип для объекта с функциями вычисления
 * @typedef {Object.<string, CalculateFunction>} CalculateObject
 */
type CalculateObject = {
  [key: string]: CalculateFunction;
}

/**
 * Компонент калькулятора
 * Реализует базовый функционал калькулятора с поддержкой основных математических операций
 *
 * @returns {JSX.Element} Компонент калькулятора
 */
const CalculatorPage = (): JSX.Element => {
  /**
   * Состояние для текущего отображаемого значения
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [output, setOutput] = useState<string>('0');

  /**
   * Состояние для хранения промежуточного результата вычислений
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [currentTotal, setCurrentTotal] = useState<number>(0);

  /**
   * Состояние для текущего выбранного оператора
   * @type {[Operator | '', React.Dispatch<React.SetStateAction<Operator | ''>>]}
   */
  const [currentOperator, setCurrentOperator] = useState<Operator | ''>('');

  /**
   * Флаг, указывающий, ожидается ли новый ввод (после операции)
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isNewInputExpected, setIsNewInputExpected] = useState<boolean>(false);

  /**
   * Объект с функциями для выполнения математических операций
   * Мемоизирован для предотвращения повторных созданий при перерендере
   *
   * @type {CalculateObject}
   */
  const calculators = useMemo<CalculateObject>(() => ({
    /**
     * Функция деления с проверкой деления на ноль
     * @param {number} a - Первый операнд
     * @param {number} b - Второй операнд
     * @returns {number|string} Результат деления или сообщение об ошибке
     */
    '/': (a: number, b: number): number | string => b !== 0 ? strip(a / b) : 'Error',

    /**
     * Функция умножения
     * @param {number} a - Первый операнд
     * @param {number} b - Второй операнд
     * @returns {number} Результат умножения
     */
    '*': (a: number, b: number): number => strip(a * b),

    /**
     * Функция сложения
     * @param {number} a - Первый операнд
     * @param {number} b - Второй операнд
     * @returns {number} Результат сложения
     */
    '+': (a: number, b: number): number => strip(a + b),

    /**
     * Функция вычитания
     * @param {number} a - Первый операнд
     * @param {number} b - Второй операнд
     * @returns {number} Результат вычитания
     */
    '-': (a: number, b: number): number => strip(a - b),

    /**
     * Функция для оператора равно (возвращает второй операнд)
     * @param {number} _ - Неиспользуемый первый операнд
     * @param {number} b - Второй операнд
     * @returns {number} Второй операнд
     */
    '=': (_: number, b: number): number => strip(b),
  }), []);

  /**
   * Функция для устранения ошибок с плавающей точкой
   * Округляет число до 12 значащих цифр
   *
   * @param {number} value - Число для округления
   * @returns {number} Округленное число
   */
  const strip = useCallback((value: number): number => {
    return Number(value.toPrecision(12));
  }, []);

  /**
   * Обработчик нажатия на цифровую кнопку
   * Добавляет цифру к текущему выводу или заменяет его, если ожидается новый ввод
   *
   * @param {string} digit - Нажатая цифра
   */
  const handleDigitClick = useCallback((digit: string): void => {
    if (isNewInputExpected) {
      setOutput(digit);
      setIsNewInputExpected(false);
    } else {
      setOutput(prevOutput => prevOutput === '0' ? digit : prevOutput + digit);
    }
  }, [isNewInputExpected]);

  /**
   * Обработчик нажатия на кнопку операции
   * Выполняет текущую операцию, если она есть, и устанавливает новую операцию
   *
   * @param {Operator} operation - Выбранная операция
   */
  const handleOperationClick = useCallback((operation: Operator): void => {
    const currentOutput = Number(output);

    if (currentOperator && isNewInputExpected) {
      setCurrentOperator(operation);
      return;
    }

    if (currentTotal) {
      const calculation = calculators[currentOperator as Operator](currentTotal, currentOutput);
      setOutput(calculation.toString());
      setCurrentTotal(typeof calculation === 'number' ? calculation : 0);
    } else {
      setCurrentTotal(currentOutput);
    }

    setIsNewInputExpected(true);
    setCurrentOperator(operation);
  }, [output, currentOperator, isNewInputExpected, currentTotal, calculators]);

  /**
   * Обработчик нажатия на кнопку десятичной точки
   * Добавляет точку к текущему выводу, если она еще не присутствует
   */
  const handleDecimalClick = useCallback((): void => {
    if (isNewInputExpected || output.includes('.')) return;
    setOutput(prevOutput => `${prevOutput}.`);
  }, [isNewInputExpected, output]);

  /**
   * Обработчик нажатия на кнопку очистки
   * Сбрасывает все состояния калькулятора к начальным значениям
   */
  const handleClearClick = useCallback((): void => {
    setCurrentTotal(0);
    setCurrentOperator('');
    setIsNewInputExpected(false);
    setOutput('0');
  }, []);

  /**
   * Эффект для обработки нажатий клавиш клавиатуры
   * Привязывает клавиши к соответствующим функциям калькулятора
   */
  useEffect(() => {
    /**
     * Обработчик нажатия клавиш
     * @param {KeyboardEvent} event - Событие нажатия клавиши
     */
    const handleKeyPress = (event: KeyboardEvent): void => {
      // Игнорируем нажатия, если фокус на элементах ввода текста
      if (event.target instanceof HTMLElement &&
        (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = event.key;
      // Карта соответствия клавиш и функций калькулятора
      const keyHandlers: Record<string, () => void> = {
        '0': () => handleDigitClick('0'),
        '1': () => handleDigitClick('1'),
        '2': () => handleDigitClick('2'),
        '3': () => handleDigitClick('3'),
        '4': () => handleDigitClick('4'),
        '5': () => handleDigitClick('5'),
        '6': () => handleDigitClick('6'),
        '7': () => handleDigitClick('7'),
        '8': () => handleDigitClick('8'),
        '9': () => handleDigitClick('9'),
        '+': () => handleOperationClick('+'),
        '-': () => handleOperationClick('-'),
        '*': () => handleOperationClick('*'),
        '/': () => handleOperationClick('/'),
        '.': handleDecimalClick,
        'Enter': () => handleOperationClick('='),
        'Escape': handleClearClick,
      };

      // Если есть обработчик для нажатой клавиши, вызываем его
      if (keyHandlers[key]) {
        event.preventDefault();
        keyHandlers[key]();
      }
    };

    // Добавляем слушатель событий при монтировании компонента
    window.addEventListener('keydown', handleKeyPress);

    // Удаляем слушатель при размонтировании компонента
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleDigitClick, handleOperationClick, handleDecimalClick, handleClearClick]);

  return (
    <Card className="max-w-[400px] w-full mx-auto p-4 rounded">
      <div className="grid gap-4">
        <CalculatorDisplay output={output} />
        <div className="grid grid-cols-4 gap-4">
          <OperationButtons onOperationClick={handleOperationClick} />
          <DigitButtons onDigitClick={handleDigitClick} />

          <Button
            onClick={handleDecimalClick}
            className="text-xl font-medium"
            aria-label="decimal"
          >.</Button>

          <Button
            variant="destructive"
            className="text-xl font-medium"
            onClick={handleClearClick}
            aria-label="clear"
          >C</Button>

          <Button
            className="col-start-4 row-start-2 row-span-4 h-full bg-green-500 text-2xl font-semibold"
            onClick={() => handleOperationClick('=')}
            aria-label="equals"
          >=</Button>
        </div>
      </div>
    </Card>
  );
};

export default CalculatorPage;
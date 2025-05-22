'use client';

/**
 * # Конвертер валют
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация**:
 *    - При загрузке приложение устанавливает начальные значения валют (USD -> RUB)
 *    - Загружает соответствующие флаги стран для визуального представления
 *    - Инициализирует форму с валидацией через Zod
 *
 * 2. **Ввод данных**:
 *    - Пользователь вводит сумму для конвертации
 *    - Выбирает исходную валюту из выпадающего списка
 *    - Выбирает целевую валюту из выпадающего списка
 *    - Может быстро поменять валюты местами с помощью кнопки переключения
 *
 * 3. **Процесс конвертации**:
 *    - При отправке формы данные валидируются
 *    - Отправляется запрос к API Exchange Rates Data
 *    - Во время запроса отображается индикатор загрузки
 *    - При успешном ответе данные обрабатываются и отображаются
 *
 * 4. **Отображение результатов**:
 *    - Результат конвертации показывается в таблице
 *    - Отображается текущая дата курса
 *    - Показывается курс обмена (1 единица исходной валюты в единицах целевой)
 *    - Отображается итоговая сумма конвертации
 *
 * 5. **Обработка ошибок**:
 *    - При ошибке запроса показывается уведомление
 *    - Валидация формы предотвращает отправку некорректных данных
 *    - Обработка ошибок сетевых запросов
 *
 * 6. **Динамическое обновление UI**:
 *    - Флаги стран обновляются при изменении выбранных валют
 *    - Результаты конвертации сбрасываются при изменении параметров
 *    - Состояние загрузки отображается визуально
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { GoArrowSwitch } from 'react-icons/go';
import { CURRENCY_LIST } from '@/app/projects/easy/currency-converter/mock';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import { validate, ValidateSchema } from '@/app/projects/easy/currency-converter/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';

/**
 * Константы API для работы с сервисом обмена валют
 * @type {Object}
 * @property {string} key - API ключ для доступа к сервису
 * @property {string} flagUrl - URL для получения изображений флагов стран
 * @property {string} currencyUrl - URL для API конвертации валют
 */
const API = {
  key: '72QTpHHYt5e4JNuG2VCwerzkjph8ZNuB',
  flagUrl: 'https://flagcdn.com/48x36',
  currencyUrl: 'https://api.apilayer.com/exchangerates_data/convert',
};

/**
 * Тип для хранения состояния валюты
 * @typedef {Object} CurrencyState
 * @property {number} amount - Сумма для конвертации
 * @property {string} from - Код исходной валюты
 * @property {string} to - Код целевой валюты
 * @property {string} fromFlag - URL флага исходной валюты
 * @property {string} toFlag - URL флага целевой валюты
 * @property {number|null} rate - Курс обмена
 * @property {string|null} date - Дата курса
 * @property {number|null} result - Результат конвертации
 */
type CurrencyState = {
  amount: number | string;
  from: string;
  to: string;
  fromFlag: string;
  toFlag: string;
  rate: number | null;
  date: string | null;
  result: number | null;
};

/**
 * Тип для хранения статуса запроса
 * @typedef {Object} StatusState
 * @property {boolean} isLoading - Флаг загрузки
 * @property {boolean} isError - Флаг ошибки
 * @property {boolean} isSuccess - Флаг успешного выполнения
 */
type StatusState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

/**
 * Компонент для отображения флага и селектора валюты
 * @param {Object} props - Свойства компонента
 * @param {string} props.flagUrl - URL изображения флага
 * @param {string} props.label - Метка для селектора
 * @param {string} props.name - Имя поля формы
 * @param {Array} props.options - Опции для селектора
 * @param {string} props.defaultValue - Значение по умолчанию
 * @param {Object} props.form - Объект формы
 * @returns {JSX.Element} Компонент селектора валюты с флагом
 */
const CurrencySelector = ({
                            flagUrl,
                            label,
                            name,
                            options,
                            defaultValue,
                            form,
                          }: {
  flagUrl: string;
  label: string;
  name: string;
  options: { value: string; label: string; }[];
  defaultValue: string;
  form: any;
}) => (
  <div className="grid gap-1">
    <div className="relative">
      <Image
        src={flagUrl}
        width={32}
        height={24}
        alt="Flag for selected currency"
        className="absolute left-2 top-[28px] w-8 transform"
      />
      <FormSelect
        form={form}
        name={name}
        label={label}
        options={options}
        selectProps={{
          className: 'pl-12 w-full',
          defaultValue: defaultValue,
        }}
      />
    </div>
  </div>
);

/**
 * Компонент для отображения результата конвертации
 * @param {Object} props - Свойства компонента
 * @param {CurrencyState} props.currency - Состояние валюты
 * @returns {JSX.Element} Компонент таблицы с результатом конвертации
 */
const ConversionResult = ({ currency }: { currency: CurrencyState }) => (
  <table className="table-auto w-full mt-4">
    <tbody>
    <tr>
      <td className="border p-2 bg-neutral-50 dark:bg-accent font-medium">Date</td>
      <td className="border p-2">{currency.date}</td>
    </tr>
    <tr>
      <td className="border p-2 bg-neutral-50 dark:bg-accent font-medium">Rate</td>
      <td className="border p-2">1 {currency.from} = {currency.rate} {currency.to}</td>
    </tr>
    <tr>
      <td className="border p-2 bg-neutral-50 dark:bg-accent font-medium">Result</td>
      <td className="border p-2">{currency.amount} {currency.from} = {currency.result} {currency.to}</td>
    </tr>
    </tbody>
  </table>
);

/**
 * Компонент формы конвертера валют
 * @param {Object} props - Свойства компонента
 * @param {Object} props.form - Объект формы
 * @param {Array} props.options - Опции для селекторов валют
 * @param {CurrencyState} props.currency - Состояние валюты
 * @param {Function} props.onSubmit - Обработчик отправки формы
 * @param {Function} props.handleSelectSwitch - Обработчик переключения валют
 * @returns {JSX.Element} Компонент формы конвертера
 */
const CurrencyForm = ({
                        form,
                        options,
                        currency,
                        onSubmit,
                        handleSelectSwitch,
                      }: {
  form: any;
  options: { value: string; label: string; }[];
  currency: CurrencyState;
  onSubmit: (data: ValidateSchema) => Promise<void>;
  handleSelectSwitch: () => void;
}) => (
  <Form {...form}>
    <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        form={form}
        name="amount"
        type="number"
        label="Enter the amount"
        aria-label="Amount to convert"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_40px_1fr] sm:items-end">
        <CurrencySelector
          flagUrl={currency.fromFlag}
          label="From"
          name="from"
          options={options}
          defaultValue={currency.from}
          form={form}
        />
        <Button
          className="flex justify-center items-center w-10 h-10 !p-0"
          variant="outline"
          onClick={handleSelectSwitch}
          aria-label="Switch currencies"
          type="button"
        >
          <GoArrowSwitch size={24} />
        </Button>
        <CurrencySelector
          flagUrl={currency.toFlag}
          label="To"
          name="to"
          options={options}
          defaultValue={currency.to}
          form={form}
        />
      </div>
      <Button type="submit">
        Get the exchange rate
      </Button>
    </form>
  </Form>
);

/**
 * Основной компонент страницы конвертера валют
 * @returns {JSX.Element} Компонент страницы конвертера валют
 */
const CurrencyConverterPage = () => {
  // Состояние валюты
  const [currency, setCurrency] = useState<CurrencyState>({
    amount: 1,
    from: 'USD',
    to: 'RUB',
    fromFlag: `${API.flagUrl}/us.png`,
    toFlag: `${API.flagUrl}/ru.png`,
    rate: null,
    date: null,
    result: null,
  });

  // Состояние статуса запроса
  const [status, setStatus] = useState<StatusState>({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  // Опции для селекторов валют
  const options = CURRENCY_LIST.map(currency => ({
    value: currency.name,
    label: currency.name,
  }));

  // Инициализация формы с валидацией
  const form = useForm<ValidateSchema>({
    defaultValues: {
      amount: String(currency.amount),
      from: currency.from,
      to: currency.to,
    },
    mode: 'onChange',
    resolver: zodResolver(validate),
  });

  /**
   * Обработчик отправки формы
   * @param {ValidateSchema} data - Данные формы
   */
  const onSubmit = async (data: ValidateSchema) => {
    try {
      setStatus({ isLoading: true, isError: false, isSuccess: false });

      const response = await axios.get(API.currencyUrl, {
        params: { to: data.to, from: data.from, amount: Number(data.amount) },
        headers: { apikey: API.key },
      });

      const { date, result, info: { rate }, query: { amount, from, to } } = response.data;
      setCurrency(prev => ({ ...prev, from, to, result, date, rate, amount: Number(amount) }));
      setStatus({ isLoading: false, isError: false, isSuccess: true });
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus({ isLoading: false, isError: true, isSuccess: false });
      toast.error('Failed to fetch exchange rate', { richColors: true });
    }
  };

  /**
   * Обработчик переключения валют
   */
  const handleSelectSwitch = useCallback(() => {
    const fromValue = form.getValues('from');
    const toValue = form.getValues('to');

    form.setValue('from', toValue);
    form.setValue('to', fromValue);
    setCurrency(prev => ({ ...prev, rate: null, date: null, result: null }));
  }, [form]);

  /**
   * Эффект для обновления флагов при изменении валют
   */
  useEffect(() => {
    const fromValue = form.watch('from');
    const toValue = form.watch('to');
    setCurrency(prev => ({
      ...prev,
      fromFlag: `${API.flagUrl}/${CURRENCY_LIST.find(c => c.name === fromValue)?.value.toLowerCase()}.png`,
      toFlag: `${API.flagUrl}/${CURRENCY_LIST.find(c => c.name === toValue)?.value.toLowerCase()}.png`,
      rate: null,
    }));
  }, [form.watch('from'), form.watch('to')]);

  return (
    <Card className="max-w-2xl w-full mx-auto p-4 rounded">
      <CurrencyForm
        form={form}
        options={options}
        currency={currency}
        onSubmit={onSubmit}
        handleSelectSwitch={handleSelectSwitch}
      />

      <div>
        {status.isLoading && <Spinner />}
        {status.isSuccess && currency.rate && <ConversionResult currency={currency} />}
      </div>
    </Card>
  );
};

export default CurrencyConverterPage;
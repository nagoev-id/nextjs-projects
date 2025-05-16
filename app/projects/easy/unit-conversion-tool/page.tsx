'use client';

/**
 * # Инструмент преобразования единиц измерения
 *
 * ## Функциональность:
 *
 * 1. **Инициализация**:
 * - Загрузка компонентов с пустыми значениями преобразования
 * - Типы преобразования включают вес, температуру, длину и скорость
 *
 * 2. **Ввод пользователем**:
 * - Пользователь вводит значение в любое поле ввода
 * - Значение преобразуется во все другие единицы измерения того же типа
 *
 * 3. **Процесс преобразования**:
 * - Для каждой единицы измерения заданы формулы или коэффициенты преобразования
 * - Преобразования выполняются в режиме реального времени по мере ввода пользователем данных
 *
 * 4. **Отображение**:
 * - Типы конверсий отображаются в адаптивной таблице
 * - Каждый тип имеет свою собственную секцию с соответствующими входными данными для единиц измерения
 */

import { Card } from '@/components/ui/card';
import { HELPERS } from '@/shared';
import { ChangeEvent, useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';

type ConversionType = 'weight' | 'temperature' | 'length' | 'speed';
type ConversionValues = Record<ConversionType, Record<string, string>>;
type ConversionFactor = number | ((v: number) => number);

interface ConversionTypeConfig {
  name: ConversionType;
  values: string[];
}

interface ConverterConfig {
  [key: string]: {
    [fromUnit: string]: {
      [toUnit: string]: ConversionFactor;
    };
  };
}


const conversionData = {
  // Доступные типы преобразований
  types: [
    {
      name: 'weight',
      values: ['pounds', 'ounces', 'stones', 'kilograms', 'grams'],
    },
    {
      name: 'temperature',
      values: ['fahrenheit', 'celsius', 'kelvin'],
    },
    {
      name: 'length',
      values: ['feet', 'inches', 'yards', 'miles', 'meters', 'cm', 'kilometers'],
    },
    {
      name: 'speed',
      values: ['mph', 'kph', 'knots', 'mach'],
    },
  ] as ConversionTypeConfig[],

  // Формулы и коэффициенты пересчета
  converters: {
    weight: {
      pounds: {
        kilograms: 1 / 2.2046,
        ounces: 16,
        grams: 1 / 0.0022046,
        stones: 0.071429,
      },
      ounces: {
        pounds: 0.0625,
        kilograms: 1 / 35.274,
        grams: 1 / 0.035274,
        stones: 0.0044643,
      },
      stones: {
        pounds: 14,
        kilograms: 1 / 0.15747,
        ounces: 224,
        grams: 1 / 0.00015747,
      },
      kilograms: {
        pounds: 2.2046,
        ounces: 35.274,
        grams: 1000,
        stones: 0.1574,
      },
      grams: {
        pounds: 0.0022046,
        kilograms: 1 / 1000,
        ounces: 0.035274,
        stones: 0.00015747,
      },
    },
    temperature: {
      fahrenheit: {
        celsius: (v: number) => (v - 32) / 1.8,
        kelvin: (v: number) => (v - 32) / 1.8 + 273.15,
      },
      celsius: {
        fahrenheit: (v: number) => v * 1.8 + 32,
        kelvin: (v: number) => v + 273.15,
      },
      kelvin: {
        fahrenheit: (v: number) => (v - 273.15) * 1.8 + 32,
        celsius: (v: number) => v - 273.15,
      },
    },
    speed: {
      mph: { kph: 1.609344, knots: 1 / 1.150779, mach: 1 / 761.207 },
      kph: { mph: 1 / 1.609344, knots: 1 / 1.852, mach: 1 / 1225.044 },
      knots: { mph: 1.150779, kph: 1.852, mach: 1 / 661.4708 },
      mach: { mph: 761.207, kph: 1225.044, knots: 661.4708 },
    },
    length: {
      feet: {
        meters: 1 / 3.2808,
        inches: 12,
        cm: 1 / 0.032808,
        yards: 0.33333,
        kilometers: 1 / 3280.8,
        miles: 0.00018939,
      },
      inches: {
        feet: 0.083333,
        meters: 1 / 39.37,
        cm: 1 / 0.3937,
        yards: 0.027778,
        kilometers: 1 / 39370,
        miles: 0.000015783,
      },
      yards: {
        feet: 3,
        meters: 1 / 1.0936,
        inches: 36,
        cm: 1 / 0.010936,
        kilometers: 1 / 1093.6,
        miles: 0.00056818,
      },
      miles: {
        feet: 5280,
        meters: 1 / 0.00062137,
        inches: 63360,
        cm: 1 / 0.0000062137,
        yards: 1760,
        kilometers: 1 / 0.62137,
      },
      meters: {
        feet: 3.2808,
        inches: 39.37,
        cm: 100,
        yards: 1.0936,
        kilometers: 1 / 1000,
        miles: 0.00062137,
      },
      cm: {
        feet: 0.032808,
        meters: 1 / 100,
        inches: 0.3937,
        yards: 0.010936,
        kilometers: 1 / 100000,
        miles: 0.0000062137,
      },
      kilometers: {
        feet: 3280.8,
        meters: 1000,
        inches: 39370,
        cm: 100000,
        yards: 1093.6,
        miles: 0.62137,
      },
    },
  } as ConverterConfig,
};

/**
 * Компонент инструмента преобразования единиц измерения
 * Позволяет пользователям осуществлять преобразование между различными единицами измерения
 */
const UnitConversionToolPage = () => {
  // Состояние для хранения всех значений преобразования
  const [values, setValues] = useState<ConversionValues>({} as ConversionValues);

  /**
   * Обрабатывает изменения значений в любом поле ввода и вычисляет преобразования
   *
   * @param type - тип преобразования (вес, температура и т.д.)
   * @param unit - Изменяемая единица измерения (фунты, цельсий и т.д.)
   * @param value - новое значение, введенное пользователем.
   */
  const handleValueChange = useCallback((type: ConversionType, unit: string, value: string) => {
    // Если значение пустое, очистите все значения для этого типа
    if (!value) {
      setValues(prev => ({
        ...prev,
        [type]: {},
      }));
      return;
    }

    setValues(prev => {
      const newValues = { ...prev };
      newValues[type] = newValues[type] || {};
      newValues[type][unit] = value;

      const converter = conversionData.converters[type]?.[unit];
      if (converter) {
        const parsedValue = parseFloat(value);

        if (!isNaN(parsedValue)) {
          Object.entries(converter).forEach(([targetUnit, conversion]) => {
            const convertedValue = typeof conversion === 'function'
              ? conversion(parsedValue)
              : parsedValue * (conversion as number);

            newValues[type][targetUnit] = convertedValue.toFixed(6);
          });
        }
      }

      return newValues;
    });
  }, []);


  return (
    <Card className="max-w-6xl w-full mx-auto p-4 rounded">
      <div className="grid gap-4 items-start md:grid-cols-2">
        {conversionData.types.map(({ name, values: units }: ConversionTypeConfig) => (
          <Card key={name} className="grid gap-3 rounded border p-4 shadow">
            <h3 className="text-2xl font-bold">{HELPERS.capitalizeFirstLetter(name)} Converter</h3>
            <p>Type a value in any of the fields to convert between {name} measurements:</p>
            {units.map((unit) => (
              <label key={unit} className="grid gap-1">
                <span className="font-medium">{HELPERS.capitalizeFirstLetter(unit)}</span>
                <Input
                  type="number"
                  placeholder={HELPERS.capitalizeFirstLetter(unit)}
                  value={values[name]?.[unit.toLowerCase()] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleValueChange(name, unit.toLowerCase(), e.target.value)}
                />
              </label>
            ))}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default UnitConversionToolPage;
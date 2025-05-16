'use client';

/**
 * # Расширяемый текст
 * 
 * ## Принцип работы:
 * 
 * 1. **Инициализация**:
 *    - Компонент TextExpanderPage отображает несколько примеров компонента ExpandableText
 *    - Каждый ExpandableText содержит текст, который может быть свернут или развернут
 *    - Компоненты размещаются в карточке с вертикальным расположением
 * 
 * 2. **Настройка компонентов**:
 *    - Первый компонент использует настройки по умолчанию
 *    - Второй компонент имеет пользовательские настройки: количество слов, тексты кнопок и цвет
 *    - Третий компонент изначально развернут и имеет дополнительные стили
 * 
 * 3. **Взаимодействие с пользователем**:
 *    - Пользователь может нажимать на кнопки для разворачивания и сворачивания текста
 *    - Каждый компонент работает независимо от других
 *    - Состояние развернутости/свернутости управляется внутри компонента ExpandableText
 * 
 * 4. **Отображение текста**:
 *    - В свернутом состоянии показывается ограниченное количество слов
 *    - В развернутом состоянии показывается весь текст
 *    - Кнопка переключения меняет свой текст в зависимости от состояния
 * 
 * 5. **Настраиваемость**:
 *    - Компонент ExpandableText принимает различные пропсы для кастомизации
 *    - Можно настроить количество отображаемых слов, тексты кнопок, цвет и начальное состояние
 *    - Дополнительные классы CSS могут быть переданы для стилизации
 */

import { Card } from '@/components/ui/card';
import { ExpandableText } from './components';
import { JSX } from 'react';

/**
 * Компонент страницы с примерами расширяемого текста.
 * 
 * Демонстрирует различные конфигурации компонента ExpandableText,
 * показывая его гибкость и возможности настройки. Включает три примера
 * с разными параметрами и содержимым.
 * 
 * @returns {JSX.Element} Компонент страницы с примерами расширяемого текста
 */
const TextExpanderPage = (): JSX.Element => (
  <Card className="max-w-2xl w-full mx-auto p-4 rounded">
    <div className="grid gap-3">
      {/* Пример 1: Базовое использование с настройками по умолчанию */}
      <ExpandableText>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It&#39;s the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what&#39;s possible.
      </ExpandableText>

      {/* Пример 2: Пользовательские настройки для количества слов и текста кнопок */}
      <ExpandableText
        collapsedNumWords={20}
        expandButtonText="Show text"
        collapseButtonText="Collapse text"
        buttonColor="e33232"
      >
        Space travel requires some seriously amazing technology and
        collaboration between countries, private companies, and international
        space organizations. And while it&#39;s not always easy (or cheap), the
        results are out of this world. Think about the first time humans stepped
        foot on the moon or when rovers were sent to roam around on Mars.
      </ExpandableText>

      {/* Пример 3: Изначально развернутый текст с дополнительными стилями */}
      <ExpandableText expanded={true} className="p-4">
        Space missions have given us incredible insights into our universe and
        have inspired future generations to keep reaching for the stars. Space
        travel is a pretty cool thing to think about. Who knows what we&#39;ll
        discover next!
      </ExpandableText>
    </div>
  </Card>
);

export default TextExpanderPage;
'use client';
import { PROJECTS_LIST } from '@/shared';
import React, { JSX, ReactNode } from 'react';
import { Footer, Header, Main } from '@/components/layout';

/**
 * @interface ProjectLayoutProps
 * @description Интерфейс для пропсов компонента ProjectLayout
 * @property {ReactNode} children - Дочерние элементы, которые будут отображены внутри layout
 * @property {keyof typeof PROJECTS_LIST} projectKey - Ключ проекта из списка PROJECTS_LIST
 * @property {boolean} [showAbout=false] - Флаг для отображения секции "About" в Header
 * @property {ReactNode} [customHeader] - Пользовательский компонент Header (если нужен)
 */
interface ProjectLayoutProps {
  children: ReactNode;
  projectKey: keyof typeof PROJECTS_LIST;
  showAbout?: boolean;
  customHeader?: ReactNode;
  mainClassName?: string;
}

/**
 * Компонент макета проекта
 *
 * @param {ProjectLayoutProps} props - Пропсы компонента
 * @param {ReactNode} props.children - Дочерние элементы
 * @param {keyof typeof PROJECTS_LIST} props.projectKey - Ключ проекта
 * @param {boolean} [props.showAbout=false] - Флаг отображения секции "About"
 * @param {ReactNode} [props.customHeader] - Пользовательский компонент Header
 * @returns {JSX.Element} Отрендеренный макет проекта
 *
 * @description
 * Этот компонент создает общий макет для страниц проектов, включая Header, Main и Footer.
 * Он использует информацию о проекте из PROJECTS_LIST для заполнения Header.
 * Можно настроить отображение секции "About" и использовать пользовательский Header при необходимости.
 *
 * @see {@link PROJECTS_LIST} Список проектов с их описаниями
 */
export const ProjectLayout = ({
                                children,
                                projectKey,
                                showAbout = false,
                                customHeader,
                                mainClassName = '',
                              }: ProjectLayoutProps): JSX.Element => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      {customHeader || (
        <Header
          title={PROJECTS_LIST[projectKey]?.title || 'Project'}
          description={PROJECTS_LIST[projectKey]?.description || ''}
          showAbout={showAbout}
        />
      )}
      <Main className={`${mainClassName} overflow-auto`}>
        {children}
      </Main>
      <Footer />
    </div>
  );
};
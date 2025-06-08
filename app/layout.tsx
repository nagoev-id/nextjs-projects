import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { JSX, ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';

/**
 * Конфигурация шрифта Poppins
 * @type {import('next/font/google').Font}
 */
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

/**
 * Метаданные приложения
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Collections of React Apps',
  description: '👨‍💻🎓 A comprehensive collection of interactive web projects built with Next.js, organized by difficulty level.',
  keywords: ['Next.js', 'React'],
  authors: [{ name: 'Alim Nagoev', url: 'https://github.com/nagoev-alim' }],
};

/**
 * @typedef {Object} RootLayoutProps
 * @property {ReactNode} children - Дочерние элементы, которые будут отрендерены внутри layout
 */
type RootLayoutProps = {
  children: ReactNode;
}

/**
 * Корневой компонент layout
 *
 * @type {React.FC<RootLayoutProps>}
 * @param {RootLayoutProps} props - Пропсы компонента
 * @param {ReactNode} props.children - Дочерние элементы
 * @returns {JSX.Element} Отрендеренный корневой layout
 *
 * @description
 * Этот компонент представляет собой корневой layout приложения.
 * Он настраивает основную структуру HTML, применяет глобальные стили,
 * устанавливает провайдер темы и добавляет компонент для отображения уведомлений.
 */
const RootLayout = ({ children }: RootLayoutProps): JSX.Element => (
  <>
    <html lang="en" suppressHydrationWarning>
    <body className={`${poppins.className} antialiased flex flex-col text-foreground min-h-screen`}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    <Toaster />
    </body>
    </html>
  </>
);

export default RootLayout;
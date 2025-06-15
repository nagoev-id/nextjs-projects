import { JSX, memo } from 'react';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';


interface HeaderAboutProps {
  title: string | null | undefined;
}

/**
 * Мемоизированный компонент для отображения информации о проекте
 *
 * @param {Object} props - Пропсы компонента
 * @param {string} props.title - Заголовок проекта
 * @returns {JSX.Element} Компонент диалога с информацией о проекте
 */
const HeaderAbout = memo(({ title = '' }: HeaderAboutProps): JSX.Element => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>About</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-2xl">{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-lg">
        This project showcases a diverse collection of React applications, demonstrating modern web
        development practices. Each app in this collection is built using React, Redux for state
        management, Tailwind CSS for styling, and Shadcn UI for sleek, customizable components. From
        simple utilities to complex interfaces, this repository serves as both a learning resource and a
        reference for implementing various features in React ecosystems.
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

export default HeaderAbout;
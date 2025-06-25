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
import { BookOpenText } from 'lucide-react';


interface HeaderAboutProps {
  title: string | null | undefined;
  description: string | null | undefined;
}

/**
 * Мемоизированный компонент для отображения информации о проекте
 *
 * @param {Object} props - Пропсы компонента
 * @param {string} props.title - Заголовок проекта
 * @returns {JSX.Element} Компонент диалога с информацией о проекте
 */
export const HeaderAbout = memo(({ title = '', description = '' }: HeaderAboutProps): JSX.Element => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">
        <BookOpenText />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-2xl">{title}</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-lg">
        {description}
      </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));
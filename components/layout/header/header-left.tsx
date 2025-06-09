import Link from 'next/link';
import { JSX, memo } from 'react';
import { Github } from 'lucide-react';

/**
 * Мемоизированный компонент для отображения левой части заголовка
 *
 * @param {Object} props - Пропсы компонента
 * @param {string} props.title - Заголовок страницы
 * @param {string | null | undefined} props.description - Описание страницы
 * @param {string | undefined} props.ariaLabelLink - ARIA-метка для ссылки
 * @returns {JSX.Element} Компонент левой части заголовка
 */
const HeaderLeft = memo(({
                           title,
                           description,
                           ariaLabelLink,
                         }: {
  title: string;
  description: string | null | undefined;
  ariaLabelLink: string | undefined;
}): JSX.Element => (
  <div className="grid place-items-center md:inline-flex items-center gap-2">
    <Link
      href="https://github.com/nagoev-alim"
      aria-label="GitHub Profile"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github size={30} aria-hidden="true" />
    </Link>
    <Link
      className="font-semibold"
      href="/"
      aria-label={ariaLabelLink || `Return to the main page: ${title}`}
    >
      {title}
    </Link>
    {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
  </div>
));

export default HeaderLeft;
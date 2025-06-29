import { JSX } from 'react';

interface HeadlineCardProps {
  text: string;
}

export const HeadlineCard = ({ text }: HeadlineCardProps): JSX.Element => (
  <h3 className="text-xl">{text}</h3>
);
'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  level: string;
}

const levelConfig = {
  easy: {
    label: 'Easy',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800'
  },
  hard: {
    label: 'Hard',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
  }
};

const ProjectCard = ({ title, description, href, level }: ProjectCardProps) => {
  const { label, className } = useMemo(() => {
    const normalizedLevel = level.toLowerCase();
    return levelConfig[normalizedLevel as keyof typeof levelConfig] || {
      label: level,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };
  }, [level]);

  return (
    <Card className="transition-all duration-300 hover:shadow-md p-0">
      <Link href={`/projects/${href}`} className="block">
        <CardHeader className='p-4'>
          <Badge className={`max-w-max font-medium ${className}`}>
            {label}
          </Badge>
          <CardTitle className="mt-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default ProjectCard;
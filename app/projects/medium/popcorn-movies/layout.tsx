import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/popcorn-movies/app';
import { PopcornMoviesHeader } from '@/app/projects/medium/popcorn-movies/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.PopcornMovies;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <ReduxProvider>
      <ProjectLayout projectKey={projectKey} customHeader={<PopcornMoviesHeader/>}>{children}</ProjectLayout>
    </ReduxProvider>
  );
};

export default Layout;
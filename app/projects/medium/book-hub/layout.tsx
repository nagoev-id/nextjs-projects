import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/book-hub/app';
import { BookHubHeader } from '@/app/projects/medium/book-hub/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.BookHub;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <ReduxProvider>
      <ProjectLayout projectKey={projectKey} customHeader={<BookHubHeader />}>{children}</ProjectLayout>
    </ReduxProvider>
  );
};

export default Layout;
import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { AuthInitializer, Header } from '@/app/projects/hard/chat/components';
import { ReduxProvider } from '@/app/projects/hard/chat/redux';

const projectKey = 'hard/chat' as ProjectLabel;

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ReduxProvider>
    <AuthInitializer />
    <div className="container mx-auto px-4">
      <Header />
      <ProjectLayout projectKey={projectKey}>{children}</ProjectLayout>
    </div>
  </ReduxProvider>
);

export default Layout;
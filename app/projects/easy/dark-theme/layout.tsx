import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.DarkTheme;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ProjectLayout showAbout={true} projectKey={projectKey}>{children}</ProjectLayout>
);


export default Layout;
import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.URLShortener;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ProjectLayout projectKey={projectKey}>{children}</ProjectLayout>
);


export default Layout;
import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/age-calculator/redux';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.AgeCalculator_1;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ReduxProvider>
    <ProjectLayout showAbout={true} projectKey={projectKey}>{children}</ProjectLayout>
  </ReduxProvider>
);


export default Layout;
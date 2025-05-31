import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/crypto-market-tracker/app';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.CryptoMarketTracker;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <ReduxProvider>
      <ProjectLayout projectKey={projectKey}>{children}</ProjectLayout>
    </ReduxProvider>
  );
};

export default Layout;
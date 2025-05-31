import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/mobile-store-cart/app';
import { MobileStoreHeader } from '@/app/projects/medium/mobile-store-cart/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.MobileStoreCart;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <ReduxProvider>
      <ProjectLayout projectKey={projectKey} customHeader={<MobileStoreHeader/>}>{children}</ProjectLayout>
    </ReduxProvider>
  );
};

export default Layout;
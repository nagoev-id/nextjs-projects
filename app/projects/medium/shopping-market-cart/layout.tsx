import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from '@/app/projects/medium/shopping-market-cart/app';
import { MarketHeader } from '@/app/projects/medium/shopping-market-cart/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.ShoppingMarketCart;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => {
  return (
    <ReduxProvider>
      <ProjectLayout projectKey={projectKey} customHeader={<MarketHeader/>}>{children}</ProjectLayout>
    </ReduxProvider>
  );
};

export default Layout;
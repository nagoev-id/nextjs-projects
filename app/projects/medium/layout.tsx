import { Metadata } from 'next';
import { HELPERS } from '@/shared';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = 'Medium Projects';

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <>{children}</>
);

export default Layout;
import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { AuthInitializer, PhotoGalleryHeader } from '@/app/projects/hard/photo-gallery/components';
import { ReduxProvider } from '@/app/projects/hard/photo-gallery/redux';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.PhotoGallery_0;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ReduxProvider>
    <AuthInitializer />
    <ProjectLayout projectKey={projectKey} customHeader={<PhotoGalleryHeader />}>{children}</ProjectLayout>
  </ReduxProvider>
);

export default Layout;
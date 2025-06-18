import { Metadata } from 'next';
import { HELPERS, ProjectLabel, PROJECTS_LIST } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { AuthInitializer, ReduxProvider } from '@/app/projects/hard/pets-tinder/redux';
import { PetsHeader } from '@/app/projects/hard/pets-tinder/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.PetsTinder_0;

const title = PROJECTS_LIST.PetsTinder_0.title;
const description = PROJECTS_LIST.PetsTinder_0.description;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ReduxProvider>
    <AuthInitializer />
    <ProjectLayout projectKey={projectKey} customHeader={<PetsHeader title={title} description={description} />}>
      {children}
    </ProjectLayout>
  </ReduxProvider>
);

export default Layout;
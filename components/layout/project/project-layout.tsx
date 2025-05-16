import { PROJECTS_LIST } from '@/shared';
import { Footer, Header, Main } from '@/components/layout';
import { ReactNode } from 'react';

interface ProjectLayoutProps {
  children: ReactNode;
  projectKey: keyof typeof PROJECTS_LIST;
  showAbout?: boolean;
}

const ProjectLayout = ({
                         children,
                         projectKey,
                         showAbout = false,
                       }: Readonly<ProjectLayoutProps>) => {
  return (
    <>
      <Header
        title={PROJECTS_LIST[projectKey]?.title || 'Project'}
        description={PROJECTS_LIST[projectKey]?.description || ''}
        showAbout={showAbout}
      />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default ProjectLayout;

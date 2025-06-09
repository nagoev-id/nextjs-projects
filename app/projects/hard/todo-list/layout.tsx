import { Metadata } from 'next';
import { HELPERS, ProjectLabel } from '@/shared';
import { ReactNode } from 'react';
import { ProjectLayout } from '@/components/layout';
import { ReduxProvider } from './redux/provider';
import { AuthInitializer, TodoListHeader } from '@/app/projects/hard/todo-list/components';

interface LayoutProps {
  children: ReactNode;
}

const projectKey = ProjectLabel.TodoListSDB;

export const metadata: Metadata = HELPERS.projectMetadata(projectKey);

const Layout = ({ children }: Readonly<LayoutProps>) => (
  <ReduxProvider>
    <AuthInitializer />
    <ProjectLayout projectKey={projectKey} customHeader={<TodoListHeader/>}>{children}</ProjectLayout>
  </ReduxProvider>
);

export default Layout;
'use client';

import { useMemo } from 'react';
import { ProjectLevel, PROJECTS_LIST } from '@/shared';
import { Footer, Header, Main, ProjectCard } from '@/components/layout';

const HardProjectsPage = () => {
  const filteredProjects = useMemo(() => {
    return Object.entries(PROJECTS_LIST).filter(([_, project]) => {
      return project.level === ProjectLevel.hard;
    });
  }, []);
  return (
    <>
      <Header
        title="Hard Projects"
        description="Explore collection of hard projects designed to challenge your skills and enhance your learning."
      />
      <Main>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredProjects.map(([key, project]) => (
            <ProjectCard
              key={key}
              title={project.title}
              description={project.description}
              href={project.href}
              level={project.level}
            />
          ))}
        </div>
      </Main>
      <Footer />
    </>
  );
};

export default HardProjectsPage;
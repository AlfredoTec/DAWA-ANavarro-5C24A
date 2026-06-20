import type { Metadata } from 'next';
import { projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Proyectos de desarrollo web y software construidos por Alfredo Navarro.',
  openGraph: {
    title: 'Proyectos',
    description: 'Proyectos de desarrollo web y software construidos por Alfredo Navarro.',
    images: ['/og-projects.jpg'],
  },
};

export default function ProjectsPage() {
  return (
    <section className="section">
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
        // proyectos
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
        Lo que he construido
      </h1>
      <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 44 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

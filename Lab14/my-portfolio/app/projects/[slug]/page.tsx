import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Proyecto no encontrado' };
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images: [project.image] },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <section className="section">
      <Link
        href="/projects"
        style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: "'Courier New', monospace", fontSize: 13, display: 'inline-block', marginBottom: 32 }}
      >
        ← Volver a proyectos
      </Link>

      <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
        {project.title}
      </h1>
      <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 32 }} />

      {/* screenshot */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          marginBottom: 32,
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>

      <p style={{ fontSize: 16, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 28 }}>
        {project.description}
      </p>

      {/* tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {project.technologies.map((t) => (
          <span
            key={t}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-md)',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--t2)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* links */}
      <div style={{ display: 'flex', gap: 12 }}>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--accent)', color: '#0f172a',
              borderRadius: 8, padding: '12px 28px',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Ver código
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid var(--border-md)', borderRadius: 8,
              padding: '12px 28px', fontSize: 14, fontWeight: 500,
              color: 'var(--t2)', textDecoration: 'none',
            }}
          >
            Ver demo
          </a>
        )}
      </div>
    </section>
  );
}

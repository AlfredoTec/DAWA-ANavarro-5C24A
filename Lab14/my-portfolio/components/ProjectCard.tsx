import Image from 'next/image';
import { Project } from '@/types';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const GitHubIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface Props {
  project: Project;
  reverse?: boolean;
}

export default function ProjectCard({ project, reverse = false }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        alignItems: 'center',
        direction: reverse ? 'rtl' : 'ltr',
      }}
    >
      {/* browser mockup */}
      <div
        style={{
          direction: 'ltr',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px var(--shadow)',
          transition: 'transform .3s, box-shadow .3s',
        }}
        className="group hover:-translate-y-1"
      >
        {/* chrome bar */}
        <div
          style={{
            background: 'var(--bg-surface)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--dot-r)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--dot-y)' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--dot-g)' }} />
          <div
            style={{
              flex: 1,
              margin: '0 12px',
              background: 'var(--bg)',
              borderRadius: 4,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              color: 'var(--t4)',
            }}
          >
            {project.browserUrl}
          </div>
        </div>

        {/* screenshot */}
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* info */}
      <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
          {project.title}
        </h3>

        {/* tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.techIcons.map((t) => (
            <span
              key={t.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-md)',
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--t2)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${DEVICON}/${t.icon}`}
                alt={t.name}
                width={14}
                height={14}
                className={t.invert ? 'icon-invert' : undefined}
                style={{ objectFit: 'contain' }}
              />
              {t.name}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.8 }}>{project.description}</p>

        {/* buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid var(--border-md)',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--t2)',
                textDecoration: 'none',
                transition: 'border-color .2s, color .2s',
              }}
            >
              <GitHubIcon /> Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid var(--border-md)',
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--t2)',
                textDecoration: 'none',
                transition: 'border-color .2s, color .2s',
              }}
            >
              <ExternalIcon /> Preview
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { projects, personalInfo, skills } from '@/lib/data';
import ConstellationCanvas from '@/components/ConstellationCanvas';
import SkillCard from '@/components/SkillCard';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 7%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* left content */}
        <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              color: 'var(--accent)',
              letterSpacing: 5,
              marginBottom: 22,
            }}
          >
            BACKEND DEVELOPER
          </div>

          <h1
            style={{
              fontSize: 'clamp(64px, 8vw, 96px)',
              fontWeight: 900,
              color: 'var(--t1)',
              lineHeight: 0.9,
              letterSpacing: '-4px',
              marginBottom: 20,
            }}
          >
            Alfredo
            <br />
            <span style={{ color: 'var(--accent)' }}>Navarro.</span>
          </h1>

          <div
            style={{
              width: 68,
              height: 3,
              background: 'linear-gradient(90deg, var(--accent), transparent)',
              borderRadius: 2,
              marginBottom: 20,
            }}
          />

          <p style={{ fontSize: 18, color: 'var(--t3)', letterSpacing: 0.5, marginBottom: 16 }}>
            {personalInfo.role}
          </p>

          <p
            style={{
              fontSize: 15,
              color: 'var(--t4)',
              maxWidth: 480,
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            {personalInfo.description}
          </p>

          <div style={{ display: 'flex', gap: 14 }}>
            <Link
              href="/projects"
              style={{
                background: 'var(--accent)',
                color: '#0f172a',
                fontSize: 14,
                fontWeight: 700,
                padding: '14px 32px',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              Ver proyectos
            </Link>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: '1px solid var(--border-md)',
                color: 'var(--t3)',
                fontSize: 14,
                padding: '14px 32px',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* constellation canvas — right half */}
        <div
          className="hero-fade"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '55%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <ConstellationCanvas />
        </div>
      </section>

      {/* ── HABILIDADES ── */}
      <section className="section">
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
          // habilidades
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
          Nivel por tecnología
        </h2>
        <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 44 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: '50%' }}>
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </section>

      {/* ── PROYECTOS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
          // proyectos
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
          Lo que he construido
        </h2>
        <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 44 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}

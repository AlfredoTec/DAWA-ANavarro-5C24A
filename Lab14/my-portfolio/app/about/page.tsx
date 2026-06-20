import type { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo, skills } from '@/lib/data';
import SkillCard from '@/components/SkillCard';

export const metadata: Metadata = {
  title: 'Sobre mí',
  description: `Conoce más sobre ${personalInfo.fullName}, ${personalInfo.title} en TECSUP.`,
};

export default function AboutPage() {
  return (
    <>
      {/* ── BIO ── */}
      <section className="section">
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
          // sobre mí
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
          Alfredo Navarro Tejeda
        </h1>
        <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 44 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
          {/* avatar */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoIAAgAAkA4JYgCdAEO/gHOAAD++P/YQAAA"
            />
          </div>

          {/* text */}
          <div>
            <p style={{ fontSize: 18, color: 'var(--accent)', fontFamily: "'Courier New', monospace", marginBottom: 16 }}>
              {personalInfo.role}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, color: 'var(--t3)', lineHeight: 1.8 }}>
              <p>
                Soy estudiante de Diseño y Desarrollo de Software en TECSUP (Lima, Perú).
                Me especializo en backend con Node.js y NestJS, construyendo APIs robustas y sistemas escalables.
              </p>
              <p>
                He trabajado en proyectos reales con stacks multi-plataforma — desde e-commerce hasta
                sistemas médicos con IA. Disfruto aprender tecnologías nuevas y aplicarlas en soluciones concretas.
              </p>
              <p>
                Actualmente aprendiendo Next.js y expandiendo mis conocimientos en arquitectura de software.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: '1px solid var(--border-md)', borderRadius: 8,
                  padding: '10px 20px', fontSize: 14, fontWeight: 500,
                  color: 'var(--t2)', textDecoration: 'none',
                }}
              >
                GitHub
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--accent)', color: '#0f172a',
                  borderRadius: 8, padding: '10px 20px',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: 3, marginBottom: 6 }}>
          // habilidades
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
          Nivel por tecnología
        </h2>
        <div style={{ width: 44, height: 2, background: 'var(--accent)', marginBottom: 44 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </section>
    </>
  );
}

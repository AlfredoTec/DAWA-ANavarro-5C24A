import { personalInfo } from '@/lib/data';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 7%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        color: 'var(--t4)',
        transition: 'border-color .3s',
      }}
    >
      <span>// alfredo navarro tejeda · {new Date().getFullYear()}</span>
      <div style={{ display: 'flex', gap: 22 }}>
        <a
          href={`mailto:${personalInfo.email}`}
          style={{ color: 'var(--t4)', textDecoration: 'none' }}
        >
          {personalInfo.email}
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--t4)', textDecoration: 'none' }}
        >
          LinkedIn
        </a>
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--t4)', textDecoration: 'none' }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

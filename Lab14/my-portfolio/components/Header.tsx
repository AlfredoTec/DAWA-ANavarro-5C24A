import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--rail)',
        padding: '22px 7%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px var(--shadow)',
        transition: 'background .3s, border-color .3s',
      }}
    >
      {/* logo */}
      <Link
        href="/"
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 20,
          fontWeight: 900,
          color: 'var(--t1)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'var(--rail)', fontSize: 22 }}>&lt;</span>
        alfredo<span style={{ color: 'var(--accent)' }}>.</span>dev
        <span style={{ color: 'var(--rail)', fontSize: 22 }}>/&gt;</span>
      </Link>

      {/* links */}
      <nav>
        <ul style={{ display: 'flex', gap: 8, listStyle: 'none', alignItems: 'center' }}>
          {[
            { href: '/',         label: 'Inicio' },
            { href: '/projects', label: 'Proyectos' },
            { href: '/about',    label: 'Sobre mí' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--t3)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: 6,
                  transition: 'color .2s, background .2s',
                  display: 'block',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* right: toggle + cta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        <a
          href={`mailto:alfredont1088@gmail.com`}
          style={{
            background: 'transparent',
            border: '1.5px solid var(--rail)',
            color: 'var(--accent)',
            fontSize: 14,
            fontWeight: 600,
            padding: '9px 22px',
            borderRadius: 6,
            textDecoration: 'none',
            transition: 'background .2s, border-color .2s',
          }}
        >
          Contactar
        </a>
      </div>
    </header>
  );
}

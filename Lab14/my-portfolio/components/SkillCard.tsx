import { Skill } from '@/types';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const badgeClass: Record<Skill['level'], string> = {
  Mid:      'badge-mid',
  Junior:   'badge-junior',
  Learning: 'badge-learning',
};

const barClass: Record<Skill['level'], string> = {
  Mid:      'bar-mid',
  Junior:   'bar-junior',
  Learning: 'bar-learning',
};

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        height: 100,
        padding: '10px',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        overflow: 'hidden',
        transition: 'border-color .2s, transform .2s',
      }}
      className="group hover:-translate-y-0.5"
    >
      {/* icon */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent-bg)',
          border: '1px solid var(--border)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${DEVICON}/${skill.icon}`}
          alt={skill.name}
          width={24}
          height={24}
          className={skill.invert ? 'icon-invert' : undefined}
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            color: 'var(--t1)',
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {skill.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span
            className={badgeClass[skill.level]}
            style={{ fontFamily: "'Courier New', monospace", fontSize: 9, padding: '3px 9px', borderRadius: 3 }}
          >
            {skill.level}
          </span>
        </div>

        <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            className={barClass[skill.level]}
            style={{ height: '100%', width: `${skill.pct}%`, borderRadius: 2 }}
          />
        </div>
      </div>
    </div>
  );
}

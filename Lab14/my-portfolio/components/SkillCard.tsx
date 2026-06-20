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
        padding: '20px',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        transition: 'border-color .2s, transform .2s',
      }}
      className="group hover:-translate-y-0.5"
    >
      {/* icon */}
      <div
        style={{
          width: 52,
          height: 52,
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
          width={30}
          height={30}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span
            className={badgeClass[skill.level]}
            style={{ fontFamily: "'Courier New', monospace", fontSize: 9, padding: '3px 9px', borderRadius: 3 }}
          >
            {skill.level}
          </span>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: 'var(--t4)' }}>
            {skill.years}
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

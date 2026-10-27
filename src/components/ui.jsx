import { useMemo } from 'react';

// Small shared pieces so every screen has the same header, empty state, avatar and filter control.

export const initials = (name = '') =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'M';

const TONES = ['blue', 'teal', 'amber', 'rose', 'sky'];
const toneFor = (name = '') => TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length];

export function Avatar({ name, size = 'md', tone }) {
  const picked = useMemo(() => tone || toneFor(name), [tone, name]);
  return (
    <span className={`avatar avatar-${size} tone-${picked}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty-icon">
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

// options: [{ value, label, count? }]
export function Segmented({ value, onChange, options, label, testPrefix }) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={value === option.value ? 'is-active' : ''}
          onClick={() => onChange(option.value)}
          data-testid={testPrefix ? `${testPrefix}-${option.value}` : undefined}
        >
          {option.label}
          {option.count !== undefined && <span className="segmented-count">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Stat({ icon: Icon, tone = 'blue', label, value, hint }) {
  return (
    <article className="stat">
      <span className={`stat-icon tone-${tone}`}>
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {hint && <small className="stat-hint">{hint}</small>}
      </div>
    </article>
  );
}

export function DateBlock({ value }) {
  const date = new Date(value);
  return (
    <span className="date-block" aria-hidden="true">
      <span>{date.toLocaleDateString('en-PH', { month: 'short' })}</span>
      <strong>{date.getDate()}</strong>
    </span>
  );
}

const STYLES = {
  requested: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-slate-100 text-slate-700',
  completed: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-600',
  no_show: 'bg-red-100 text-red-700',
  synced: 'bg-emerald-50 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  failed: 'bg-amber-100 text-amber-800',
  flagged: 'bg-red-100 text-red-700',
  scheduled: 'bg-slate-100 text-slate-600',
  sent: 'bg-slate-100 text-slate-700',
  delivered: 'bg-emerald-50 text-emerald-800',
};

export default function StatusBadge({ status, label }) {
  const text = label || String(status || '').replace('_', ' ');
  return (
    <span
      className={`chip ${STYLES[status] || 'bg-slate-100 text-slate-600'}`}
      data-testid={`status-badge-${status}`}
    >
      {text}
    </span>
  );
}

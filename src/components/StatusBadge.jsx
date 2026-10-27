// One badge for appointment, sync and reminder states. Colour only ever means good, waiting or bad.
const TONE = {
  requested: 'warning',
  confirmed: 'info',
  in_progress: 'info',
  completed: 'positive',
  cancelled: 'neutral',
  no_show: 'negative',
  synced: 'positive',
  pending: 'warning',
  failed: 'warning',
  flagged: 'negative',
  scheduled: 'neutral',
  sent: 'info',
  delivered: 'positive',
};

const LABEL = { in_progress: 'In progress', no_show: 'No show' };

export default function StatusBadge({ status, label }) {
  const raw = label || LABEL[status] || String(status || '').replace('_', ' ');
  const text = raw.charAt(0).toUpperCase() + raw.slice(1);
  return (
    <span className={`badge badge-${TONE[status] || 'neutral'}`} data-testid={`status-badge-${status}`}>
      {text}
    </span>
  );
}

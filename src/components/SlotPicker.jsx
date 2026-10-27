import { useQuery } from '@tanstack/react-query';
import { CalendarSearch } from 'lucide-react';
import { getAvailability } from '../api/appointments.js';
import { fmtTime } from '../utils/timeRules.js';
import { EmptyState } from './ui.jsx';

const SLOT_LABEL = {
  free: 'Open',
  taken: 'Just taken',
  buffer: 'Too close to another visit',
  expired: 'Past',
};

// The screen disables unusable slots, but the mock API rejects them too.
export default function SlotPicker({ doctorId, date, onPick, selected }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['availability', doctorId, date],
    queryFn: () => getAvailability(doctorId, date),
    enabled: Boolean(doctorId && date),
    refetchInterval: 5000,
  });

  if (!doctorId) return <EmptyState icon={CalendarSearch} title="Choose a doctor first">Open times will show up here.</EmptyState>;
  if (isPending) return <div className="slot-grid" aria-busy="true">{Array.from({ length: 8 }).map((_, i) => <span key={i} className="slot skeleton" />)}</div>;
  if (error) return <p className="form-error">{error.message}</p>;

  const open = data.slots.filter((slot) => slot.state === 'free').length;

  return (
    <>
      <p className="muted slot-count">{open ? `${open} open ${open === 1 ? 'time' : 'times'} on this day` : 'No open times on this day. Try another date.'}</p>
      <div className="slot-grid" data-testid="slot-grid">
        {data.slots.map((slot, index) => {
          const disabled = slot.state !== 'free';
          return (
            <button
              key={slot.start}
              type="button"
              disabled={disabled}
              onClick={() => onPick(slot)}
              data-testid={`slot-${index}`}
              data-slot-state={slot.state}
              aria-pressed={selected === slot.start}
              className={`slot${selected === slot.start ? ' is-selected' : ''}`}
            >
              <strong>{fmtTime(slot.start)}</strong>
              <small>{SLOT_LABEL[slot.state]}</small>
            </button>
          );
        })}
      </div>
    </>
  );
}

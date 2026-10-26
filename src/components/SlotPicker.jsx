import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/appointments.js';
import { fmtTime } from '../utils/timeRules.js';

const SLOT_LABEL = {
  free: 'Available',
  taken: 'Just taken',
  buffer: 'Blocked by 10-minute buffer',
  expired: 'Past / expired',
};

// REQ-01, REQ-10: the screen disables unusable slots, but the mock API rejects them too.
export default function SlotPicker({ doctorId, date, onPick, selected }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['availability', doctorId, date],
    queryFn: () => getAvailability(doctorId, date),
    enabled: Boolean(doctorId && date),
    refetchInterval: 5000,
  });

  if (!doctorId) return <p className="text-sm text-slate-500">Choose a doctor to see open slots.</p>;
  if (isPending) return <p className="text-sm text-slate-500">Loading slots...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" data-testid="slot-grid">
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
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
              disabled
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'border-slate-300 bg-white hover:border-brand-600 hover:text-brand-700'
            } ${selected === slot.start ? 'ring-2 ring-brand-600' : ''}`}
          >
            <span className="block font-medium">{fmtTime(slot.start)}</span>
            <span className="block text-xs">{SLOT_LABEL[slot.state]}</span>
          </button>
        );
      })}
    </div>
  );
}

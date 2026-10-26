import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/appointments.js';
import { fmtTime } from '../utils/timeRules.js';

const STATE_LABEL = {
  free: 'Available',
  taken: 'Just taken',
  buffer: 'Blocked by 10-minute buffer',
  expired: 'Past / expired',
};

// Shared by the patient reschedule screen and the doctor recovery flow (REQ-06, REQ-07).
export default function ReschedulePanel({ appointment, onDone }) {
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ['availability', appointment.doctorId, date],
    queryFn: () => getAvailability(appointment.doctorId, date),
    enabled: Boolean(date),
  });

  const submit = async () => {
    if (!selected) {
      setError('Choose a new slot first.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onDone(selected);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3" data-testid="reschedule-panel">
      <label className="label" htmlFor={`date-${appointment.id}`}>
        New date
      </label>
      <input
        id={`date-${appointment.id}`}
        type="date"
        className="input max-w-xs"
        value={date}
        onChange={(event) => {
          setDate(event.target.value);
          setSelected('');
        }}
        data-testid="reschedule-date"
      />
      {isPending && <p className="mt-2 text-sm text-slate-500">Loading slots...</p>}
      {data && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {data.slots.map((slot, index) => (
            <button
              key={slot.start}
              type="button"
              disabled={slot.state !== 'free'}
              onClick={() => setSelected(slot.start)}
              data-testid={`reschedule-slot-${index}`}
              className={`rounded-lg border px-2 py-1 text-left text-xs ${
                slot.state !== 'free'
                  ? 'cursor-not-allowed border-slate-200 bg-white text-slate-400'
                  : selected === slot.start
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-300 bg-white hover:border-brand-600'
              }`}
            >
              <span className="block font-medium">{fmtTime(slot.start)}</span>
              <span>{STATE_LABEL[slot.state]}</span>
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="error" data-testid="reschedule-error">
          {error}
        </p>
      )}
      <button type="button" className="btn-primary mt-2" disabled={busy} onClick={submit} data-testid="reschedule-submit">
        {busy ? 'Moving...' : 'Confirm new slot'}
      </button>
    </div>
  );
}

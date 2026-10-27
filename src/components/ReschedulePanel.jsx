import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/appointments.js';
import { fmtTime, toDateInput } from '../utils/timeRules.js';

const STATE_LABEL = {
  free: 'Open',
  taken: 'Just taken',
  buffer: 'Too close to another visit',
  expired: 'Past',
};

// Shared by the patient reschedule action and the doctor recovery flow.
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
      setError('Choose a new time first.');
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
    <div className="panel-inset" data-testid="reschedule-panel">
      <div className="field">
        <label className="label" htmlFor={`date-${appointment.id}`}>New date</label>
        <input
          id={`date-${appointment.id}`}
          type="date"
          className="input input-narrow"
          min={toDateInput()}
          value={date}
          onChange={(event) => { setDate(event.target.value); setSelected(''); }}
          data-testid="reschedule-date"
        />
      </div>
      {isPending && date && <p className="muted">Loading times…</p>}
      {data && (
        <div className="slot-grid slot-grid-sm">
          {data.slots.map((slot, index) => (
            <button
              key={slot.start}
              type="button"
              disabled={slot.state !== 'free'}
              onClick={() => setSelected(slot.start)}
              data-testid={`reschedule-slot-${index}`}
              aria-pressed={selected === slot.start}
              className={`slot${selected === slot.start ? ' is-selected' : ''}`}
            >
              <strong>{fmtTime(slot.start)}</strong>
              <small>{STATE_LABEL[slot.state]}</small>
            </button>
          ))}
        </div>
      )}
      {error && <p className="form-error" data-testid="reschedule-error">{error}</p>}
      <div className="row-end">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={submit} data-testid="reschedule-submit">
          {busy ? 'Moving…' : 'Confirm new time'}
        </button>
      </div>
    </div>
  );
}

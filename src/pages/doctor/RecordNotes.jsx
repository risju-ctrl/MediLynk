import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { saveConsultationNotes } from '../../api/records.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { fmtDateTime } from '../../utils/timeRules.js';

export default function RecordNotes() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useAppointments();
  const appointment = (data?.appointments || []).find((row) => row.id === id);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (appointment?.consultationNotes) setNotes(appointment.consultationNotes);
  }, [appointment?.consultationNotes]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (notes.trim().length < 10) return setMessage('Consultation notes must be at least 10 characters.');
    try {
      await saveConsultationNotes(id, notes);
      setMessage('Notes saved to the medical record.');
      queryClient.invalidateQueries();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!appointment) return <p className="text-sm text-slate-500">Loading consultation...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Consultation notes</h1>
        <p className="text-sm text-slate-600">
          {appointment.patientName} · {fmtDateTime(appointment.start)} · status {appointment.status}
        </p>
        <p className="text-xs text-slate-500">Symptoms reported: {appointment.symptoms || '—'}</p>
      </div>

      <form className="card space-y-3" onSubmit={submit}>
        <label className="label" htmlFor="notes">
          Notes (visible to the patient and to cleared clinical roles only)
        </label>
        <textarea
          id="notes"
          rows={6}
          className="input"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          data-testid="notes-text"
        />
        {message && (
          <p
            className={`text-sm ${message.startsWith('Notes saved') ? 'text-emerald-700' : 'text-red-600'}`}
            data-testid="notes-message"
          >
            {message}
          </p>
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn-primary" data-testid="notes-submit">
            Save notes
          </button>
          <Link to="/doctor/consultations" className="btn-ghost" data-testid="notes-back">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { saveSymptoms } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { ACTIVE_STATUSES, fmtDateTime } from '../../utils/timeRules.js';

export default function SymptomForm() {
  const queryClient = useQueryClient();
  const { data } = useAppointments();
  const [appointmentId, setAppointmentId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [message, setMessage] = useState('');

  const bookable = (data?.appointments || []).filter((appointment) =>
    ACTIVE_STATUSES.includes(appointment.status),
  );
  const selected = bookable.find((appointment) => appointment.id === appointmentId);

  useEffect(() => {
    setSymptoms(selected?.symptoms || '');
    setMessage('');
  }, [appointmentId, selected?.symptoms]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (!appointmentId) return setMessage('Choose an appointment first.');
    if (symptoms.trim().length < 10) return setMessage('Describe your symptoms in at least 10 characters.');
    try {
      await saveSymptoms(appointmentId, symptoms);
      setMessage('Symptoms saved.');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Symptom form</h1>
        <p className="text-sm text-slate-600">Update the symptoms your doctor will read before the call.</p>
      </div>

      <form className="card space-y-4" onSubmit={submit}>
        <div>
          <label className="label" htmlFor="appointment">
            Appointment
          </label>
          <select
            id="appointment"
            className="input"
            value={appointmentId}
            onChange={(event) => setAppointmentId(event.target.value)}
            data-testid="symptom-appointment"
          >
            <option value="">Choose an appointment</option>
            {bookable.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {fmtDateTime(appointment.start)} — {appointment.doctorName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="symptoms">
            Symptoms
          </label>
          <textarea
            id="symptoms"
            rows={4}
            className="input"
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
            data-testid="symptom-text"
          />
          <p className="mt-1 text-xs text-slate-500">{symptoms.trim().length}/500 characters (minimum 10).</p>
        </div>
        {message && (
          <p className={`text-sm ${message === 'Symptoms saved.' ? 'text-emerald-700' : 'text-red-600'}`} data-testid="symptom-message">
            {message}
          </p>
        )}
        <button type="submit" className="btn-primary" data-testid="symptom-submit">
          Save symptoms
        </button>
      </form>
    </div>
  );
}

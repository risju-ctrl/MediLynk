import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarPlus, CheckCircle2 } from 'lucide-react';
import { saveSymptoms } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { EmptyState, PageHeader } from '../../components/ui.jsx';
import { ACTIVE_STATUSES, fmtDateTime } from '../../utils/timeRules.js';

export default function SymptomForm() {
  const queryClient = useQueryClient();
  const { data } = useAppointments();
  const [appointmentId, setAppointmentId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [message, setMessage] = useState('');

  const bookable = (data?.appointments || []).filter((appointment) => ACTIVE_STATUSES.includes(appointment.status));
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

  const saved = message === 'Symptoms saved.';

  return (
    <div className="page narrow-page">
      <PageHeader title="Symptoms" subtitle="Update what your doctor will read before the call." />

      {data && bookable.length === 0 ? (
        <section className="card card-pad">
          <EmptyState icon={CalendarPlus} title="No upcoming visit to update">Book a visit first, then you can add or change your symptoms here.</EmptyState>
          <div className="center-row"><Link to="/patient/book" className="btn btn-primary">Book a visit</Link></div>
        </section>
      ) : (
        <form className="card card-pad form" onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="appointment">Appointment</label>
            <select id="appointment" className="input" value={appointmentId} onChange={(event) => setAppointmentId(event.target.value)} data-testid="symptom-appointment">
              <option value="">Choose an appointment</option>
              {bookable.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>{fmtDateTime(appointment.start)} · {appointment.doctorName}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="symptoms">Symptoms</label>
            <textarea id="symptoms" rows={6} maxLength={500} className="input" value={symptoms} onChange={(event) => setSymptoms(event.target.value)} data-testid="symptom-text" placeholder="When did it start? How does it feel? Anything that makes it better or worse?" />
            <div className="field-foot"><span>At least 10 characters.</span><span>{symptoms.trim().length}/500</span></div>
          </div>
          {message && (
            <p className={saved ? 'form-success' : 'form-error'} role={saved ? 'status' : 'alert'} data-testid="symptom-message">
              {saved && <CheckCircle2 size={16} aria-hidden="true" />}{message}
            </p>
          )}
          <div className="row-end"><button type="submit" className="btn btn-primary" data-testid="symptom-submit">Save symptoms</button></div>
        </form>
      )}
    </div>
  );
}

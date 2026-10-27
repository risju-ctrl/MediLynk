import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { saveConsultationNotes } from '../../api/records.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, PageHeader } from '../../components/ui.jsx';
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

  if (!appointment) return <div className="page"><p className="muted" role="status">Loading consultation…</p></div>;
  const saved = message.startsWith('Notes saved');

  return (
    <div className="page">
      <PageHeader title="Consultation notes" subtitle={`${appointment.patientName} · ${fmtDateTime(appointment.start)}`}>
        <Link to="/doctor/consultations" className="btn btn-secondary" data-testid="notes-back"><ArrowLeft size={16} aria-hidden="true" />Back</Link>
      </PageHeader>

      <div className="split split-rail">
        <form className="card card-pad form" onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" rows={10} className="input" value={notes} onChange={(event) => setNotes(event.target.value)} data-testid="notes-text" placeholder="Findings, diagnosis, prescription and follow-up…" />
            <div className="field-foot"><span>Visible to the patient and to cleared clinical roles only.</span><span>{notes.trim().length} characters</span></div>
          </div>
          {message && (
            <p className={saved ? 'form-success' : 'form-error'} role={saved ? 'status' : 'alert'} data-testid="notes-message">
              {saved && <CheckCircle2 size={16} aria-hidden="true" />}{message}
            </p>
          )}
          <div className="row-end"><button type="submit" className="btn btn-primary" data-testid="notes-submit">Save notes</button></div>
        </form>

        <aside className="card card-pad" aria-label="Patient">
          <div className="card-head"><h2>Patient</h2><StatusBadge status={appointment.status} /></div>
          <div className="record-head"><Avatar name={appointment.patientName} /><div><h3>{appointment.patientName}</h3><small className="muted-sm">{fmtDateTime(appointment.start)}</small></div></div>
          <h4 className="mini-title">Symptoms reported</h4>
          <p className="appt-note flat">{appointment.symptoms || 'No symptoms were added.'}</p>
        </aside>
      </div>
    </div>
  );
}

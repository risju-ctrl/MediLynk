import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import { bookAppointment, listDoctors } from '../../api/appointments.js';
import SlotPicker from '../../components/SlotPicker.jsx';
import ReminderList from '../../components/ReminderList.jsx';
import { Avatar, PageHeader } from '../../components/ui.jsx';
import { fmtDateTime, now, toDateInput } from '../../utils/timeRules.js';

const tomorrow = () => toDateInput(new Date(now().getTime() + 86400000));

export default function BookAppointment() {
  const queryClient = useQueryClient();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(tomorrow());
  const [selected, setSelected] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [message, setMessage] = useState('');
  const [booked, setBooked] = useState(null);
  const [raceResult, setRaceResult] = useState([]);
  const { data: doctors } = useQuery({ queryKey: ['doctors'], queryFn: listDoctors });
  const doctorList = doctors?.doctors || [];
  const selectedDoctor = doctorList.find((doctor) => doctor.id === doctorId);

  // Next 14 days as a strip, so most bookings are one tap instead of a calendar popup.
  const days = useMemo(() => {
    const start = now();
    start.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const booking = useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => { setBooked(data.appointment); setMessage(''); setSelected(null); setSymptoms(''); queryClient.invalidateQueries(); },
    onError: (error) => { setMessage(error.message); setBooked(null); if (error.status === 409) queryClient.invalidateQueries({ queryKey: ['availability'] }); },
  });

  const submit = (event) => {
    event.preventDefault();
    if (!doctorId) return setMessage('Choose a doctor first.');
    if (!selected) return setMessage('Choose an available time first.');
    if (symptoms.trim().length < 10) return setMessage('Describe your symptoms in at least 10 characters.');
    return booking.mutate({ doctorId, start: selected.start, symptoms });
  };

  const simulateRace = async () => {
    if (!selected) return setMessage('Choose an available time first.');
    setRaceResult([]);
    const payload = { doctorId, start: selected.start, symptoms: symptoms || 'Simultaneous booking test.' };
    const results = await Promise.allSettled([bookAppointment(payload), bookAppointment(payload)]);
    setRaceResult(results.map((result) => (result.status === 'fulfilled' ? `Accepted: ${result.value.appointment.id}` : `Rejected (${result.reason.status}): ${result.reason.message}`)));
    queryClient.invalidateQueries();
  };

  if (booked) {
    return (
      <div className="page narrow-page">
        <section className="card card-pad success" data-testid="booking-success">
          <span className="success-icon"><CheckCircle2 size={28} aria-hidden="true" /></span>
          <h1>Visit requested</h1>
          <p>{booked.doctorName} · {fmtDateTime(booked.start)}</p>
          <p className="muted">Status: {booked.status} · Calendar sync: {booked.syncStatus}</p>
          <div className="success-reminders"><h2>Your reminders</h2><ReminderList appointmentId={booked.id} /></div>
          <div className="row-end">
            <button type="button" className="btn btn-secondary" onClick={() => setBooked(null)}>Book another</button>
            <Link to="/patient/appointments" className="btn btn-primary">View appointments <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Book a visit" subtitle="Choose a doctor, pick a time and tell them what’s going on.">
        <span className="secure"><ShieldCheck size={15} aria-hidden="true" />Private and secure</span>
      </PageHeader>

      <form className="book-grid" onSubmit={submit} noValidate>
        <div className="stack">
          <section className="card card-pad step">
            <h2><span className="step-n">1</span>Choose a doctor</h2>
            <div className="doctor-grid" role="radiogroup" aria-label="Doctor" data-testid="booking-doctor">
              {doctorList.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  role="radio"
                  aria-checked={doctorId === doctor.id}
                  className={`doctor-card${doctorId === doctor.id ? ' is-selected' : ''}`}
                  onClick={() => { setDoctorId(doctor.id); setSelected(null); }}
                  data-testid={`booking-doctor-${doctor.id}`}
                >
                  <Avatar name={doctor.name} size="lg" />
                  <span><strong>{doctor.name}</strong><small>{doctor.specialty}</small></span>
                  {doctorId === doctor.id && <Check size={18} className="doctor-check" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </section>

          <section className="card card-pad step">
            <h2><span className="step-n">2</span>Pick a day and time</h2>
            <div className="day-strip" role="group" aria-label="Day">
              {days.map((d) => {
                const value = toDateInput(d);
                return (
                  <button key={value} type="button" className={`day${date === value ? ' is-selected' : ''}`} aria-pressed={date === value} onClick={() => { setDate(value); setSelected(null); }}>
                    <span>{d.toLocaleDateString('en-PH', { weekday: 'short' })}</span>
                    <strong>{d.getDate()}</strong>
                    <small>{d.toLocaleDateString('en-PH', { month: 'short' })}</small>
                  </button>
                );
              })}
            </div>
            <div className="field date-other">
              <label className="label" htmlFor="date">Or choose another date</label>
              <input id="date" type="date" className="input input-narrow" value={date} min={toDateInput()} onChange={(event) => { setDate(event.target.value); setSelected(null); }} data-testid="booking-date" />
            </div>
            <SlotPicker doctorId={doctorId} date={date} selected={selected?.start} onPick={(slot) => { setSelected(slot); setMessage(''); }} />
          </section>

          <section className="card card-pad step">
            <h2><span className="step-n">3</span>What would you like help with?</h2>
            <label className="label" htmlFor="symptoms">Reason for the visit</label>
            <textarea id="symptoms" rows={4} maxLength={500} className="input" placeholder="Share your symptoms or what you’d like to discuss…" value={symptoms} onChange={(event) => setSymptoms(event.target.value)} data-testid="booking-symptoms" />
            <div className="field-foot"><span>Only your care team can read this.</span><span>{symptoms.trim().length}/500</span></div>
          </section>
        </div>

        <aside className="card card-pad summary" aria-label="Appointment summary">
          <h2>Summary</h2>
          <dl className="summary-list">
            <div><dt>Doctor</dt><dd>{selectedDoctor ? <><strong>{selectedDoctor.name}</strong><small>{selectedDoctor.specialty}</small></> : <span className="placeholder">Not chosen yet</span>}</dd></div>
            <div><dt>When</dt><dd>{selected ? <><strong data-testid="booking-selected">{fmtDateTime(selected.start)}</strong><small>Video consultation</small></> : <span className="placeholder">Pick an open time</span>}</dd></div>
            <div><dt>Reason</dt><dd>{symptoms.trim() ? <span className="clamp">{symptoms.trim()}</span> : <span className="placeholder">Add a short note</span>}</dd></div>
          </dl>
          {message && <p className="form-error" role="alert" data-testid="booking-error">{message}</p>}
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={booking.isPending} data-testid="booking-submit">{booking.isPending ? 'Requesting…' : 'Confirm appointment'}</button>
          <p className="fine-print">Your doctor confirms the request. You’ll see the status change here and in your reminders.</p>
          <details className="demo-details">
            <summary>Demo tools</summary>
            <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={simulateRace} disabled={!selected} data-testid="simulate-simultaneous-booking" title="Sends two booking requests at the same time for the same slot">Test simultaneous booking</button>
            {raceResult.length > 0 && (
              <ul data-testid="race-result" className="race">
                {raceResult.map((line, index) => <li key={index} className={line.startsWith('Accepted') ? 'ok' : 'bad'}>Request {index + 1}: {line}</li>)}
              </ul>
            )}
          </details>
        </aside>
      </form>
    </div>
  );
}

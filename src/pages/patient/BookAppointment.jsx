import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookAppointment, listDoctors } from '../../api/appointments.js';
import SlotPicker from '../../components/SlotPicker.jsx';
import ReminderList from '../../components/ReminderList.jsx';
import { fmtDateTime, toDateInput } from '../../utils/timeRules.js';

const tomorrow = () => toDateInput(new Date(Date.now() + 86400000));

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
  const selectedDoctor = (doctors?.doctors || []).find((doctor) => doctor.id === doctorId);

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
    setRaceResult(results.map((result) => result.status === 'fulfilled' ? `Accepted: ${result.value.appointment.id}` : `Rejected (${result.reason.status}): ${result.reason.message}`));
    queryClient.invalidateQueries();
  };

  return <div className="booking-page">
    <header className="booking-heading"><div><h1>Let’s find a time for your care.</h1><p>Choose your doctor and an available time. You can share a note before confirming.</p></div><span className="booking-secure"> Private and secure</span></header>
    <ol className="booking-steps" aria-label="Booking steps"><li className="step-active"><span>01</span><div><strong>Provider</strong><small>Choose your doctor</small></div></li><li className={doctorId ? 'step-active' : ''}><span>02</span><div><strong>Date & time</strong><small>Pick an opening</small></div></li><li className={selected ? 'step-active' : ''}><span>03</span><div><strong>Your visit</strong><small>Add a short note</small></div></li></ol>
    <form className="booking-layout" onSubmit={submit} noValidate>
      <div className="booking-main">
        <section className="booking-card"><div className="booking-section-title"><span>01</span><div><h2>Choose your provider</h2><p>Select a doctor and a day that works for you.</p></div></div><div className="booking-field-grid"><div><label className="label" htmlFor="doctor">Doctor</label><select id="doctor" className="input" value={doctorId} onChange={(event) => { setDoctorId(event.target.value); setSelected(null); setBooked(null); }} data-testid="booking-doctor"><option value="">Choose a doctor</option>{(doctors?.doctors || []).map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} — {doctor.specialty}</option>)}</select></div><div><label className="label" htmlFor="date">Date</label><input id="date" type="date" className="input" value={date} min={toDateInput()} onChange={(event) => { setDate(event.target.value); setSelected(null); setBooked(null); }} data-testid="booking-date" /></div></div></section>
        <section className="booking-card"><div className="booking-section-title"><span>02</span><div><h2>Pick an available time</h2><p>Times are shown in your local timezone.</p></div></div><div className="slot-picker-wrap"><SlotPicker doctorId={doctorId} date={date} selected={selected?.start} onPick={(slot) => { setSelected(slot); setMessage(''); }} /></div></section>
        <section className="booking-card"><div className="booking-section-title"><span>03</span><div><h2>What would you like help with?</h2><p>A short note helps your doctor prepare for the visit.</p></div></div><label className="label" htmlFor="symptoms">Reason for consultation</label><textarea id="symptoms" rows={4} maxLength={500} className="input booking-textarea" placeholder="Share your symptoms or what you’d like to discuss…" value={symptoms} onChange={(event) => setSymptoms(event.target.value)} data-testid="booking-symptoms" /><div className="booking-note-footer"><span>Your note is only shared with your care team.</span><span>{symptoms.trim().length}/500</span></div></section>
      </div>
      <aside className="booking-summary"><div className="summary-top"><div><h2>Appointment summary</h2></div></div><div className="summary-detail"><span>PROVIDER</span><strong>{selectedDoctor?.name || 'Choose a doctor'}</strong><small>{selectedDoctor?.specialty || 'Your selected provider will appear here'}</small></div><div className="summary-detail"><span>DATE & TIME</span><strong>{selected ? fmtDateTime(selected.start) : 'Select an available time'}</strong><small>{selected ? 'Teleconsultation' : 'Choose a date and time to continue'}</small></div><div className="summary-detail summary-reason"><span>REASON</span><p>{symptoms.trim() || 'Your note will appear here after you add it.'}</p></div>
        {selected && <p className="selected-time" data-testid="booking-selected"> Selected: {fmtDateTime(selected.start)}</p>}
        {message && <p className="booking-error" role="alert" data-testid="booking-error">{message}</p>}
        <button type="submit" className="btn-primary booking-submit" disabled={booking.isPending} data-testid="booking-submit">{booking.isPending ? 'Requesting…' : 'Confirm appointment'}</button><p className="booking-disclaimer">You’ll see your appointment status as soon as your request is submitted.</p>
        <div className="booking-test-tools"><span>DEMO TOOLS</span><button type="button" className="btn-ghost" onClick={simulateRace} disabled={!selected} data-testid="simulate-simultaneous-booking" title="Sends two booking requests at the same time for the same slot">Test simultaneous booking</button>{raceResult.length > 0 && <ul data-testid="race-result">{raceResult.map((line,index)=><li key={index} className={line.startsWith('Accepted')?'text-emerald-700':'text-red-700'}>Request {index+1} — {line}</li>)}</ul>}</div>
      </aside>
    </form>
    {booked && <section className="card booking-success" data-testid="booking-success"><div><h2>Appointment requested</h2><p>{booked.doctorName} · {fmtDateTime(booked.start)} · {booked.status}</p><small>Calendar sync: {booked.syncStatus}</small><div className="booking-success-reminders"><ReminderList appointmentId={booked.id} /></div></div></section>}
  </div>;
}

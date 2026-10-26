import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { cancelAppointment, rescheduleAppointment } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import ReminderList from '../../components/ReminderList.jsx';
import ReschedulePanel from '../../components/ReschedulePanel.jsx';

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments();
  const [openReminders, setOpenReminders] = useState(null);
  const [openReschedule, setOpenReschedule] = useState(null);
  const [actionError, setActionError] = useState('');
  const refresh = () => queryClient.invalidateQueries();
  const cancel = async (id) => { setActionError(''); try { await cancelAppointment(id); refresh(); } catch (err) { setActionError(err.message); } };
  const reschedule = async (id, start) => { await rescheduleAppointment(id, start); setOpenReschedule(null); refresh(); };
  if (isPending) return <p className="notice-text">Loading your appointments…</p>;
  if (error) return <p className="error" role="alert">{error.message}</p>;
  const appointments = data.appointments;
  const upcoming = appointments.filter((a) => ['requested','confirmed','in_progress'].includes(a.status)).length;
  const completed = appointments.filter((a) => a.status === 'completed').length;

  return <div className="appointments-page">
    <header className="appointments-header"><div><h1>Appointments</h1><p>Keep track of upcoming visits and manage your care in one place.</p></div><Link to="/patient/book" className="btn-primary"> Book a visit</Link></header>
    <section className="appointment-counts"><article><div><strong>{upcoming}</strong><span>Upcoming</span></div></article><article><div><strong>{completed}</strong><span>Completed</span></div></article><article><div><strong>{appointments.length}</strong><span>All appointments</span></div></article></section>
    <div className="appointment-list-heading"><div><h2>Your appointments</h2></div><span className="appointment-total">{appointments.length} {appointments.length === 1 ? 'visit' : 'visits'}</span></div>
    {actionError && <p className="appointment-alert" role="alert" data-testid="appointment-action-error">{actionError}</p>}
    {appointments.length === 0 && <div className="appointment-empty"><h3>Your schedule is clear</h3><p>Book your first teleconsultation and we’ll keep the details here.</p><Link to="/patient/book" className="btn-primary">Find a time</Link></div>}
    <div className="appointment-records">{appointments.map((appointment) => {
      const canChange = ['requested','confirmed'].includes(appointment.status);
      return <article className="appointment-record" key={appointment.id}><AppointmentCard appointment={appointment}>
        {['confirmed','in_progress'].includes(appointment.status) && <Link to={`/patient/room/${appointment.id}`} className="btn-primary" data-testid={`patient-room-${appointment.id}`}>Join consultation</Link>}
        <button type="button" className="btn-ghost" onClick={() => setOpenReminders(openReminders === appointment.id ? null : appointment.id)} data-testid={`toggle-reminders-${appointment.id}`}>{openReminders === appointment.id ? 'Hide reminders' : 'View reminders'}</button>
        <button type="button" className="btn-ghost" disabled={!canChange} onClick={() => setOpenReschedule(openReschedule === appointment.id ? null : appointment.id)} data-testid={`toggle-reschedule-${appointment.id}`}>Reschedule</button>
        <button type="button" className="btn-danger" disabled={!canChange} onClick={() => cancel(appointment.id)} data-testid={`cancel-${appointment.id}`}>Cancel visit</button>
      </AppointmentCard>{openReminders === appointment.id && <div className="card appointment-expanded"><ReminderList appointmentId={appointment.id} /></div>}{openReschedule === appointment.id && <ReschedulePanel appointment={appointment} onDone={(start) => reschedule(appointment.id,start)} />}</article>;
    })}</div>
  </div>;
}

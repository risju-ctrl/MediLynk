import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useAppointments } from '../../hooks/useAppointments.js';
import { ACTIVE_STATUSES, fmtDateTime, isExpired } from '../../utils/timeRules.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ReminderList from '../../components/ReminderList.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isPending, error } = useAppointments();
  const appointments = data?.appointments || [];
  const upcoming = appointments.filter((a) => ACTIVE_STATUSES.includes(a.status) && !isExpired(a.start));
  const next = upcoming[0];
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const waiting = appointments.filter((a) => a.status === 'requested').length;

  return <div className="dashboard-page">
    <header className="dashboard-titlebar"><div><h1>Good morning, {user?.name?.split(' ')[0]}</h1><p>Here’s a clear view of what’s next in your care.</p></div><Link to="/patient/book" className="btn-primary" data-testid="dashboard-book"> Book an appointment</Link></header>
    {isPending && <p className="notice-text">Loading your appointments…</p>}{error && <p className="error" role="alert">{error.message}</p>}
    {!isPending && !error && <>
      <section className="metric-grid" aria-label="Appointment summary">
        <article className="metric-card"><div><span className="metric-label">UPCOMING VISITS</span><strong>{upcoming.length}</strong><small>{next ? `Next: ${fmtDateTime(next.start)}` : 'Nothing scheduled yet'}</small></div></article>
        <article className="metric-card"><div><span className="metric-label">COMPLETED VISITS</span><strong>{completed}</strong><small>Visits in your history</small></div></article>
        <article className="metric-card"><div><span className="metric-label">AWAITING CONFIRMATION</span><strong>{waiting}</strong><small>{waiting ? 'We’ll update your appointment status' : 'You’re all caught up'}</small></div></article>
      </section>
      <div className="dashboard-columns">
        <section className="dashboard-section"><div className="section-title-row"><div><h2>Upcoming appointments</h2></div><Link to="/patient/appointments" className="text-link" data-testid="dashboard-manage">View all</Link></div>
          {upcoming.length ? <div className="visit-list">{upcoming.slice(0,4).map((appointment) => <article className="visit-row" key={appointment.id}><div className="visit-date-icon"><span>{new Date(appointment.start).toLocaleDateString(undefined,{month:'short'})}</span><strong>{new Date(appointment.start).getDate()}</strong></div><div className="visit-info"><strong>{appointment.doctorName}</strong><span>{appointment.specialty || 'Consultation'} · {fmtDateTime(appointment.start)}</span></div><StatusBadge status={appointment.status} /><Link to="/patient/appointments" className="visit-action" aria-label={`Manage appointment with ${appointment.doctorName}`}><ArrowUpRight size={16} aria-hidden="true" /></Link></article>)}</div> : <div className="empty-visit"><h3>No visits scheduled</h3><p>Choose a time that works for you and meet with your care team online.</p><Link to="/patient/book" className="btn-primary">Find a time</Link></div>}
        </section>
        <aside className="dashboard-side">
          <section className="next-visit-card"><div className="side-card-heading"><div><h2>{next ? next.doctorName : 'Your next visit'}</h2></div></div>{next ? <><p className="next-specialty">{next.specialty || 'Teleconsultation'}</p><div className="next-date"><div><strong>{fmtDateTime(next.start)}</strong><small>Online consultation</small></div></div><Link to="/patient/appointments" className="btn-primary next-join">View visit details</Link></> : <div className="next-empty"><p>When you book a visit, the details will appear here.</p><Link to="/patient/book" className="text-link">Book your first visit</Link></div>}</section>
          {next && <section className="card reminder-panel"><div className="reminder-heading"><div><h3>Visit reminders</h3><p>For {fmtDateTime(next.start)}</p></div></div><ReminderList appointmentId={next.id} /></section>}
        </aside>
      </div>
      <section className="quick-actions"><div className="section-title-row"><div><h2>Manage your care</h2></div></div><div className="quick-action-grid"><Link to="/patient/book" className="quick-action"><span><strong>Book a visit</strong><small>Find a time with your doctor</small></span></Link><Link to="/patient/symptoms" className="quick-action"><span><strong>Update symptoms</strong><small>Share what you’re feeling</small></span></Link><Link to="/patient/history" className="quick-action"><span><strong>View records</strong><small>See your consultation history</small></span></Link></div></section>
    </>}
  </div>;
}


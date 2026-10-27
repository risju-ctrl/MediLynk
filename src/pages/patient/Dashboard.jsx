import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CalendarClock, CalendarPlus, CheckCircle2, ChevronRight, ClipboardList, FileText, Hourglass, Plus, Video } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useAppointments } from '../../hooks/useAppointments.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { ACTIVE_STATUSES, fmtDateTime, fmtTime, isExpired, now } from '../../utils/timeRules.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ReminderList from '../../components/ReminderList.jsx';
import { Avatar, DateBlock, EmptyState, PageHeader, Stat } from '../../components/ui.jsx';

const greeting = () => {
  const hour = now().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

const untilLabel = (seconds) => {
  if (seconds <= 0) return 'Starting now';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d) return `Starts in ${d}d ${h}h`;
  if (h) return `Starts in ${h}h ${m}m`;
  return `Starts in ${m}m`;
};

function NextVisit({ next }) {
  const seconds = useCountdown(next.start);
  const joinable = ['confirmed', 'in_progress'].includes(next.status);
  return (
    <section className="card hero-card" aria-label="Next visit">
      <span className="hero-chip">{untilLabel(seconds)}</span>
      <div className="hero-person">
        <Avatar name={next.doctorName} size="lg" tone="sky" />
        <div>
          <h2>{next.doctorName}</h2>
          <p>{next.specialty || 'Teleconsultation'}</p>
        </div>
      </div>
      <div className="hero-when">
        <strong>{fmtTime(next.start)}</strong>
        <span>{new Date(next.start).toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      {joinable ? (
        <Link to={`/patient/room/${next.id}`} className="btn btn-light btn-block"><Video size={16} aria-hidden="true" />Join consultation</Link>
      ) : (
        <Link to="/patient/appointments" className="btn btn-light btn-block">View details <ArrowRight size={16} aria-hidden="true" /></Link>
      )}
      {!joinable && <p className="hero-note">The doctor hasn’t confirmed yet. You’ll see the join button here once they do.</p>}
    </section>
  );
}

function WeekStrip({ appointments }) {
  const today = now();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });
  const has = (d) => appointments.some((a) => new Date(a.start).toDateString() === d.toDateString());
  return (
    <section className="card card-pad" aria-label="This week">
      <div className="card-head"><h2>Next 7 days</h2></div>
      <ol className="week">
        {days.map((d, i) => (
          <li key={d.toISOString()} className={`${i === 0 ? 'is-today' : ''}${has(d) ? ' has-visit' : ''}`}>
            <span>{d.toLocaleDateString('en-PH', { weekday: 'short' })}</span>
            <strong>{d.getDate()}</strong>
            <i aria-label={has(d) ? 'Visit scheduled' : undefined} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isPending, error } = useAppointments();
  const appointments = data?.appointments || [];
  const upcoming = appointments.filter((a) => ACTIVE_STATUSES.includes(a.status) && !isExpired(a.start));
  const next = upcoming[0];
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const waiting = appointments.filter((a) => a.status === 'requested').length;

  return (
    <div className="page">
      <PageHeader title={`${greeting()}, ${user?.name?.split(' ')[0]}`} subtitle="Here’s what’s coming up in your care.">
        <Link to="/patient/book" className="btn btn-primary" data-testid="dashboard-book"><Plus size={16} aria-hidden="true" />Book a visit</Link>
      </PageHeader>

      {isPending && <p className="muted" role="status">Loading your appointments…</p>}
      {error && <p className="form-error" role="alert">{error.message}</p>}

      {!isPending && !error && (
        <>
          <section className="stats" aria-label="Appointment summary">
            <Stat icon={CalendarClock} tone="blue" label="Upcoming" value={upcoming.length} hint={next ? `Next: ${fmtDateTime(next.start)}` : 'Nothing scheduled yet'} />
            <Stat icon={CheckCircle2} tone="teal" label="Completed" value={completed} hint="Visits in your history" />
            <Stat icon={Hourglass} tone="amber" label="Awaiting confirmation" value={waiting} hint={waiting ? 'We’ll update the status here' : 'You’re all caught up'} />
          </section>

          <div className="split">
            <div className="stack">
              <section className="card card-pad">
                <div className="card-head">
                  <h2>Upcoming appointments</h2>
                  <Link to="/patient/appointments" className="link" data-testid="dashboard-manage">View all</Link>
                </div>
                {upcoming.length ? (
                  <ul className="rows">
                    {upcoming.slice(0, 4).map((appointment) => (
                      <li key={appointment.id}>
                        <Link to="/patient/appointments" className="row-link" aria-label={`Manage appointment with ${appointment.doctorName}`}>
                          <DateBlock value={appointment.start} />
                          <span className="row-text">
                            <strong>{appointment.doctorName}</strong>
                            <small>{appointment.specialty || 'Consultation'} · {fmtDateTime(appointment.start)}</small>
                          </span>
                          <StatusBadge status={appointment.status} />
                          <ChevronRight size={16} className="row-chevron" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState icon={CalendarCheck} title="No visits scheduled">
                    Pick a time that works for you and meet your doctor online.
                  </EmptyState>
                )}
                {!upcoming.length && <div className="center-row"><Link to="/patient/book" className="btn btn-primary">Find a time</Link></div>}
              </section>

              <section className="shortcuts" aria-label="Shortcuts">
                <Link to="/patient/book" className="shortcut tone-blue"><CalendarPlus size={20} aria-hidden="true" /><strong>Book a visit</strong><small>Find a time with your doctor</small></Link>
                <Link to="/patient/symptoms" className="shortcut tone-amber"><ClipboardList size={20} aria-hidden="true" /><strong>Update symptoms</strong><small>Tell your doctor what changed</small></Link>
                <Link to="/patient/history" className="shortcut tone-teal"><FileText size={20} aria-hidden="true" /><strong>View records</strong><small>Your consultation history</small></Link>
              </section>
            </div>

            <aside className="stack" aria-label="Next visit and reminders">
              {next ? (
                <>
                  <NextVisit next={next} />
                  <section className="card card-pad">
                    <div className="card-head"><h2>Reminders</h2><span className="muted-sm">For {fmtDateTime(next.start)}</span></div>
                    <ReminderList appointmentId={next.id} />
                  </section>
                </>
              ) : (
                <section className="card card-pad">
                  <EmptyState icon={CalendarClock} title="Your next visit">When you book, the details and reminders will show up here.</EmptyState>
                </section>
              )}
              <WeekStrip appointments={upcoming} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarClock, ChevronRight, Hourglass, RefreshCw, TriangleAlert } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments.js';
import CalendarView from '../../components/CalendarView.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, EmptyState, PageHeader, Stat } from '../../components/ui.jsx';
import { ACTIVE_STATUSES, SYNC_LIMIT_SEC, fmtDate, fmtDateTime, fmtTime, isExpired } from '../../utils/timeRules.js';

export default function DoctorSchedule() {
  const { data, isPending, error } = useAppointments({ refetchInterval: 2000 });
  const [, tick] = useState(0);

  // Re-render every second so a sync that is taking too long is visible.
  useEffect(() => {
    const timer = setInterval(() => tick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const appointments = data?.appointments || [];
  const elapsed = (appointment) => (appointment.syncStartedAt ? (new Date() - new Date(appointment.syncStartedAt)) / 1000 : 0);

  if (isPending) return <div className="page"><p className="muted" role="status">Loading your schedule…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  const upcoming = appointments
    .filter((a) => ACTIVE_STATUSES.includes(a.status) && !isExpired(a.start))
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  const today = upcoming.filter((a) => new Date(a.start).toDateString() === new Date().toDateString());
  const requests = appointments.filter((a) => a.status === 'requested').length;
  const syncIssues = appointments.filter((a) => ['flagged', 'failed'].includes(a.syncStatus)).length;

  return (
    <div className="page">
      <PageHeader title="Schedule" subtitle={`New bookings appear on your calendar within ${SYNC_LIMIT_SEC} seconds. If a sync fails, it’s retried once, then sent to clinic staff.`}>
        <Link to="/doctor/consultations" className="btn btn-primary"><CalendarCheck size={16} aria-hidden="true" />Today’s consultations</Link>
      </PageHeader>

      <section className="stats" aria-label="Summary">
        <Stat icon={CalendarClock} tone="blue" label="Today" value={today.length} hint={today.length ? `Next at ${fmtTime(today[0].start)}` : 'No visits today'} />
        <Stat icon={Hourglass} tone="amber" label="Waiting for you to accept" value={requests} hint={requests ? 'Open Consultations to accept' : 'Nothing waiting'} />
        <Stat icon={TriangleAlert} tone={syncIssues ? 'rose' : 'teal'} label="Calendar sync issues" value={syncIssues} hint={syncIssues ? 'Sent to clinic staff' : 'All synced'} />
      </section>

      <div className="split split-rail">
        <CalendarView appointments={appointments} />
        <aside className="card card-pad" aria-label="Up next">
          <div className="card-head"><h2>Up next</h2></div>
          {upcoming.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nothing scheduled">New bookings will show up here.</EmptyState>
          ) : (
            <ul className="rows">
              {upcoming.slice(0, 5).map((appointment) => (
                <li key={appointment.id}>
                  <Link to={`/doctor/room/${appointment.id}`} className="row-link">
                    <Avatar name={appointment.patientName} />
                    <span className="row-text"><strong>{appointment.patientName}</strong><small>{fmtDate(appointment.start)} · {fmtTime(appointment.start)}</small></span>
                    <ChevronRight size={16} className="row-chevron" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <section className="card card-pad">
        <div className="card-head"><h2><RefreshCw size={16} aria-hidden="true" /> Calendar sync</h2></div>
        {appointments.length === 0 ? (
          <p className="muted">No bookings to sync yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table" data-testid="sync-table">
              <thead><tr><th>Patient</th><th>Time</th><th>Appointment</th><th>Sync</th><th>Elapsed</th></tr></thead>
              <tbody>
                {appointments.map((appointment) => {
                  const overLimit = appointment.syncStatus === 'pending' && elapsed(appointment) > SYNC_LIMIT_SEC;
                  return (
                    <tr key={appointment.id}>
                      <td><span className="cell-person"><Avatar name={appointment.patientName} size="sm" />{appointment.patientName}</span></td>
                      <td className="num">{fmtDateTime(appointment.start)}</td>
                      <td><StatusBadge status={appointment.status} /></td>
                      <td><StatusBadge status={appointment.syncStatus} /></td>
                      <td className={`num${overLimit ? ' text-negative' : ' muted'}`}>
                        {appointment.syncStatus === 'pending' ? `${elapsed(appointment).toFixed(1)} s${overLimit ? ` · over the ${SYNC_LIMIT_SEC} s limit` : ''}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

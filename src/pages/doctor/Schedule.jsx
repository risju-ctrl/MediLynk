import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments.js';
import CalendarView from '../../components/CalendarView.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { SYNC_LIMIT_SEC, fmtDateTime } from '../../utils/timeRules.js';

export default function DoctorSchedule() {
  const { data, isPending, error } = useAppointments({ refetchInterval: 2000 });
  const [, tick] = useState(0);

  // Re-render every second so a sync that is taking too long is visible.
  useEffect(() => {
    const timer = setInterval(() => tick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const appointments = data?.appointments || [];
  const elapsed = (appointment) =>
    appointment.syncStartedAt
      ? (new Date() - new Date(appointment.syncStartedAt)) / 1000
      : 0;

  if (isPending) return <p className="text-sm text-slate-500">Loading schedule...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My schedule</h1>
        <p className="text-sm text-slate-600">
          The calendar refreshes within {SYNC_LIMIT_SEC} seconds of a booking. A failed sync is retried once, then
          flagged for clinic staff (REQ-03).
        </p>
      </div>

      <CalendarView appointments={appointments} />

      <section className="card">
        <h2 className="mb-3 font-semibold text-slate-900">Calendar sync status</h2>
        <table className="w-full text-sm" data-testid="sync-table">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2">Patient</th>
              <th className="py-2">Slot</th>
              <th className="py-2">Appointment</th>
              <th className="py-2">Sync</th>
              <th className="py-2">Elapsed</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const overLimit = appointment.syncStatus === 'pending' && elapsed(appointment) > SYNC_LIMIT_SEC;
              return (
                <tr key={appointment.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2">{appointment.patientName}</td>
                  <td className="py-2">{fmtDateTime(appointment.start)}</td>
                  <td className="py-2">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="py-2">
                    <StatusBadge status={appointment.syncStatus} />
                  </td>
                  <td className={`py-2 ${overLimit ? 'font-medium text-red-600' : 'text-slate-500'}`}>
                    {appointment.syncStatus === 'pending'
                      ? `${elapsed(appointment).toFixed(1)} s${overLimit ? ' — over the 5 s limit' : ''}`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="text-sm text-slate-600">
        <Link to="/doctor/consultations" className="text-brand-700 underline">
          Go to today's consultations
        </Link>
      </p>
    </div>
  );
}

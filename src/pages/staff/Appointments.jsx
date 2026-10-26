import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cancelAppointment, retryCalendarSync } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { fmtDateTime } from '../../utils/timeRules.js';

export default function StaffAppointments() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments({ refetchInterval: 3000 });
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['appointments'] });

  const run = async (action) => {
    setMessage('');
    try {
      await action();
      refresh();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (isPending) return <p className="text-sm text-slate-500">Loading appointments...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  const rows = data.appointments.filter((appointment) => {
    if (filter === 'flagged') return appointment.syncStatus === 'flagged';
    if (filter === 'active') return ['requested', 'confirmed', 'in_progress'].includes(appointment.status);
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">All appointments</h1>
        <p className="text-sm text-slate-600">
          Clinic staff see every appointment. Clinical fields stay masked unless the role has clearance (REQ-05).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['all', 'active', 'flagged'].map((value) => (
          <button
            key={value}
            type="button"
            className={filter === value ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setFilter(value)}
            data-testid={`staff-filter-${value}`}
          >
            {value === 'all' ? 'All' : value === 'active' ? 'Active' : 'Sync flagged'}
          </button>
        ))}
      </div>

      {message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" data-testid="staff-error">
          {message}
        </p>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm" data-testid="staff-appointments-table">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2">Slot</th>
              <th className="py-2">Patient</th>
              <th className="py-2">Doctor</th>
              <th className="py-2">Status</th>
              <th className="py-2">Sync</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((appointment) => (
              <tr key={appointment.id} className="border-b border-slate-100 last:border-0">
                <td className="py-2">{fmtDateTime(appointment.start)}</td>
                <td className="py-2">{appointment.patientName}</td>
                <td className="py-2">{appointment.doctorName}</td>
                <td className="py-2">
                  <StatusBadge status={appointment.status} />
                </td>
                <td className="py-2">
                  <StatusBadge status={appointment.syncStatus} />
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="btn-ghost px-2 py-1 text-xs"
                      disabled={['cancelled', 'completed'].includes(appointment.status)}
                      onClick={() => run(() => cancelAppointment(appointment.id))}
                      data-testid={`staff-cancel-${appointment.id}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-ghost px-2 py-1 text-xs"
                      disabled={appointment.syncStatus === 'synced'}
                      onClick={() => run(() => retryCalendarSync(appointment.id))}
                      data-testid={`staff-retry-sync-${appointment.id}`}
                    >
                      Retry sync
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-4 text-sm text-slate-600">Nothing matches this filter.</p>}
      </div>
    </div>
  );
}

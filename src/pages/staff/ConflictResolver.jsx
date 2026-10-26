import { useQueryClient } from '@tanstack/react-query';
import { retryCalendarSync } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { fmtDateTime } from '../../utils/timeRules.js';

// REQ-03: a failed calendar sync is retried automatically, then flagged here for manual review.
export default function ConflictResolver() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments({ refetchInterval: 3000 });

  const retry = async (id) => {
    await retryCalendarSync(id);
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  if (isPending) return <p className="text-sm text-slate-500">Loading sync queue...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  const flagged = data.appointments.filter((appointment) =>
    ['flagged', 'failed', 'pending'].includes(appointment.syncStatus),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Sync and conflict desk</h1>
        <p className="text-sm text-slate-600">
          Appointments whose calendar sync is pending, failed or flagged for manual review. Conflicts and released
          slots are logged on the appointment itself.
        </p>
      </div>

      {flagged.length === 0 && (
        <div className="card" data-testid="sync-clear">
          <p className="text-sm text-slate-600">No sync problems right now.</p>
          <p className="mt-1 text-xs text-slate-500">
            Turn on "Next calendar sync fails" in the test panel, then book a slot to create a flagged item.
          </p>
        </div>
      )}

      {flagged.map((appointment) => (
        <article key={appointment.id} className="card" data-testid={`flagged-${appointment.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-medium text-slate-900">
                {appointment.patientName} with {appointment.doctorName}
              </h2>
              <p className="text-sm text-slate-500">{fmtDateTime(appointment.start)}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={appointment.syncStatus} />
              <StatusBadge status={appointment.status} />
            </div>
          </div>
          {appointment.syncNote && <p className="mt-2 text-sm text-orange-700">{appointment.syncNote}</p>}
          {appointment.rescheduledFrom && (
            <p className="mt-1 text-xs text-slate-500">
              Moved from {fmtDateTime(appointment.rescheduledFrom)}.
            </p>
          )}
          <button
            type="button"
            className="btn-primary mt-3"
            disabled={appointment.syncStatus === 'pending'}
            onClick={() => retry(appointment.id)}
            data-testid={`retry-${appointment.id}`}
          >
            {appointment.syncStatus === 'pending' ? 'Sync in progress...' : 'Retry sync now'}
          </button>
        </article>
      ))}
    </div>
  );
}

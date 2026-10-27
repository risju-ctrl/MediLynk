import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { retryCalendarSync } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, EmptyState, PageHeader } from '../../components/ui.jsx';
import { fmtDateTime } from '../../utils/timeRules.js';

// A failed calendar sync is retried automatically, then flagged here for manual review.
export default function ConflictResolver() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments({ refetchInterval: 3000 });

  const retry = async (id) => {
    await retryCalendarSync(id);
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  if (isPending) return <div className="page"><p className="muted" role="status">Loading the sync queue…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  const flagged = data.appointments.filter((appointment) => ['flagged', 'failed', 'pending'].includes(appointment.syncStatus));

  return (
    <div className="page">
      <PageHeader title="Sync desk" subtitle="Appointments whose calendar sync is pending, failed or flagged for review." />

      {flagged.length === 0 && (
        <section className="card card-pad" data-testid="sync-clear">
          <EmptyState icon={CheckCircle2} title="No sync problems right now">
            To see one here, turn on “Next calendar sync fails” in Demo tools, then book a visit as a patient.
          </EmptyState>
        </section>
      )}

      <div className="stack">
        {flagged.map((appointment) => (
          <article key={appointment.id} className="card card-pad" data-testid={`flagged-${appointment.id}`}>
            <div className="appt-main">
              <Avatar name={appointment.patientName} />
              <div className="appt-info">
                <h3>{appointment.patientName} with {appointment.doctorName}</h3>
                <p>{fmtDateTime(appointment.start)}</p>
              </div>
              <div className="appt-badges"><StatusBadge status={appointment.syncStatus} /><StatusBadge status={appointment.status} /></div>
            </div>
            {appointment.syncNote && <p className="appt-warn">{appointment.syncNote}</p>}
            {appointment.rescheduledFrom && <p className="muted-sm">Moved from {fmtDateTime(appointment.rescheduledFrom)}.</p>}
            <div className="appt-actions">
              <button type="button" className="btn btn-primary btn-sm" disabled={appointment.syncStatus === 'pending'} onClick={() => retry(appointment.id)} data-testid={`retry-${appointment.id}`}>
                <RefreshCw size={15} aria-hidden="true" />{appointment.syncStatus === 'pending' ? 'Sync in progress…' : 'Retry sync now'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

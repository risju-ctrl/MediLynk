import { useQuery } from '@tanstack/react-query';
import { listRecords } from '../../api/records.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import MaskedField from '../../components/MaskedField.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { fmtDateTime } from '../../utils/timeRules.js';

export default function History() {
  const { data: recordsData, isPending, error } = useQuery({ queryKey: ['records'], queryFn: listRecords });
  const { data: appointmentsData } = useAppointments();

  const past = (appointmentsData?.appointments || []).filter((appointment) =>
    ['completed', 'cancelled', 'no_show'].includes(appointment.status),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Consultation history</h1>
        <p className="text-sm text-slate-600">
          You see only your own history. Sensitive fields stay masked for roles without clearance (REQ-02, REQ-05).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">Past appointments</h2>
        {past.length === 0 && <p className="text-sm text-slate-600">No past appointments yet.</p>}
        {past.map((appointment) => (
          <div key={appointment.id} className="card flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{appointment.doctorName}</p>
              <p className="text-xs text-slate-500">{fmtDateTime(appointment.start)}</p>
            </div>
            <StatusBadge status={appointment.status} />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">Medical records</h2>
        {isPending && <p className="text-sm text-slate-500">Loading records...</p>}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
        {(recordsData?.records || []).length === 0 && (
          <p className="text-sm text-slate-600">No records released yet.</p>
        )}
        {(recordsData?.records || []).map((record) => (
          <article key={record.id} className="card" data-testid={`record-${record.id}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-slate-900">{record.doctorName || 'Consultation record'}</h3>
              <span className="text-xs text-slate-500">{fmtDateTime(record.createdAt)}</span>
            </div>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <MaskedField field="diagnosis" label="Diagnosis" value={record.diagnosis} />
              <MaskedField field="prescription" label="Prescription" value={record.prescription} />
              <MaskedField field="clinicalNotes" label="Clinical notes" value={record.clinicalNotes} />
              <MaskedField field="paymentReference" label="Payment reference" value={record.paymentReference} />
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

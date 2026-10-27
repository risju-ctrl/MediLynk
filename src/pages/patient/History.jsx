import { useQuery } from '@tanstack/react-query';
import { ClipboardList, FileText } from 'lucide-react';
import { listRecords } from '../../api/records.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import MaskedField from '../../components/MaskedField.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, DateBlock, EmptyState, PageHeader } from '../../components/ui.jsx';
import { fmtDateTime } from '../../utils/timeRules.js';

export default function History() {
  const { data: recordsData, isPending, error } = useQuery({ queryKey: ['records'], queryFn: listRecords });
  const { data: appointmentsData } = useAppointments();

  const past = (appointmentsData?.appointments || []).filter((appointment) => ['completed', 'cancelled', 'no_show'].includes(appointment.status));
  const records = recordsData?.records || [];

  return (
    <div className="page">
      <PageHeader title="Records" subtitle="Your visits and medical records. Only you and your care team can see them." />

      <div className="split split-even">
        <section className="card card-pad">
          <div className="card-head"><h2>Past appointments</h2></div>
          {past.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No past appointments yet">Completed and cancelled visits will be listed here.</EmptyState>
          ) : (
            <ul className="rows">
              {past.map((appointment) => (
                <li key={appointment.id} className="row">
                  <DateBlock value={appointment.start} />
                  <span className="row-text"><strong>{appointment.doctorName}</strong><small>{fmtDateTime(appointment.start)}</small></span>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="stack">
          <div className="card-head plain"><h2>Medical records</h2></div>
          {isPending && <p className="muted" role="status">Loading records…</p>}
          {error && <p className="form-error" role="alert">{error.message}</p>}
          {!isPending && records.length === 0 && (
            <div className="card card-pad"><EmptyState icon={FileText} title="No records released yet">After a consultation, your doctor’s notes and prescriptions appear here.</EmptyState></div>
          )}
          {records.map((record) => (
            <article key={record.id} className="card card-pad" data-testid={`record-${record.id}`}>
              <div className="record-head">
                <Avatar name={record.doctorName || 'Consultation'} />
                <div><h3>{record.doctorName || 'Consultation record'}</h3><small className="muted-sm">{fmtDateTime(record.createdAt)}</small></div>
              </div>
              <dl className="read-grid">
                <MaskedField field="diagnosis" label="Diagnosis" value={record.diagnosis} />
                <MaskedField field="prescription" label="Prescription" value={record.prescription} />
                <MaskedField field="clinicalNotes" label="Clinical notes" value={record.clinicalNotes} />
                <MaskedField field="paymentReference" label="Payment reference" value={record.paymentReference} />
              </dl>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

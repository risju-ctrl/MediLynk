import StatusBadge from './StatusBadge.jsx';
import { fmtDateTime } from '../utils/timeRules.js';

export default function AppointmentCard({ appointment, showPatient, children }) {
  return (
    <article className="card" data-testid={`appointment-${appointment.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">
            {showPatient ? appointment.patientName : appointment.doctorName}
          </h3>
          <p className="text-sm text-slate-500">
            {appointment.specialty || 'Consultation'} · {fmtDateTime(appointment.start)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={appointment.status} />
          {appointment.syncStatus && (
            <span className="text-xs text-slate-500">
              Calendar sync: <StatusBadge status={appointment.syncStatus} />
            </span>
          )}
        </div>
      </div>
      {appointment.symptoms && (
        <p className="mt-3 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Symptoms: </span>
          {appointment.symptoms}
        </p>
      )}
      {appointment.syncNote && <p className="mt-2 text-xs text-orange-700">{appointment.syncNote}</p>}
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </article>
  );
}

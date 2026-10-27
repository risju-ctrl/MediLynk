import StatusBadge from './StatusBadge.jsx';
import { Avatar, DateBlock } from './ui.jsx';
import { fmtDate, fmtTime } from '../utils/timeRules.js';

// One appointment as a row card. `showPatient` flips the headline person for doctors and staff.
export default function AppointmentCard({ appointment, showPatient, showSync, children }) {
  const person = showPatient ? appointment.patientName : appointment.doctorName;
  return (
    <article className="card appt" data-testid={`appointment-${appointment.id}`}>
      <div className="appt-main">
        <DateBlock value={appointment.start} />
        <Avatar name={person} />
        <div className="appt-info">
          <h3>{person}</h3>
          <p>{appointment.specialty || 'Consultation'} · {fmtDate(appointment.start)} at {fmtTime(appointment.start)}</p>
        </div>
        <div className="appt-badges">
          <StatusBadge status={appointment.status} />
          {showSync && appointment.syncStatus && (
            <span className="appt-sync">Calendar <StatusBadge status={appointment.syncStatus} /></span>
          )}
        </div>
      </div>
      {appointment.symptoms && (
        <p className="appt-note"><strong>Reason:</strong> {appointment.symptoms}</p>
      )}
      {appointment.syncNote && <p className="appt-warn">{appointment.syncNote}</p>}
      {children && <div className="appt-actions">{children}</div>}
    </article>
  );
}

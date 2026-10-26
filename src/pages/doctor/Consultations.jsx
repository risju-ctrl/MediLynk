import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setAppointmentStatus } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import { ACTIVE_STATUSES } from '../../utils/timeRules.js';

export default function Consultations() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments();

  const start = async (id) => {
    await setAppointmentStatus(id, 'in_progress');
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  if (isPending) return <p className="text-sm text-slate-500">Loading consultations...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  const appointments = data.appointments;
  const active = appointments.filter((appointment) => ACTIVE_STATUSES.includes(appointment.status));
  const done = appointments.filter((appointment) => !ACTIVE_STATUSES.includes(appointment.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Consultations</h1>
        <p className="text-sm text-slate-600">You only see consultations assigned to you.</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">Upcoming and in progress</h2>
        {active.length === 0 && <p className="text-sm text-slate-600">Nothing scheduled.</p>}
        {active.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} showPatient>
            {appointment.status === 'requested' && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => start(appointment.id)}
                data-testid={`confirm-${appointment.id}`}
              >
                Accept booking
              </button>
            )}
            {appointment.status === 'confirmed' && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => start(appointment.id)}
                data-testid={`start-${appointment.id}`}
              >
                Start consultation
              </button>
            )}
            <Link to={`/doctor/room/${appointment.id}`} className="btn-primary" data-testid={`room-${appointment.id}`}>
              Open consultation room
            </Link>
          </AppointmentCard>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">Finished</h2>
        {done.length === 0 && <p className="text-sm text-slate-600">No finished consultations yet.</p>}
        {done.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} showPatient>
            <Link to={`/doctor/notes/${appointment.id}`} className="btn-ghost" data-testid={`notes-${appointment.id}`}>
              Consultation notes
            </Link>
          </AppointmentCard>
        ))}
      </section>
    </div>
  );
}

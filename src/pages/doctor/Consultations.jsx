import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, FileText, Stethoscope, Video } from 'lucide-react';
import { setAppointmentStatus } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import { EmptyState, PageHeader, Segmented } from '../../components/ui.jsx';
import { ACTIVE_STATUSES } from '../../utils/timeRules.js';

export default function Consultations() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments();
  const [tab, setTab] = useState('active');

  const start = async (id) => {
    await setAppointmentStatus(id, 'in_progress');
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  if (isPending) return <div className="page"><p className="muted" role="status">Loading consultations…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  const appointments = data.appointments;
  const active = appointments.filter((a) => ACTIVE_STATUSES.includes(a.status));
  const done = appointments.filter((a) => !ACTIVE_STATUSES.includes(a.status));
  const shown = tab === 'active' ? active : done;

  return (
    <div className="page">
      <PageHeader title="Consultations" subtitle="You only see consultations assigned to you." />
      <Segmented
        label="Filter consultations"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'active', label: 'Upcoming and in progress', count: active.length },
          { value: 'done', label: 'Finished', count: done.length },
        ]}
      />

      {shown.length === 0 && (
        <section className="card card-pad">
          <EmptyState icon={tab === 'active' ? CalendarCheck : Stethoscope} title={tab === 'active' ? 'Nothing scheduled' : 'No finished consultations yet'}>
            {tab === 'active' ? 'New bookings from patients will appear here for you to accept.' : 'Completed consultations and their notes will be listed here.'}
          </EmptyState>
        </section>
      )}

      <div className="stack">
        {shown.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} showPatient showSync={tab === 'active'}>
            {tab === 'active' ? (
              <>
                {appointment.status === 'requested' && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => start(appointment.id)} data-testid={`confirm-${appointment.id}`}>Accept booking</button>
                )}
                {appointment.status === 'confirmed' && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => start(appointment.id)} data-testid={`start-${appointment.id}`}>Start consultation</button>
                )}
                <Link to={`/doctor/room/${appointment.id}`} className="btn btn-primary btn-sm" data-testid={`room-${appointment.id}`}><Video size={15} aria-hidden="true" />Open room</Link>
              </>
            ) : (
              <Link to={`/doctor/notes/${appointment.id}`} className="btn btn-secondary btn-sm" data-testid={`notes-${appointment.id}`}><FileText size={15} aria-hidden="true" />Consultation notes</Link>
            )}
          </AppointmentCard>
        ))}
      </div>
    </div>
  );
}

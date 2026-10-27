import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Bell, CalendarCheck, CalendarClock, Plus, Video, X } from 'lucide-react';
import { cancelAppointment, rescheduleAppointment } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import ReminderList from '../../components/ReminderList.jsx';
import ReschedulePanel from '../../components/ReschedulePanel.jsx';
import { EmptyState, PageHeader, Segmented } from '../../components/ui.jsx';

const LIVE = ['requested', 'confirmed', 'in_progress'];

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments();
  const [tab, setTab] = useState('upcoming');
  const [openReminders, setOpenReminders] = useState(null);
  const [openReschedule, setOpenReschedule] = useState(null);
  const [actionError, setActionError] = useState('');
  const refresh = () => queryClient.invalidateQueries();
  const cancel = async (id) => { setActionError(''); try { await cancelAppointment(id); refresh(); } catch (err) { setActionError(err.message); } };
  const reschedule = async (id, start) => { await rescheduleAppointment(id, start); setOpenReschedule(null); refresh(); };

  if (isPending) return <div className="page"><p className="muted" role="status">Loading your appointments…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  const all = data.appointments;
  const upcoming = all.filter((a) => LIVE.includes(a.status));
  const past = all.filter((a) => !LIVE.includes(a.status));
  const shown = tab === 'upcoming' ? upcoming : tab === 'past' ? past : all;

  return (
    <div className="page">
      <PageHeader title="Appointments" subtitle="Track upcoming visits, reschedule or cancel in one place.">
        <Link to="/patient/book" className="btn btn-primary"><Plus size={16} aria-hidden="true" />Book a visit</Link>
      </PageHeader>

      <Segmented
        label="Filter appointments"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { value: 'past', label: 'Past', count: past.length },
          { value: 'all', label: 'All', count: all.length },
        ]}
      />

      {actionError && <p className="form-error" role="alert" data-testid="appointment-action-error">{actionError}</p>}

      {shown.length === 0 && (
        <section className="card card-pad">
          <EmptyState icon={tab === 'past' ? CalendarCheck : CalendarClock} title={tab === 'past' ? 'No past visits yet' : 'Your schedule is clear'}>
            {tab === 'past' ? 'Completed and cancelled visits will appear here.' : 'Book your first video consultation and the details will live here.'}
          </EmptyState>
          {tab !== 'past' && <div className="center-row"><Link to="/patient/book" className="btn btn-primary">Find a time</Link></div>}
        </section>
      )}

      <div className="stack">
        {shown.map((appointment) => {
          const canChange = ['requested', 'confirmed'].includes(appointment.status);
          return (
            <div key={appointment.id} className="stack-tight">
              <AppointmentCard appointment={appointment}>
                {['confirmed', 'in_progress'].includes(appointment.status) && (
                  <Link to={`/patient/room/${appointment.id}`} className="btn btn-primary btn-sm" data-testid={`patient-room-${appointment.id}`}><Video size={15} aria-hidden="true" />Join consultation</Link>
                )}
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpenReminders(openReminders === appointment.id ? null : appointment.id)} data-testid={`toggle-reminders-${appointment.id}`}>
                  <Bell size={15} aria-hidden="true" />{openReminders === appointment.id ? 'Hide reminders' : 'Reminders'}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" disabled={!canChange} onClick={() => setOpenReschedule(openReschedule === appointment.id ? null : appointment.id)} data-testid={`toggle-reschedule-${appointment.id}`}>Reschedule</button>
                <button type="button" className="btn btn-danger btn-sm" disabled={!canChange} onClick={() => cancel(appointment.id)} data-testid={`cancel-${appointment.id}`}><X size={15} aria-hidden="true" />Cancel visit</button>
              </AppointmentCard>
              {openReminders === appointment.id && <div className="card card-pad"><ReminderList appointmentId={appointment.id} /></div>}
              {openReschedule === appointment.id && <ReschedulePanel appointment={appointment} onDone={(start) => reschedule(appointment.id, start)} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

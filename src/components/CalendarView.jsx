import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// Calendar of a doctor's appointments (REQ-03). Refetches are driven by the parent query.
export default function CalendarView({ appointments = [], onSelectAppointment }) {
  const events = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.patientName} · ${appointment.status}`
          .concat(appointment.syncStatus === 'flagged' ? ' · sync flagged' : ''),
        start: appointment.start,
        end: appointment.end,
        backgroundColor:
          appointment.syncStatus === 'flagged'
            ? '#b91c1c'
            : appointment.status === 'cancelled'
              ? '#94a3b8'
              : appointment.status === 'completed'
                ? '#047857'
                : '#0f766e',
        borderColor: 'transparent',
      })),
    [appointments],
  );

  return (
    <div className="card" data-testid="calendar-view">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
        height="auto"
        nowIndicator
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        events={events}
        eventClick={(info) => onSelectAppointment?.(info.event.id)}
        eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
      />
    </div>
  );
}

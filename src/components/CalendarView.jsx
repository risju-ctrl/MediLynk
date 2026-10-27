import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

// Calendar of a doctor's appointments. Colours come from CSS classes so the theme stays in index.css.
export default function CalendarView({ appointments = [], onSelectAppointment }) {
  const events = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        title: appointment.patientName,
        start: appointment.start,
        end: appointment.end,
        classNames: [
          'cal-event',
          appointment.syncStatus === 'flagged'
            ? 'is-flagged'
            : appointment.status === 'cancelled'
              ? 'is-cancelled'
              : appointment.status === 'completed'
                ? 'is-completed'
                : 'is-active',
        ],
      })),
    [appointments],
  );

  return (
    <div className="card card-pad calendar" data-testid="calendar-view">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
        buttonText={{ today: 'Today', month: 'Month', week: 'Week' }}
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

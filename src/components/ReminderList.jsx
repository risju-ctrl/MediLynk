import { useQuery } from '@tanstack/react-query';
import { listReminders } from '../api/appointments.js';
import StatusBadge from './StatusBadge.jsx';
import { fmtDateTime } from '../utils/timeRules.js';

const CHANNEL = { email: 'Email', sms: 'SMS', push: 'Push notification' };

// REQ-04: reminders at 24 h and 1 h before the appointment, per channel, marked simulated.
export default function ReminderList({ appointmentId }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['reminders', appointmentId],
    queryFn: () => listReminders(appointmentId),
    enabled: Boolean(appointmentId),
    refetchInterval: 15000,
  });

  if (!appointmentId) return <p className="text-sm text-slate-500">Choose an appointment to see its reminders.</p>;
  if (isPending) return <p className="text-sm text-slate-500">Loading reminders...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-amber-700">
        Prototype only — no real Email, SMS or Push is sent.
      </p>
      <table className="w-full text-sm" data-testid="reminder-table">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2">Lead time</th>
            <th className="py-2">Channel</th>
            <th className="py-2">Scheduled</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.reminders.map((reminder) => (
            <tr key={reminder.id} className="border-b border-slate-100 last:border-0">
              <td className="py-2">{reminder.leadHours} h before</td>
              <td className="py-2">{CHANNEL[reminder.channel]}</td>
              <td className="py-2" data-testid={`reminder-time-${reminder.leadHours}-${reminder.channel}`}>
                {fmtDateTime(reminder.scheduledAt)}
              </td>
              <td className="py-2">
                <StatusBadge status={reminder.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

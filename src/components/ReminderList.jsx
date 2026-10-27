import { useQuery } from '@tanstack/react-query';
import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { listReminders } from '../api/appointments.js';
import StatusBadge from './StatusBadge.jsx';
const fmtShort = (value) => new Date(value).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const CHANNEL = {
  email: ['Email', Mail],
  sms: ['SMS', MessageSquare],
  push: ['Push', Smartphone],
};

// Reminders at 24 h and 1 h before the visit, one per channel, with their exact scheduled time.
export default function ReminderList({ appointmentId }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['reminders', appointmentId],
    queryFn: () => listReminders(appointmentId),
    enabled: Boolean(appointmentId),
    refetchInterval: 15000,
  });

  if (!appointmentId) return <p className="muted">Choose an appointment to see its reminders.</p>;
  if (isPending) return <p className="muted">Loading reminders…</p>;
  if (error) return <p className="form-error">{error.message}</p>;

  return (
    <div className="reminders">
      <table className="table" data-testid="reminder-table">
        <thead>
          <tr><th>Reminder</th><th>Scheduled for</th><th>Status</th></tr>
        </thead>
        <tbody>
          {data.reminders.map((reminder) => {
            const [label, Icon] = CHANNEL[reminder.channel] || [reminder.channel, Mail];
            return (
              <tr key={reminder.id}>
                <td><span className="inline-icon"><Icon size={14} aria-hidden="true" /><span className="cell-stack"><strong>{label}</strong><small>{reminder.leadHours} h before</small></span></span></td>
                <td className="num" data-testid={`reminder-time-${reminder.leadHours}-${reminder.channel}`}>{fmtShort(reminder.scheduledAt)}</td>
                <td><StatusBadge status={reminder.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="fine-print">Demo: reminders are simulated. Nothing is actually emailed, texted or pushed.</p>
    </div>
  );
}

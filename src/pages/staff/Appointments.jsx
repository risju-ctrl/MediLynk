import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarX, RefreshCw, Search, X } from 'lucide-react';
import { cancelAppointment, retryCalendarSync } from '../../api/appointments.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { Avatar, EmptyState, PageHeader, Segmented } from '../../components/ui.jsx';
import { fmtDate, fmtTime } from '../../utils/timeRules.js';

export default function StaffAppointments() {
  const queryClient = useQueryClient();
  const { data, isPending, error } = useAppointments({ refetchInterval: 3000 });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['appointments'] });

  const run = async (action) => {
    setMessage('');
    try {
      await action();
      refresh();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (isPending) return <div className="page"><p className="muted" role="status">Loading appointments…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  const all = data.appointments;
  const counts = {
    all: all.length,
    active: all.filter((a) => ['requested', 'confirmed', 'in_progress'].includes(a.status)).length,
    flagged: all.filter((a) => a.syncStatus === 'flagged').length,
  };
  const q = query.trim().toLowerCase();
  const rows = all
    .filter((a) => {
      if (filter === 'flagged') return a.syncStatus === 'flagged';
      if (filter === 'active') return ['requested', 'confirmed', 'in_progress'].includes(a.status);
      return true;
    })
    .filter((a) => !q || `${a.patientName} ${a.doctorName}`.toLowerCase().includes(q));

  return (
    <div className="page">
      <PageHeader title="All appointments" subtitle="Every booking in the clinic. Clinical details stay hidden unless your role has clearance." />

      <div className="toolbar-row">
        <Segmented
          label="Filter appointments"
          value={filter}
          onChange={setFilter}
          testPrefix="staff-filter"
          options={[
            { value: 'all', label: 'All', count: counts.all },
            { value: 'active', label: 'Active', count: counts.active },
            { value: 'flagged', label: 'Sync flagged', count: counts.flagged },
          ]}
        />
        <label className="search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search by patient or doctor</span>
          <input type="search" placeholder="Search patient or doctor" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>

      {message && <p className="form-error" role="alert" data-testid="staff-error">{message}</p>}

      <section className="card">
        {rows.length === 0 ? (
          <EmptyState icon={CalendarX} title="Nothing matches">Try another filter or clear the search.</EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table table-roomy" data-testid="staff-appointments-table">
              <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Sync</th><th className="th-actions">Actions</th></tr></thead>
              <tbody>
                {rows.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="num"><strong>{fmtDate(appointment.start)}</strong><small className="cell-sub">{fmtTime(appointment.start)}</small></td>
                    <td><span className="cell-person"><Avatar name={appointment.patientName} size="sm" />{appointment.patientName}</span></td>
                    <td><span className="cell-person"><Avatar name={appointment.doctorName} size="sm" />{appointment.doctorName}</span></td>
                    <td><StatusBadge status={appointment.status} /></td>
                    <td><StatusBadge status={appointment.syncStatus} /></td>
                    <td>
                      <div className="row-end tight">
                        <button type="button" className="btn btn-secondary btn-sm" disabled={appointment.syncStatus === 'synced'} onClick={() => run(() => retryCalendarSync(appointment.id))} data-testid={`staff-retry-sync-${appointment.id}`}><RefreshCw size={14} aria-hidden="true" />Retry sync</button>
                        <button type="button" className="btn btn-danger btn-sm" disabled={['cancelled', 'completed'].includes(appointment.status)} onClick={() => run(() => cancelAppointment(appointment.id))} data-testid={`staff-cancel-${appointment.id}`}><X size={14} aria-hidden="true" />Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { api } from '../../api/mockServer.js';
import { Avatar, PageHeader } from '../../components/ui.jsx';
import { ROLE_LABELS } from '../../utils/roles.js';

const ROLE_TONE = { patient: 'info', doctor: 'positive', staff: 'warning', admin: 'neutral' };

export default function AdminUsers() {
  const { data, isPending, error } = useQuery({ queryKey: ['users'], queryFn: () => api('/users') });

  if (isPending) return <div className="page"><p className="muted" role="status">Loading users…</p></div>;
  if (error) return <div className="page"><p className="form-error" role="alert">{error.message}</p></div>;

  return (
    <div className="page">
      <PageHeader title="Users" subtitle={`${data.users.length} accounts on the platform. Clinic staff manage clinic-level accounts; this page is platform-wide.`} />

      <section className="card">
        <div className="table-wrap">
          <table className="table table-roomy" data-testid="admin-users-table">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Mobile</th></tr></thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td><span className="cell-person"><Avatar name={user.name} size="sm" />{user.name}</span></td>
                  <td><span className={`badge badge-${ROLE_TONE[user.role] || 'neutral'}`}>{ROLE_LABELS[user.role]}</span></td>
                  <td>{user.email}</td>
                  <td className="num">{user.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="note"><Info size={15} aria-hidden="true" />Demo note: passwords live in the mock seed and are shown on the sign-in screen. This is not real authentication.</p>
    </div>
  );
}

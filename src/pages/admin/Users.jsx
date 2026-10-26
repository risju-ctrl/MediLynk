import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/mockServer.js';
import { ROLE_LABELS } from '../../utils/roles.js';

export default function AdminUsers() {
  const { data, isPending, error } = useQuery({ queryKey: ['users'], queryFn: () => api('/users') });

  if (isPending) return <p className="text-sm text-slate-500">Loading users...</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Platform users</h1>
        <p className="text-sm text-slate-600">
          System Administrator view. Clinic staff manage clinic-level accounts; this page is platform-level only.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm" data-testid="admin-users-table">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Email</th>
              <th className="py-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{ROLE_LABELS[user.role]}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        Demo note: passwords are stored in the mock seed only and are shown on the sign-in screen. Nothing here is
        production-ready authentication.
      </p>
    </div>
  );
}

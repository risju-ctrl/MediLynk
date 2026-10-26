import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { ROLE_LABELS } from '../utils/roles.js';

// Route guard: authentication first, then the allowed roles. The API re-checks every call (REQ-02).
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="p-8 text-sm text-slate-500">Restoring your session...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card mx-auto mt-10 max-w-lg border-red-200" data-testid="forbidden-state">
        <h2 className="text-lg font-semibold text-red-700">403 — Access denied</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your role ({ROLE_LABELS[user.role]}) is not allowed on this page. This page is limited to:{' '}
          {roles.map((role) => ROLE_LABELS[role]).join(', ')}.
        </p>
      </div>
    );
  }

  return children ?? <Outlet />;
}

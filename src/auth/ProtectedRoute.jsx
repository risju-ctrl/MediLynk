import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from './AuthContext.jsx';
import { ROLE_LABELS, homeRoute } from '../utils/roles.js';
import { EmptyState } from '../components/ui.jsx';

// Route guard: authentication first, then the allowed roles. The API re-checks every call.
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="splash" role="status">Restoring your session…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card card-pad narrow" data-testid="forbidden-state">
        <EmptyState icon={ShieldAlert} title="403 · You don’t have access to this page">
          Your role ({ROLE_LABELS[user.role]}) can’t open it. This page is for {roles.map((role) => ROLE_LABELS[role]).join(', ')}.
        </EmptyState>
        <div className="center-row"><Link to={homeRoute(user.role)} className="btn btn-primary">Back to your home</Link></div>
      </div>
    );
  }

  return children ?? <Outlet />;
}

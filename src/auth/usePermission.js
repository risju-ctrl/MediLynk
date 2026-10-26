import { useAuth } from './AuthContext.jsx';
import { canSeeField } from '../utils/roles.js';

// Small helper so screens ask permission instead of hard-coding role names.
export function usePermission() {
  const { user } = useAuth();
  const role = user?.role;
  return {
    role,
    is: (...roles) => roles.includes(role),
    canSeeField: (field) => canSeeField(role, field),
  };
}

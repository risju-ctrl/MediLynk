import { Lock } from 'lucide-react';
import { usePermission } from '../auth/usePermission.js';
import { MASKED } from '../utils/roles.js';

// Confidential fields are masked for roles without clearance.
// The mock API redacts the same fields, so masking is not only a display trick.
export default function MaskedField({ field, value, label }) {
  const { canSeeField } = usePermission();
  const allowed = canSeeField(field);

  return (
    <div className="field-read">
      <dt>{label}</dt>
      <dd className={allowed ? '' : 'is-masked'} data-testid={`masked-field-${field}`}>
        {allowed ? value || '—' : MASKED}
      </dd>
      {!allowed && (
        <p className="masked-note" title="The role-by-field matrix is still to be confirmed (ER-08).">
          <Lock size={12} aria-hidden="true" /> Restricted for your role
        </p>
      )}
    </div>
  );
}

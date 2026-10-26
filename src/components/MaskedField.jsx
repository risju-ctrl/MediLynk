import { usePermission } from '../auth/usePermission.js';
import { MASKED } from '../utils/roles.js';

// REQ-05: confidential fields are masked for roles without clearance.
// The mock API redacts the same fields, so masking is not only a display trick.
export default function MaskedField({ field, value, label }) {
  const { canSeeField } = usePermission();
  const allowed = canSeeField(field);

  return (
    <div className="text-sm">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={allowed ? 'text-slate-800' : 'italic text-slate-400'} data-testid={`masked-field-${field}`}>
        {allowed ? value || '—' : MASKED}
      </dd>
      {!allowed && (
        <p className="text-[11px] text-slate-400">
          Masked for your role. Role × field matrix is [NEEDS CONFIRMATION] (ER-08).
        </p>
      )}
    </div>
  );
}

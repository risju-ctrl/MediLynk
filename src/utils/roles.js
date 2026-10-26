// Single source of truth for roles and field masking (REQ-02, REQ-05, ER-08).
// [NEEDS CONFIRMATION] ER-08 in the MTP is still an open item, so this matrix is provisional.

export const ROLES = ['patient', 'doctor', 'staff', 'admin'];

export const ROLE_LABELS = {
  patient: 'Patient',
  doctor: 'Doctor / Healthcare Provider',
  staff: 'Clinic Admin / Staff',
  admin: 'System Administrator',
};

export const MASKED = '••••••';

// field -> roles that may read it unmasked.
export const MASKING_MATRIX = {
  email: ['patient', 'doctor', 'staff', 'admin'],
  phone: ['patient', 'doctor', 'staff', 'admin'],
  address: ['patient', 'doctor', 'staff', 'admin'],
  birthdate: ['patient', 'doctor', 'staff', 'admin'],
  symptoms: ['patient', 'doctor'],
  diagnosis: ['patient', 'doctor'],
  prescription: ['patient', 'doctor'],
  clinicalNotes: ['doctor'],
  paymentReference: ['staff', 'admin'],
};

export const canSeeField = (role, field) => (MASKING_MATRIX[field] || []).includes(role);

// Hide fields the role may not read, and report which ones were hidden.
export const maskRecord = (role, record) => {
  const hidden = [];
  const out = {};
  for (const [field, value] of Object.entries(record)) {
    if (!(field in MASKING_MATRIX) || canSeeField(role, field)) {
      out[field] = value;
    } else {
      out[field] = MASKED;
      hidden.push(field);
    }
  }
  return { record: out, hidden };
};

export const homeRoute = (role) =>
  ({
    patient: '/patient',
    doctor: '/doctor',
    staff: '/staff/appointments',
    admin: '/admin/users',
  })[role] || '/login';

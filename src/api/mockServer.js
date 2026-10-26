// Mock API for the MediLynk prototype. Everything here is in-memory and simulated:
// no real database, no real Email/SMS/Push provider, no real video platform.
//
// Design notes:
// - This module is a singleton (one shared store), mirroring the Singleton pattern used for the DB connection.
// - Authorisation and every business rule are enforced HERE, not in the screens, so hiding a button is never the only control.
// - Check-and-insert for booking is synchronous, so two simultaneous requests cannot both win.

import {
  ACTIVE_STATUSES,
  BUFFER_MIN,
  REMINDER_LEADS_H,
  SESSION_LENGTH_MIN,
  canTransition,
  now,
  violatesBuffer,
} from '../utils/timeRules.js';
import { maskRecord } from '../utils/roles.js';

export const SLOT_MIN = 30; // consultation length; the MTP sets no length, so 30 minutes is used
// Slots sit 30 minutes apart on purpose: that makes the 10-minute buffer reachable in the UI,
// because the slot right after an appointment is always inside the buffer.
export const SLOT_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];
const CHANNELS = ['email', 'sms', 'push'];
const SYNC_LIMIT_SEC = 5;

export class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code || status;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomLatency = () => 120 + Math.random() * 260;
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

// ---------- seed data (synthetic only) ----------

const at = (dayOffset, hhmm) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  const [hours, minutes] = hhmm.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const iso = (date) => new Date(date).toISOString();

function createStore() {
  const users = [
    {
      id: 'u-p1',
      role: 'patient',
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: 'Patient123!',
      phone: '09171234567',
      birthdate: '1995-04-12',
      address: 'Malolos, Bulacan',
    },
    {
      id: 'u-p2',
      role: 'patient',
      name: 'Jose Reyes',
      email: 'jose@example.com',
      password: 'Patient123!',
      phone: '09181234567',
      birthdate: '1988-11-02',
      address: 'Guiguinto, Bulacan',
    },
    {
      id: 'u-d1',
      role: 'doctor',
      name: 'Dr. Ana Cruz',
      email: 'doctor@example.com',
      password: 'Doctor123!',
      phone: '09191234567',
      birthdate: '1980-06-20',
      address: 'Malolos, Bulacan',
      doctorId: 'doc-1',
    },
    {
      id: 'u-d2',
      role: 'doctor',
      name: 'Dr. Ben Lim',
      email: 'ben@example.com',
      password: 'Doctor123!',
      phone: '09192234567',
      birthdate: '1979-01-15',
      address: 'Plaridel, Bulacan',
      doctorId: 'doc-2',
    },
    {
      id: 'u-s1',
      role: 'staff',
      name: 'Liza Bautista',
      email: 'staff@example.com',
      password: 'Staff123!',
      phone: '09193234567',
      birthdate: '1992-09-30',
      address: 'Malolos, Bulacan',
    },
    {
      id: 'u-a1',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'Admin123!',
      phone: '09194234567',
      birthdate: '1985-03-08',
      address: 'Bulacan',
    },
  ];

  const doctors = [
    {
      id: 'doc-1',
      userId: 'u-d1',
      name: 'Dr. Ana Cruz',
      specialty: 'Internal Medicine',
      clinic: 'MediLynk Malolos',
    },
    {
      id: 'doc-2',
      userId: 'u-d2',
      name: 'Dr. Ben Lim',
      specialty: 'Family Medicine',
      clinic: 'MediLynk Malolos',
    },
  ];

  const appointments = [
    {
      id: 'apt-past',
      doctorId: 'doc-1',
      patientId: 'u-p1',
      start: iso(at(-3, '10:00')),
      end: iso(at(-3, '10:30')),
      status: 'completed',
      symptoms: 'Recurring headache for four days, worse in the afternoon.',
      syncStatus: 'synced',
      createdAt: iso(at(-5, '09:00')),
    },
    {
      id: 'apt-seed-1',
      doctorId: 'doc-1',
      patientId: 'u-p1',
      start: iso(at(1, '10:00')),
      end: iso(at(1, '10:30')),
      status: 'confirmed',
      symptoms: 'Follow-up for blood pressure maintenance medicine.',
      syncStatus: 'synced',
      createdAt: iso(at(-1, '15:00')),
    },
    {
      id: 'apt-seed-2',
      doctorId: 'doc-1',
      patientId: 'u-p2',
      start: iso(at(2, '14:00')),
      end: iso(at(2, '14:30')),
      status: 'requested',
      symptoms: 'Cough and mild fever for two days.',
      syncStatus: 'synced',
      createdAt: iso(at(-1, '16:00')),
    },
    {
      id: 'apt-seed-3',
      doctorId: 'doc-2',
      patientId: 'u-p2',
      start: iso(at(3, '11:00')),
      end: iso(at(3, '11:30')),
      status: 'cancelled',
      symptoms: 'Skin allergy on the forearm.',
      syncStatus: 'synced',
      createdAt: iso(at(-2, '11:00')),
    },
  ];

  const reminders = [];
  for (const appointment of appointments) {
    if (appointment.status === 'cancelled') continue;
    const startMs = new Date(appointment.start).getTime();
    for (const leadHours of REMINDER_LEADS_H) {
      for (const channel of CHANNELS) {
        reminders.push({
          id: uid('rem'),
          appointmentId: appointment.id,
          channel,
          leadHours,
          scheduledAt: new Date(startMs - leadHours * 3600000).toISOString(),
          simulated: true,
        });
      }
    }
  }

  const records = [
    {
      id: 'rec-seed-1',
      patientId: 'u-p1',
      appointmentId: 'apt-past',
      diagnosis: 'Tension-type headache',
      prescription: 'Paracetamol 500 mg every 6 hours as needed',
      clinicalNotes: 'Advised hydration and sleep hygiene. No red flags on review.',
      paymentReference: 'ML-PAY-000121',
      createdAt: iso(at(-3, '10:45')),
    },
  ];

  const consultations = [
    {
      id: 'con-seed-1',
      appointmentId: 'apt-past',
      doctorId: 'doc-1',
      patientId: 'u-p1',
      notes: 'Advised hydration and sleep hygiene. No red flags on review.',
      createdAt: iso(at(-3, '10:45')),
    },
  ];

  return {
    users,
    doctors,
    appointments,
    reminders,
    records,
    consultations,
    demo: { failSync: false, rejoinFails: false, lastSyncNote: '' },
    timers: new Set(),
  };
}

// One shared, module-level store: the prototype's "database".
export const store = createStore();

let currentToken = null;

export const setToken = (token) => {
  currentToken = token;
};
export const getToken = () => currentToken;

// ---------- helpers ----------

const publicUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const findUser = (id) => store.users.find((user) => user.id === id);
const findDoctor = (id) => store.doctors.find((doctor) => doctor.id === id);
const userDoctorId = (user) => (user.role === 'doctor' ? user.doctorId : null);

const asAuthError = () => new ApiError(401, 'Your session has expired. Please sign in again.', 'UNAUTHENTICATED');

// The token is stateless (the mock of a signed JWT): the user id travels inside it, so a page
// refresh does not sign the user out.
const tokenUserId = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  return parts.length === 3 && parts[0] === 'mock-jwt' ? parts[1] : null;
};

const requireUser = (token) => {
  const userId = tokenUserId(token);
  const user = userId && findUser(userId);
  if (!user) throw asAuthError();
  return user;
};

const requireRole = (user, roles) => {
  if (!roles.includes(user.role)) {
    throw new ApiError(403, `Your role (${user.role}) is not allowed to perform this action.`, 'FORBIDDEN');
  }
};

const activeAppointmentsFor = (doctorId, excludeId) =>
  store.appointments.filter(
    (appointment) =>
      appointment.doctorId === doctorId &&
      ACTIVE_STATUSES.includes(appointment.status) &&
      appointment.id !== excludeId,
  );

const ownsAppointment = (user, appointment) => {
  if (user.role === 'patient') return appointment.patientId === user.id;
  if (user.role === 'doctor') return appointment.doctorId === userDoctorId(user);
  return ['staff', 'admin'].includes(user.role);
};

const enrich = (appointment) => ({
  ...appointment,
  doctorName: findDoctor(appointment.doctorId)?.name || 'Unknown doctor',
  specialty: findDoctor(appointment.doctorId)?.specialty || '',
  patientName: findUser(appointment.patientId)?.name || 'Unknown patient',
  consultationNotes:
    store.consultations.find((consultation) => consultation.appointmentId === appointment.id)?.notes || '',
});

function reminderState(reminder, appointment) {
  if (appointment.status === 'cancelled') return 'cancelled';
  const dueAt = new Date(reminder.scheduledAt).getTime();
  const current = now().getTime();
  if (dueAt > current) return 'scheduled';
  if (dueAt + 5 * 60000 <= current) return 'delivered';
  return 'sent';
}

function scheduleCalendarSync(appointment) {
  appointment.syncStatus = 'pending';
  appointment.syncStartedAt = new Date().toISOString();
  const timer = setTimeout(() => {
    store.timers.delete(timer);
    if (store.demo.failSync) {
      appointment.syncStatus = 'failed';
      appointment.syncNote = 'First sync attempt failed. Retrying once.';
      const retry = setTimeout(() => {
        store.timers.delete(retry);
        appointment.syncStatus = 'flagged';
        appointment.syncNote = 'Retry failed. Flagged for manual review by clinic staff.';
      }, 1500);
      store.timers.add(retry);
    } else {
      appointment.syncStatus = 'synced';
      appointment.syncedAt = new Date().toISOString();
      appointment.syncNote = '';
    }
  }, 1200 + Math.random() * 1500); // deliberately inside the 5-second limit
  store.timers.add(timer);
}

export function resetStore() {
  for (const timer of store.timers) clearTimeout(timer);
  Object.assign(store, createStore());
}

function registerReminders(appointment) {
  const startMs = new Date(appointment.start).getTime();
  for (const leadHours of REMINDER_LEADS_H) {
    for (const channel of CHANNELS) {
      store.reminders.push({
        id: uid('rem'),
        appointmentId: appointment.id,
        channel,
        leadHours,
        scheduledAt: new Date(startMs - leadHours * 3600000).toISOString(),
        simulated: true,
      });
    }
  }
}

function validateSlot(doctorId, startISO, excludeId) {
  const startMs = new Date(startISO).getTime();
  if (Number.isNaN(startMs)) throw new ApiError(422, 'That start time is not valid.', 'INVALID_DATE');
  if (startMs <= now().getTime()) {
    throw new ApiError(422, 'That slot is in the past or has already expired. Please pick another slot.', 'SLOT_EXPIRED');
  }
  const endMs = startMs + SLOT_MIN * 60000;
  const existing = activeAppointmentsFor(doctorId, excludeId);
  if (existing.some((appointment) => new Date(appointment.start).getTime() === startMs)) {
    throw new ApiError(409, 'That slot was just taken. The slot list has been refreshed.', 'SLOT_TAKEN');
  }
  if (violatesBuffer(startMs, endMs, existing)) {
    throw new ApiError(
      409,
      `That slot is inside the ${BUFFER_MIN}-minute buffer required between a doctor's appointments.`,
      'BUFFER_VIOLATION',
    );
  }
  return { start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString() };
}

// ---------- request handlers ----------

function handle(method, path, body, token) {
  const url = new URL(path, 'http://mock.local');
  const route = url.pathname;

  if (method === 'POST' && route === '/auth/login') {
    const user = store.users.find(
      (candidate) => candidate.email.toLowerCase() === String(body?.email || '').trim().toLowerCase(),
    );
    if (!user || user.password !== body?.password) {
      throw new ApiError(401, 'Email or password is incorrect.', 'BAD_CREDENTIALS');
    }
    const newToken = `mock-jwt.${user.id}.${Date.now()}`;
    return { token: newToken, user: publicUser(user) };
  }

  if (method === 'POST' && route === '/auth/register') {
    const payload = body || {};
    const email = String(payload.email || '').trim().toLowerCase();
    if (!email) throw new ApiError(422, 'Email address is required.', 'VALIDATION');
    if (store.users.some((user) => user.email.toLowerCase() === email)) {
      throw new ApiError(409, 'An account with that email address already exists.', 'DUPLICATE_EMAIL');
    }
    const user = {
      id: uid('u'),
      role: 'patient',
      name: String(payload.name || '').trim(),
      email,
      password: payload.password,
      phone: payload.phone,
      birthdate: payload.birthdate,
      address: payload.address,
    };
    if (!user.name || !user.password || !user.phone || !user.birthdate) {
      throw new ApiError(422, 'Some required details are missing.', 'VALIDATION');
    }
    store.users.push(user);
    const newToken = `mock-jwt.${user.id}.${Date.now()}`;
    return { token: newToken, user: publicUser(user) };
  }

  const user = requireUser(token);

  if (method === 'GET' && route === '/auth/me') return { user: publicUser(user) };

  if (method === 'GET' && route === '/doctors') {
    return { doctors: store.doctors };
  }

  if (method === 'GET' && route === '/availability') {
    const doctorId = url.searchParams.get('doctorId');
    const date = url.searchParams.get('date');
    if (!findDoctor(doctorId)) throw new ApiError(404, 'Doctor not found.', 'NOT_FOUND');
    if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
      throw new ApiError(422, 'A valid date is required.', 'INVALID_DATE');
    }
    const [year, month, day] = date.split('-').map(Number);
    const active = activeAppointmentsFor(doctorId);
    const slots = SLOT_TIMES.map((hhmm) => {
      const [hours, minutes] = hhmm.split(':').map(Number);
      const startDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const start = startDate.toISOString();
      const end = new Date(startDate.getTime() + SLOT_MIN * 60000).toISOString();
      const taken = active.some(
        (appointment) => new Date(appointment.start).getTime() === startDate.getTime(),
      );
      const buffered = violatesBuffer(start, end, active);
      const expired = startDate.getTime() <= now().getTime();
      return {
        start,
        end,
        state: expired ? 'expired' : taken ? 'taken' : buffered ? 'buffer' : 'free',
      };
    });
    return { date, doctorId, slots };
  }

  if (method === 'GET' && route === '/appointments') {
    if (!['patient', 'doctor', 'staff', 'admin'].includes(user.role)) {
      throw new ApiError(403, 'Your role may not view appointments.', 'FORBIDDEN');
    }
    const rows = store.appointments
      .filter((appointment) => ownsAppointment(user, appointment))
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map(enrich);
    return { appointments: rows };
  }

  if (method === 'POST' && route === '/appointments') {
    requireRole(user, ['patient']);
    const doctorId = body?.doctorId;
    if (!findDoctor(doctorId)) throw new ApiError(404, 'Doctor not found.', 'NOT_FOUND');
    const slot = validateSlot(doctorId, body?.start);
    const appointment = {
      id: uid('apt'),
      doctorId,
      patientId: user.id,
      start: slot.start,
      end: slot.end,
      status: 'requested',
      symptoms: String(body?.symptoms || '').trim(),
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    // Check and insert happen in the same synchronous step, so exactly one of two
    // simultaneous requests for the same slot can succeed (REQ-01).
    store.appointments.push(appointment);
    registerReminders(appointment);
    scheduleCalendarSync(appointment);
    return { appointment: enrich(appointment) };
  }

  const statusMatch = route.match(/^\/appointments\/([^/]+)\/status$/);
  if (method === 'PATCH' && statusMatch) {
    const appointment = store.appointments.find((row) => row.id === statusMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    requireRole(user, ['doctor', 'staff', 'admin']);
    if (user.role === 'doctor' && appointment.doctorId !== userDoctorId(user)) {
      throw new ApiError(403, 'You may only update your own consultations.', 'FORBIDDEN');
    }
    if (!canTransition(appointment.status, body?.status)) {
      throw new ApiError(
        409,
        `You cannot move an appointment from "${appointment.status}" to "${body?.status}".`,
        'INVALID_TRANSITION',
      );
    }
    appointment.status = body.status;
    return { appointment: enrich(appointment) };
  }

  const symptomMatch = route.match(/^\/appointments\/([^/]+)\/symptoms$/);
  if (method === 'PATCH' && symptomMatch) {
    const appointment = store.appointments.find((row) => row.id === symptomMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    if (user.role !== 'patient' || appointment.patientId !== user.id) {
      throw new ApiError(403, 'You may only update your own appointments.', 'FORBIDDEN');
    }
    appointment.symptoms = String(body?.symptoms || '').trim();
    return { appointment: enrich(appointment) };
  }

  const rescheduleMatch = route.match(/^\/appointments\/([^/]+)\/reschedule$/);
  if (method === 'POST' && rescheduleMatch) {
    const appointment = store.appointments.find((row) => row.id === rescheduleMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    if (!ownsAppointment(user, appointment)) {
      throw new ApiError(403, 'You may not reschedule this appointment.', 'FORBIDDEN');
    }
    if (!['requested', 'confirmed'].includes(appointment.status)) {
      throw new ApiError(
        409,
        `A "${appointment.status}" appointment cannot be rescheduled.`,
        'INVALID_TRANSITION',
      );
    }
    const slot = validateSlot(appointment.doctorId, body?.start, appointment.id);
    const oldStart = appointment.start;
    appointment.start = slot.start;
    appointment.end = slot.end;
    appointment.status = 'confirmed';
    appointment.rescheduledFrom = oldStart;
    store.reminders = store.reminders.filter((reminder) => reminder.appointmentId !== appointment.id);
    registerReminders(appointment);
    scheduleCalendarSync(appointment);
    return { appointment: enrich(appointment) };
  }

  const cancelMatch = route.match(/^\/appointments\/([^/]+)\/cancel$/);
  if (method === 'POST' && cancelMatch) {
    const appointment = store.appointments.find((row) => row.id === cancelMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    if (!ownsAppointment(user, appointment)) {
      throw new ApiError(403, 'You may not cancel this appointment.', 'FORBIDDEN');
    }
    if (!canTransition(appointment.status, 'cancelled')) {
      throw new ApiError(
        409,
        `A "${appointment.status}" appointment can no longer be cancelled.`,
        'INVALID_TRANSITION',
      );
    }
    appointment.status = 'cancelled';
    appointment.syncStatus = 'pending';
    scheduleCalendarSync(appointment);
    return { appointment: enrich(appointment) };
  }

  const syncRetryMatch = route.match(/^\/appointments\/([^/]+)\/sync$/);
  if (method === 'POST' && syncRetryMatch) {
    requireRole(user, ['staff', 'admin']);
    const appointment = store.appointments.find((row) => row.id === syncRetryMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    appointment.syncStatus = 'synced';
    appointment.syncedAt = new Date().toISOString();
    appointment.syncNote = 'Sync retried manually by clinic staff.';
    return { appointment: enrich(appointment) };
  }

  const reminderMatch = route.match(/^\/appointments\/([^/]+)\/reminders$/);
  if (method === 'GET' && reminderMatch) {
    const appointment = store.appointments.find((row) => row.id === reminderMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    if (!ownsAppointment(user, appointment)) {
      throw new ApiError(403, 'You may not view reminders for this appointment.', 'FORBIDDEN');
    }
    const reminders = store.reminders
      .filter((reminder) => reminder.appointmentId === appointment.id)
      .map((reminder) => ({
        ...reminder,
        status: reminderState(reminder, appointment),
        simulated: true,
      }))
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    return { reminders };
  }

  if (method === 'GET' && route === '/records') {
    const rows = store.records
      .filter((record) => {
        if (user.role === 'patient') return record.patientId === user.id;
        if (user.role === 'doctor') {
          return record.appointmentId
            ? store.appointments.some(
                (appointment) =>
                  appointment.id === record.appointmentId && appointment.doctorId === userDoctorId(user),
              )
            : false;
        }
        return ['staff', 'admin'].includes(user.role);
      })
      .map((record) => {
        const { record: masked } = maskRecord(user.role, record);
        return {
          ...masked,
          patientName: findUser(record.patientId)?.name || 'Unknown patient',
          doctorName:
            findDoctor(
              store.appointments.find((appointment) => appointment.id === record.appointmentId)?.doctorId,
            )?.name || '',
        };
      });
    return { records: rows };
  }

  if (method === 'GET' && route === '/consultations') {
    requireRole(user, ['doctor', 'staff', 'admin']);
    const rows = store.consultations
      .filter((consultation) => user.role !== 'doctor' || consultation.doctorId === userDoctorId(user))
      .map((consultation) => ({
        ...consultation,
        patientName: findUser(consultation.patientId)?.name || 'Unknown patient',
      }));
    return { consultations: rows };
  }

  const notesMatch = route.match(/^\/consultations\/([^/]+)\/notes$/);
  if (method === 'POST' && notesMatch) {
    requireRole(user, ['doctor']);
    const appointment = store.appointments.find((row) => row.id === notesMatch[1]);
    if (!appointment) throw new ApiError(404, 'Appointment not found.', 'NOT_FOUND');
    if (appointment.doctorId !== userDoctorId(user)) {
      throw new ApiError(403, 'You may only write notes for your own consultations.', 'FORBIDDEN');
    }
    if (!['in_progress', 'completed'].includes(appointment.status)) {
      throw new ApiError(409, 'Notes can only be saved during or after the consultation.', 'INVALID_STATE');
    }
    const notes = String(body?.notes || '').trim();
    if (notes.length < 10) throw new ApiError(422, 'Consultation notes are too short.', 'VALIDATION');
    let consultation = store.consultations.find((row) => row.appointmentId === appointment.id);
    if (consultation) {
      consultation.notes = notes;
    } else {
      consultation = {
        id: uid('con'),
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        notes,
        createdAt: new Date().toISOString(),
      };
      store.consultations.push(consultation);
    }
    const record = store.records.find((row) => row.appointmentId === appointment.id);
    if (record) record.clinicalNotes = notes;
    return { consultation };
  }

  if (method === 'GET' && route === '/users') {
    requireRole(user, ['admin']);
    return { users: store.users.map((row) => ({ ...publicUser(row), role: row.role })) };
  }

  if (method === 'POST' && route === '/demo/flags') {
    Object.assign(store.demo, body || {});
    return { demo: store.demo };
  }

  if (method === 'GET' && route === '/demo/state') {
    return { demo: store.demo, syncLimitSec: SYNC_LIMIT_SEC };
  }

  if (method === 'POST' && route === '/demo/reset') {
    resetStore();
    return { ok: true };
  }

  throw new ApiError(404, `No mock endpoint for ${method} ${route}.`, 'NOT_FOUND');
}

// The single entry point every screen uses. Behaves like `fetch` with mock JSON.
export async function api(path, { method = 'GET', body, token = currentToken } = {}) {
  await sleep(randomLatency());
  return handle(method, path, body, token);
}

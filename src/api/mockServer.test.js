// Behaviour tests for the mock API. They prove the rules the MTP cares about are enforced
// server-side and not only in the screens.
import test from 'node:test';
import assert from 'node:assert/strict';
import { api, resetStore, setToken } from './mockServer.js';
import { toDateInput } from '../utils/timeRules.js';

const login = async (email, password) => {
  const data = await api('/auth/login', { method: 'POST', body: { email, password } });
  setToken(data.token);
  return data;
};

const freeSlot = async (doctorId, dayOffset) => {
  const date = toDateInput(new Date(Date.now() + dayOffset * 86400000));
  const { slots } = await api(`/availability?doctorId=${doctorId}&date=${date}`);
  return slots.find((slot) => slot.state === 'free');
};

test.beforeEach(() => {
  resetStore();
  setToken(null);
});

test('two simultaneous bookings for the same slot: exactly one wins', async () => {
  await login('maria@example.com', 'Patient123!');
  const slot = await freeSlot('doc-2', 7);
  assert.ok(slot, 'expected a free slot');

  const body = { doctorId: 'doc-2', start: slot.start, symptoms: 'Race test symptoms.' };
  const results = await Promise.allSettled([
    api('/appointments', { method: 'POST', body }),
    api('/appointments', { method: 'POST', body }),
  ]);

  const accepted = results.filter((result) => result.status === 'fulfilled');
  const rejected = results.filter((result) => result.status === 'rejected');
  assert.equal(accepted.length, 1);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].reason.status, 409);
});

test('a slot inside the 10-minute buffer is rejected', async () => {
  await login('maria@example.com', 'Patient123!');
  // apt-seed-1 is tomorrow at 10:00 for doc-1.
  const date = toDateInput(new Date(Date.now() + 86400000));
  const { slots } = await api(`/availability?doctorId=doc-1&date=${date}`);
  const afterSeed = slots.find((slot) => slot.state === 'buffer');
  assert.ok(afterSeed, 'expected a slot blocked by the buffer');
  await assert.rejects(
    api('/appointments', { method: 'POST', body: { doctorId: 'doc-1', start: afterSeed.start } }),
    (error) => error.status === 409,
  );
});

test('a past slot is rejected with a validation error', async () => {
  await login('maria@example.com', 'Patient123!');
  await assert.rejects(
    api('/appointments', {
      method: 'POST',
      body: { doctorId: 'doc-1', start: new Date(Date.now() - 3600000).toISOString() },
    }),
    (error) => error.status === 422,
  );
});

test('a patient cannot read another patient\'s reminders', async () => {
  await login('maria@example.com', 'Patient123!');
  // apt-seed-2 belongs to Jose.
  await assert.rejects(
    api('/appointments/apt-seed-2/reminders'),
    (error) => error.status === 403,
  );
});

test('a patient cannot fetch appointments with staff rights', async () => {
  await login('maria@example.com', 'Patient123!');
  const list = await api('/appointments');
  assert.ok(list.appointments.every((appointment) => appointment.patientId === 'u-p1'));
});

test('records are masked for clinic staff', async () => {
  await login('staff@example.com', 'Staff123!');
  const { records } = await api('/records');
  const record = records.find((row) => row.id === 'rec-seed-1');
  assert.equal(record.diagnosis, '••••••');
  assert.equal(record.paymentReference, 'ML-PAY-000121');
});

test('only valid status transitions are accepted', async () => {
  await login('doctor@example.com', 'Doctor123!');
  // apt-seed-1 is confirmed, so it cannot jump straight to completed.
  await assert.rejects(
    api('/appointments/apt-seed-1/status', { method: 'PATCH', body: { status: 'completed' } }),
    (error) => error.status === 409,
  );
  const { appointment } = await api('/appointments/apt-seed-1/status', {
    method: 'PATCH',
    body: { status: 'in_progress' },
  });
  assert.equal(appointment.status, 'in_progress');
});

test('registration rejects a duplicate email', async () => {
  await assert.rejects(
    api('/auth/register', {
      method: 'POST',
      body: {
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '09171234567',
        birthdate: '1995-04-12',
        address: 'Malolos, Bulacan',
        password: 'Patient123!',
      },
    }),
    (error) => error.status === 409,
  );
});

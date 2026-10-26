import test from 'node:test';
import assert from 'node:assert/strict';
import { BUFFER_MIN, canTransition, isExpired, violatesBuffer } from './timeRules.js';
import { MASKING_MATRIX, canSeeField, maskRecord } from './roles.js';

const appt = (startIso, minutes = 30) => ({
  start: startIso,
  end: new Date(new Date(startIso).getTime() + minutes * 60000).toISOString(),
});

test('a slot exactly on a gap of 10 minutes is allowed, 9 minutes is not', () => {
  const base = '2030-01-01T10:00:00.000Z';
  const existing = [appt(base)];
  const exactGap = '2030-01-01T10:40:00.000Z'; // existing ends 10:30 + 10 min buffer
  const shortGap = '2030-01-01T10:39:00.000Z';

  assert.equal(violatesBuffer(exactGap, '2030-01-01T11:10:00.000Z', existing), false);
  assert.equal(violatesBuffer(shortGap, '2030-01-01T11:09:00.000Z', existing), true);
});

test('overlapping appointments always violate the buffer', () => {
  const base = '2030-01-01T10:00:00.000Z';
  const existing = [appt(base)];
  assert.equal(violatesBuffer('2030-01-01T10:15:00.000Z', '2030-01-01T10:45:00.000Z', existing), true);
});

test('the buffer is ten minutes', () => {
  assert.equal(BUFFER_MIN, 10);
});

test('only valid status transitions pass', () => {
  assert.equal(canTransition('requested', 'confirmed'), true);
  assert.equal(canTransition('confirmed', 'cancelled'), true);
  assert.equal(canTransition('completed', 'cancelled'), false);
  assert.equal(canTransition('cancelled', 'confirmed'), false);
  assert.equal(canTransition('requested', 'completed'), false);
});

test('past slots are expired', () => {
  assert.equal(isExpired(new Date(Date.now() - 60000).toISOString()), true);
  assert.equal(isExpired(new Date(Date.now() + 600000).toISOString()), false);
});

test('staff and admin never read clinical notes through the matrix', () => {
  assert.equal(canSeeField('doctor', 'clinicalNotes'), true);
  assert.equal(canSeeField('staff', 'clinicalNotes'), false);
  assert.equal(canSeeField('admin', 'clinicalNotes'), false);
  assert.deepEqual(maskRecord('staff', { diagnosis: 'Flu', paymentReference: 'X' }).record, {
    diagnosis: '••••••',
    paymentReference: 'X',
  });
});

test('every masking matrix entry names at least one role', () => {
  for (const [field, roles] of Object.entries(MASKING_MATRIX)) {
    assert.ok(roles.length > 0, `${field} has no clearing role`);
  }
});

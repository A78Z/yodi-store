import test from 'node:test';
import assert from 'node:assert/strict';
import { orderProgress, orderStatusLabel, profileFields, profilePasswordError, profilePayload } from '../lib/profile.ts';

test('order tracking progresses from pending to processing to delivered, never through cancelled', () => {
  assert.equal(orderProgress('pending'), 0);
  assert.equal(orderProgress('processing'), 1);
  assert.equal(orderProgress('delivered'), 2);
  assert.equal(orderProgress('cancelled'), -1);
  assert.equal(orderProgress('unknown'), -1);
  assert.equal(orderStatusLabel('unknown'), 'Statut à confirmer');
});
test('profile password changes are optional but require all fields and matching six characters', () => {
  assert.equal(profilePasswordError({ old: '', next: '', confirm: '' }), '');
  for (const fields of [{ old: 'secret', next: '', confirm: '' }, { old: '', next: 'abcdef', confirm: 'abcdef' }, { old: 'secret', next: 'abcde', confirm: 'abcde' }, { old: 'secret', next: 'abcdef', confirm: 'abcdeg' }]) assert.notEqual(profilePasswordError(fields), '');
  assert.equal(profilePasswordError({ old: 'secret', next: 'abcdef', confirm: 'abcdef' }), '');
});
test('profile state excludes credentials and payload excludes extra fields without normalizing passwords', () => {
  const fields = { firstname: 'Test', lastname: 'Preview', phone: '000', address: '', city: '', country: '', zip: '', email: 'ignored@example.invalid', oldPassword: 'never-store', role: 'ignored' };
  const clean = { firstname: 'Test', lastname: 'Preview', phone: '000', address: '', city: '', country: '', zip: '' };
  assert.deepEqual(profileFields(fields), clean);
  assert.deepEqual(profilePayload(fields, { old: '', next: '', confirm: '' }), clean);
  assert.deepEqual(profilePayload(fields, { old: ' old ', next: ' next ', confirm: ' next ' }), { ...clean, oldPassword: ' old ', newPassword: ' next ' });
});

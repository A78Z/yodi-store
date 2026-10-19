import test from 'node:test';
import assert from 'node:assert/strict';
import { registrationPasswordError, registrationPayload, sanitizeVerificationCode, isVerificationCode } from '../lib/registration-form.ts';

test('registration retains the existing six-character minimum and requires a matching confirmation', () => {
  assert.equal(registrationPasswordError('abcdef', 'abcdef'), '');
  assert.notEqual(registrationPasswordError('abcde', 'abcde'), '');
  assert.notEqual(registrationPasswordError('abcdef', 'abcdeg'), '');
});

test('registration payload keeps password bytes and optional fields, excluding confirmation or extra fields', () => {
  const payload = registrationPayload({ firstname: ' Test ', lastname: ' Preview ', email: ' preview@example.invalid ', phone: ' 000 ', address: ' Adresse fictive ', city: ' Dakar ', zip: '', country: 'Sénégal', password: ' secret ', confirmPassword: ' secret ', unexpected: 'ignored' });
  assert.deepEqual(payload, { firstname: 'Test', lastname: 'Preview', email: 'preview@example.invalid', phone: '000', address: 'Adresse fictive', city: 'Dakar', zip: '', country: 'Sénégal', password: ' secret ' });
});

test('verification preserves leading zeroes and accepts only six digits', () => {
  assert.equal(sanitizeVerificationCode('00 12-34 extra 56'), '001234');
  assert.equal(isVerificationCode('001234'), true);
  for (const value of ['', '12345', '1234567', '12a456', ' 123456']) assert.equal(isVerificationCode(value), false);
});

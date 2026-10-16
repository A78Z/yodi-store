import test from 'node:test';
import assert from 'node:assert/strict';
import { passwordResetError, passwordResetPayload } from '../lib/password-recovery.ts';

test('password recovery requires exactly six digits, preserving leading zeroes', () => {
  const fields = { code: '001234', password: 'abcdef', confirmPassword: 'abcdef' };
  assert.equal(passwordResetError(fields), '');
  for (const code of ['', '12345', '1234567', '12a456', ' 123456']) assert.notEqual(passwordResetError({ ...fields, code }), '');
});

test('password recovery retains the existing minimum and matching confirmation', () => {
  assert.notEqual(passwordResetError({ code: '123456', password: 'abcde', confirmPassword: 'abcde' }), '');
  assert.notEqual(passwordResetError({ code: '123456', password: 'abcdef', confirmPassword: 'abcdeg' }), '');
  assert.equal(passwordResetError({ code: '123456', password: 'abcdef', confirmPassword: 'abcdef' }), '');
});

test('reset payload preserves password bytes and code, sending only the API contract', () => {
  assert.deepEqual(passwordResetPayload(' preview@example.invalid ', { code: '001234', password: ' secret ', confirmPassword: ' secret ', extra: 'ignored' }), { email: 'preview@example.invalid', code: '001234', password: ' secret ' });
});

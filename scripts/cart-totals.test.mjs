import test from 'node:test';
import assert from 'node:assert/strict';
import { cartTotals, formatMoney } from '../lib/pricing.ts';

test('cart aggregates quantities and discounts before converting or rounding', () => {
  const totals = cartTotals([
    { price: 7989, discount: 15, quantity: 3 },
    { price: 8000, quantity: 2 },
  ]);
  assert.equal(totals.quantity, 5);
  assert.equal(totals.subtotal, 36371.95);
  assert.ok(Math.abs(totals.savings - 3595.05) < 0.000001);
  assert.equal(formatMoney(totals.subtotal, 'USD', 625), '58.20 USD');
  assert.equal(formatMoney(totals.subtotal, 'XOF', 625).replace(/\s/g, ' '), '36 372 FCFA');
});

test('empty cart has no totals or savings; undiscounted quantities retain their price', () => {
  assert.deepEqual(cartTotals([]), { quantity: 0, subtotal: 0, savings: 0 });
  assert.deepEqual(cartTotals([{ price: 8000, quantity: 2 }]), { quantity: 2, subtotal: 16000, savings: 0 });
});

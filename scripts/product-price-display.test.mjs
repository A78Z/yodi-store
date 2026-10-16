import test from 'node:test';
import assert from 'node:assert/strict';
import { discountedPrice, formatMoney } from '../lib/pricing.ts';

test('product detail retains USD cents after discount and currency conversion', () => {
  const price = discountedPrice(7989, 15);
  assert.equal(formatMoney(price, 'USD', 625), '10.87 USD');
});

test('product detail rounds discounted XOF amounts consistently with category cards', () => {
  assert.equal(formatMoney(discountedPrice(7989, 15), 'XOF', 625).replace(/\s/g, ' '), '6 791 FCFA');
  assert.equal(formatMoney(discountedPrice(8000, 0), 'USD', 625), '12.80 USD');
});

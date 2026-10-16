import test from 'node:test';
import assert from 'node:assert/strict';
import { remainingProductQuantity } from '../lib/product-quantity.ts';

test('product quantity accounts for units already in the cart', () => {
  assert.equal(remainingProductQuantity(5, 2), 3);
  assert.equal(remainingProductQuantity(5, 5), 0);
  assert.equal(remainingProductQuantity(5, 8), 0);
});

test('product quantity is bounded to nonnegative whole units', () => {
  assert.equal(remainingProductQuantity(0, 0), 0);
  assert.equal(remainingProductQuantity(-1, 0), 0);
  assert.equal(remainingProductQuantity(NaN, 0), 0);
  assert.equal(remainingProductQuantity(Infinity, 0), 0);
  assert.equal(remainingProductQuantity(3.9, 1.2), 2);
  assert.equal(remainingProductQuantity(3, -2), 3);
});

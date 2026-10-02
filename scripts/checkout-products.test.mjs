import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCheckoutProducts } from '../lib/checkout-products.ts';

const id = '6939bdf396e4c874c38c2e65';
const product = { _id: id, price: 8000, discount: 10, stock: 3, disponible: true };

test('checkout computes prices from fresh products, including discounts', () => {
  const result = validateCheckoutProducts([{ id, quantity: 2, price: 1 }], [product]);
  assert.equal(result.subtotal, 14400);
  assert.equal(result.pricesChanged, true);
});

test('fresh price snapshots pass, changed prices and discounts are detected', () => {
  assert.equal(validateCheckoutProducts([{ id, quantity: 1, price: 8000, discount: 10 }], [product]).pricesChanged, false);
  assert.equal(validateCheckoutProducts([{ id, quantity: 1, price: 8000, discount: 0 }], [product]).pricesChanged, true);
  assert.equal(validateCheckoutProducts([{ id, quantity: 1, price: 7000, discount: 10 }], [product]).pricesChanged, true);
});

test('duplicate cart entries cannot bypass stock validation', () => {
  assert.throws(() => validateCheckoutProducts([{ id, quantity: 2 }, { id, quantity: 2 }], [product]));
});

test('checkout rejects missing, unavailable and out-of-stock products', () => {
  for (const products of [[], [{ ...product, disponible: false }], [{ ...product, stock: 0 }]]) {
    assert.throws(() => validateCheckoutProducts([{ id, quantity: 1 }], products));
  }
});

test('checkout rejects empty carts and invalid quantities', () => {
  assert.throws(() => validateCheckoutProducts([], [product]));
  for (const quantity of [0, -1, 1.5, NaN, Infinity, '2']) {
    assert.throws(() => validateCheckoutProducts([{ id, quantity }], [product]));
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactCartImages } from '../lib/cart-images.ts';

test('legacy cart images become versioned URLs without losing cart contents', () => {
  const cart = { id: '6939bdf396e4c874c38c2e65', imageUrl: 'data:image/png;base64,AAAA', quantity: 3, price: 8000, discount: 10, updatedAt: '2026-10-01T00:00:00.000Z' };
  const result = compactCartImages([cart])[0];
  assert.equal(result.imageUrl, `/api/product-images/${cart.id}?v=${Date.parse(cart.updatedAt)}`);
  assert.deepEqual({ ...result, imageUrl: cart.imageUrl }, cart);
  assert.equal(cart.imageUrl, 'data:image/png;base64,AAAA');
});

test('existing URLs and unsupported legacy identifiers remain unchanged', () => {
  const cart = { id: 'old-id', imageUrl: 'data:image/png;base64,AAAA', quantity: 1 };
  const linked = { id: '6939bdf396e4c874c38c2e65', imageUrl: '/products/locks.webp', quantity: 2 };
  assert.deepEqual(compactCartImages([cart, linked]), [cart, linked]);
});

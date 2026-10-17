import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOrderPhone, validateWhatsAppOrder, whatsappOrderHref } from '../lib/whatsapp-order.ts';
import { discountedPrice, formatMoney, productHref } from '../lib/pricing.ts';
import { PHONE_COMMERCIAL, SITE_URL } from '../lib/site.ts';

const product = { _id: '6939bdf396e4c874c38c2e65', category: 'huile', subCategory: 'cheveux' };
const publicUrl = new URL(productHref(product), SITE_URL).href;
const fields = { phoneCountry: 'SN', phone: '77 000 00 00', street: 'Rue de démonstration', city: 'Dakar', deliveryCountry: 'Sénégal', customerName: '', note: '', quantity: 2 };
const order = { name: 'Huile de Cheveux', displayedPrice: formatMoney(discountedPrice(7989, 15), 'XOF', 625), displayedSubtotal: formatMoney(discountedPrice(7989, 15) * 2, 'XOF', 625), publicProductUrl: publicUrl, phone: PHONE_COMMERCIAL.tel, fields, maxQuantity: 3 };

test('Senegal accepts nine digits with or without country prefix and rejects incomplete or malformed input', () => {
  for (const value of ['77 000 00 00', '+221 77 000 00 00', '00221 77 000 00 00', '221770000000']) assert.equal(normalizeOrderPhone(value, 'SN'), '+221770000000');
  for (const value of ['', '77 000', '8195550123', '+1 8195550123', '770000000hello', '000000000']) assert.equal(normalizeOrderPhone(value, 'SN'), null);
});

test('Canada validates ten-digit numbers independently from Senegal', () => {
  for (const value of ['819 555 0123', '+1 (819) 555-0123', '0018195550123', '18195550123']) assert.equal(normalizeOrderPhone(value, 'CA'), '+18195550123');
  for (const value of ['770000000', '0195550123', '8191550123', '+221770000000']) assert.equal(normalizeOrderPhone(value, 'CA'), null);
});

test('required phone and individual address fields produce precise errors, optional fields are optional', () => {
  assert.deepEqual(validateWhatsAppOrder(fields, 3), {});
  const errors = validateWhatsAppOrder({ ...fields, phone: '', street: '', city: '', deliveryCountry: '' }, 3);
  assert.deepEqual(Object.keys(errors), ['phone', 'street', 'city', 'deliveryCountry']);
});

test('quantities must be whole units within remaining stock, unavailable products cannot proceed', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity, 4]) assert.ok(validateWhatsAppOrder({ ...fields, quantity }, 3).quantity);
  assert.ok(validateWhatsAppOrder({ ...fields, quantity: 1 }, 0).quantity);
  assert.deepEqual(validateWhatsAppOrder({ ...fields, quantity: 3 }, 3), {});
});

test('final message includes commercial number, normalized contact, address, quantity, real discounted unit price and subtotal', () => {
  const url = new URL(whatsappOrderHref(order));
  assert.equal(url.origin + url.pathname, 'https://wa.me/221780128486');
  const text = url.searchParams.get('text');
  assert.ok(text.includes('Quantité : 2'));
  assert.ok(text.includes(`Prix unitaire : ${order.displayedPrice}`));
  assert.ok(text.includes(`Sous-total produits : ${order.displayedSubtotal}`));
  assert.ok(text.includes('Téléphone : +221770000000'));
  assert.ok(text.includes('Adresse : Rue de démonstration, Dakar, Sénégal'));
  assert.ok(text.endsWith(`Lien : ${publicUrl}`));
  assert.ok(text.includes('Frais de livraison à confirmer.'));
  assert.ok(!text.includes('Nom :'));
  assert.ok(!text.includes('Note :'));
});

test('USD totals retain precision until display rather than multiplying rounded unit prices', () => {
  const price = discountedPrice(7989, 15);
  const displayedPrice = formatMoney(price, 'USD', 625);
  const displayedSubtotal = formatMoney(price * 2, 'USD', 625);
  const href = whatsappOrderHref({ ...order, displayedPrice, displayedSubtotal });
  const text = new URL(href).searchParams.get('text');
  assert.ok(text.includes('Prix unitaire : 10.87 USD'));
  assert.ok(text.includes('Sous-total produits : 21.73 USD'));
});

test('final message preserves accents, multiline notes and special characters with encodeURIComponent', () => {
  const custom = { ...order, name: 'Baume réparateur & éclat #1', fields: { ...fields, phoneCountry: 'CA', phone: '8195550123', customerName: ' Démonstration ', note: 'Repère & entrée #2\nAprès 18h', deliveryCountry: 'Canada', city: 'Montréal' } };
  const href = whatsappOrderHref(custom);
  const message = new URL(href).searchParams.get('text');
  assert.equal(href, `https://wa.me/221780128486?text=${encodeURIComponent(message)}`);
  assert.equal(new URL(href).hash, '');
  assert.ok(message.includes('Téléphone : +18195550123'));
  assert.ok(message.includes('Nom : Démonstration'));
  assert.ok(message.includes('Note : Repère & entrée #2\nAprès 18h'));
});

test('no final link can be generated with invalid coordinates or unavailable quantity', () => {
  assert.throws(() => whatsappOrderHref({ ...order, fields: { ...fields, phone: '' } }));
  assert.throws(() => whatsappOrderHref({ ...order, maxQuantity: 0 }));
});

test('products without subcategory retain the existing canonical product route', () => {
  assert.equal(new URL(productHref({ ...product, subCategory: undefined }), SITE_URL).href,
    'https://yodi-k.com/huile/product/6939bdf396e4c874c38c2e65');
});

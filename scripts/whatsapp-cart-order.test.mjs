import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWhatsAppCartOrder, whatsappCartOrderHref } from '../lib/whatsapp-order.ts';
import { cartTotals, discountedPrice, formatMoney, productHref } from '../lib/pricing.ts';
import { PHONE_COMMERCIAL, SITE_URL } from '../lib/site.ts';

const fields = { phoneCountry: 'SN', phone: '77 000 00 00', street: 'Rue de démonstration', city: 'Dakar', deliveryCountry: 'Sénégal', customerName: '', note: '', quantity: 1 };
const products = [
  { _id: 'barbe', title: 'Huile de Barbe', category: 'huile', subCategory: 'huile-barbe', price: 7989, discount: 15, quantity: 2, stock: 2 },
  { _id: 'locks', title: 'Huile Locks', category: 'huile', subCategory: 'huile-cheveux', price: 8000, quantity: 1, stock: 10 },
];
const prepare = (currency = 'XOF') => ({
  fields, phone: PHONE_COMMERCIAL.tel,
  lines: products.map(product => ({
    name: product.title, quantity: product.quantity, maxQuantity: product.stock,
    displayedPrice: formatMoney(discountedPrice(product.price, product.discount), currency, 625),
    displayedLineTotal: formatMoney(discountedPrice(product.price, product.discount) * product.quantity, currency, 625),
    publicProductUrl: new URL(productHref(product), SITE_URL).href,
  })),
  displayedSubtotal: formatMoney(cartTotals(products).subtotal, currency, 625),
});

test('cart request retains every product, its quantity, discounted prices, line total and canonical URL', () => {
  const order = prepare();
  assert.deepEqual(validateWhatsAppCartOrder(fields, order.lines), {});
  const url = new URL(whatsappCartOrderHref(order));
  assert.equal(url.origin + url.pathname, 'https://wa.me/221780128486');
  const message = url.searchParams.get('text');
  for (const [index, line] of order.lines.entries()) {
    assert.ok(message.includes(`${index + 1}. ${line.name}\nQuantité : ${line.quantity}\nPrix unitaire : ${line.displayedPrice}\nTotal produit : ${line.displayedLineTotal}\nLien : ${line.publicProductUrl}`));
  }
  assert.ok(message.includes(`Sous-total produits : ${order.displayedSubtotal}`));
  assert.equal(order.displayedSubtotal.replace(/\s/g, ' '), '21 581 FCFA');
  assert.equal(message.match(/Téléphone :/g).length, 1);
  assert.ok(message.includes('Frais de livraison à confirmer.'));
});

test('cart USD amounts use the displayed currency and aggregate before rounding', () => {
  const order = prepare('USD');
  const message = new URL(whatsappCartOrderHref(order)).searchParams.get('text');
  assert.ok(message.includes('Prix unitaire : 10.87 USD'));
  assert.ok(message.includes('Total produit : 21.73 USD'));
  assert.ok(message.includes('Sous-total produits : 34.53 USD'));
  assert.ok(!message.includes('FCFA'));
});

test('empty carts and a single invalid, unavailable or excessive quantity block the entire request', () => {
  const order = prepare();
  assert.throws(() => whatsappCartOrderHref({ ...order, lines: [] }));
  for (const quantity of [0, -1, 1.5, 3, NaN]) {
    const lines = [{ ...order.lines[0], quantity }, order.lines[1]];
    assert.ok(validateWhatsAppCartOrder(fields, lines).quantity);
    assert.throws(() => whatsappCartOrderHref({ ...order, lines }));
  }
  assert.throws(() => whatsappCartOrderHref({ ...order, lines: [order.lines[0], { ...order.lines[1], maxQuantity: 0 }] }));
  assert.throws(() => whatsappCartOrderHref({ ...order, fields: { ...fields, phone: '' } }));
});

test('cart message encodes optional details once and validates the Canadian phone format', () => {
  const order = { ...prepare(), fields: { ...fields, phoneCountry: 'CA', phone: '8195550123', customerName: 'Démonstration', note: 'Entrée #2 & repère\nAprès 18h' } };
  const href = whatsappCartOrderHref(order);
  const message = new URL(href).searchParams.get('text');
  assert.equal(href, `https://wa.me/221780128486?text=${encodeURIComponent(message)}`);
  assert.ok(message.includes('Téléphone : +18195550123'));
  assert.ok(message.includes('Nom : Démonstration\nNote : Entrée #2 & repère\nAprès 18h'));
});

test('large carts are not truncated and request preparation never changes the input cart', () => {
  const order = prepare();
  const before = JSON.stringify(order);
  const many = { ...order, lines: Array.from({ length: 30 }, (_, index) => ({ ...order.lines[0], name: `Soin ${index + 1}` })) };
  const message = new URL(whatsappCartOrderHref(many)).searchParams.get('text');
  assert.ok(message.includes('30. Soin 30'));
  assert.equal((message.match(/Lien :/g) || []).length, 30);
  whatsappCartOrderHref(order);
  assert.equal(JSON.stringify(order), before);
});

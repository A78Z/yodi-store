import test from 'node:test';
import assert from 'node:assert/strict';
import { whatsappOrderHref } from '../lib/whatsapp-order.ts';
import { discountedPrice, formatMoney, productHref } from '../lib/pricing.ts';
import { PHONE_COMMERCIAL, SITE_URL } from '../lib/site.ts';

const product = { _id: '6939bdf396e4c874c38c2e65', category: 'huile', subCategory: 'cheveux' };
const publicUrl = new URL(productHref(product), SITE_URL).href;

test('WhatsApp uses the commercial number, discounted displayed XOF price and canonical product URL', () => {
  const price = formatMoney(discountedPrice(7989, 15), 'XOF', 625);
  const href = whatsappOrderHref('Huile de Cheveux', price, publicUrl, PHONE_COMMERCIAL.tel);
  const url = new URL(href);
  assert.equal(url.origin + url.pathname, 'https://wa.me/221780128486');
  assert.equal(url.searchParams.get('text'), `Bonjour Yodi-K, je souhaite commander ce produit : Huile de Cheveux. Prix affiché : ${price}. Lien : https://yodi-k.com/huile/cheveux/6939bdf396e4c874c38c2e65.`);
});

test('WhatsApp retains displayed USD cents and encodes accents, ampersands and URL punctuation', () => {
  const name = 'Baume réparateur & éclat #1';
  const price = formatMoney(discountedPrice(7989, 15), 'USD', 625);
  const href = whatsappOrderHref(name, price, publicUrl, PHONE_COMMERCIAL.tel);
  const message = `Bonjour Yodi-K, je souhaite commander ce produit : ${name}. Prix affiché : 10.87 USD. Lien : ${publicUrl}.`;
  assert.equal(href, `https://wa.me/221780128486?text=${encodeURIComponent(message)}`);
  assert.equal(new URL(href).searchParams.get('text'), message);
  assert.equal(new URL(href).hash, '');
});

test('products without subcategory retain the existing canonical product route', () => {
  assert.equal(new URL(productHref({ ...product, subCategory: undefined }), SITE_URL).href,
    'https://yodi-k.com/huile/product/6939bdf396e4c874c38c2e65');
});

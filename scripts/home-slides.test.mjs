import test from 'node:test';
import assert from 'node:assert/strict';
import { homeSlides, nextHeroSlide, heroSwipeDirection } from '../lib/home-slides.ts';

test('home carousel has exactly three slides and links only to visible categories', () => {
  const slides = homeSlides([{ slug: 'huile' }, { slug: 'baume' }]);
  assert.equal(slides.length, 3);
  assert.deepEqual(slides.map(slide => slide.href), ['#produits', '/huile', '/baume']);
  assert.deepEqual(homeSlides([]).map(slide => slide.href), ['#produits', '#produits', '#produits']);
  assert.equal(homeSlides([{ slug: 'huile' }])[2].href, '#produits');
});
test('carousel wraps in both directions', () => {
  assert.equal(nextHeroSlide(2, 1, 3), 0);
  assert.equal(nextHeroSlide(0, -1, 3), 2);
  assert.equal(nextHeroSlide(0, 1, 0), 0);
});
test('horizontal swipes navigate, small gestures and vertical scrolling do not', () => {
  assert.equal(heroSwipeDirection(-80, 10), 1);
  assert.equal(heroSwipeDirection(80, -10), -1);
  assert.equal(heroSwipeDirection(20, 0), 0);
  assert.equal(heroSwipeDirection(60, 100), 0);
  assert.equal(heroSwipeDirection(60, 50), 0);
});

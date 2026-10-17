import test from 'node:test';
import assert from 'node:assert/strict';
import { completeHomeGallery, suppliedGalleryPhotos } from '../lib/home-gallery.ts';
test('an empty or partial admin gallery still fills two six-card rows', () => {
  for (const managed of [[], [{ id: 'admin-photo', kind: 'photo', thumbnail: 'photo.jpg', viewerUrl: 'photo.jpg', permalink: '', label: 'Photo publiée' }]]) {
    const gallery = completeHomeGallery(managed);
    assert.equal(gallery.length, 12);
    assert.equal(new Set(gallery.map(item => item.id)).size, 12);
    assert.equal(gallery.slice(0, 6).length, 6);
    assert.equal(gallery.slice(6).length, 6);
    if (managed.length) assert.equal(gallery[0], managed[0]);
  }
  assert.equal(suppliedGalleryPhotos.length, 11);
});
test('new admin publications have priority without growing the two rows', () => {
  const managed = Array.from({ length: 15 }, (_, index) => ({ id: `admin-${index}` }));
  assert.deepEqual(completeHomeGallery(managed), managed.slice(0, 12));
  assert.equal(managed.length, 15);
});

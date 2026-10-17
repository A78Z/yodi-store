import test from 'node:test';
import assert from 'node:assert/strict';
import { publishedGalleryMedia, galleryBlobUrl } from '../lib/manual-gallery.ts';
const host = 'yoditest.public.blob.vercel-storage.com';
const entry = (id, kind = 'photo') => ({ _id: id, kind, url: `https://${host}/gallery/refonte/${id}.${kind === 'video' ? 'mp4' : 'jpg'}`, thumbnail: `https://${host}/gallery/refonte/${id}.jpg`, published: true, alt: 'Soin Yodi-K' });
test('only published valid media from the configured store reach visitors', () => {
  const media = publishedGalleryMedia([entry('1'), entry('v', 'video'), { ...entry('hidden'), published: false }, { ...entry('bad'), url: 'https://evil.test/a.mp4' }, { ...entry('unlabelled'), alt: '' }, { ...entry('unknown'), kind: 'html' }], host);
  assert.equal(media.length, 2); assert.equal(media[1].kind, 'video'); assert.equal(media[1].viewerUrl, entry('v', 'video').url);
  assert.ok(media.every(value => value.permalink === '' && !('published' in value)));
});
test('empty or unconfigured feed is safe; duplicates and output count are bounded', () => {
  assert.deepEqual(publishedGalleryMedia([], host), []);
  assert.deepEqual(publishedGalleryMedia([entry('1')], undefined), []);
  assert.equal(publishedGalleryMedia([entry('1'), entry('1')], host).length, 1);
  assert.equal(publishedGalleryMedia(Array.from({ length: 40 }, (_, i) => entry(String(i))), host).length, 24);
});
test('URLs cannot inject credentials, query secrets or another storage path', () => {
  for (const url of [`http://${host}/gallery/refonte/a.jpg`, `https://${host}/gallery/refonte/a.jpg?token=private`, `https://user:pass@${host}/gallery/refonte/a.jpg`, `https://${host}/gallery/production/a.jpg`, `https://${host}/gallery/refonte/../other/a.jpg`]) assert.equal(galleryBlobUrl(url, host), false);
});

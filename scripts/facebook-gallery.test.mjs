import test from 'node:test';
import assert from 'node:assert/strict';
import { facebookGalleryConfig, facebookPermalink, fetchFacebookGallery, normalizeFacebookMedia } from '../lib/facebook-gallery.ts';

// Synthetic API-shaped fixtures only: never rendered in the site or used as gallery content.
const attachment = (id, type = 'photo', host = 'scontent.example.fbcdn.net') => ({ type, target: { id }, media: { image: { src: `https://${host}/${id}.jpg?signature=example` } } });
const post = (id, items) => ({ id, is_published: true, permalink_url: `https://www.facebook.com/yyodistores/posts/${id}`, attachments: { data: items } });
const config = { pageId: '123', token: 'test-token-not-a-real-secret', version: 'v26.0' };
const response = data => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
const identity = () => response({ id: '123', link: 'https://www.facebook.com/yyodistores/' });

test('albums retain every available photo, deduplicate media, and keep source post links for videos', () => {
  const posts = [post('1', [{ type: 'album', subattachments: { data: [attachment('a'), attachment('b')] } }]), post('2', [attachment('a'), attachment('v', 'video_inline')]), post('3', [attachment('preview', 'share')]), { id: '4', message: 'Text only' }];
  const media = normalizeFacebookMedia(posts);
  assert.deepEqual(media.map(item => [item.id, item.kind]), [['a', 'photo'], ['b', 'photo'], ['v', 'video']]);
  assert.equal(media[2].permalink, posts[1].permalink_url);
  assert.ok(media[0].thumbnail.endsWith('?signature=example'));
  assert.ok(media.every(item => !('message' in item)));
});

test('unpublished posts, invalid destinations and non-Meta thumbnails are excluded', () => {
  const privatePost = { ...post('1', [attachment('private')]), is_published: false };
  assert.deepEqual(normalizeFacebookMedia([privatePost, post('2', [attachment('foreign', 'photo', 'example.org')]), { ...post('3', [attachment('bad')]), permalink_url: 'javascript:alert(1)' }]), []);
  for (const url of ['http://www.facebook.com/post', 'https://facebook.com.evil.test/post', 'https://user:password@www.facebook.com/post', 'https://www.facebook.com/yyodistores']) assert.equal(facebookPermalink(url), null);
  assert.equal(facebookPermalink('https://m.facebook.com/photo/?fbid=1&access_token=do-not-keep&tracking=remove'), 'https://www.facebook.com/photo/?fbid=1');
});

test('feed is capped and empty data produces no gallery media', () => {
  assert.equal(normalizeFacebookMedia(Array.from({ length: 40 }, (_, i) => post(String(i), [attachment(String(i))]))).length, 24);
  assert.deepEqual(normalizeFacebookMedia([]), []);
  assert.deepEqual(normalizeFacebookMedia([post('1', [attachment('a')])], 0), []);
});

test('gallery configuration is dedicated to Preview refonte; advertising token is never a fallback', () => {
  const env = { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'refonte', FACEBOOK_PAGE_ID: '123', FACEBOOK_PAGE_ACCESS_TOKEN: config.token };
  assert.deepEqual(facebookGalleryConfig(env), config);
  for (const extra of [{ VERCEL_ENV: 'production' }, { VERCEL_GIT_COMMIT_REF: 'main' }, { FACEBOOK_PAGE_ID: 'yyodistores' }, { FACEBOOK_PAGE_ACCESS_TOKEN: '' }, { FACEBOOK_GRAPH_API_VERSION: '../invalid' }]) assert.equal(facebookGalleryConfig({ ...env, ...extra }), null);
  assert.equal(facebookGalleryConfig({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'refonte', META_ACCESS_TOKEN: config.token }), null);
});

test('Graph pagination is bounded and reconstructed; secrets stay in headers rather than URLs', async () => {
  const calls = [];
  const request = async (url, options) => {
    calls.push({ url: new URL(url), options });
    if (calls.length === 1) return identity();
    return response({ data: [post(String(calls.length), [attachment(String(calls.length))])], paging: { next: 'https://untrusted.example/never-follow?access_token=bad', cursors: { after: `cursor-${calls.length}` } } });
  };
  const media = await fetchFacebookGallery(config, request);
  assert.equal(calls.length, 4); // Identity + at most 3 batches.
  assert.equal(media.length, 3);
  for (const call of calls) {
    assert.equal(call.url.origin, 'https://graph.facebook.com');
    assert.ok(!call.url.href.includes(config.token));
    assert.equal(call.options.headers.Authorization, `Bearer ${config.token}`);
    assert.equal(call.options.redirect, 'error');
  }
  assert.equal(calls[2].url.searchParams.get('after'), 'cursor-2');
});

test('wrong page identity, expired access, deleted content and network failure hide the gallery', async () => {
  let calls = 0;
  assert.deepEqual(await fetchFacebookGallery(config, async () => { calls++; return response({ id: '999', link: 'https://www.facebook.com/someone-else' }); }), []);
  assert.equal(calls, 1);
  assert.deepEqual(await fetchFacebookGallery(config, async () => new Response('', { status: 403 })), []);
  assert.deepEqual(await fetchFacebookGallery(config, async () => { throw new Error('network'); }), []);
  let step = 0;
  assert.deepEqual(await fetchFacebookGallery(config, async () => ++step === 1 ? identity() : response({ data: [] })), []);
});

test('a repeated cursor terminates pagination instead of looping indefinitely', async () => {
  let calls = 0;
  await fetchFacebookGallery(config, async () => ++calls === 1 ? identity() : response({ data: [], paging: { next: 'ignored', cursors: { after: 'same' } } }));
  assert.equal(calls, 3);
});

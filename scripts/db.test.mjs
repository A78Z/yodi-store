import { test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

test('database connections are shared and can retry after a failure', async () => {
  const originalConnect = mongoose.connect;
  const originalCache = global.mongoose;
  delete global.mongoose;
  let calls = 0;
  mongoose.connect = async () => {
    calls += 1;
    if (calls === 1) throw new Error('Simulated connection failure');
    return mongoose;
  };
  try {
    const { connectDB } = await import('../lib/db.ts');
    const failed = await Promise.allSettled([connectDB(), connectDB()]);
    assert(failed.every(result => result.status === 'rejected'));
    assert.equal(calls, 1);
    assert.equal(await connectDB(), 'Connected to database with success');
    assert.equal(await connectDB(), 'Already connected to database');
    assert.equal(calls, 2);
  } finally {
    mongoose.connect = originalConnect;
    if (originalCache === undefined) delete global.mongoose;
    else global.mongoose = originalCache;
  }
});

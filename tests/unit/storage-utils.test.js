import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBytes } from '../../src/utils/storageUtils.js';

test('formatBytes returns zero bytes for 0 input', () => {
  assert.equal(formatBytes(0), '0 Bytes');
  assert.equal(formatBytes(-10), '0 Bytes');
  assert.equal(formatBytes(NaN), '0 Bytes');
  assert.equal(formatBytes(null), '0 Bytes');
  assert.equal(formatBytes(undefined), '0 Bytes');
});

test('formatBytes converts bytes to KB/MB correctly', () => {
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024), '1 MB');
  assert.equal(formatBytes(1024 * 1024 * 1024), '1 GB');
  assert.equal(formatBytes(1536), '1.5 KB');
});

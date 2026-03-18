import test from 'node:test';
import assert from 'node:assert/strict';
import { isShortcutMatch } from '../../src/utils/shortcutUtils.js';

const event = ({ key, ctrlKey = false, metaKey = false, shiftKey = false, altKey = false }) => ({
  key,
  ctrlKey,
  metaKey,
  shiftKey,
  altKey,
});

test('matches simple key shortcut', () => {
  assert.equal(isShortcutMatch(event({ key: 'p' }), 'p'), true);
  assert.equal(isShortcutMatch(event({ key: 'p' }), 'o'), false);
});

test('matches mod and modifier shortcuts', () => {
  assert.equal(isShortcutMatch(event({ key: 'z', ctrlKey: true }), 'mod+z'), true);
  assert.equal(isShortcutMatch(event({ key: 'z', metaKey: true }), 'mod+z'), true);
  assert.equal(isShortcutMatch(event({ key: 'z', ctrlKey: true, shiftKey: true }), 'mod+shift+z'), true);
  assert.equal(isShortcutMatch(event({ key: 'z', ctrlKey: true }), 'mod+shift+z'), false);
});

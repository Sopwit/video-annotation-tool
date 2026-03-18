export const normalizeShortcut = (shortcut) => (shortcut || '').toLowerCase().trim();

export const isShortcutMatch = (event, shortcut) => {
  const normalized = normalizeShortcut(shortcut);
  if (!normalized) return false;

  const parts = normalized.split('+').map((p) => p.trim()).filter(Boolean);
  const key = parts[parts.length - 1];
  const modifiers = new Set(parts.slice(0, -1));

  const expectsMod = modifiers.has('mod');
  const expectsCtrl = modifiers.has('ctrl');
  const expectsMeta = modifiers.has('meta');
  const expectsShift = modifiers.has('shift');
  const expectsAlt = modifiers.has('alt');

  const hasMod = event.ctrlKey || event.metaKey;
  const hasCtrl = event.ctrlKey;
  const hasMeta = event.metaKey;
  const hasShift = event.shiftKey;
  const hasAlt = event.altKey;

  if (expectsMod !== hasMod) return false;
  if (!expectsMod && expectsCtrl !== hasCtrl) return false;
  if (!expectsMod && expectsMeta !== hasMeta) return false;
  if (expectsCtrl && !hasCtrl) return false;
  if (expectsMeta && !hasMeta) return false;
  if (expectsShift !== hasShift) return false;
  if (expectsAlt !== hasAlt) return false;

  const eventKey = event.key.toLowerCase();
  return eventKey === key;
};

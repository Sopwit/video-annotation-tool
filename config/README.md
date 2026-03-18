# Config Directory

This directory stores static default configuration files used by the app.

## Files

- `default-settings.json`: canonical baseline settings used for first-run/default resets.

## Maintenance Rules

- Keep `default-settings.json` aligned with the defaults in `src/store/useStore.js`.
- Prefer additive changes (new keys) to avoid breaking existing persisted settings.
- Any breaking setting changes should be documented in `CHANGELOG.md`.

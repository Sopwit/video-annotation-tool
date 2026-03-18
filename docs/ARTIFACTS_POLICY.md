# Artifacts and Vendor Directories Policy

This project contains generated and vendor-managed directories that should not be edited manually.

## `dist/`

- Purpose: generated production output from Vite (`npm run build`).
- Policy:
  - Do not manually edit files under `dist/`.
  - Rebuild instead of patching output files.
  - Treat this directory as disposable build artifact.

## `node_modules/`

- Purpose: dependency installation managed by npm.
- Policy:
  - Do not commit or manually edit package contents.
  - Changes must come from `package.json` / `package-lock.json` updates.
  - Reinstall with `npm ci` when consistency is needed.

## Recommended Maintenance Commands

```bash
# clean generated outputs
bash scripts/clean.sh

# reinstall dependencies exactly from lockfile
npm ci

# regenerate production bundle
npm run build
```

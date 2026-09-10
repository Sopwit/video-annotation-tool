# Native deployment

Releases are built on the target operating system and CPU architecture. The
release workflow does not cross-compile application packages.

| Operating system | Architecture | GitHub runner | Installable artifacts |
| --- | --- | --- | --- |
| Linux | x86-64 | `ubuntu-24.04` | AppImage, DEB, RPM |
| Linux | ARM64 | `ubuntu-24.04-arm` | AppImage, DEB, RPM |
| Windows | x86-64 | `windows-2025` | NSIS installer |
| Windows | ARM64 | `windows-11-arm` | NSIS installer |
| macOS | x86-64 | `macos-15-intel` | DMG, ZIP |
| macOS | Apple Silicon | `macos-15` | DMG, ZIP |

Every matrix job runs lint, unit tests, the Vite production build, native
packaging, package integrity checks, and an application startup smoke test.
The publish job runs only after all six jobs pass and attaches
`SHA256SUMS.txt` to the GitHub release.

## Release

1. Update the version and changelog.
2. Push a `v*` tag, or run the Release workflow manually with the matching tag.
3. Confirm all six `build-and-package` jobs pass.
4. Verify downloaded files with `SHA256SUMS.txt` before installation.

Windows installers always create Start Menu and Desktop shortcuts. The native
application icon is embedded in the executable and used by both shortcuts.

Code-signing and macOS notarization credentials must only be supplied through
GitHub Actions secrets. Unsigned local builds are intended for development and
smoke testing, not public distribution.

# Release Procedure

This document describes the release procedure for Snack Time Chrome extension.

## Versioning Format

We use Calendar Versioning (CalVer) with the format: **vYYYY.MM.VER**

- **YYYY**: 4-digit year
- **MM**: 2-digit month (zero-padded)
- **VER**: Incremental number for releases within the same month

### Examples

- `v2025.01.1` - First release in January 2025
- `v2025.01.2` - Second release in January 2025
- `v2025.02.1` - First release in February 2025

## Release Steps

### 1. Update CHANGELOG.md

Update the CHANGELOG.md file with the changes for the new release:

1. Move items from `[Unreleased]` section to the new version section
2. Add the version number and release date
3. Categorize changes using Keep a Changelog format:
   - **Added** for new features
   - **Changed** for changes in existing functionality
   - **Deprecated** for soon-to-be removed features
   - **Removed** for now removed features
   - **Fixed** for bug fixes
   - **Security** for vulnerability fixes

Example:
```markdown
## [2025.01.1] - 2025-01-15

### Added
- New timer sound options

### Fixed
- Timer display issue on certain websites
```

### 2. Update package.json version

Update the version field in `package.json` to the new CalVer format.

```json
{
  "version": "2025.01.1"
}
```

※ Notice: The version in `package.json` must match the git tag (without the 'v' prefix).

### 3. Commit version update

Have the user run the following command (required for GPG signing):

```bash
git add package.json CHANGELOG.md && git commit -m "chore: bump version to 2025.01.1"
```

### 4. Create and push tag

The tag should have a `v` prefix.

```bash
git push origin main
git tag v2025.01.1 -m ''
git push origin v2025.01.1
```

### 5. Wait for GitHub Actions

The GitHub Actions workflow will automatically:

- Build the extension
- Create a zip file
- Create a GitHub release with the zip attached

Monitor the build progress at the [Actions tab](../../actions).

### 6. Download extension from GitHub Releases

Once the build completes, download `snack-time-vYYYY.MM.VER.zip` from the created release.

### 7. Upload to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. Find the Snack Time extension
3. Upload the new zip file
4. Submit for review

## Important Notes

- The version in `package.json` must match the git tag (without the 'v' prefix)
- The GitHub Actions workflow triggers on tags matching the `v*` pattern
- Chrome Web Store upload remains a manual step
- Always test the extension locally before creating a release

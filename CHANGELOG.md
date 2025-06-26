# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2025.06.3] - 2025-06-27

### Changed

- Updated Tailwind CSS configuration for v4 compatibility
- Renamed Content component to Timer for better clarity
- Replaced hardcoded colors with theme variables throughout the codebase
- Updated theme icons for better visual consistency
- Updated Tailwind CSS monorepo to v4.1.11
- Updated dependencies:
  - @types/node to v22.15.33
  - prettier to v3.6.1

### Fixed

- Added color variable overrides for Shadow DOM compatibility
- Removed onShowSettings prop from TimerCardPreview component

### Removed

- Redundant TimerSettings component and its stories
- Rounded corners from timer cards for cleaner design
- Unnecessary styling from content root element
- RGB comments from CSS variables for cleaner code

## [2025.06.2] - 2025-06-26

### Added

- Timer card preview to options page with live updates
- Theme settings with real-time preview functionality
- Timer position settings configuration
- New reusable RadioCard component
- E2E tests for theme application and RadioCard component

### Changed

- Completely redesigned options page with modern UI and improved UX
- Migrated from PostCSS to Vite plugin for Tailwind CSS configuration
- Renamed button variant from 'outline-solid' to 'outline' for consistency
- Refactored E2E test structure for better stability
- Updated dependencies:
  - Vite to v7
  - Prettier to v3.6.1
  - Node.js to v22.17.0
  - @types/node to v22.15.33

### Fixed

- Updated E2E tests to work with new RadioCard component structure

## [2025.06.1] - 2025-06-24

### Added

- Release procedure documentation with GPG signing requirements
- Support for CalVer (Calendar Versioning) format: vYYYY.MM.VER

### Changed

- Upgraded to Tailwind CSS v4 with improved Shadow DOM support
- Updated various dependencies:
  - React to v19
  - Node.js to v22
  - Vite to v6
  - TypeScript to v5.8.3
  - Vitest to v3.2.4
  - pnpm to v10
  - Multiple UI and development dependencies
- Synchronized pnpm version across GitHub Actions workflows

### Fixed

- Added missing light theme CSS variables for Shadow DOM
- Updated react, radix-ui-primitives, and tailwind-merge dependencies

### Security

- Updated vite to v5.4.19 to address security vulnerabilities

## [2.5.10] - 2025-04-09

### Changed

- Enhanced Shadow DOM isolation for better compatibility with host pages
- Optimized timer styling for better integration

### Fixed

- Improved event handling to prevent interference with host page

## [2.5.9] - 2025-01-28

### Changed

- Renamed Chrome extension title and description

## [2.5.8] - 2025-01-27

### Changed

- Improved settings handling implementation

## [2.5.7] - 2025-01-27

### Fixed

- Corrected test case for History class

## [2.5.6] - 2025-01-27

### Changed

- Improved Settings model robustness

## [2.5.5] - 2025-01-27

### Changed

- Improved timer accuracy and component structure

## [2.5.4] - 2025-01-25

### Changed

- Unified component file naming convention
- Reorganized popup directory structure
- Translated test descriptions to English

### Fixed

- Resolved build errors by improving Chrome API mocks

### Added

- Tests for timer service and target time functionality

## [2.5.3] - 2025-01-25

### Fixed

- Updated moduleResolution to bundler in tsconfig.json

## [2.5.2] - 2025-01-24

### Added

- Custom timer functionality with improved Duration class

## [2.5.1] - 2025-01-24

### Added

- Tests for Duration class

## [2.5.0] - 2025-01-24

### Added

- End time based timer setting functionality (#1)

## [2.4.2] - 2025-01-20

### Fixed

- Set default alarm sound when not configured

## [2.4.1] - 2025-01-17

### Fixed

- Swapped Piano and Simple sound file names

## [2.4.0] - 2025-01-17

### Added

- Volume control for alarm sound

## [2.3.0] - 2025-01-17

### Added

- Fullscreen mode for timer display

## [2.2.0] - 2025-01-17

### Added

- Alarm sound selection in settings
- Development and production guide to README

### Changed

- Timer notification from beep to WAV file format

### Fixed

- Stop sound playback when timer is closed

## [2.1.1] - 2025-01-17

### Added

- Mint and rose color schemes to theme options

## [2.1.0] - 2025-01-17 [YANKED]

### Added

- Extended color scheme options with additional theme choices

## [2.0.0] - 2025-01-16

### Added

- Configurable build output directory via OUTPUT_DIR environment variable
- shadcn/ui component library integration

### Changed

- **BREAKING**: Migrated UI framework from Material-UI (MUI) to shadcn/ui
- Replaced MUI icons with Lucide React icons
- Updated Node.js version requirement
- Improved timer UI layout and sizing
- Removed animation packages and MUI theme providers

### Removed

- Material-UI (MUI) and all related packages
- Unused Tailwind plugin configuration
- Unused animation packages

## [1.4.0] - 2024-11-29 [YANKED]

### Added

- Light/Dark mode theme switching support

### Changed

- Migrated from npm to pnpm package manager
- Updated GitHub Actions workflows for pnpm integration
- Updated README installation instructions

## [1.3.3] - 2024-10-30

### Fixed

- Reverted removal of scripting permission as it was still required for functionality

## [1.3.2] - 2024-10-30

### Security

- Removed unnecessary scripting permission from manifest for improved security

## [1.3.1] - 2024-10-30

### Changed

- Timer now automatically starts after creation for improved user experience

## [1.3.0] - 2024-10-30

### Changed

- Implemented Shadow DOM for timer display to prevent style conflicts with host pages
- Improved timer cleanup: properly clear intervals when timer is closed

## [1.2.4] - 2024-10-28

### Added

- Timer position setting in options page (UI placeholder)

## [1.2.3] - 2024-10-28

### Added

- Option to toggle alarm sound on/off in settings

### Changed

- Refactored alarm sound playback logic
- Refactored DOM creation for better maintainability
- Split Timerboard component from Popup.tsx for better code organization
- General refactoring of Popup component
- Cleaned up unused imports

## [1.2.2] - 2024-10-25

### Fixed

- Reduced UI flicker for smoother user experience

## [1.2.1] - 2024-10-25

### Changed

- Refactored code architecture: organized Value Objects and Models for Timer domain

## [1.2.0] - 2024-10-25

### Added

- Material-UI (MUI) components for improved UI design
- Options page (initial implementation)
- Recently used timers feature
- Header in popup interface
- Prettier for code formatting

### Changed

- Migrated to CRXJS for better Chrome Extension development experience
- Popup now automatically closes after starting timer
- Improved custom time input behavior (no timer start on cancel)
- Format recently used timers for better readability

### Fixed

- Removed duplicate timer-grid elements issue

## [1.1.1] - 2024-10-24

### Changed

- Removed H1 title from popup interface for cleaner UI

## [1.1.0] - 2024-10-24

### Added

- Alarm sound notification when timer completes

### Changed

- Updated dependencies
- Code cleanup and removed corrupted comments

## [1.0.0] - 2024-10-24

### Added

- Initial release of SnackTime Chrome Extension
- Basic timer functionality with start, pause, and reset
- Timer display injected into web pages
- Simple popup interface for timer control
- Alarm notification when timer completes
- Chrome Extension Manifest V3 support

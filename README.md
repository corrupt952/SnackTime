# Snack Time

The repository for chrome extension to remind you to take a break and have a snack.

## Installation

Install this extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/snack-time/okaijbdacnkekgchlligfkjccijcghfn).

## Development

### Prerequisites

- [asdf](https://asdf-vm.com/) or a compatible tool that reads `.tool-versions`

### Setup

1. Install Node.js

    ```bash
    asdf install
    ```

1. Enable Corepack so the pinned pnpm is used

    ```bash
    corepack enable
    ```

1. Install dependencies

    ```bash
    pnpm install
    ```

### Debugging

This extension is built with [WXT](https://wxt.dev/). Running `pnpm dev` starts a
development build that rebuilds on change and writes to `.output/chrome-mv3`.

1. Run the development server

    ```bash
    pnpm dev
    ```

1. Load `.output/chrome-mv3` as an unpacked extension from [chrome://extensions](chrome://extensions/)

> When modifying `Content.tsx` (Timer component), hot reload may not work properly. In this case, you need to restart the extension:
>
> 1. Go to `chrome://extensions`
> 2. Find "Snack Time" extension
> 3. Click the reload button (↻) or toggle the extension off and on
>
> This is a known limitation of Chrome Extension's content scripts.

### Checks

These are the same commands CI runs.

- Type check: `pnpm compile`
- Unit tests: `pnpm test`
- E2E tests: `pnpm test:e2e` (builds first via `pretest:e2e`)
- Build: `pnpm build`
- Storybook: `pnpm build-storybook` (`pnpm storybook` to run it)

## Production

See [.claude/commands/release.md](.claude/commands/release.md) for release procedures.

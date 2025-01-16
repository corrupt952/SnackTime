# Snack Time

The repository for chrome extension to remind you to take a break and have a snack.

## Installation

Install this extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/snack-time/okaijbdacnkekgchlligfkjccijcghfn).

## Development

### Prerequisites

- [asdf](https://asdf-vm.com/) or compatible .tool-versions file

### Setup

1. Install Node.js

    ```bash
    asdf install
    ```

1. Install pnpm

    ```bash
    npm install -g pnpm
    ```

### Debugging

This extension is developed using CRXJS.
So, if you run `pnpm dev` and load the output directory as an extension, the file will be updated in real time.
`OUTPUT_DIR` is the directory where the output will be placed.

> When modifying `Content.tsx` (Timer component), hot reload may not work properly. In this case, you need to restart the extension:
>
> 1. Go to `chrome://extensions`
> 2. Find "Snack Time" extension
> 3. Click the reload button (↻) or toggle the extension off and on
>
> This is a known limitation of Chrome Extension's content scripts.


1. Install dependencies

    ```bash
    pnpm install
    ```

1. Run the development server

    ```bash
    OUTPUT_DIR=~/Documents/snack-time pnpm dev
    ```

1. Load the [extension](chrome://extensions/) from the output directory

## Production

1. Tagging the version

    ```bash
    git tag vX.Y.Z
    ```

1. Push the tag

    ```bash
    git push origin vX.Y.Z
    ```

1. Waiting for the build to complete
1. Download the extension from GitHub Releases
1. Upload the extension to the Chrome Web Store

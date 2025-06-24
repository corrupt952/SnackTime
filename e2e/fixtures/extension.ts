import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // Get extension ID from a loaded extension page instead of service worker
    const page = await context.newPage();
    await page.goto('chrome://extensions/');
    await page.click('cr-toggle#devMode');
    
    // Find the extension card and get its ID
    const extensionCard = await page.locator('extensions-item').first();
    const extensionId = await extensionCard.getAttribute('id');
    
    await page.close();
    await use(extensionId);
  },
});

export const expect = test.expect;
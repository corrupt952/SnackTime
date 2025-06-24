import { test, expect } from './fixtures/extension';

test('extension should be loaded', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await expect(page).toHaveTitle(/Popup/);
});

test('timer should inject into web page', async ({ page, context, extensionId }) => {
  // 1. Open target page where timer will be displayed
  const targetPage = await context.newPage();
  await targetPage.goto('https://example.com');
  
  // 2. Use Chrome DevTools Protocol to ensure target page is active tab
  // This is necessary because chrome.tabs.query in popup looks for active tab
  const client = await targetPage.context().newCDPSession(targetPage);
  await client.send('Page.bringToFront');
  
  // 3. Open popup in new tab (simulating extension popup)
  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);
  
  // 4. Activate target page again before clicking timer button
  // This ensures the popup sends message to the correct tab
  await client.send('Page.bringToFront');
  
  // 5. Click 5 minute timer button in popup
  await popupPage.locator('button:has-text("5:00")').click();
  
  // 6. Verify timer appears on target page
  await expect(targetPage.locator('#snack-time-root')).toBeVisible();
});
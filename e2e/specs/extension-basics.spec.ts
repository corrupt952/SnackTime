import { test, expect } from "../fixtures/extension";
import { PopupPage } from "../page-objects/popup.page";
import { ContentTimerPage } from "../page-objects/content-timer.page";

test("extension should be loaded", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await expect(page).toHaveTitle(/Popup/);
});

test("timer should inject into web page", async ({ page, context, extensionId }) => {
  // 1. Open target page where timer will be displayed
  const targetPage = await context.newPage();
  await targetPage.goto("https://example.com");
  
  const contentPage = new ContentTimerPage(targetPage);
  await contentPage.bringToFront();

  // 2. Open popup in new tab (simulating extension popup)
  const popupPageHandle = await context.newPage();
  const popupPage = new PopupPage(popupPageHandle, extensionId);
  await popupPage.open();

  // 3. Activate target page again before clicking timer button
  await contentPage.bringToFront();

  // 4. Click 15 minute timer button in popup (5:00)
  await popupPage.clickPresetButton("15");

  // 5. Verify timer appears on target page
  await contentPage.verifyTimerVisible();
});
import { test, expect } from "../fixtures/extension";
import { PopupPage } from "../page-objects/popup.page";
import { ContentTimerPage } from "../page-objects/content-timer.page";

// Run timer history tests in serial mode to avoid conflicts
test.describe("Timer History", () => {
  test("should start with empty history", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    // Verify history is initially empty
    await popupPage.verifyHistoryEmpty();

    await popupPage.close();
  });

  test("should add timer to history after starting", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    // Start a 5-minute timer
    await contentPage.bringToFront();
    await popupPage.clickPresetButton("5");

    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    // Close and reopen popup to see history
    await popupPage.close();

    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    // Verify history has 1 item
    await popupPage2.verifyHistoryCount(1);
    const historyText = await popupPage2.getHistoryItemText(0);
    expect(historyText).toContain("1:00");

    await popupPage2.close();
  });

  test("should start timer from history", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    // First, create a history by starting a timer
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await contentPage.bringToFront();
    await popupPage.clickPresetButton("10"); // 3:00

    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();
    await popupPage.close();

    // Navigate to a new page
    await page.goto("https://www.google.com");
    await contentPage.bringToFront();

    // Open popup and start timer from history
    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    await popupPage2.verifyHistoryCount(1);

    await contentPage.bringToFront();
    await popupPage2.clickHistoryItem(0);

    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    await popupPage2.close();
  });

  test("should maintain history order (most recent first)", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    // Start multiple timers with different durations
    const durations = ["5", "10", "15"] as const; // 1:00, 3:00, 5:00

    for (const duration of durations) {
      const popupPageHandle = await context.newPage();
      const popupPage = new PopupPage(popupPageHandle, extensionId);
      await popupPage.open();

      await contentPage.bringToFront();
      await popupPage.clickPresetButton(duration);

      await contentPage.waitForTimer();
      await popupPage.close();

      // Wait a bit between timers
      await page.waitForTimeout(1000);
    }

    // Open popup and check history order
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await popupPage.verifyHistoryCount(3);

    // Most recent (5:00) should be first
    const firstItem = await popupPage.getHistoryItemText(0);
    expect(firstItem).toContain("5:00");

    const secondItem = await popupPage.getHistoryItemText(1);
    expect(secondItem).toContain("3:00");

    const thirdItem = await popupPage.getHistoryItemText(2);
    expect(thirdItem).toContain("1:00");

    await popupPage.close();
  });

  test("should remove duplicates and move to top", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    // Start 3 different timers
    const durations = ["5", "10", "15"] as const;

    for (const duration of durations) {
      const popupPageHandle = await context.newPage();
      const popupPage = new PopupPage(popupPageHandle, extensionId);
      await popupPage.open();

      await contentPage.bringToFront();
      await popupPage.clickPresetButton(duration);

      await contentPage.waitForTimer();
      await popupPage.close();
      await page.waitForTimeout(500);
    }

    // Start the first timer again (5 minutes / 1:00)
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await contentPage.bringToFront();
    await popupPage.clickPresetButton("5");

    await contentPage.waitForTimer();
    await popupPage.close();

    // Check history
    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    // Should still have 3 items (no duplicates)
    await popupPage2.verifyHistoryCount(3);

    // 1:00 should now be first
    const firstItem = await popupPage2.getHistoryItemText(0);
    expect(firstItem).toContain("1:00");

    // Others should follow
    const secondItem = await popupPage2.getHistoryItemText(1);
    expect(secondItem).toContain("5:00");

    const thirdItem = await popupPage2.getHistoryItemText(2);
    expect(thirdItem).toContain("3:00");

    await popupPage2.close();
  });

  test("should persist history across browser sessions", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    // Start a timer to create history
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await contentPage.bringToFront();
    await popupPage.clickPresetButton("25"); // 10:00

    await contentPage.waitForTimer();
    await popupPage.close();

    // Wait a bit to ensure history is saved
    await page.waitForTimeout(1000);

    // Open popup in a new context to simulate new session
    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    // History should still be there
    const count = await popupPage2.getHistoryCount();
    expect(count).toBeGreaterThan(0);

    // Check if our timer is in history
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await popupPage2.getHistoryItemText(i);
      if (text.includes("10:00")) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);

    await popupPage2.close();
  });
});

import { test, expect } from "../fixtures/extension";
import { PopupPage } from "../page-objects/popup.page";
import { ContentTimerPage } from "../page-objects/content-timer.page";

test.describe("Multi-tab Timer Independence", () => {
  test("should run independent timers in different tabs", async ({ extensionId, context }) => {
    // Create two tabs with different URLs
    const page1 = await context.newPage();
    await page1.goto("https://example.com");
    const contentPage1 = new ContentTimerPage(page1);

    const page2 = await context.newPage();
    await page2.goto("https://www.google.com");
    const contentPage2 = new ContentTimerPage(page2);

    // Set timer on first tab
    await contentPage1.bringToFront();
    
    const popupPageHandle1 = await context.newPage();
    const popupPage1 = new PopupPage(popupPageHandle1, extensionId);
    await popupPage1.open();

    await contentPage1.bringToFront();
    await popupPage1.clickPresetButton("5"); // 1:00
    
    await contentPage1.waitForTimer();
    await contentPage1.verifyTimerVisible();
    
    await popupPage1.close();

    // Set timer on second tab
    await contentPage2.bringToFront();
    
    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    await contentPage2.bringToFront();
    await popupPage2.clickPresetButton("10"); // 3:00
    
    await contentPage2.waitForTimer();
    await contentPage2.verifyTimerVisible();

    // Verify both timers are still visible
    await page1.bringToFront();
    await contentPage1.verifyTimerVisible();

    await page2.bringToFront();
    await contentPage2.verifyTimerVisible();

    await popupPage2.close();
  });

  test("should maintain timer when switching tabs", async ({ extensionId, context }) => {
    const page = await context.newPage();
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);

    await contentPage.bringToFront();

    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await contentPage.bringToFront();
    await popupPage.clickPresetButton("5"); // 1:00

    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    await popupPage.close();

    // Create and switch to another tab
    const page2 = await context.newPage();
    await page2.goto("https://www.google.com");
    await page2.bringToFront();

    // Switch back to original tab and verify timer is still there
    await page.bringToFront();
    await contentPage.verifyTimerVisible();
  });
});
import { test, expect } from "../fixtures/extension";
import { PopupPage } from "../page-objects/popup.page";
import { ContentTimerPage } from "../page-objects/content-timer.page";

test.describe("Popup - Preset Buttons (Page Object Pattern)", () => {
  test("should show all preset buttons", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    
    await popupPage.open();
    await popupPage.verifyAllPresetButtonsVisible();
    await popupPage.close();
  });

  test("should inject timer with different presets", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await contentPage.bringToFront();
    await popupPage.clickPresetButton("5");
    
    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    await popupPage.close();
    const popupPageHandle2 = await context.newPage();
    const popupPage2 = new PopupPage(popupPageHandle2, extensionId);
    await popupPage2.open();

    await contentPage.bringToFront();
    await popupPage2.clickPresetButton("10");
    await contentPage.verifyTimerVisible();

    await popupPage2.close();
    const popupPageHandle3 = await context.newPage();
    const popupPage3 = new PopupPage(popupPageHandle3, extensionId);
    await popupPage3.open();

    await contentPage.bringToFront();
    await popupPage3.clickPresetButton("15");
    await contentPage.verifyTimerVisible();

    await popupPage3.close();
    const popupPageHandle4 = await context.newPage();
    const popupPage4 = new PopupPage(popupPageHandle4, extensionId);
    await popupPage4.open();

    await contentPage.bringToFront();
    await popupPage4.clickPresetButton("25");
    await contentPage.verifyTimerVisible();

    await popupPage4.close();
  });
});

test.describe("Popup - Custom Time Features (Page Object Pattern)", () => {
  test("should open and close custom duration modal", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await expect(popupPage.customButton).toBeVisible();
    await popupPage.openCustomDurationModal();
    
    await popupPage.verifyModalVisible();
    await expect(popupPage.page.locator('text="Set custom duration"')).toBeVisible();
    await expect(popupPage.timeInput).toBeVisible();

    await popupPage.closeModal();
    await popupPage.verifyModalNotVisible();

    await popupPage.close();
  });

  test("should open and close end time modal", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await expect(popupPage.endTimeButton).toBeVisible();
    await popupPage.openEndTimeModal();
    
    await popupPage.verifyModalVisible();
    await expect(popupPage.page.locator('text="Set end time"').nth(1)).toBeVisible();
    await expect(popupPage.timeInput).toBeVisible();

    await popupPage.closeModal();
    await popupPage.verifyModalNotVisible();

    await popupPage.close();
  });

  test("should set custom duration", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await popupPage.openCustomDurationModal();
    await popupPage.fillTime("00:30");
    
    await contentPage.bringToFront();
    await popupPage.clickSetButton();
    
    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    await popupPage.close();
  });

  test("should set end time", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");
    
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();

    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await popupPage.openEndTimeModal();
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const endTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    await popupPage.fillTime(endTime);
    
    await contentPage.bringToFront();
    await popupPage.clickSetButton();
    
    await contentPage.waitForTimer();
    await contentPage.verifyTimerVisible();

    await popupPage.close();
  });
});
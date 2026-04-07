import { test, expect } from "../fixtures/extension";
import { PopupPage } from "../page-objects/popup.page";

test.describe("Popup - Header and Layout", () => {
  test("should display Snack Time title in header", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);

    await popupPage.open();

    await expect(popupPage.headerTitle).toBeVisible();
    await expect(popupPage.headerTitle).toHaveText("Snack Time");

    await popupPage.close();
  });

  test("should display coffee icon in header", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);

    await popupPage.open();

    await expect(popupPage.headerCoffeeIcon).toBeVisible();

    await popupPage.close();
  });

  test("should have 344px width constraint", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);

    await popupPage.open();

    await expect(popupPage.container).toBeVisible();
    const box = await popupPage.container.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(344);

    await popupPage.close();
  });
});

test.describe("Popup - Settings Navigation", () => {
  test("should open options page when settings gear icon is clicked", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);

    await popupPage.open();

    await expect(popupPage.settingsButton).toBeVisible();

    // Listen for new page (options page opens via chrome.runtime.openOptionsPage())
    const pagePromise = context.waitForEvent("page");
    await popupPage.settingsButton.click();
    const optionsPage = await pagePromise;

    await optionsPage.waitForLoadState("networkidle");
    expect(optionsPage.url()).toContain(`chrome-extension://${extensionId}/options.html`);

    await optionsPage.close();
    await popupPage.close();
  });
});

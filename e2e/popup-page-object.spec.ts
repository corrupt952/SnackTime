import { test } from "./fixtures/extension";
import { PopupPage } from "./page-objects/popup.page";

test.describe("Popup - Preset Buttons (Page Object Pattern)", () => {
  test("should show all preset buttons", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    
    await popupPage.open();
    await popupPage.verifyAllPresetButtonsVisible();
    await popupPage.close();
  });
});
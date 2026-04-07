import { test, expect } from "../fixtures/extension";
import { OptionsPage } from "../page-objects/options.page";

test.describe("Sound Settings - Preview Button", () => {
  test("should allow clicking preview button when alarm is selected", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    await expect(optionsPage.previewButton).toBeVisible();
    await expect(optionsPage.previewButton).toBeEnabled();

    // Click the preview button - should not throw an error
    await optionsPage.previewButton.click();

    // Button should remain enabled after clicking
    await expect(optionsPage.previewButton).toBeEnabled();
  });

  test("should allow previewing with each sound selection", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    const sounds = ["Simple", "Piano", "Vibraphone", "SteelDrums"];

    for (const sound of sounds) {
      await optionsPage.selectSound(sound);
      await optionsPage.verifySoundSelected(sound);

      // Preview button should remain enabled for each sound
      await expect(optionsPage.previewButton).toBeEnabled();

      // Click preview for each sound
      await optionsPage.previewButton.click();

      // Button should still be functional after clicking
      await expect(optionsPage.previewButton).toBeEnabled();
    }
  });
});

test.describe("Sound Settings - Persistence", () => {
  test("should persist sound and volume settings together after reload", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.scrollToSection("Notification");

    // Select alarm notification type
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    // Select a specific sound
    await optionsPage.selectSound("Vibraphone");
    await optionsPage.verifySoundSelected("Vibraphone");

    // Adjust volume to a specific level
    await optionsPage.adjustVolume(30, "right");
    const volumeTextBefore = await optionsPage.volumePercentage.textContent();

    // Reload and verify both settings persisted
    await optionsPage.reloadAndWaitForPage();

    await optionsPage.verifyNotificationTypeSelected("alarm");
    await optionsPage.verifySoundSelected("Vibraphone");

    const volumeTextAfter = await optionsPage.volumePercentage.textContent();
    expect(volumeTextAfter).toBe(volumeTextBefore);
  });

  test("should persist notification type None after reload and restore settings when switching back", async ({
    extensionId,
    page,
  }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.scrollToSection("Notification");

    // Set a specific sound and notification type
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.selectSound("SteelDrums");
    await optionsPage.verifySoundSelected("SteelDrums");

    // Switch to None
    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    // Reload
    await optionsPage.reloadAndWaitForPage();

    // Notification type should still be None
    await optionsPage.verifyNotificationTypeSelected("none");

    // Sound and volume should still be disabled
    await expect(optionsPage.previewButton).toBeDisabled();

    // Switch back to alarm - the previously selected sound should be preserved
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");
    await optionsPage.verifySoundSelected("SteelDrums");
  });
});

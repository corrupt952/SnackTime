import { test, expect } from "../fixtures/extension";
import { OptionsPage } from "../page-objects/options.page";

test.describe("Options Page - Page Header", () => {
  test("should display Snack Time title in page header", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.pageHeaderTitle).toBeVisible();
    await expect(optionsPage.pageHeaderTitle).toHaveText("Snack Time");
  });

  test("should display coffee icon in page header", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.pageHeaderIcon).toBeVisible();
  });
});

test.describe("Options Page - Sound Disabled When None", () => {
  test("should disable sound selection when notification type is None", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Ensure alarm is selected first so sound controls are enabled
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    // Verify sound container is interactive
    await expect(optionsPage.soundSettingsContainer).not.toHaveClass(/pointer-events-none/);

    // Switch to None
    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    // Sound settings container should have pointer-events-none and reduced opacity
    await expect(optionsPage.soundSettingsContainer).toHaveClass(/pointer-events-none/);
    await expect(optionsPage.soundSettingsContainer).toHaveClass(/opacity-50/);
  });

  test("should disable volume slider when notification type is None", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Ensure alarm is selected first
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    // Verify volume container is interactive
    await expect(optionsPage.volumeSettingsContainer).not.toHaveClass(/pointer-events-none/);

    // Switch to None
    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    // Volume settings container should have pointer-events-none and reduced opacity
    await expect(optionsPage.volumeSettingsContainer).toHaveClass(/pointer-events-none/);
    await expect(optionsPage.volumeSettingsContainer).toHaveClass(/opacity-50/);
  });

  test("should re-enable sound and volume when switching back to alarm", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Set to None first
    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    await expect(optionsPage.soundSettingsContainer).toHaveClass(/pointer-events-none/);
    await expect(optionsPage.volumeSettingsContainer).toHaveClass(/pointer-events-none/);

    // Switch back to alarm
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    // Both containers should be interactive again
    await expect(optionsPage.soundSettingsContainer).not.toHaveClass(/pointer-events-none/);
    await expect(optionsPage.volumeSettingsContainer).not.toHaveClass(/pointer-events-none/);
  });
});

test.describe("Options Page - Sidebar Scroll Verification", () => {
  test("should scroll each section into view when clicking sidebar links", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Navigate to About (bottom of page) first, so subsequent navigations require scrolling
    await optionsPage.navigateTo("About");
    await expect(optionsPage.getSectionHeader("About")).toBeInViewport();

    // Navigate back to General (top of page) - should scroll up
    await optionsPage.navigateTo("General");
    const generalHeader = optionsPage.getSectionHeader("General Settings");
    await expect(generalHeader).toBeInViewport();

    // The About section should no longer be in viewport after scrolling to General
    await expect(optionsPage.getSectionHeader("About")).not.toBeInViewport();

    // Navigate to Notification (middle of page)
    await optionsPage.navigateTo("Notification");
    await expect(optionsPage.getSectionHeader("Notification")).toBeInViewport();

    // Navigate to Appearance
    await optionsPage.navigateTo("Appearance");
    await expect(optionsPage.getSectionHeader("Appearance")).toBeInViewport();
  });
});

import { test, expect } from "./fixtures/extension";
import { OptionsPage } from "./page-objects/options.page";

test.describe("Options Page - Appearance (Page Object Pattern)", () => {
  test("should change theme", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.getSectionHeader("Appearance")).toBeVisible();

    const colorSchemes = ["system", "light", "dark", "lemon", "mint", "rose"];

    for (const scheme of colorSchemes) {
      await expect(optionsPage.getThemeLabel(scheme)).toBeVisible();
      await optionsPage.selectTheme(scheme);
      await optionsPage.verifyThemeSelected(scheme);

      await optionsPage.reloadAndWaitForPage();
      await optionsPage.verifyThemeSelected(scheme);
    }
  });

  test("should update timer card preview when changing themes", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.scrollToSection("Appearance");

    const previewText = page.locator('text="Timer Card Preview"');
    await expect(previewText).toBeVisible();

    const themes = ["light", "dark", "lemon", "mint", "rose"];

    for (const theme of themes) {
      await optionsPage.selectTheme(theme);
      await optionsPage.verifyThemeSelected(theme);
      await expect(optionsPage.previewContainer).toBeVisible();
    }
  });

  test("should toggle apply theme to settings", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.applyThemeLabel).toBeVisible();
    await optionsPage.verifyApplyThemeState("unchecked");

    await optionsPage.toggleApplyTheme();
    await optionsPage.verifyApplyThemeState("checked");

    await optionsPage.selectTheme("dark");
    await optionsPage.verifyThemeSelected("dark");
    await expect(optionsPage.htmlElement).toHaveClass(/dark/);

    await optionsPage.toggleApplyTheme();
    await optionsPage.verifyApplyThemeState("unchecked");
    await expect(optionsPage.htmlElement).not.toHaveClass(/dark/);

    await optionsPage.toggleApplyTheme();
    await optionsPage.verifyApplyThemeState("checked");
    await optionsPage.reloadAndWaitForPage();
    await optionsPage.verifyApplyThemeState("checked");
  });

  test("should apply each theme to settings page when toggle is on", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.toggleApplyTheme();
    await optionsPage.verifyApplyThemeState("checked");

    const themes = [
      { id: "light", expectedClass: "light" },
      { id: "dark", expectedClass: "dark" },
      { id: "lemon", expectedClass: "lemon" },
      { id: "mint", expectedClass: "mint" },
      { id: "rose", expectedClass: "rose" }
    ];

    for (const theme of themes) {
      await optionsPage.selectTheme(theme.id);
      await optionsPage.verifyThemeSelected(theme.id);
      await expect(optionsPage.htmlElement).toHaveClass(new RegExp(theme.expectedClass));
    }

    await optionsPage.selectTheme("system");
    await optionsPage.verifyThemeSelected("system");

    const isDarkMode = await page.evaluate(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDarkMode) {
      await expect(optionsPage.htmlElement).toHaveClass(/dark/);
    } else {
      await expect(optionsPage.htmlElement).toHaveClass(/light/);
    }
  });
});

test.describe("Options Page - Notification (Page Object Pattern)", () => {
  test("should change notification settings", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.getSectionHeader("Notification")).toBeVisible();

    await expect(optionsPage.getNotificationTypeLabel("alarm")).toBeVisible();
    await expect(optionsPage.getNotificationTypeLabel("none")).toBeVisible();

    await optionsPage.verifyNotificationTypeSelected("alarm");

    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");
    await expect(optionsPage.getNotificationTypeRadio("alarm")).not.toBeChecked();

    await optionsPage.reloadAndWaitForPage();
    await optionsPage.verifyNotificationTypeSelected("none");

    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");
  });

  test("should toggle sound settings", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.getSectionHeader("Notification")).toBeVisible();

    await expect(optionsPage.getSoundLabel("Simple")).toBeVisible();
    await expect(optionsPage.getSoundLabel("Piano")).toBeVisible();

    await optionsPage.verifySoundSelected("Simple");

    await optionsPage.selectSound("Piano");
    await optionsPage.verifySoundSelected("Piano");
    await expect(optionsPage.getSoundRadio("Simple")).not.toBeChecked();

    await optionsPage.reloadAndWaitForPage();
    await optionsPage.verifySoundSelected("Piano");

    await optionsPage.selectSound("Simple");
    await optionsPage.verifySoundSelected("Simple");
  });

  test("should support new alarm sounds", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    const newSounds = ["Vibraphone", "SteelDrums"];

    for (const sound of newSounds) {
      await expect(optionsPage.getSoundLabel(sound)).toBeVisible();
      await optionsPage.selectSound(sound);
      await optionsPage.verifySoundSelected(sound);

      await optionsPage.reloadAndWaitForPage();
      await optionsPage.verifySoundSelected(sound);
    }
  });

  test("should preview alarm sounds", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    await expect(optionsPage.previewButton).toBeVisible();
    await expect(optionsPage.previewButton).toBeEnabled();

    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    await expect(optionsPage.previewButton).toBeDisabled();
  });

  test("should control volume settings", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await optionsPage.scrollToSection("Notification");
    
    await optionsPage.selectNotificationType("alarm");
    await optionsPage.verifyNotificationTypeSelected("alarm");

    await expect(optionsPage.volumeControl).toBeVisible();
    await expect(optionsPage.volumeSlider).toBeVisible();

    await optionsPage.adjustVolume(40, "right");
    await expect(optionsPage.volumePercentage).toContainText(/4[5-9]|5[0-5]%/);

    await optionsPage.reloadAndWaitForPage();
    await expect(optionsPage.volumePercentage).toContainText(/4[5-9]|5[0-5]%/);

    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");
    await expect(optionsPage.volumeSlider).toHaveAttribute('data-disabled', '');
  });
});

test.describe("Options Page - General (Page Object Pattern)", () => {
  test("should change timer position settings", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    await expect(optionsPage.getSectionHeader("General Settings")).toBeVisible();

    const positions = ["top-right", "top-left", "bottom-right", "bottom-left", "center"];

    for (const position of positions) {
      await expect(optionsPage.getPositionButton(position)).toBeVisible();
      await optionsPage.selectPosition(position);
      await optionsPage.verifyPositionSelected(position);

      await optionsPage.reloadAndWaitForPage();
      await optionsPage.verifyPositionSelected(position);
    }
  });
});

test.describe("Options Page - Navigation (Page Object Pattern)", () => {
  test("should navigate with sidebar links", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const navLinks = [
      { text: "General", targetText: "General" },
      { text: "Appearance", targetText: "Appearance" },
      { text: "Notification", targetText: "Notification" }
    ];

    for (const link of navLinks) {
      await expect(optionsPage.getNavLink(link.text)).toBeVisible();
      await optionsPage.navigateTo(link.text as "General" | "Appearance" | "Notification");

      const targetSection = optionsPage.getSectionHeader(link.targetText);
      await expect(targetSection).toBeInViewport();
    }
  });
});
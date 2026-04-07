import { test, expect } from "../fixtures/extension";
import { OptionsPage } from "../page-objects/options.page";
import { PopupPage } from "../page-objects/popup.page";

test.describe("Settings Sync - Language", () => {
  test("should sync Japanese language from Options to Popup", async ({ extensionId, context }) => {
    // Open Options and change language to Japanese
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();

    await optionsPage.selectLanguage("ja");
    await optionsPage.verifyLanguageSelected("ja");

    // Verify Japanese text on Options page
    await expect(optionsPage.getSectionHeader("一般設定")).toBeVisible();
    await optionsPage.close();

    // Open Popup and verify Japanese text
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await expect(popupPage.presetsHeading).toHaveText("プリセット");
    await expect(popupPage.recentHeading).toHaveText("履歴");
    await expect(popupPage.endTimeButtonLocator).toContainText("終了時刻を設定");

    await popupPage.close();
  });

  test("should sync English language from Options to Popup", async ({ extensionId, context }) => {
    // First set Japanese so we can verify the switch back to English
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();

    await optionsPage.selectLanguage("ja");
    await optionsPage.verifyLanguageSelected("ja");
    await expect(optionsPage.getSectionHeader("一般設定")).toBeVisible();

    // Switch to English
    await optionsPage.selectLanguage("en");
    await optionsPage.verifyLanguageSelected("en");
    await expect(optionsPage.getSectionHeader("General Settings")).toBeVisible();
    await optionsPage.close();

    // Open Popup and verify English text
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await expect(popupPage.presetsHeading).toHaveText("Presets");
    await expect(popupPage.recentHeading).toHaveText("Recent");
    await expect(popupPage.endTimeButtonLocator).toContainText("Set end time");

    await popupPage.close();
  });
});

test.describe("Settings Sync - Preset Timers", () => {
  test("should sync preset timer changes from Options to Popup", async ({ extensionId, context }) => {
    // Open Options and apply Pomodoro template
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();

    await optionsPage.applyTemplate("Pomodoro");
    await optionsPage.waitForUpdate();

    // Verify the Pomodoro preset values in Options (25, 5, 15, 30)
    await optionsPage.verifyPresetValue(1, 25);
    await optionsPage.verifyPresetValue(2, 5);
    await optionsPage.verifyPresetValue(3, 15);
    await optionsPage.verifyPresetValue(4, 30);
    await optionsPage.close();

    // Open Popup and verify updated preset button labels
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    // Pomodoro presets: 25 min -> "25:00", 5 min -> "05:00", 15 min -> "15:00", 30 min -> "30:00"
    await expect(popupPage.getPresetButtonByLabel("25:00")).toBeVisible();
    await expect(popupPage.getPresetButtonByLabel("05:00")).toBeVisible();
    await expect(popupPage.getPresetButtonByLabel("15:00")).toBeVisible();
    await expect(popupPage.getPresetButtonByLabel("30:00")).toBeVisible();

    await popupPage.close();
  });
});

test.describe("Settings Sync - Theme", () => {
  test("should sync dark theme with applyThemeToSettings from Options to Popup", async ({ extensionId, context }) => {
    // Open Options and configure theme
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();

    // Select dark theme
    await optionsPage.selectTheme("dark");
    await optionsPage.verifyThemeSelected("dark");

    // Enable apply theme to settings
    await optionsPage.toggleApplyTheme();
    await optionsPage.verifyApplyThemeState("checked");

    // Verify Options page has dark class applied
    await expect(optionsPage.htmlElement).toHaveClass(/dark/);
    await optionsPage.close();

    // Open Popup and verify dark theme is applied
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    // The popup always applies the color scheme from settings
    await expect(popupPage.htmlElement).toHaveClass(/dark/);

    await popupPage.close();
  });
});

test.describe("Settings Persistence", () => {
  test("should persist multiple settings after closing and reopening Options", async ({ extensionId, context }) => {
    // Open Options and change multiple settings
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();

    // Change theme to mint
    await optionsPage.selectTheme("mint");
    await optionsPage.verifyThemeSelected("mint");

    // Change notification type to none
    await optionsPage.selectNotificationType("none");
    await optionsPage.verifyNotificationTypeSelected("none");

    // Apply Pomodoro preset template (before changing language so button text matches)
    await optionsPage.applyTemplate("Pomodoro");
    await optionsPage.waitForUpdate();
    await optionsPage.verifyPresetValue(1, 25);

    // Change timer position
    await optionsPage.selectPosition("bottom-left");
    await optionsPage.verifyPositionSelected("bottom-left");

    // Change language to Japanese (last, since it changes all UI text)
    await optionsPage.selectLanguage("ja");
    await optionsPage.verifyLanguageSelected("ja");

    // Close Options page
    await optionsPage.close();

    // Reopen Options page and verify all settings persisted
    const optionsPageHandle2 = await context.newPage();
    const optionsPage2 = new OptionsPage(optionsPageHandle2, extensionId);
    await optionsPage2.open();

    await optionsPage2.verifyLanguageSelected("ja");
    await optionsPage2.verifyThemeSelected("mint");
    await optionsPage2.verifyNotificationTypeSelected("none");
    await optionsPage2.verifyPresetValue(1, 25);
    await optionsPage2.verifyPresetValue(2, 5);
    await optionsPage2.verifyPresetValue(3, 15);
    await optionsPage2.verifyPresetValue(4, 30);
    await optionsPage2.verifyPositionSelected("bottom-left");

    await optionsPage2.close();
  });
});

test.describe("Settings Navigation", () => {
  test("should open options page from popup settings icon", async ({ extensionId, context }) => {
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    await expect(popupPage.settingsButton).toBeVisible();

    // Click the settings gear icon and wait for the new page to open
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      popupPage.settingsButton.click(),
    ]);

    await newPage.waitForLoadState("networkidle");
    expect(newPage.url()).toContain("options.html");

    await newPage.close();
    await popupPage.close();
  });
});

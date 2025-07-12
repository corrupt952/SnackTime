import { test, expect } from "../fixtures/extension";
import { OptionsPage } from "../page-objects/options.page";
import { PopupPage } from "../page-objects/popup.page";

test.describe("Options Page - Preset Timers", () => {
  test("should display preset timer settings in General section", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Navigate to General Settings section
    await expect(optionsPage.getSectionHeader("General Settings")).toBeVisible();

    // Check for preset timer heading
    const presetTimerHeading = page.locator('h3:text("Preset Timers")');
    await expect(presetTimerHeading).toBeVisible();

    // Check for 4 preset inputs
    for (let i = 1; i <= 4; i++) {
      await expect(optionsPage.getPresetLabel(i)).toBeVisible();
      await expect(optionsPage.getPresetInput(i)).toBeVisible();
    }
  });

  test("should have default preset values", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const defaultValues = [1, 3, 5, 10];
    
    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, defaultValues[i]);
    }
  });

  test("should update preset timer values and persist", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const newValues = [15, 25, 45, 60];

    // Update each preset input
    for (let i = 0; i < 4; i++) {
      await optionsPage.setPresetValue(i + 1, newValues[i]);
    }

    // Reload page to verify persistence
    await optionsPage.reloadAndWaitForPage();

    // Verify values persisted
    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, newValues[i]);
    }
  });

  test("should apply quick templates", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Test Pomodoro template
    await expect(optionsPage.getTemplateButton("Pomodoro")).toBeVisible();
    await optionsPage.applyTemplate("Pomodoro");

    // Verify Pomodoro values are applied
    const pomodoroValues = [25, 5, 15, 30];
    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, pomodoroValues[i]);
    }

    // Test Study template
    await optionsPage.applyTemplate("Study");

    // Verify Study values are applied
    const studyValues = [45, 10, 60, 90];
    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, studyValues[i]);
    }

    // Reload and verify persistence
    await optionsPage.reloadAndWaitForPage();

    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, studyValues[i]);
    }
  });

  test("should apply all quick templates correctly", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const templates = [
      { name: "Breaks", values: [1, 3, 5, 10] },
      { name: "Meditation", values: [2, 5, 10, 20] },
      { name: "Meetings", values: [15, 30, 45, 60] }
    ];

    for (const template of templates) {
      await expect(optionsPage.getTemplateButton(template.name)).toBeVisible();
      await optionsPage.applyTemplate(template.name);

      // Verify values are applied
      for (let i = 0; i < 4; i++) {
        await optionsPage.verifyPresetValue(i + 1, template.values[i]);
      }
    }
  });

  test("should reset to default values", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // First, apply a template to change values
    await optionsPage.applyTemplate("Pomodoro");

    // Verify values changed
    await optionsPage.verifyPresetValue(1, 25);

    // Click reset button
    await expect(optionsPage.resetButton).toBeVisible();
    await optionsPage.resetToDefaults();

    // Verify default values are restored
    const defaultValues = [1, 3, 5, 10];
    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, defaultValues[i]);
    }

    // Reload and verify persistence
    await optionsPage.reloadAndWaitForPage();

    for (let i = 0; i < 4; i++) {
      await optionsPage.verifyPresetValue(i + 1, defaultValues[i]);
    }
  });

  test("should validate input constraints", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const presetInput = optionsPage.getPresetInput(1);

    // Test negative values (should not be accepted)
    await presetInput.fill("-5");
    await presetInput.blur();
    // Value should remain as previous valid value
    const value = await presetInput.inputValue();
    expect(parseInt(value)).toBeGreaterThan(0);

    // Test very large values (max 999)
    await presetInput.fill("1000");
    await presetInput.blur();
    const largeValue = await presetInput.inputValue();
    expect(parseInt(largeValue)).toBeLessThanOrEqual(999);

    // Test valid values
    await presetInput.fill("30");
    await presetInput.blur();
    await expect(presetInput).toHaveValue("30");
  });

  test("should update popup preset buttons when values change", async ({ extensionId, page, context }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    const newValues = [2, 7, 12, 20];
    for (let i = 0; i < 4; i++) {
      await optionsPage.setPresetValue(i + 1, newValues[i]);
    }

    // Wait a bit for settings to save
    await optionsPage.waitForUpdate(1000);

    // Open popup in new page
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();

    // Check that preset buttons show new values
    const presetsSection = popupPageHandle.locator('text="Presets"').locator('..');
    const presetButtons = presetsSection.locator('button').filter({ hasText: /^\d+:\d+$/ });

    // Verify the preset buttons show the correct times
    const expectedTexts = ["2:00", "7:00", "12:00", "20:00"];
    for (let i = 0; i < 4; i++) {
      const button = presetButtons.nth(i);
      await expect(button).toContainText(expectedTexts[i]);
    }

    await popupPage.close();
  });

  test("should show selected template indicator for default values", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Default values match Breaks template
    await expect(optionsPage.getTemplateButton("Breaks")).toBeVisible();
    
    // Check for selected indicator (blue dot)
    await expect(optionsPage.getTemplateIndicator("Breaks")).toBeVisible();
    
    // Other templates should not have the indicator
    await expect(optionsPage.getTemplateIndicator("Pomodoro")).not.toBeVisible();
  });

  test("should show Custom as selected when values don't match any template", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Set custom values that don't match any template
    const customValues = [7, 14, 21, 28];
    for (let i = 0; i < 4; i++) {
      await optionsPage.setPresetValue(i + 1, customValues[i]);
    }

    // Wait for update
    await optionsPage.waitForUpdate();

    // Check Custom card has selected indicator
    await expect(optionsPage.customIndicator).toBeVisible();

    // All template buttons should not have indicator
    const templates = ["Breaks", "Pomodoro", "Study", "Meditation", "Meetings"];
    for (const templateName of templates) {
      await expect(optionsPage.getTemplateIndicator(templateName)).not.toBeVisible();
    }
  });

  test("should update selected indicator when switching templates", async ({ extensionId, page }) => {
    const optionsPage = new OptionsPage(page, extensionId);
    await optionsPage.open();

    // Initially Breaks should be selected
    await expect(optionsPage.getTemplateIndicator("Breaks")).toBeVisible();

    // Click Pomodoro template
    await optionsPage.applyTemplate("Pomodoro");
    
    // Wait for update
    await optionsPage.waitForUpdate();

    // Pomodoro should now have the indicator
    await expect(optionsPage.getTemplateIndicator("Pomodoro")).toBeVisible();

    // Breaks should not have the indicator anymore
    await expect(optionsPage.getTemplateIndicator("Breaks")).not.toBeVisible();

    // Verify Custom card is not selectable (cursor-not-allowed)
    await expect(optionsPage.customCard).toHaveClass(/cursor-not-allowed/);
  });
});
import { test, expect } from "./fixtures/extension";

test.describe("Options Page - Preset Timers", () => {
  test("should display preset timer settings in General section", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // Navigate to General Settings section
    await expect(page.locator('h2:text("General Settings")')).toBeVisible();

    // Check for preset timer heading
    const presetTimerHeading = page.locator('h3:text("Preset Timers")');
    await expect(presetTimerHeading).toBeVisible();

    // Check for 4 preset inputs
    for (let i = 1; i <= 4; i++) {
      const presetLabel = page.locator(`text="Preset ${i}"`);
      await expect(presetLabel).toBeVisible();
      const presetInput = page.locator(`input[type="number"]`).nth(i - 1);
      await expect(presetInput).toBeVisible();
    }
  });

  test("should have default preset values", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const defaultValues = [1, 3, 5, 10];
    
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await expect(presetInput).toHaveValue(defaultValues[i].toString());
    }
  });

  test("should update preset timer values and persist", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const newValues = [15, 25, 45, 60];

    // Update each preset input
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await presetInput.fill(newValues[i].toString());
    }

    // Reload page to verify persistence
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify values persisted
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await expect(presetInput).toHaveValue(newValues[i].toString());
    }
  });

  test("should apply quick templates", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // Test Pomodoro template
    const pomodoroButton = page.locator('button:has-text("Pomodoro")');
    await expect(pomodoroButton).toBeVisible();
    await pomodoroButton.click();

    // Verify Pomodoro values are applied
    const pomodoroValues = [25, 5, 15, 30];
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await expect(presetInput).toHaveValue(pomodoroValues[i].toString());
    }

    // Test Study template
    const studyButton = page.locator('button:has-text("Study")');
    await studyButton.click();

    // Verify Study values are applied
    const studyValues = [45, 10, 60, 90];
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await expect(presetInput).toHaveValue(studyValues[i].toString());
    }

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState("networkidle");

    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await expect(presetInput).toHaveValue(studyValues[i].toString());
    }
  });

  test("should apply all quick templates correctly", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const templates = [
      { name: "Breaks", values: [1, 3, 5, 10] },
      { name: "Meditation", values: [2, 5, 10, 20] },
      { name: "Meetings", values: [15, 30, 45, 60] }
    ];

    for (const template of templates) {
      const templateButton = page.locator(`button:has-text("${template.name}")`);
      await expect(templateButton).toBeVisible();
      await templateButton.click();

      // Verify values are applied
      for (let i = 0; i < 4; i++) {
        const presetInput = page.locator(`input[type="number"]`).nth(i);
        await expect(presetInput).toHaveValue(template.values[i].toString());
      }
    }
  });

  test("should reset to default values", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // First, apply a template to change values
    const pomodoroButton = page.locator('button:has-text("Pomodoro")');
    await pomodoroButton.click();

    // Verify values changed
    const presetInput = page.locator(`input[type="number"]`).first();
    await expect(presetInput).toHaveValue("25");

    // Click reset button
    const resetButton = page.locator('button:has-text("Reset to Defaults")');
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    // Verify default values are restored
    const defaultValues = [1, 3, 5, 10];
    for (let i = 0; i < 4; i++) {
      const input = page.locator(`input[type="number"]`).nth(i);
      await expect(input).toHaveValue(defaultValues[i].toString());
    }

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState("networkidle");

    for (let i = 0; i < 4; i++) {
      const input = page.locator(`input[type="number"]`).nth(i);
      await expect(input).toHaveValue(defaultValues[i].toString());
    }
  });

  test("should validate input constraints", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const presetInput = page.locator(`input[type="number"]`).first();

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
    // First, update preset values in options
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const newValues = [2, 7, 12, 20];
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await presetInput.fill(newValues[i].toString());
    }

    // Wait a bit for settings to save
    await page.waitForTimeout(1000);

    // Open popup in new page
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popupPage.waitForLoadState("networkidle");

    // Check that preset buttons show new values
    const presetsSection = popupPage.locator('text="Presets"').locator('..');
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
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // Default values match Breaks template
    const breaksButton = page.locator('button:has-text("Breaks")');
    await expect(breaksButton).toBeVisible();
    
    // Check for selected indicator (blue dot)
    const selectedIndicator = breaksButton.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
    await expect(selectedIndicator).toBeVisible();
    
    // Other templates should not have the indicator
    const pomodoroButton = page.locator('button:has-text("Pomodoro")');
    const pomodoroIndicator = pomodoroButton.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
    await expect(pomodoroIndicator).not.toBeVisible();
  });

  test("should show Custom as selected when values don't match any template", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // Set custom values that don't match any template
    const customValues = [7, 14, 21, 28];
    for (let i = 0; i < 4; i++) {
      const presetInput = page.locator(`input[type="number"]`).nth(i);
      await presetInput.fill(customValues[i].toString());
    }

    // Wait for update
    await page.waitForTimeout(500);

    // Check Custom card has selected indicator
    // Use more specific selector to target the Custom preset card
    const presetsSection = page.locator('h3:text("Quick Templates")').locator('..');
    const customCard = presetsSection.locator('div.relative.flex.rounded-lg').filter({ hasText: 'Custom' }).filter({ hasText: 'User defined' });
    const customIndicator = customCard.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
    await expect(customIndicator).toBeVisible();

    // All template buttons should not have indicator
    const templates = ["Breaks", "Pomodoro", "Study", "Meditation", "Meetings"];
    for (const templateName of templates) {
      const button = page.locator(`button:has-text("${templateName}")`);
      const indicator = button.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
      await expect(indicator).not.toBeVisible();
    }
  });

  test("should update selected indicator when switching templates", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    // Initially Breaks should be selected
    const breaksButton = page.locator('button:has-text("Breaks")');
    const breaksIndicator = breaksButton.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
    await expect(breaksIndicator).toBeVisible();

    // Click Pomodoro template
    const pomodoroButton = page.locator('button:has-text("Pomodoro")');
    await pomodoroButton.click();
    
    // Wait for update
    await page.waitForTimeout(500);

    // Pomodoro should now have the indicator
    const pomodoroIndicator = pomodoroButton.locator('.absolute.right-2.top-2.h-2.w-2.rounded-full.bg-primary');
    await expect(pomodoroIndicator).toBeVisible();

    // Breaks should not have the indicator anymore
    await expect(breaksIndicator).not.toBeVisible();

    // Verify Custom card is not selectable (cursor-not-allowed)
    const presetsSection = page.locator('h3:text("Quick Templates")').locator('..');
    const customCard = presetsSection.locator('div.relative.flex.rounded-lg').filter({ hasText: 'Custom' }).filter({ hasText: 'User defined' });
    await expect(customCard).toHaveClass(/cursor-not-allowed/);
  });
});
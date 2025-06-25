import { test, expect } from "./fixtures/extension";

test.describe("Options Page - Appearance", () => {
  test("should change theme", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:text("Appearance")')).toBeVisible();

    const colorSchemes = ["system", "light", "dark", "lemon", "mint", "rose"];

    for (const scheme of colorSchemes) {
      const themeRadio = page.locator(`#color-scheme-${scheme}`);
      const themeLabel = page.locator(`label[for="color-scheme-${scheme}"]`);
      await expect(themeLabel).toBeVisible();
      await themeLabel.click();
      await expect(themeRadio).toBeChecked();

      await page.reload();
      await page.waitForLoadState("networkidle");

      const themeRadioAfterReload = page.locator(`#color-scheme-${scheme}`);
      await expect(themeRadioAfterReload).toBeChecked();
    }
  });

  test("should update timer card preview when changing themes", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const appearanceSection = page.locator('h2:text("Appearance")');
    await appearanceSection.scrollIntoViewIfNeeded();

    const previewText = page.locator('text="Timer Card Preview"');
    await expect(previewText).toBeVisible();

    const themes = [
      { id: "light", expectedClass: "bg-white" },
      { id: "dark", expectedClass: "bg-gray-800" },
      { id: "lemon", expectedClass: "bg-yellow-50" },
      { id: "mint", expectedClass: "bg-green-50" },
      { id: "rose", expectedClass: "bg-rose-50" }
    ];

    for (const theme of themes) {
      const themeLabel = page.locator(`label[for="color-scheme-${theme.id}"]`);
      await themeLabel.click();
      await expect(page.locator(`#color-scheme-${theme.id}`)).toBeChecked();

      const previewContainer = page.locator('.relative.rounded-lg.overflow-hidden');
      await expect(previewContainer).toBeVisible();
    }
  });

  test("should toggle apply theme to settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const applyThemeToggle = page.locator('#apply-theme-to-settings');
    const applyThemeLabel = page.locator('label[for="apply-theme-to-settings"]');
    await expect(applyThemeLabel).toBeVisible();

    await expect(applyThemeToggle).toHaveAttribute("data-state", "unchecked");

    await applyThemeToggle.click();
    await expect(applyThemeToggle).toHaveAttribute("data-state", "checked");

    const darkLabel = page.locator('label[for="color-scheme-dark"]');
    await darkLabel.click();
    await expect(page.locator('#color-scheme-dark')).toBeChecked();

    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    await applyThemeToggle.click();
    await expect(applyThemeToggle).toHaveAttribute("data-state", "unchecked");

    await expect(htmlElement).not.toHaveClass(/dark/);

    await applyThemeToggle.click();
    await expect(applyThemeToggle).toHaveAttribute("data-state", "checked");
    await page.reload();
    await page.waitForLoadState("networkidle");

    const applyThemeToggleAfterReload = page.locator('#apply-theme-to-settings');
    await expect(applyThemeToggleAfterReload).toHaveAttribute("data-state", "checked");
  });
});

test.describe("Options Page - Notification", () => {
  test("should change notification settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:text("Notification")')).toBeVisible();

    const alarmType = page.locator("#notification-type-alarm");
    const noneType = page.locator("#notification-type-none");
    const alarmLabel = page.locator('label[for="notification-type-alarm"]');
    const noneLabel = page.locator('label[for="notification-type-none"]');
    await expect(alarmLabel).toBeVisible();
    await expect(noneLabel).toBeVisible();

    await expect(alarmType).toBeChecked();

    await noneLabel.click();

    await expect(noneType).toBeChecked();
    await expect(alarmType).not.toBeChecked();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const noneTypeAfterReload = page.locator("#notification-type-none");
    const alarmTypeAfterReload = page.locator("#notification-type-alarm");
    await expect(noneTypeAfterReload).toBeChecked();

    const alarmLabelAfterReload = page.locator('label[for="notification-type-alarm"]');
    await alarmLabelAfterReload.click();
    await expect(alarmTypeAfterReload).toBeChecked();
  });

  test("should toggle sound settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:text("Notification")')).toBeVisible();

    const simpleSound = page.locator("#alarm-sound-Simple");
    const pianoSound = page.locator("#alarm-sound-Piano");
    const simpleLabel = page.locator('label[for="alarm-sound-Simple"]');
    const pianoLabel = page.locator('label[for="alarm-sound-Piano"]');
    await expect(simpleLabel).toBeVisible();
    await expect(pianoLabel).toBeVisible();

    await expect(simpleSound).toBeChecked();

    await pianoLabel.click();

    await expect(pianoSound).toBeChecked();
    await expect(simpleSound).not.toBeChecked();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const pianoSoundAfterReload = page.locator("#alarm-sound-Piano");
    const simpleSoundAfterReload = page.locator("#alarm-sound-Simple");
    await expect(pianoSoundAfterReload).toBeChecked();

    const simpleLabelAfterReload = page.locator('label[for="alarm-sound-Simple"]');
    await simpleLabelAfterReload.click();
    await expect(simpleSoundAfterReload).toBeChecked();
  });

  test("should support new alarm sounds", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const alarmLabel = page.locator('label[for="notification-type-alarm"]');
    await alarmLabel.click();
    await expect(page.locator('#notification-type-alarm')).toBeChecked();

    const newSounds = ["Vibraphone", "SteelDrums"];

    for (const sound of newSounds) {
      const soundLabel = page.locator(`label[for="alarm-sound-${sound}"]`);
      await expect(soundLabel).toBeVisible();
      await soundLabel.click();

      const soundRadio = page.locator(`#alarm-sound-${sound}`);
      await expect(soundRadio).toBeChecked();

      await page.reload();
      await page.waitForLoadState("networkidle");

      const soundRadioAfterReload = page.locator(`#alarm-sound-${sound}`);
      await expect(soundRadioAfterReload).toBeChecked();
    }
  });

  test("should preview alarm sounds", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const alarmLabel = page.locator('label[for="notification-type-alarm"]');
    await alarmLabel.click();
    await expect(page.locator('#notification-type-alarm')).toBeChecked();

    const previewButton = page.locator('button:has-text("Preview")');
    await expect(previewButton).toBeVisible();
    await expect(previewButton).toBeEnabled();

    const noneLabel = page.locator('label[for="notification-type-none"]');
    await noneLabel.click();
    await expect(page.locator('#notification-type-none')).toBeChecked();

    await expect(previewButton).toBeDisabled();
  });

  test("should control volume settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const notificationSection = page.locator('h2:text("Notification")');
    await notificationSection.scrollIntoViewIfNeeded();

    const alarmLabel = page.locator('label[for="notification-type-alarm"]');
    await alarmLabel.click();
    await expect(page.locator('#notification-type-alarm')).toBeChecked();

    const volumeControl = page.locator('.rounded-lg.bg-muted\\/10').filter({ hasText: '%' });
    await expect(volumeControl).toBeVisible();

    const volumeSlider = volumeControl.locator('[role="slider"]');
    await expect(volumeSlider).toBeVisible();

    await volumeSlider.focus();
    
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('ArrowRight');
    }

    const percentageText = volumeControl.locator('.font-mono');
    await expect(percentageText).toContainText(/4[5-9]|5[0-5]%/);

    await page.reload();
    await page.waitForLoadState("networkidle");

    const percentageTextAfterReload = page.locator('.rounded-lg.bg-muted\\/10').filter({ hasText: '%' }).locator('.font-mono');
    await expect(percentageTextAfterReload).toContainText(/4[5-9]|5[0-5]%/);

    const noneLabel = page.locator('label[for="notification-type-none"]');
    await noneLabel.click();
    await expect(page.locator('#notification-type-none')).toBeChecked();

    const volumeSliderAfterNone = page.locator('.rounded-lg.bg-muted\\/10').filter({ hasText: '%' }).locator('[role="slider"]');
    await expect(volumeSliderAfterNone).toHaveAttribute('data-disabled', '');
  });
});

test.describe("Options Page - Navigation", () => {
  test("should navigate with sidebar links", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    const navLinks = [
      { text: "General", targetText: "General" },
      { text: "Appearance", targetText: "Appearance" },
      { text: "Notification", targetText: "Notification" }
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      await navLink.click();

      await page.waitForURL(new RegExp(`#${link.text.toLowerCase()}`));

      const targetSection = page.locator(`h2:has-text("${link.targetText}")`);
      await expect(targetSection).toBeInViewport();
    }
  });
});
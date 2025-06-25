import { test, expect } from "./fixtures/extension";

test.describe("Options Page", () => {
  test("should change theme", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);

    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:has-text("Appearance")')).toBeVisible();

    const colorSchemes = ["system", "light", "dark", "lemon", "mint", "rose"];

    for (const scheme of colorSchemes) {
      const themeRadio = page.locator(`#color-scheme-${scheme}`);
      const themeLabel = page.locator(`label[for="color-scheme-${scheme}"]`);
      await expect(themeLabel).toBeVisible();
      await themeLabel.click();
      await page.waitForTimeout(100); // 設定保存を待つ

      await page.reload();
      await page.waitForLoadState("networkidle");

      const themeRadioAfterReload = page.locator(`#color-scheme-${scheme}`);
      await expect(themeRadioAfterReload).toBeChecked();
    }
  });

  test("should change notification settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:has-text("Notification")')).toBeVisible();

    const alarmType = page.locator("#notification-type-alarm");
    const noneType = page.locator("#notification-type-none");
    const alarmLabel = page.locator('label[for="notification-type-alarm"]');
    const noneLabel = page.locator('label[for="notification-type-none"]');
    await expect(alarmLabel).toBeVisible();
    await expect(noneLabel).toBeVisible();

    // 初期状態を確認（Alarmがデフォルト）
    await expect(alarmType).toBeChecked();

    await noneLabel.click();
    await page.waitForTimeout(100);

    await expect(noneType).toBeChecked();
    await expect(alarmType).not.toBeChecked();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const noneTypeAfterReload = page.locator("#notification-type-none");
    const alarmTypeAfterReload = page.locator("#notification-type-alarm");
    await expect(noneTypeAfterReload).toBeChecked();

    const alarmLabelAfterReload = page.locator('label[for="notification-type-alarm"]');
    await alarmLabelAfterReload.click();
    await page.waitForTimeout(100);
    await expect(alarmTypeAfterReload).toBeChecked();
  });

  test("should toggle sound settings", async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator('h2:has-text("Notification")')).toBeVisible();

    const simpleSound = page.locator("#alarm-sound-Simple");
    const pianoSound = page.locator("#alarm-sound-Piano");
    const simpleLabel = page.locator('label[for="alarm-sound-Simple"]');
    const pianoLabel = page.locator('label[for="alarm-sound-Piano"]');
    await expect(simpleLabel).toBeVisible();
    await expect(pianoLabel).toBeVisible();

    // 初期状態を確認（Simpleがデフォルト）
    await expect(simpleSound).toBeChecked();

    await pianoLabel.click();
    await page.waitForTimeout(100);

    await expect(pianoSound).toBeChecked();
    await expect(simpleSound).not.toBeChecked();

    await page.reload();
    await page.waitForLoadState("networkidle");

    const pianoSoundAfterReload = page.locator("#alarm-sound-Piano");
    const simpleSoundAfterReload = page.locator("#alarm-sound-Simple");
    await expect(pianoSoundAfterReload).toBeChecked();

    const simpleLabelAfterReload = page.locator('label[for="alarm-sound-Simple"]');
    await simpleLabelAfterReload.click();
    await page.waitForTimeout(100);
    await expect(simpleSoundAfterReload).toBeChecked();
  });
});

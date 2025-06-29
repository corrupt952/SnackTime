import { test, expect } from "./fixtures/extension";

test.describe("Popup - Preset Buttons", () => {
  test("should show all preset buttons", async ({ extensionId, context }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");

    const presets = ["5", "10", "15", "25"];

    for (const preset of presets) {
      const presetMap = { "5": "1:00", "10": "3:00", "15": "5:00", "25": "10:00" };
      const button = popup.locator(`button:has-text("${presetMap[preset]}")`).first();
      await expect(button).toBeVisible();
    }

    await popup.close();
  });

  test("should inject timer with different presets", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");

    const client = await page.context().newCDPSession(page);
    await client.send("Page.bringToFront");

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");

    await client.send("Page.bringToFront");
    const preset5min = popup.locator('button:has-text("1:00")');
    await expect(preset5min).toBeVisible();
    await preset5min.click();

    await page.waitForSelector("#snack-time-root");
    const timerRoot = page.locator("#snack-time-root");
    await expect(timerRoot).toBeVisible();

    await popup.close();
    const popup2 = await context.newPage();
    await popup2.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup2.waitForLoadState("networkidle");

    await client.send("Page.bringToFront");
    const preset10min = popup2.locator('button:has-text("3:00")');
    await expect(preset10min).toBeVisible();
    await preset10min.click();

    await expect(timerRoot.first()).toBeVisible();
    await popup2.close();
    const popup3 = await context.newPage();
    await popup3.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup3.waitForLoadState("networkidle");

    await client.send("Page.bringToFront");
    const preset15min = popup3.locator('button:has-text("5:00")');
    await expect(preset15min).toBeVisible();
    await preset15min.click();

    await expect(timerRoot.first()).toBeVisible();

    await popup3.close();
    const popup4 = await context.newPage();
    await popup4.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup4.waitForLoadState("networkidle");

    await client.send("Page.bringToFront");
    const preset25min = popup4.locator('button:has-text("10:00")');
    await expect(preset25min).toBeVisible();
    await preset25min.click();

    await expect(timerRoot.first()).toBeVisible();

    await popup4.close();
  });
});

test.describe("Popup - Custom Time Features", () => {
  test("should open and close custom duration modal", async ({ extensionId, context }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");
    const customButton = popup.locator("button").filter({ hasText: "⚡Custom" });
    await expect(customButton).toBeVisible();
    await customButton.click();

    const modal = popup.locator(".absolute.inset-0").first();
    await expect(modal).toBeVisible();

    await expect(popup.locator('text="Set custom duration"')).toBeVisible();
    const timeInput = popup.locator('input[type="time"]');
    await expect(timeInput).toBeVisible();

    const cancelButton = popup.getByRole("button", { name: "Cancel" });
    await cancelButton.click();
    await expect(modal).not.toBeVisible();

    await popup.close();
  });

  test("should open and close end time modal", async ({ extensionId, context }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");
    const endTimeButton = popup.locator('button:has-text("Set end time")');
    await expect(endTimeButton).toBeVisible();
    await endTimeButton.click();

    const modal = popup.locator(".absolute.inset-0").first();
    await expect(modal).toBeVisible();

    await expect(popup.locator('text="Set end time"').nth(1)).toBeVisible();
    const timeInput = popup.locator('input[type="time"]');
    await expect(timeInput).toBeVisible();

    const cancelButton = popup.getByRole("button", { name: "Cancel" });
    await cancelButton.click();
    await expect(modal).not.toBeVisible();

    await popup.close();
  });

  test("should set custom duration", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");

    const client = await page.context().newCDPSession(page);
    await client.send("Page.bringToFront");

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");

    const customButton = popup.locator("button").filter({ hasText: "⚡Custom" });
    await customButton.click();

    const timeInput = popup.locator('input[type="time"]');
    await timeInput.fill("00:30");

    await client.send("Page.bringToFront");
    const setButton = popup.getByRole("button", { name: "Set", exact: true });
    await setButton.click();

    await page.waitForSelector("#snack-time-root");
    const timerRoot = page.locator("#snack-time-root");
    await expect(timerRoot).toBeVisible();

    await popup.close();
  });

  test("should set end time", async ({ extensionId, context, page }) => {
    await page.goto("https://example.com");

    const client = await page.context().newCDPSession(page);
    await client.send("Page.bringToFront");

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");

    const endTimeButton = popup.locator('button:has-text("Set end time")');
    await endTimeButton.click();

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const endTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const timeInput = popup.locator('input[type="time"]');
    await timeInput.fill(endTime);

    await client.send("Page.bringToFront");
    const setButton = popup.getByRole("button", { name: "Set", exact: true });
    await setButton.click();

    await page.waitForSelector("#snack-time-root");
    const timerRoot = page.locator("#snack-time-root");
    await expect(timerRoot).toBeVisible();

    await popup.close();
  });
});
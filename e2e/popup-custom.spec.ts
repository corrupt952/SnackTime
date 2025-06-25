import { test, expect } from "./fixtures/extension";

test.describe("Popup Custom Time Features", () => {
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
});

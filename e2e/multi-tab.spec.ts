import { test, expect } from "./fixtures/extension";

test.describe("Multi-tab Timer Independence", () => {
  test("should run independent timers in different tabs", async ({ extensionId, context }) => {
    const page1 = await context.newPage();
    await page1.goto("https://example.com");

    const page2 = await context.newPage();
    await page2.goto("https://www.google.com");

    const client1 = await page1.context().newCDPSession(page1);
    await client1.send("Page.bringToFront");

    const popup1 = await context.newPage();
    await popup1.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup1.waitForLoadState("networkidle");

    await client1.send("Page.bringToFront");
    const preset5min = popup1.locator('button:has-text("1:00")');
    await preset5min.click();

    await page1.waitForSelector("#snack-time-root");
    const timer1 = page1.locator("#snack-time-root");
    await expect(timer1).toBeVisible();

    await popup1.close();

    const client2 = await page2.context().newCDPSession(page2);
    await client2.send("Page.bringToFront");

    const popup2 = await context.newPage();
    await popup2.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup2.waitForLoadState("networkidle");

    await client2.send("Page.bringToFront");
    const preset10min = popup2.locator('button:has-text("3:00")');
    await preset10min.click();

    await page2.waitForSelector("#snack-time-root");
    const timer2 = page2.locator("#snack-time-root");
    await expect(timer2).toBeVisible();

    await page1.bringToFront();
    await expect(timer1).toBeVisible();

    await page2.bringToFront();
    await expect(timer2).toBeVisible();

    await popup2.close();
  });

  test("should maintain timer when switching tabs", async ({ extensionId, context }) => {
    const page = await context.newPage();
    await page.goto("https://example.com");

    const client = await page.context().newCDPSession(page);
    await client.send("Page.bringToFront");

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popup.waitForLoadState("networkidle");

    await client.send("Page.bringToFront");
    const preset5min = popup.locator('button:has-text("1:00")');
    await preset5min.click();

    await page.waitForSelector("#snack-time-root");
    const timer = page.locator("#snack-time-root");
    await expect(timer).toBeVisible();

    await popup.close();

    const page2 = await context.newPage();
    await page2.goto("https://www.google.com");
    await page2.bringToFront();

    await page.bringToFront();
    await expect(timer).toBeVisible();
  });
});

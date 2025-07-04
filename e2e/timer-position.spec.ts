import { test, expect } from "./fixtures/extension";

test.describe("Timer Position", () => {
  test.describe("should apply timer position from settings", () => {
    const positions = [
      { 
        id: "top-left", 
        expectedStyles: { top: "10px", left: "10px", bottom: undefined, right: undefined }
      },
      { 
        id: "top-right", 
        expectedStyles: { top: "10px", right: "10px", bottom: undefined, left: undefined }
      },
      { 
        id: "bottom-left", 
        expectedStyles: { bottom: "10px", left: "10px", top: undefined, right: undefined }
      },
      { 
        id: "bottom-right", 
        expectedStyles: { bottom: "10px", right: "10px", top: undefined, left: undefined }
      },
      { 
        id: "center", 
        expectedStyles: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
      }
    ];

    for (const position of positions) {
      test(`position: ${position.id}`, async ({ page, extensionId, context }) => {
        const optionsPage = await context.newPage();
        await optionsPage.goto(`chrome-extension://${extensionId}/options/index.html`);
        await optionsPage.waitForLoadState("networkidle");
        
        const positionButton = optionsPage.locator(`#position-${position.id}`);
        await positionButton.click();
        const selectedIndicator = positionButton.locator('.bg-primary');
        await expect(selectedIndicator).toBeVisible();
        await optionsPage.close();

        await page.goto("https://example.com");
        const client = await page.context().newCDPSession(page);
        
        await client.send("Page.bringToFront");
        
        const popupPage = await context.newPage();
        await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);
        await popupPage.waitForLoadState("networkidle");
        
        await client.send("Page.bringToFront");
        const preset1min = popupPage.locator('button:has-text("1:00")').first();
        await expect(preset1min).toBeVisible();
        await preset1min.click();
        await popupPage.close();

        await page.bringToFront();
        await page.waitForSelector("#snack-time-root", { state: "visible" });
        const timer = page.locator("#snack-time-root");
        await expect(timer).toBeVisible();

        const styles = await timer.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            top: el.style.top || undefined,
            left: el.style.left || undefined,
            bottom: el.style.bottom || undefined,
            right: el.style.right || undefined,
            transform: el.style.transform || undefined
          };
        });

        if (position.id === "center") {
          expect(styles.top).toBe(position.expectedStyles.top);
          expect(styles.left).toBe(position.expectedStyles.left);
          expect(styles.transform).toBe(position.expectedStyles.transform);
        } else {
          if (position.expectedStyles.top) expect(styles.top).toBe(position.expectedStyles.top);
          if (position.expectedStyles.left) expect(styles.left).toBe(position.expectedStyles.left);
          if (position.expectedStyles.bottom) expect(styles.bottom).toBe(position.expectedStyles.bottom);
          if (position.expectedStyles.right) expect(styles.right).toBe(position.expectedStyles.right);
          expect(styles.top || "").toBe(position.expectedStyles.top || "");
          expect(styles.left || "").toBe(position.expectedStyles.left || "");
          expect(styles.bottom || "").toBe(position.expectedStyles.bottom || "");
          expect(styles.right || "").toBe(position.expectedStyles.right || "");
        }
      });
    }
  });

  test("should maintain drag functionality regardless of initial position", async ({ page, extensionId, context }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/index.html`);
    await optionsPage.waitForLoadState("networkidle");
    
    const centerButton = optionsPage.locator('#position-center');
    await centerButton.click();
    const selectedIndicator = centerButton.locator('.bg-primary');
    await expect(selectedIndicator).toBeVisible();
    await optionsPage.close();

    await page.goto("https://example.com");
    
    const client = await page.context().newCDPSession(page);
    await client.send("Page.bringToFront");
    
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);
    await popupPage.waitForLoadState("networkidle");
    
    await client.send("Page.bringToFront");
    const preset1min = popupPage.locator('button:has-text("1:00")').first();
    await expect(preset1min).toBeVisible();
    await preset1min.click();
    await popupPage.close();

    await page.bringToFront();
    const timer = page.locator("#snack-time-root");
    await expect(timer).toBeVisible();

    const initialPosition = await timer.boundingBox();
    expect(initialPosition).not.toBeNull();

    await timer.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    const newPosition = await timer.boundingBox();
    expect(newPosition).not.toBeNull();
    expect(newPosition!.x).not.toBe(initialPosition!.x);
    expect(newPosition!.y).not.toBe(initialPosition!.y);

  });
});
import { test, expect } from "../fixtures/extension";
import { OptionsPage } from "../page-objects/options.page";
import { PopupPage } from "../page-objects/popup.page";
import { ContentTimerPage } from "../page-objects/content-timer.page";

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
        // Set position in options
        const optionsPageHandle = await context.newPage();
        const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
        await optionsPage.open();
        
        await optionsPage.selectPosition(position.id);
        await optionsPage.verifyPositionSelected(position.id);
        await optionsPage.close();

        // Open target page
        await page.goto("https://example.com");
        const contentPage = new ContentTimerPage(page);
        await contentPage.bringToFront();
        
        // Set timer via popup
        const popupPageHandle = await context.newPage();
        const popupPage = new PopupPage(popupPageHandle, extensionId);
        await popupPage.open();
        
        await contentPage.bringToFront();
        await popupPage.clickPresetButton("5"); // 1:00
        await popupPage.close();

        // Verify timer position
        await page.bringToFront();
        await contentPage.waitForTimer();
        await contentPage.verifyTimerVisible();

        const styles = await contentPage.getTimerStyles();

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
    // Set center position in options
    const optionsPageHandle = await context.newPage();
    const optionsPage = new OptionsPage(optionsPageHandle, extensionId);
    await optionsPage.open();
    
    await optionsPage.selectPosition("center");
    await optionsPage.verifyPositionSelected("center");
    await optionsPage.close();

    // Open target page
    await page.goto("https://example.com");
    const contentPage = new ContentTimerPage(page);
    await contentPage.bringToFront();
    
    // Set timer via popup
    const popupPageHandle = await context.newPage();
    const popupPage = new PopupPage(popupPageHandle, extensionId);
    await popupPage.open();
    
    await contentPage.bringToFront();
    await popupPage.clickPresetButton("5"); // 1:00
    await popupPage.close();

    // Verify timer is visible and draggable
    await page.bringToFront();
    await contentPage.verifyTimerVisible();

    const initialPosition = await contentPage.getTimerBoundingBox();
    expect(initialPosition).not.toBeNull();

    // Drag timer
    await contentPage.dragTimer(100, 100);

    const newPosition = await contentPage.getTimerBoundingBox();
    expect(newPosition).not.toBeNull();
    expect(newPosition!.x).not.toBe(initialPosition!.x);
    expect(newPosition!.y).not.toBe(initialPosition!.y);
  });
});
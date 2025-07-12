import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ContentTimerPage extends BasePage {
  get timerRoot(): Locator {
    return this.page.locator("#snack-time-root").first();
  }

  async waitForTimer(): Promise<void> {
    await this.page.waitForSelector("#snack-time-root");
  }

  async verifyTimerVisible(): Promise<void> {
    await expect(this.timerRoot).toBeVisible();
  }

  async verifyTimerNotVisible(): Promise<void> {
    await expect(this.timerRoot).not.toBeVisible();
  }

  async bringToFront(): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send("Page.bringToFront");
  }

  async getTimerStyles(): Promise<{
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
    transform?: string;
  }> {
    return await this.timerRoot.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        top: el.style.top || undefined,
        left: el.style.left || undefined,
        bottom: el.style.bottom || undefined,
        right: el.style.right || undefined,
        transform: el.style.transform || undefined
      };
    });
  }

  async dragTimer(deltaX: number, deltaY: number): Promise<void> {
    await this.timerRoot.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(deltaX, deltaY);
    await this.page.mouse.up();
  }

  async getTimerBoundingBox() {
    return await this.timerRoot.boundingBox();
  }
}
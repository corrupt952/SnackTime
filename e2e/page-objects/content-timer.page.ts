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
}
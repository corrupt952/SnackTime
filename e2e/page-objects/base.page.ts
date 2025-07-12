import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}
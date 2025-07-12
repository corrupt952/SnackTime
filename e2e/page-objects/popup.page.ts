import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class PopupPage extends BasePage {
  private readonly presetButtonMap = {
    "5": "1:00",
    "10": "3:00", 
    "15": "5:00",
    "25": "10:00",
  };

  constructor(page: Page, private readonly extensionId: string) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(`chrome-extension://${this.extensionId}/popup/index.html`);
  }

  getPresetButton(minutes: "5" | "10" | "15" | "25"): Locator {
    const timeText = this.presetButtonMap[minutes];
    return this.page.locator(`button:has-text("${timeText}")`).first();
  }

  async clickPresetButton(minutes: "5" | "10" | "15" | "25"): Promise<void> {
    const button = this.getPresetButton(minutes);
    await button.click();
  }

  async verifyAllPresetButtonsVisible(): Promise<void> {
    const presets = ["5", "10", "15", "25"] as const;
    for (const preset of presets) {
      const button = this.getPresetButton(preset);
      await expect(button).toBeVisible();
    }
  }
}
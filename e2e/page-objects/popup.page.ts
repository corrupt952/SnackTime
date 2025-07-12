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

  get customButton(): Locator {
    return this.page.locator("button").filter({ hasText: "⚡Custom" });
  }

  get endTimeButton(): Locator {
    return this.page.locator('button:has-text("Set end time")');
  }

  get modal(): Locator {
    return this.page.locator(".absolute.inset-0").first();
  }

  get timeInput(): Locator {
    return this.page.locator('input[type="time"]');
  }

  get cancelButton(): Locator {
    return this.page.getByRole("button", { name: "Cancel" });
  }

  get setButton(): Locator {
    return this.page.getByRole("button", { name: "Set", exact: true });
  }

  async openCustomDurationModal(): Promise<void> {
    await this.customButton.click();
  }

  async openEndTimeModal(): Promise<void> {
    await this.endTimeButton.click();
  }

  async closeModal(): Promise<void> {
    await this.cancelButton.click();
  }

  async fillTime(time: string): Promise<void> {
    await this.timeInput.fill(time);
  }

  async clickSetButton(): Promise<void> {
    await this.setButton.click();
  }

  async verifyModalVisible(): Promise<void> {
    await expect(this.modal).toBeVisible();
  }

  async verifyModalNotVisible(): Promise<void> {
    await expect(this.modal).not.toBeVisible();
  }

  // History section
  get recentSection(): Locator {
    return this.page.locator('text="Recent"').locator('..');
  }

  getHistoryItems(): Locator {
    return this.recentSection.locator('.space-y-1').locator('button');
  }

  async getHistoryCount(): Promise<number> {
    return await this.getHistoryItems().count();
  }

  async clickHistoryItem(index: number): Promise<void> {
    await this.getHistoryItems().nth(index).click();
  }

  async getHistoryItemText(index: number): Promise<string> {
    const item = this.getHistoryItems().nth(index);
    return await item.textContent() || '';
  }

  async verifyHistoryEmpty(): Promise<void> {
    const count = await this.getHistoryCount();
    expect(count).toBe(0);
  }

  async verifyHistoryCount(expectedCount: number): Promise<void> {
    const count = await this.getHistoryCount();
    expect(count).toBe(expectedCount);
  }

  async waitForHistoryUpdate(expectedCount: number): Promise<void> {
    await expect(async () => {
      const count = await this.getHistoryCount();
      expect(count).toBe(expectedCount);
    }).toPass({ timeout: 5000 });
  }
}
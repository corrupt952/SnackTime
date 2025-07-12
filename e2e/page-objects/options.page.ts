import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class OptionsPage extends BasePage {
  constructor(page: Page, private readonly extensionId: string) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(`chrome-extension://${this.extensionId}/options/index.html`);
  }

  // Navigation
  getNavLink(text: string): Locator {
    return this.page.locator(`nav a:has-text("${text}")`);
  }

  async navigateTo(section: "General" | "Appearance" | "Notification"): Promise<void> {
    await this.getNavLink(section).click();
    await this.page.waitForURL(new RegExp(`#${section.toLowerCase()}`));
  }

  // Section headers
  getSectionHeader(text: string): Locator {
    return this.page.locator(`h2:text("${text}")`);
  }

  // Theme settings
  getThemeRadio(scheme: string): Locator {
    return this.page.locator(`#color-scheme-${scheme}`);
  }

  getThemeLabel(scheme: string): Locator {
    return this.page.locator(`label[for="color-scheme-${scheme}"]`);
  }

  async selectTheme(scheme: string): Promise<void> {
    await this.getThemeLabel(scheme).click();
  }

  async verifyThemeSelected(scheme: string): Promise<void> {
    await expect(this.getThemeRadio(scheme)).toBeChecked();
  }

  get applyThemeToggle(): Locator {
    return this.page.locator("#apply-theme-to-settings");
  }

  get applyThemeLabel(): Locator {
    return this.page.locator('label[for="apply-theme-to-settings"]');
  }

  async toggleApplyTheme(): Promise<void> {
    await this.applyThemeToggle.click();
  }

  async verifyApplyThemeState(state: "checked" | "unchecked"): Promise<void> {
    await expect(this.applyThemeToggle).toHaveAttribute("data-state", state);
  }

  get htmlElement(): Locator {
    return this.page.locator("html");
  }

  get previewContainer(): Locator {
    return this.page.locator(".relative.rounded-lg.overflow-hidden");
  }

  // Notification settings
  getNotificationTypeRadio(type: "alarm" | "none"): Locator {
    return this.page.locator(`#notification-type-${type}`);
  }

  getNotificationTypeLabel(type: "alarm" | "none"): Locator {
    return this.page.locator(`label[for="notification-type-${type}"]`);
  }

  async selectNotificationType(type: "alarm" | "none"): Promise<void> {
    await this.getNotificationTypeLabel(type).click();
  }

  async verifyNotificationTypeSelected(type: "alarm" | "none"): Promise<void> {
    await expect(this.getNotificationTypeRadio(type)).toBeChecked();
  }

  // Sound settings
  getSoundRadio(sound: string): Locator {
    return this.page.locator(`#alarm-sound-${sound}`);
  }

  getSoundLabel(sound: string): Locator {
    return this.page.locator(`label[for="alarm-sound-${sound}"]`);
  }

  async selectSound(sound: string): Promise<void> {
    await this.getSoundLabel(sound).click();
  }

  async verifySoundSelected(sound: string): Promise<void> {
    await expect(this.getSoundRadio(sound)).toBeChecked();
  }

  get previewButton(): Locator {
    return this.page.locator('button:has-text("Preview")');
  }

  get volumeControl(): Locator {
    return this.page.locator('.rounded-lg.bg-muted\\/10').filter({ hasText: '%' });
  }

  get volumeSlider(): Locator {
    return this.volumeControl.locator('[role="slider"]');
  }

  get volumePercentage(): Locator {
    return this.volumeControl.locator('.font-mono');
  }

  async adjustVolume(steps: number, direction: "right" | "left"): Promise<void> {
    await this.volumeSlider.focus();
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press(direction === "right" ? "ArrowRight" : "ArrowLeft");
    }
  }

  // Position settings
  getPositionButton(position: string): Locator {
    return this.page.locator(`#position-${position}`);
  }

  async selectPosition(position: string): Promise<void> {
    await this.getPositionButton(position).click();
  }

  async verifyPositionSelected(position: string): Promise<void> {
    const selectedIndicator = this.getPositionButton(position).locator('.bg-primary');
    await expect(selectedIndicator).toBeVisible();
  }

  // Utilities
  async reloadAndWaitForPage(): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState("networkidle");
  }

  async scrollToSection(sectionName: string): Promise<void> {
    const section = this.getSectionHeader(sectionName);
    await section.scrollIntoViewIfNeeded();
  }
}
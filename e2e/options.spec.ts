import { test, expect } from './fixtures/extension'

test.describe('Options Page', () => {
  test('should change theme', async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`)
    
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h2:has-text("Appearance")')).toBeVisible()
    
    const colorSchemes = ['system', 'light', 'dark', 'lemon', 'mint', 'rose']
    
    for (const scheme of colorSchemes) {
      const themeRadio = page.locator(`#color-scheme-${scheme}`)
      await expect(themeRadio).toBeVisible()
      await themeRadio.click()
      await page.waitForTimeout(100) // 設定保存を待つ
      
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      const themeRadioAfterReload = page.locator(`#color-scheme-${scheme}`)
      await expect(themeRadioAfterReload).toBeChecked()
    }
  })

  test('should change notification settings', async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h2:has-text("Notification")')).toBeVisible()
    
    const alarmType = page.locator('#notification-type-alarm')
    const noneType = page.locator('#notification-type-none')
    await expect(alarmType).toBeVisible()
    await expect(noneType).toBeVisible()
    
    // 初期状態を確認（Alarmがデフォルト）
    await expect(alarmType).toBeChecked()
    
    await noneType.click()
    await page.waitForTimeout(100)
    
    await expect(noneType).toBeChecked()
    await expect(alarmType).not.toBeChecked()
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const noneTypeAfterReload = page.locator('#notification-type-none')
    const alarmTypeAfterReload = page.locator('#notification-type-alarm')
    await expect(noneTypeAfterReload).toBeChecked()
    
    await alarmTypeAfterReload.click()
    await page.waitForTimeout(100)
    await expect(alarmTypeAfterReload).toBeChecked()
  })
  
  test('should toggle sound settings', async ({ extensionId, page }) => {
    await page.goto(`chrome-extension://${extensionId}/options/index.html`)
    await page.waitForLoadState('networkidle')
    
    await expect(page.locator('h2:has-text("Notification")')).toBeVisible()
    
    const simpleSound = page.locator('#alarm-sound-Simple')
    const pianoSound = page.locator('#alarm-sound-Piano')
    await expect(simpleSound).toBeVisible()
    await expect(pianoSound).toBeVisible()
    
    // 初期状態を確認（Simpleがデフォルト）
    await expect(simpleSound).toBeChecked()
    
    await pianoSound.click()
    await page.waitForTimeout(100)
    
    await expect(pianoSound).toBeChecked()
    await expect(simpleSound).not.toBeChecked()
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const pianoSoundAfterReload = page.locator('#alarm-sound-Piano')
    const simpleSoundAfterReload = page.locator('#alarm-sound-Simple')
    await expect(pianoSoundAfterReload).toBeChecked()
    
    await simpleSoundAfterReload.click()
    await page.waitForTimeout(100)
    await expect(simpleSoundAfterReload).toBeChecked()
  })
})
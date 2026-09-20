import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
  await page.goto('/demo')
  await page.evaluate(() => document.fonts.ready)
})

test('verification accepts digits and paste then allows keyboard correction', async ({page}) => {
  const section = page.locator('#form-extra')
  const first = section.getByRole('textbox', {name: 'Guild verification, digit 1 of 6', exact: true})
  await first.focus()
  await page.keyboard.type('12')
  const third = section.getByRole('textbox', {name: 'Guild verification, digit 3 of 6', exact: true})
  await expect(third).toBeFocused()
  await third.evaluate(element => {
    const clipboardData = new DataTransfer()
    clipboardData.setData('text/plain', '34-56')
    element.dispatchEvent(new ClipboardEvent('paste', {clipboardData, bubbles: true}))
  })
  await expect(section.getByRole('status').filter({hasText: 'Verification:'})).toHaveText('Verification: ready')
  const sixth = section.getByRole('textbox', {name: 'Guild verification, digit 6 of 6', exact: true})
  await expect(sixth).toHaveValue('6')
  await page.keyboard.press('Backspace')
  await expect(section.getByRole('textbox', {name: 'Guild verification, digit 5 of 6', exact: true})).toBeFocused()
  await expect(section.getByRole('status').filter({hasText: 'Verification:'})).toHaveText('Verification: 5 of 6 digits')
  await section.getByRole('combobox', {name: 'Native realm'}).selectOption('castle')
  await expect(section.getByRole('combobox', {name: 'Native realm'})).toHaveValue('castle')
  await expect(section.getByRole('checkbox', {name: 'Terms'})).toHaveAccessibleDescription('Accept before joining. Acceptance is required.')
})

test('toggle groups retain independent pressed states and skip disabled choices', async ({page}) => {
  const section = page.locator('#form-extra')
  await section.getByRole('button', {name: 'Attack', exact: true}).focus()
  await page.keyboard.press('ArrowRight')
  const defend = section.getByRole('button', {name: 'Defend', exact: true})
  await expect(defend).toBeFocused()
  await page.keyboard.press('Space')
  await expect(defend).toHaveAttribute('aria-pressed', 'false')
  await section.getByRole('button', {name: 'Compass', exact: true}).click()
  await expect(section.getByRole('button', {name: 'Map', exact: true})).toHaveAttribute('aria-pressed', 'true')
  await expect(section.getByRole('button', {name: 'Compass', exact: true})).toHaveAttribute('aria-pressed', 'true')
})

test('calendar popovers select a day and range and return keyboard focus', async ({page}) => {
  const section = page.locator('#form-extra')
  const openers = section.getByRole('button', {name: 'Open calendar', exact: true})
  await openers.first().click()
  await page.getByRole('dialog', {name: 'Choose date'}).locator('[data-date="2026-09-20"]').click()
  await expect(section.getByRole('status', {name: 'Date selection'})).toContainText('2026-09-20')
  await openers.first().click()
  await page.keyboard.press('Escape')
  await expect(openers.first()).toBeFocused()
  await openers.nth(1).click()
  const rangeCalendar = page.getByRole('dialog', {name: 'Choose date'})
  await rangeCalendar.locator('[data-date="2026-09-22"]').click()
  await rangeCalendar.locator('[data-date="2026-09-25"]').click()
  await expect(section.getByRole('status', {name: 'Date selection'})).toContainText('2026-09-22 to 2026-09-25')
  await section.getByRole('button', {name: 'Clear itinerary'}).click()
  await expect(section.getByRole('status', {name: 'Date selection'})).toHaveText('No departure · No expedition dates')
})

for (const theme of ['overworld', 'castle'] as const) {
  test(`extended forms and calendar popup in ${theme}`, async ({page}) => {
    if (theme === 'castle') await page.getByRole('button', {name: 'Switch to Castle', exact: true}).click()
    const section = page.locator('#form-extra')
    await expect(section).toHaveScreenshot(`form-extra-${theme}.png`)
    await section.getByRole('button', {name: 'Open calendar', exact: true}).first().click()
    const calendar = page.getByRole('dialog', {name: 'Choose date'})
    await expect(calendar.getByRole('grid', {name: 'September 2026'})).toHaveScreenshot(`date-picker-${theme}.png`)
  })
}

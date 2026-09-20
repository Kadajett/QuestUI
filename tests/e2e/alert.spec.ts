import {expect, test} from '@playwright/test'

test('alert details expand and danger can be dismissed', async ({page}) => {
  await page.goto('/demo')
  const alerts = page.locator('#alerts')
  await alerts.getByRole('button', {name: /expand/i}).click()
  await expect(alerts.getByRole('button', {name: 'View'})).toBeVisible()
  await alerts.getByRole('button', {name: /dismiss/i}).click()
  await expect(alerts.getByText('Defeat', {exact: true})).toHaveCount(0)
})

for (const mode of ['overworld', 'castle'] as const) {
  test(`alerts ${mode} screenshot`, async ({page}) => {
    await page.goto('/demo')
    if (mode === 'castle') await page.getByRole('button', {name: 'Switch to Castle'}).click()
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('#alerts')).toHaveScreenshot(`alerts-${mode}.png`)
  })
}

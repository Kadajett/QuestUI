import {expect, test} from '@playwright/test'

test('initial theme follows the browser color scheme', async ({browser}) => {
  for (const [colorScheme, expectedTheme] of [
    ['light', 'overworld'],
    ['dark', 'castle'],
  ] as const) {
    const context = await browser.newContext({colorScheme})
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:5173/')
    await expect(page.getByRole('combobox', {name: 'Theme'})).toHaveValue(expectedTheme)
    await context.close()
  }
})

test('explicit theme selection persists across navigation and reload', async ({page}) => {
  await page.emulateMedia({colorScheme: 'light'})
  await page.goto('/')
  const picker = page.getByRole('combobox', {name: 'Theme'})
  await picker.selectOption('nymph-gb')
  await page.goto('/components/button')
  await expect(page.getByRole('combobox', {name: 'Theme'})).toHaveValue('nymph-gb')
  await page.emulateMedia({colorScheme: 'dark'})
  await page.reload()
  await expect(page.getByRole('combobox', {name: 'Theme'})).toHaveValue('nymph-gb')
})
